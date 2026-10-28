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
    const prevMargin = el.getAttribute('data-cv-prev-margin-top');
    if (prevMargin !== null && prevMargin !== '') {
      el.style.marginTop = prevMargin;
      el.removeAttribute('data-cv-prev-margin-top');
    } else {
      el.style.marginTop = '';
    }

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
 * Finds the preceding heading element within the container to prevent orphaned headings.
 */
function findPrecedingHeading(
  el: HTMLElement,
  container: HTMLElement,
  containerTop: number,
  currentScale: number
): { el: HTMLElement; top: number; bottom: number } | null {
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, header, .cv-heading, [data-cv-heading="true"]'
    )
  );

  const elRect = el.getBoundingClientRect();
  const elTop = (elRect.top - containerTop) / currentScale;

  let closestHeading: { el: HTMLElement; top: number; bottom: number } | null = null;
  let minDistance = Infinity;

  for (const h of headings) {
    if (h === el || el.contains(h)) continue;
    const r = h.getBoundingClientRect();
    const hTop = (r.top - containerTop) / currentScale;
    const hBottom = (r.bottom - containerTop) / currentScale;

    if (hBottom <= elTop + 2) {
      const distance = elTop - hBottom;
      if (distance < minDistance) {
        minDistance = distance;
        closestHeading = { el: h, top: hTop, bottom: hBottom };
      }
    }
  }

  return closestHeading;
}

/**
 * Finds the optimal element to push across the page break boundary.
 * Never splits sentences, paragraphs, bullet points, headings, or entries.
 * Avoids orphaned headings and ensures natural breaks between content blocks.
 */
function findBestBreakElement(
  container: HTMLElement,
  cutY: number,
  pageFooterCutY: number,
  pageTopMargin: number,
  currentScale: number,
  containerTop: number,
  pageHeightPx: number
): HTMLElement | null {
  // 1. Check for orphaned headings:
  // If a heading ends within 55px of the footer cut line, its following content
  // cannot fit on this page, so the heading itself should move to the next page.
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>(
      'h1, h2, h3, h4, header, .cv-heading, [data-cv-heading="true"]'
    )
  );

  for (const h of headings) {
    if (h.getAttribute('data-cv-pushed') === 'true') continue;
    const r = h.getBoundingClientRect();
    const top = (r.top - containerTop) / currentScale;
    const bottom = (r.bottom - containerTop) / currentScale;

    // If heading sits near the footer cut line on the current page
    if (top < pageFooterCutY && bottom + 55 > pageFooterCutY) {
      const parentSection = h.closest('section');
      if (parentSection && parentSection !== container && !parentSection.getAttribute('data-cv-pushed')) {
        const secR = parentSection.getBoundingClientRect();
        const secTop = (secR.top - containerTop) / currentScale;
        // If the section begins with this heading, push the whole section
        if (Math.abs(secTop - top) < 40) {
          return parentSection;
        }
      }
      return h;
    }
  }

  // 2. Candidate selectors covering Student CV, Marital CV, and Professional CV structures
  const candidateSelectors = [
    'li',
    '[data-cv-bullet="true"]',
    'p',
    '.cv-paragraph',
    '[data-cv-paragraph="true"]',
    '[data-cv-subitem="true"]',
    '[data-biodata-row="true"]',
    '[data-cv-item="true"]',
    '.cv-item-avoid-break',
    '.cv-entry-avoid-break',
    '.cv-card-avoid-break',
    '.biodata-card',
    '[data-biodata-card="true"]',
    'section',
    '.cv-section-avoid-break',
  ];

  const allCandidates = Array.from(
    container.querySelectorAll<HTMLElement>(candidateSelectors.join(', '))
  );

  interface CandidateInfo {
    el: HTMLElement;
    top: number;
    bottom: number;
    height: number;
  }

  const violatingCandidates: CandidateInfo[] = [];

  for (const el of allCandidates) {
    if (el.getAttribute('data-cv-pushed') === 'true') continue;

    const r = el.getBoundingClientRect();
    const top = (r.top - containerTop) / currentScale;
    const bottom = (r.bottom - containerTop) / currentScale;
    const height = r.height / currentScale;

    if (height <= 0) continue;

    // Element crosses into the footer buffer or begins inside it
    const crossesFooter = top < pageFooterCutY && bottom > pageFooterCutY;
    const startsInFooterZone = top >= pageFooterCutY - 14 && top < cutY;

    if (crossesFooter || startsInFooterZone) {
      violatingCandidates.push({ el, top, bottom, height });
    }
  }

  if (violatingCandidates.length === 0) {
    return null;
  }

  // Sort by vertical position on page
  violatingCandidates.sort((a, b) => a.top - b.top);

  // Iterate to find the cleanest atomic block
  for (const candidate of violatingCandidates) {
    const el = candidate.el;

    // Skip huge container elements (> 85% of page) to target their children
    if (candidate.height > pageHeightPx * 0.85) {
      continue;
    }

    // Check if el contains any child that also violates
    const violatingChild = violatingCandidates.find(
      (c) => c.el !== el && el.contains(c.el)
    );

    if (violatingChild) {
      // If el is a section or container with a heading:
      const heading = el.querySelector<HTMLElement>(
        'h1, h2, h3, h4, header, .cv-heading, [data-cv-heading="true"]'
      );
      if (heading) {
        const headR = heading.getBoundingClientRect();
        const headBottom = (headR.bottom - containerTop) / currentScale;
        // If the violating child is the first child immediately under the heading,
        // pushing the child would orphan the heading! Push `el` instead!
        if (violatingChild.top - headBottom < 45) {
          return el;
        }
      }
      // Otherwise prefer breaking at the child level to avoid large blank spaces
      continue;
    }

    // Check if this candidate is immediately preceded by a heading that would be orphaned
    const prevHeading = findPrecedingHeading(el, container, containerTop, currentScale);
    if (prevHeading) {
      const hTop = prevHeading.top;
      const hBottom = prevHeading.bottom;
      if (candidate.top - hBottom < 45 && hTop > pageFooterCutY - 90) {
        const parentSec = prevHeading.el.closest('section');
        if (parentSec && parentSec !== container && !parentSec.getAttribute('data-cv-pushed')) {
          return parentSec;
        }
        return prevHeading.el;
      }
    }

    return el;
  }

  return violatingCandidates[0]?.el || null;
}

/**
 * Calculates and applies precise page-break boundaries for A4 multi-page CVs & Biodatas.
 *
 * Guarantees:
 * 1. Consistent ~48px (12.7mm / 0.5in) bottom margin on Page 1 and every page.
 * 2. Consistent ~48px (12.7mm / 0.5in) top margin on Page 2 and every subsequent page.
 * 3. Never splits a sentence, paragraph, heading, bullet point, or content block across pages.
 * 4. Prevents orphaned headings at the bottom of pages.
 * 5. Fully scale-normalized to support any preview zoom level without layout corruption.
 */
export function applyPageBoundaries(container: HTMLElement): () => void {
  if (!container) return () => {};

  // First reset previous adjustments to measure pristine layout
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

  // Consistent 0.5 inch (~12.7mm / 48px) top and bottom margins
  const PAGE_BOTTOM_MARGIN = 48; // Content terminates at or before cutY - 48px
  const PAGE_TOP_MARGIN = 48; // Pushed content begins at cutY + 48px

  // Support up to 10 pages
  for (let page = 1; page <= 10; page++) {
    const freshContainerRect = container.getBoundingClientRect();
    const cutY = page * pageHeightPx;
    const pageFooterCutY = cutY - PAGE_BOTTOM_MARGIN;

    const unscaledContainerHeight = freshContainerRect.height / currentScale;

    // If document content does not reach this page cut, stop
    if (unscaledContainerHeight <= pageFooterCutY + 8) {
      break;
    }

    // Find the best element to push across this boundary
    const targetElement = findBestBreakElement(
      container,
      cutY,
      pageFooterCutY,
      PAGE_TOP_MARGIN,
      currentScale,
      freshContainerRect.top,
      pageHeightPx
    );

    if (targetElement) {
      const r = targetElement.getBoundingClientRect();
      const itemTop = (r.top - freshContainerRect.top) / currentScale;

      // Distance to place the element exactly at cutY + PAGE_TOP_MARGIN
      const pushDistance = (cutY + PAGE_TOP_MARGIN) - itemTop;

      if (pushDistance > 0 && pushDistance < pageHeightPx) {
        targetElement.setAttribute('data-cv-pushed', 'true');
        targetElement.setAttribute('data-cv-prev-margin-top', targetElement.style.marginTop || '');

        const currentMargin = parseFloat(window.getComputedStyle(targetElement).marginTop) || 0;
        targetElement.style.marginTop = `${Math.ceil(currentMargin + pushDistance)}px`;
      }
    }
  }

  // Return a cleanup callback
  return () => {
    resetPageBoundaries(container);
  };
}
