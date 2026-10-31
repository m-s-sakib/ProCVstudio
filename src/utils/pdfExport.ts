/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CVData } from '../types/cv';
import { applyPageBoundaries, resetPageBoundaries } from './pagination';
import { downloadPdfSafely, getSafeCanvasScale } from './mobileDownload';
import { normalizePdfLink } from './links';

export interface ExportPdfOptions {
  elementId?: string;
}

/**
 * Direct file download PDF using html2canvas & jsPDF with smart multi-page segmentation
 * and real clickable PDF hyperlink annotations for every link in the CV!
 * Strictly guarantees that Page 1 ends after the last full stop (.), and the spilling sentence starts on Page 2!
 */
export async function exportToPdf(cv: CVData, options?: ExportPdfOptions): Promise<{ blobUrl: string }> {
  const elementId = options?.elementId || 'cv-document-render';
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('CV document element not found for PDF export.');
  }

  // 1. Store and temporarily neutralize any CSS transforms on all parent/ancestor elements
  // This is crucial: if any ancestor has transform: scale(zoom), html2canvas measures scaled-down bounding boxes
  // which compresses text and causes adjacent characters, lines, and columns to overlap!
  const ancestorTransforms: Array<{ el: HTMLElement; transform: string; transition: string }> = [];
  let ancestor = element.parentElement;
  while (ancestor && ancestor !== document.body) {
    if (ancestor.style.transform && ancestor.style.transform !== 'none') {
      ancestorTransforms.push({
        el: ancestor,
        transform: ancestor.style.transform,
        transition: ancestor.style.transition,
      });
      ancestor.style.transform = 'none';
      ancestor.style.transition = 'none';
    }
    ancestor = ancestor.parentElement;
  }

  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  element.style.transform = 'none';
  element.style.transition = 'none';

  try {
    // 2. Wait for web fonts (e.g. Plus Jakarta Sans, Merriweather) to finish loading
    // so font metrics are 100% accurate before measuring and rendering
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Force layout reflow so client rects are measured on unscaled 1:1 dimensions
    void element.offsetHeight;
    void document.body.offsetHeight;

    // 3. Apply page-break boundaries on the unscaled 1:1 layout
    applyPageBoundaries(element);

    // 4. Standard A4 width in CSS pixels (210mm at 96 DPI = 794px)
    const targetWidth = 794;
    const elementHeight = Math.ceil(element.offsetHeight);
    const pageHeightPx = 1123;
    let linksData: Array<{ href: string; x: number; y: number; w: number; h: number }> = [];

    const safeScale = getSafeCanvasScale(elementHeight);

    const canvas = await html2canvas(element, {
      scale: safeScale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: targetWidth,
      windowHeight: Math.max(pageHeightPx, elementHeight + 200),
      width: targetWidth,
      height: elementHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Strip any mobile viewport meta tags from the cloned document
        // to prevent mobile browser engines from overriding iframe media query thresholds
        const viewportMetas = clonedDoc.querySelectorAll('meta[name="viewport"]');
        viewportMetas.forEach((meta) => meta.remove());

        const fixedMeta = clonedDoc.createElement('meta');
        fixedMeta.name = 'viewport';
        fixedMeta.content = 'width=794, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        clonedDoc.head.appendChild(fixedMeta);

        // 2. Lock html and body to exact 794px canonical A4 dimensions and disable text inflation
        clonedDoc.documentElement.style.width = `${targetWidth}px`;
        clonedDoc.documentElement.style.minWidth = `${targetWidth}px`;
        clonedDoc.documentElement.style.maxWidth = `${targetWidth}px`;
        clonedDoc.documentElement.style.margin = '0';
        clonedDoc.documentElement.style.padding = '0';

        clonedDoc.body.style.width = `${targetWidth}px`;
        clonedDoc.body.style.minWidth = `${targetWidth}px`;
        clonedDoc.body.style.maxWidth = `${targetWidth}px`;
        clonedDoc.body.style.margin = '0';
        clonedDoc.body.style.padding = '0';
        clonedDoc.body.style.webkitTextSizeAdjust = '100%';

        // 3. Inject CSS to lock A4 document container and ensure print consistency
        const overrideStyle = clonedDoc.createElement('style');
        overrideStyle.textContent = `
          * {
            -webkit-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
          }
          .cv-document-container,
          .biodata-document-container {
            width: ${targetWidth}px !important;
            min-width: ${targetWidth}px !important;
            max-width: ${targetWidth}px !important;
            box-sizing: border-box !important;
            margin: 0 auto !important;
            transform: none !important;
          }
        `;
        clonedDoc.head.appendChild(overrideStyle);

        // 4. Enforce exact 794px canonical A4 dimensions on the cloned element in iframe
        clonedElement.style.transform = 'none';
        clonedElement.style.transition = 'none';
        clonedElement.style.width = `${targetWidth}px`;
        clonedElement.style.minWidth = `${targetWidth}px`;
        clonedElement.style.maxWidth = `${targetWidth}px`;
        clonedElement.style.boxSizing = 'border-box';
        clonedElement.style.margin = '0 auto';

        let p = clonedElement.parentElement;
        while (p && p !== clonedDoc.body) {
          p.style.transform = 'none';
          p.style.transition = 'none';
          p.style.margin = '0';
          p.style.padding = '0';
          p = p.parentElement;
        }

        // 5. Measure links directly on clonedElement inside the unscaled iframe
        const clonedContainerRect = clonedElement.getBoundingClientRect();
        const linkElements = Array.from(clonedElement.querySelectorAll('a[href]'));

        linksData = linkElements
          .map((a) => {
            const rect = a.getBoundingClientRect();
            const rawHref = (a as HTMLAnchorElement).href || (a as HTMLAnchorElement).getAttribute('href') || '';
            const cleanHref = normalizePdfLink(rawHref);
            if (!cleanHref || rect.width <= 0 || rect.height <= 0) return null;

            return {
              href: cleanHref,
              x: rect.left - clonedContainerRect.left,
              y: rect.top - clonedContainerRect.top,
              w: rect.width,
              h: rect.height,
            };
          })
          .filter((l): l is NonNullable<typeof l> => l !== null);
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pageHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages with exact page-offset segment slicing
    while (heightLeft > 2) {
      position = -(pageCount * pageHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageCount++;
    }

    // Embed genuine clickable hyperlink annotations into the PDF on the correct pages.
    // 1 unscaled CSS pixel on the 794px-wide document is exactly (pdfWidth / targetWidth) mm!
    const mmPerPx = pdfWidth / targetWidth;
    linksData.forEach((link) => {
      const rawXMm = link.x * mmPerPx;
      const rawYMm = link.y * mmPerPx;
      const rawWMm = link.w * mmPerPx;
      const rawHMm = link.h * mmPerPx;

      // Expand touch area for finger tapping on mobile touchscreens (minimum 7.0mm height, 2mm horizontal pad)
      const padX = 2.0;
      const padY = 2.0;
      const touchX = Math.max(0, rawXMm - padX);
      const touchW = Math.min(pdfWidth - touchX, rawWMm + (padX * 2));
      const touchH = Math.max(rawHMm + (padY * 2), 7.0);

      const targetPage = Math.floor(rawYMm / pageHeight) + 1;
      const yOnPageMm = Math.max(0, (rawYMm % pageHeight) - padY);

      if (targetPage <= pageCount) {
        pdf.setPage(targetPage);
        pdf.link(touchX, yOnPageMm, touchW, touchH, { url: link.href });
      }
    });

    // If multi-page, add clean running page numbers at the bottom of each page
    const cleanName = (cv.personal.fullName || 'Professional').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    if (pageCount > 1) {
      for (let p = 1; p <= pageCount; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `${cv.personal.fullName || 'Curriculum Vitae'}  ·  Page ${p} of ${pageCount}`,
          pdfWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
    }

    const filename = `${cleanName}_CV.pdf`;
    const { blobUrl } = downloadPdfSafely(pdf, filename);
    return { blobUrl };
  } finally {
    // Restore styling on all ancestors and element
    ancestorTransforms.forEach(({ el, transform, transition }) => {
      el.style.transform = transform;
      el.style.transition = transition;
    });
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
    // Re-apply boundaries for the live preview
    applyPageBoundaries(element);
  }
}

/**
 * Triggers native high-fidelity browser print dialog for 100% vector-crisp selectable text & hyperlinks
 */
export function printCV(cv?: CVData): void {
  const element = document.getElementById('cv-document-render');
  if (element) {
    applyPageBoundaries(element);
  }

  const originalTitle = document.title;
  if (cv?.personal.fullName) {
    const cleanName = cv.personal.fullName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${cleanName}_CV`;
  }
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
