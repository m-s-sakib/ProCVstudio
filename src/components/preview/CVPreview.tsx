/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CVData, TemplateId } from '../../types/cv';
import { ClassicAcademicTemplate } from './templates/ClassicAcademicTemplate';
import { ModernDataAnalystTemplate } from './templates/ModernDataAnalystTemplate';
import { PremiumNavyTemplate } from './templates/PremiumNavyTemplate';
import { ATSTemplate } from './templates/ATSTemplate';
import { EuropassTemplate } from './templates/EuropassTemplate';
import { exportToDocx } from '../../utils/docxExport';
import { exportToPdf, printCV } from '../../utils/pdfExport';
import { applyPageBoundaries, resetPageBoundaries } from '../../utils/pagination';
import { Download, FileText, Printer, ZoomIn, ZoomOut, Check, Sparkles, AlertCircle, FileEdit, Maximize2, Layers } from 'lucide-react';

interface CVPreviewProps {
  cv: CVData;
  onUpdateCV: (updater: (prev: CVData) => CVData) => void;
  onBackToForm?: () => void;
  showBackToFormButton?: boolean;
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  cv,
  onUpdateCV,
  onBackToForm,
  showBackToFormButton = false,
}) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number>(1123);
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 480) return 46;
      if (window.innerWidth < 768) return 55;
      if (window.innerWidth < 1024) return 75;
    }
    return 95;
  });
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Dynamically calculate document page count based on rendered A4 height (1123px at standard DPI)
  const A4_HEIGHT_PX = 1123;
  const totalPages = Math.max(1, Math.ceil((docHeight - 20) / A4_HEIGHT_PX));

  // In the live screen preview, automatically identify the last full stop of page 1
  // and push any sentence spilling into page 2 so it starts cleanly from page 2!
  useEffect(() => {
    const updatePaginationAndHeight = () => {
      if (docRef.current) {
        applyPageBoundaries(docRef.current);
        setDocHeight(docRef.current.offsetHeight);
      }
    };
    updatePaginationAndHeight();
    const t1 = setTimeout(updatePaginationAndHeight, 100);
    const t2 = setTimeout(updatePaginationAndHeight, 350);
    window.addEventListener('resize', updatePaginationAndHeight);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updatePaginationAndHeight);
    };
  }, [cv, zoom, cv.customization.templateId, cv.customization.spacing, cv.customization.fontSize]);

  const handleTemplateChange = (templateId: TemplateId) => {
    onUpdateCV((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        templateId,
      },
    }));
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportError(null);
      await exportToPdf(cv, { elementId: 'cv-document-render' });
      setExportSuccess('PDF downloaded successfully!');
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setExportError('Failed to generate PDF. Using print dialog as backup.');
      setTimeout(() => {
        printCV();
      }, 500);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      setExportError(null);
      await exportToDocx(cv);
      setExportSuccess('Word (.docx) document downloaded!');
      setTimeout(() => setExportSuccess(null), 3500);
    } catch (err) {
      console.error('DOCX Export Error:', err);
      setExportError('Failed to create .docx file. Please check input fields.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Font family mapping
  const getFontClass = () => {
    switch (cv.customization.fontFamily) {
      case 'academic':
        return 'font-academic';
      case 'editorial':
        return 'font-editorial';
      case 'mono':
        return 'font-mono-code';
      case 'modern':
      default:
        return 'font-modern';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Top Preview Control Toolbar */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
        <div className="flex items-center gap-2 flex-wrap">
          {showBackToFormButton && onBackToForm && (
            <button
              type="button"
              onClick={onBackToForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs mr-1"
            >
              <FileEdit className="w-3.5 h-3.5 text-blue-600" />
              <span>← Edit Form</span>
            </button>
          )}

          {/* Template Selector in Preview */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 mr-1 hidden lg:inline">Template:</span>
            <button
              onClick={() => handleTemplateChange('academic')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                cv.customization.templateId === 'academic'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Academic Serif
            </button>
            <button
              onClick={() => handleTemplateChange('data-analyst')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                cv.customization.templateId === 'data-analyst'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Data Analyst
            </button>
            <button
              onClick={() => handleTemplateChange('premium-navy')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                cv.customization.templateId === 'premium-navy'
                  ? 'bg-[#0f2b48] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Premium Navy
            </button>
            <button
              onClick={() => handleTemplateChange('ats')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                cv.customization.templateId === 'ats'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ATS Minimal
            </button>
            <button
              onClick={() => handleTemplateChange('europass')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                cv.customization.templateId === 'europass'
                  ? 'bg-[#0e4194] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Europass (EU)
            </button>
          </div>
        </div>

        {/* Zoom Controls & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Dynamic Page Count Badge */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
              totalPages > 1
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
            title={`Document length: ${totalPages} A4 ${totalPages === 1 ? 'page' : 'pages'}`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{totalPages === 1 ? '1 Page (A4)' : `${totalPages} Pages (A4)`}</span>
          </div>

          {/* Zoom controls (Always accessible on Mobile, Tablet & PC) */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setZoom((z) => Math.max(40, z - 10))}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-600 px-1 min-w-8 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.innerWidth < 480) setZoom(46);
                  else if (window.innerWidth < 768) setZoom(55);
                  else if (window.innerWidth < 1024) setZoom(75);
                  else setZoom(95);
                }
              }}
              className="text-[10px] font-bold px-1.5 py-0.5 text-slate-600 hover:bg-white rounded transition-colors"
              title="Fit to screen width"
            >
              Fit
            </button>
          </div>

          {/* Native Print / Save */}
          <button
            onClick={() => printCV(cv)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            title="Print or Save as PDF with 100% vector-crisp selectable text & hyperlinks"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          {/* Word Export Button */}
          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs disabled:opacity-60 whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>{isExportingDocx ? 'Exporting...' : 'Word (.docx)'}</span>
          </button>

          {/* PDF Export Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs disabled:opacity-60 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Page Optimizer Helper (Shows when CV exceeds 1 Page) */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-b border-blue-200/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs no-print shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wide">
              {totalPages} Pages (A4)
            </span>
            <span className="text-slate-800 font-medium text-xs">
              Well-organized multi-page layout. Content flows cleanly without cutting entries in half.
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 hidden md:inline">Quick Adjust:</span>
            <button
              type="button"
              onClick={() => {
                onUpdateCV((prev) => ({
                  ...prev,
                  customization: {
                    ...prev.customization,
                    spacing: 'compact',
                    fontSize: 'sm',
                  },
                }));
              }}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-semibold shadow-2xs transition-colors"
              title="Tighten spacing & font to fit onto fewer pages"
            >
              Fit to 1 Page
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateCV((prev) => ({
                  ...prev,
                  customization: {
                    ...prev.customization,
                    spacing: 'normal',
                    fontSize: 'base',
                  },
                }));
              }}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-semibold shadow-2xs transition-colors"
              title="Spacious standard spacing for balanced multi-page document"
            >
              Spacious Multi-Page
            </button>
          </div>
        </div>
      )}

      {/* Notifications toast */}
      {exportSuccess && (
        <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 border-b border-emerald-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{exportSuccess}</span>
          </div>
          <span className="text-[11px] text-emerald-600">Saved to your downloads folder</span>
        </div>
      )}

      {exportError && (
        <div className="bg-amber-50 text-amber-900 text-xs px-4 py-2 border-b border-amber-200 flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{exportError}</span>
        </div>
      )}

      {/* Scrollable Preview Canvas with Dynamic Multi-Page Boundaries */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-200/80 print:p-0 print:bg-white print:overflow-visible">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 150ms ease-out',
          }}
          className="transition-all duration-150 ease-out print:transform-none"
        >
          {/* Printable Document Paper */}
          <div
            ref={docRef}
            id="cv-document-render"
            className={`cv-document-container relative bg-white shadow-xl border border-slate-300 w-[210mm] min-h-[297mm] ${getFontClass()} print:border-none print:shadow-none print:w-full print:m-0`}
          >
            {/* Dynamic Visual Page Break Guides for Every Page (Hidden in Print & Export) */}
            {Array.from({ length: totalPages - 1 }).map((_, idx) => {
              const pageIndex = idx + 1;
              const breakTopPx = pageIndex * A4_HEIGHT_PX;
              return (
                <div
                  key={`page-break-${pageIndex}`}
                  data-html2canvas-ignore="true"
                  className="absolute left-0 right-0 pointer-events-none no-print print:hidden z-20 flex flex-col items-center"
                  style={{ top: `${breakTopPx}px` }}
                >
                  <div className="w-full border-b-2 border-dashed border-rose-400/80" />
                  <div className="-translate-y-1/2 flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-0.5 rounded-full shadow-2xs">
                    <span className="text-[10px] font-bold text-rose-800 flex items-center gap-1.5">
                      <span>✂ Page {pageIndex} Ends (After Full Stop)</span>
                      <span className="text-rose-400">·</span>
                      <span>Page {pageIndex + 1} Starts With Next Sentence</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Page number indicators at the bottom of each page (Preview only) */}
            {totalPages > 1 &&
              Array.from({ length: totalPages }).map((_, idx) => {
                const pageIndex = idx + 1;
                const footerTopPx = pageIndex * A4_HEIGHT_PX - 22;
                return (
                  <div
                    key={`preview-page-indicator-${pageIndex}`}
                    data-html2canvas-ignore="true"
                    className="absolute right-8 pointer-events-none no-print print:hidden text-[10px] font-semibold text-slate-400 bg-white/80 px-2 py-0.5 rounded"
                    style={{ top: `${footerTopPx}px` }}
                  >
                    Page {pageIndex} of {totalPages}
                  </div>
                );
              })}

            {cv.customization.templateId === 'academic' && <ClassicAcademicTemplate cv={cv} />}
            {cv.customization.templateId === 'data-analyst' && <ModernDataAnalystTemplate cv={cv} />}
            {cv.customization.templateId === 'premium-navy' && <PremiumNavyTemplate cv={cv} />}
            {cv.customization.templateId === 'ats' && <ATSTemplate cv={cv} />}
            {cv.customization.templateId === 'europass' && <EuropassTemplate cv={cv} />}
          </div>
        </div>
      </div>

      {/* Footer Info bar */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Live Preview
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-[11px]">
            Target standard A4 (210×297mm) · Clickable hyperlinks enabled
          </span>
        </div>
        <div className="text-[11px] text-slate-600">
          Last updated: {new Date(cv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
