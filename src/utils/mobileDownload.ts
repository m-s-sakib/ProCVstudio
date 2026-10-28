/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';

/**
 * Checks whether the current runtime is a mobile or small-screen device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  return isMobileUA || isSmallScreen;
}

/**
 * Calculates a safe rendering scale for html2canvas to prevent iOS Safari memory crashes.
 * iOS Safari WebKit has a hard ceiling of 4096px per dimension or ~16M pixels total.
 * Multi-page CVs at scale: 2 exceed 4096px and crash or return blank images.
 */
export function getSafeCanvasScale(elementHeightPx: number): number {
  if (!isMobileDevice()) {
    return 2; // Full 300 DPI on desktop
  }
  // Safe ceiling: 3800px max canvas height
  const maxSafeScale = 3800 / Math.max(elementHeightPx, 1123);
  return Math.max(1.2, Math.min(1.8, Math.floor(maxSafeScale * 10) / 10));
}

/**
 * Downloads a Blob file reliably across mobile devices (iOS Safari, Android Chrome, mobile WebViews)
 * without premature object URL revocation.
 */
export function downloadBlobFile(blob: Blob, filename: string): { blobUrl: string } {
  const blobUrl = URL.createObjectURL(blob);
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  try {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    console.warn('Programmatic anchor click failed:', err);
  }

  // On iOS Safari, programmatic anchor download is frequently ignored for blob URLs.
  // In addition, if direct download did not trigger, opening the blob URL in a new window/tab
  // allows iOS Safari's native PDF preview to display with the native "Share / Save to Files" option.
  if (isIOS) {
    setTimeout(() => {
      window.open(blobUrl, '_blank');
    }, 250);
  }

  // Keep the blob URL valid for 60 seconds so mobile download managers can complete reading the file
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);

  return { blobUrl };
}

/**
 * Downloads a jsPDF document safely on both desktop and mobile devices.
 */
export function downloadPdfSafely(pdf: jsPDF, filename: string): { blobUrl: string } {
  try {
    const blob = pdf.output('blob');
    return downloadBlobFile(blob, filename);
  } catch (e) {
    console.warn('pdf.output(blob) failed, falling back to pdf.save:', e);
    pdf.save(filename);
    return { blobUrl: '' };
  }
}
