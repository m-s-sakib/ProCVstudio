/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { MarriageBiodata } from '../types/biodata';
import { applyPageBoundaries } from './pagination';
import { downloadPdfSafely, getSafeCanvasScale } from './mobileDownload';

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

    // Apply intelligent page breaks to prevent sentence/card splitting
    applyPageBoundaries(element);

    const targetWidth = element.offsetWidth || 794;
    const pageHeightPx = Math.round(targetWidth * (297 / 210));
    const totalPages = Math.max(1, Math.ceil((element.offsetHeight - 20) / pageHeightPx));

    // Pad container to exact multiple of A4 page height for full background coverage
    element.style.minHeight = `${totalPages * pageHeightPx}px`;

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
