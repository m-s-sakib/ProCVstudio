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

  // Support up to 10 pages
  for (let page = 1; page <= 10; page++) {
    const unscaledContainerHeight = containerRect.height / currentScale;
    const cutY = page * pageHeightPx;

    // If document content does not reach this page cut, stop
    if (unscaledContainerHeight <= cutY + 20) {
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

      // Prevent orphan heading at the bottom of the page (within 50px of cut)
      if (isHeading && itemTop < cutY && itemBottom + 45 > cutY) {
        targetElement = el;
        pushDistance = cutY - itemTop + 16;
        break;
      }

      // If a bullet item or entry crosses the page boundary line (text spilling into next page)
      // OR starts within 16px of the cutY line (orphan edge line)
      const crossesCut = itemTop < cutY - 2 && itemBottom > cutY;
      const startsAtEdge = itemTop >= cutY - 16 && itemTop < cutY;

      if ((crossesCut || startsAtEdge) && itemHeight < pageHeightPx * 0.85) {
        targetElement = el;
        pushDistance = cutY - itemTop + 16;
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

        if (itemTop < cutY && itemBottom > cutY && itemHeight < pageHeightPx * 0.85) {
          targetElement = el;
          pushDistance = cutY - itemTop + 16;
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
