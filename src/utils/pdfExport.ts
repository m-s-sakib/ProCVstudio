/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CVData } from '../types/cv';
import { applyPageBoundaries, resetPageBoundaries } from './pagination';
import { downloadPdfSafely, getSafeCanvasScale } from './mobileDownload';

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

    // 3. Apply page-break boundaries on the unscaled 1:1 layout
    applyPageBoundaries(element);

    // 4. Get link elements and their positions in pristine 1:1 coordinates
    const containerRect = element.getBoundingClientRect();
    const linkElements = Array.from(element.querySelectorAll('a[href]'));

    const linksData = linkElements.map((a) => {
      const rect = a.getBoundingClientRect();
      const href = (a as HTMLAnchorElement).href;
      return {
        href,
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        w: rect.width,
        h: rect.height,
      };
    });

    const targetWidth = element.offsetWidth || 794;
    const safeScale = getSafeCanvasScale(element.offsetHeight);

    const canvas = await html2canvas(element, {
      scale: safeScale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: targetWidth,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure the cloned document has zero transform on all parent elements
        clonedElement.style.transform = 'none';
        clonedElement.style.transition = 'none';
        let p = clonedElement.parentElement;
        while (p && p !== clonedDoc.body) {
          p.style.transform = 'none';
          p.style.transition = 'none';
          p = p.parentElement;
        }
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
    let totalPages = 1;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 2) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      totalPages++;
    }

    // Embed genuine clickable hyperlink annotations into the PDF on the correct pages
    const mmPerPx = pdfWidth / containerRect.width;
    linksData.forEach((link) => {
      if (!link.href || link.w <= 0 || link.h <= 0) return;

      const xMm = link.x * mmPerPx;
      const yMm = link.y * mmPerPx;
      const wMm = Math.max(link.w * mmPerPx, 2);
      const hMm = Math.max(link.h * mmPerPx, 2);

      const targetPage = Math.floor(yMm / pageHeight) + 1;
      const yOnPageMm = yMm % pageHeight;

      if (targetPage <= totalPages) {
        pdf.setPage(targetPage);
        pdf.link(xMm, yOnPageMm, wMm, hMm, { url: link.href });
      }
    });

    // If multi-page, add clean running page numbers at the bottom of each page
    const cleanName = (cv.personal.fullName || 'Professional').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    if (totalPages > 1) {
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `${cv.personal.fullName || 'Curriculum Vitae'}  ·  Page ${p} of ${totalPages}`,
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
