/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MarriageBiodata } from '../types/biodata';
import { applyPageBoundaries } from './pagination';
import { downloadPdfSafely, getSafeCanvasScale } from './mobileDownload';
import { normalizePdfLink } from './links';

export interface ExportBiodataPdfOptions {
  elementId?: string;
}

/**
 * Downloads a high-quality PDF of the marriage biodata with consistent margins
 * and intelligent page boundaries preventing sentence and block splitting.
 */
export async function exportBiodataToPdf(
  biodata: MarriageBiodata,
  options?: ExportBiodataPdfOptions
): Promise<{ blobUrl: string }> {
  const elementId = options?.elementId || 'biodata-document-render';
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error('Biodata document element not found for export.');
  }

  // Store and temporarily neutralize any CSS transforms on all parent/ancestor elements
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

  const originalMinHeight = element.style.minHeight;

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Force layout reflow so client rects are measured on unscaled 1:1 dimensions
    void element.offsetHeight;
    void document.body.offsetHeight;

    // Apply intelligent page breaks to prevent sentence/card splitting
    applyPageBoundaries(element);

    const targetWidth = 794;
    const pageHeightPx = Math.round(targetWidth * (297 / 210));
    const totalPages = Math.max(1, Math.ceil((element.offsetHeight - 20) / pageHeightPx));

    // Pad container to exact multiple of A4 page height for full background coverage
    element.style.minHeight = `${totalPages * pageHeightPx}px`;

    let linksData: Array<{ href: string; x: number; y: number; w: number; h: number }> = [];

    const elementHeight = Math.ceil(element.offsetHeight);
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
        // Strip any mobile viewport meta tags
        const viewportMetas = clonedDoc.querySelectorAll('meta[name="viewport"]');
        viewportMetas.forEach((meta) => meta.remove());

        const fixedMeta = clonedDoc.createElement('meta');
        fixedMeta.name = 'viewport';
        fixedMeta.content = 'width=794, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        clonedDoc.head.appendChild(fixedMeta);

        // Lock html and body
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

        // Measure links directly on clonedElement inside the unscaled iframe
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

    // Additional pages if biodata is long
    while (heightLeft > 2) {
      position = -(pageCount * pageHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageCount++;
    }

    // Embed genuine clickable hyperlink annotations into the PDF on the correct pages
    const mmPerPx = pdfWidth / targetWidth;
    linksData.forEach((link) => {
      const rawXMm = link.x * mmPerPx;
      const rawYMm = link.y * mmPerPx;
      const rawWMm = link.w * mmPerPx;
      const rawHMm = link.h * mmPerPx;

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

    const cleanName = (biodata.personal.fullName || 'Marriage_Biodata')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanName}_Marriage_Biodata.pdf`;
    const { blobUrl } = downloadPdfSafely(pdf, filename);
    return { blobUrl };
  } finally {
    element.style.minHeight = originalMinHeight;
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
 * Native vector print dialog for pixel-perfect printing or Save as PDF
 */
export function printBiodata(biodata?: MarriageBiodata): void {
  const element = document.getElementById('biodata-document-render');
  if (element) {
    applyPageBoundaries(element);
  }

  const originalTitle = document.title;
  if (biodata?.personal.fullName) {
    const cleanName = biodata.personal.fullName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${cleanName}_Marriage_Biodata`;
  }
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
