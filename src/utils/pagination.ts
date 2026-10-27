/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Cleans up any dynamic layout styles applied by pagination.
 */
export function resetPageBoundaries(container: HTMLElement): void {
  if (!container) return;
  const adjusted = container.querySelectorAll<HTMLElement>('[data-cv-pushed="true"]');
  adjusted.forEach((el) => {
    el.style.marginTop = '';
    const prevDisplay = el.getAttribute('data-cv-prev-display');
    if (prevDisplay !== null) {
      el.style.display = prevDisplay;
      el.removeAttribute('data-cv-prev-display');
    }
    el.removeAttribute('data-cv-pushed');
  });

  // Remove any legacy spacer elements if any exist
  container.querySelectorAll('.cv-export-page-spacer').forEach((el) => el.remove());
}

/**
 * Calculates and applies precise page-break boundaries for A4 multi-page CVs.
 * Identifies the exact bullet item, heading, or entry whose text spills into the next page,
 * ensuring Page 1 terminates strictly after the previous item's last full stop (.),
 * and the spilling sentence/bullet starts cleanly from the beginning of Page 2.
 * Fully scale-normalized to support any preview zoom level without layout corruption.
 */
export function applyPageBoundaries(container: HTMLElement): () => void {
  if (!container) return () => {};

  // First reset any previous adjustments so we measure pristine layout
  resetPageBoundaries(container);

  const containerRect = container.getBoundingClientRect();
  const containerWidth = container.offsetWidth || 794;

  // Compute current scale factor from CSS transforms on preview parent
  const currentScale =
    containerRect.width > 0 && containerWidth > 0
      ? containerRect.width / containerWidth
      : 1;

  // Standard A4 aspect ratio (297 / 210 = 1.4142857...)
  // At 794px width, standard page height is 1123px
  const pageHeightPx = Math.round(containerWidth * (297 / 210));

  // Spacing constants:
  // 1 blank line buffer for the footer of the previous page (~24px)
  // 2 blank lines buffer for the header of the next page (~44px)
  const FOOTER_BUFFER_PX = 24; // 1 line blank for footer
  const HEADER_BUFFER_PX = 44; // 2 lines blank for header

  // Support up to 10 pages
  for (let page = 1; page <= 10; page++) {
    const unscaledContainerHeight = containerRect.height / currentScale;
    const cutY = page * pageHeightPx;
    // Page 1 footer safe boundary line (1 line blank before cut)
    const pageFooterCutY = cutY - FOOTER_BUFFER_PX;

    // If document content does not reach this page cut, stop
    if (unscaledContainerHeight <= pageFooterCutY + 10) {
      break;
    }

    // Candidates in prioritized order:
    // 1. List items (li) - individual bullet sentences
    // 2. Headings (h2, h3, .cv-heading) to prevent orphaned headings
    // 3. Entry blocks ([data-cv-item="true"], .cv-item-avoid-break)
    const candidates = Array.from(
      container.querySelectorAll<HTMLElement>(
        'li, h2, h3, .cv-heading, [data-cv-item="true"], .cv-item-avoid-break'
      )
    );

    let targetElement: HTMLElement | null = null;
    let pushDistance = 0;

    for (const el of candidates) {
      // Skip if already pushed
      if (el.getAttribute('data-cv-pushed') === 'true') continue;

      const r = el.getBoundingClientRect();
      const itemTop = (r.top - containerRect.top) / currentScale;
      const itemBottom = (r.bottom - containerRect.top) / currentScale;
      const itemHeight = r.height / currentScale;

      const isHeading =
        el.tagName.toLowerCase() === 'h2' ||
        el.tagName.toLowerCase() === 'h3' ||
        el.classList.contains('cv-heading');

      // Prevent orphan heading at the bottom of the page (ensure room for content before 1-line footer buffer)
      if (isHeading && itemTop < pageFooterCutY && itemBottom + 45 > pageFooterCutY) {
        targetElement = el;
        // Push past cut line into next page with 2 blank lines reserved for header
        pushDistance = cutY - itemTop + HEADER_BUFFER_PX;
        break;
      }

      // If a bullet item or entry crosses into the 1-line footer buffer or spills into next page
      // OR starts within 18px of the footer buffer line
      const crossesFooterZone = itemTop < pageFooterCutY && itemBottom > pageFooterCutY;
      const startsInFooterZone = itemTop >= pageFooterCutY - 18 && itemTop < cutY;

      if ((crossesFooterZone || startsInFooterZone) && itemHeight < pageHeightPx * 0.85) {
        targetElement = el;
        // Push past cut line into next page with 2 blank lines reserved for header
        pushDistance = cutY - itemTop + HEADER_BUFFER_PX;
        break;
      }
    }

    // Fallback: check larger container entries if no specific item was selected
    if (!targetElement) {
      const entryCandidates = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-cv-item="true"], .cv-item-avoid-break, .cv-entry-avoid-break, section'
        )
      );

      for (const el of entryCandidates) {
        if (el.getAttribute('data-cv-pushed') === 'true') continue;
        const r = el.getBoundingClientRect();
        const itemTop = (r.top - containerRect.top) / currentScale;
        const itemBottom = (r.bottom - containerRect.top) / currentScale;
        const itemHeight = r.height / currentScale;

        if (itemTop < pageFooterCutY && itemBottom > pageFooterCutY && itemHeight < pageHeightPx * 0.85) {
          targetElement = el;
          pushDistance = cutY - itemTop + HEADER_BUFFER_PX;
          break;
        }
      }
    }

    if (targetElement && pushDistance > 0 && pushDistance < pageHeightPx) {
      targetElement.setAttribute('data-cv-pushed', 'true');
      targetElement.style.marginTop = `${Math.ceil(pushDistance)}px`;
    }
  }

  // Return a cleanup callback
  return () => {
    resetPageBoundaries(container);
  };
}
