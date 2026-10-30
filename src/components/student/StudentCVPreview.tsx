/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { StudentCVData, StudentTemplateId } from '../../types/studentCv';
import { SimpleStudentTemplate } from './templates/SimpleStudentTemplate';
import { ModernStudentTemplate } from './templates/ModernStudentTemplate';
import { AtsStudentTemplate } from './templates/AtsStudentTemplate';
import { exportStudentPdf, exportStudentDocx } from '../../utils/studentExport';
import { applyPageBoundaries, resetPageBoundaries } from '../../utils/pagination';
import {
  Download,
  FileText,
  ZoomIn,
  ZoomOut,
  Check,
  Sparkles,
  AlertCircle,
  FileEdit,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface StudentCVPreviewProps {
  cv: StudentCVData;
  onUpdateCV: (updater: (prev: StudentCVData) => StudentCVData) => void;
  onBackToForm?: () => void;
  showBackToFormButton?: boolean;
}

export const StudentCVPreview: React.FC<StudentCVPreviewProps> = ({
  cv,
  onUpdateCV,
  onBackToForm,
  showBackToFormButton = false,
}) => {
  const docRef = useRef<HTMLDivElement>(null);
  const templateScrollRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number>(1123);

  const scrollTemplates = (direction: 'left' | 'right') => {
    if (templateScrollRef.current) {
      const scrollAmount = direction === 'left' ? -160 : 160;
      templateScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
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

  const A4_HEIGHT_PX = 1123;
  const totalPages = Math.max(1, Math.ceil((docHeight - 20) / A4_HEIGHT_PX));

  // Automatically apply intelligent page boundaries to prevent sentence splitting
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
  }, [cv, zoom, cv.templateId]);

  const handleTemplateChange = (templateId: StudentTemplateId) => {
    onUpdateCV((prev) => ({
      ...prev,
      templateId,
    }));
  };

  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('Student_CV.pdf');

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportError(null);
      const res = await exportStudentPdf(cv, { elementId: 'student-cv-render' });
      if (res?.blobUrl) {
        setDownloadBlobUrl(res.blobUrl);
        setDownloadFilename(`${(cv.personal.fullName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_Student_CV.pdf`);
      }
      setExportSuccess('Student CV PDF is ready!');
      setTimeout(() => setExportSuccess(null), 8000);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setExportError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      setExportError(null);
      const res = await exportStudentDocx(cv);
      if (res?.blobUrl) {
        setDownloadBlobUrl(res.blobUrl);
        setDownloadFilename(`${(cv.personal.fullName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_Student_CV.docx`);
      }
      setExportSuccess('Student CV Word (.docx) is ready!');
      setTimeout(() => setExportSuccess(null), 8000);
    } catch (err) {
      console.error('DOCX Export Error:', err);
      setExportError('Failed to export Word document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Top Preview Control Toolbar */}
      <div className="bg-white px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shrink-0 no-print">
        <div className="flex items-center gap-2 max-w-full w-full sm:w-auto min-w-0">
          {/* Template Selector with horizontal touch sliding on mobile */}
          <div className="relative flex items-center min-w-0 max-w-full w-full sm:w-auto">
            {/* Mobile Left Slide Button */}
            <button
              type="button"
              onClick={() => scrollTemplates('left')}
              className="sm:hidden shrink-0 p-1 mr-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 active:scale-90 shadow-2xs z-10"
              title="Slide Left"
              aria-label="Slide left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Horizontally Slidable / Scrollable Container */}
            <div
              ref={templateScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none bg-slate-50/90 px-2 rounded-xl border border-slate-200/90 shadow-2xs max-w-full touch-pan-x overscroll-x-contain scroll-smooth flex-nowrap min-w-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <span className="text-xs font-bold text-slate-800 mr-0.5 hidden lg:inline shrink-0">Template:</span>
              <button
                type="button"
                onClick={() => handleTemplateChange('student-simple')}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap active:scale-95 ${
                  cv.templateId === 'student-simple'
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/30'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-500 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                Template A: Simple
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange('student-modern')}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap active:scale-95 ${
                  cv.templateId === 'student-modern'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500/30'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50/50 shadow-2xs'
                }`}
              >
                Template B: Modern
              </button>
              <button
                type="button"
                onClick={() => handleTemplateChange('student-ats')}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap active:scale-95 ${
                  cv.templateId === 'student-ats'
                    ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/30'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-2xs'
                }`}
              >
                Template C: ATS-Friendly
              </button>
            </div>

            {/* Mobile Right Slide Button */}
            <button
              type="button"
              onClick={() => scrollTemplates('right')}
              className="sm:hidden shrink-0 p-1 ml-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 active:scale-90 shadow-2xs z-10"
              title="Slide Right"
              aria-label="Slide right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Dynamic Page Count Badge */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
              totalPages > 1
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{totalPages === 1 ? '1 Page (A4)' : `${totalPages} Pages (A4)`}</span>
          </div>

          {/* Zoom controls */}
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
          </div>

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

      {/* Toast notifications */}
      {exportSuccess && (
        <div className="bg-emerald-50 text-emerald-900 text-xs px-4 py-2.5 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{exportSuccess}</span>
            <span className="hidden sm:inline text-emerald-700">· Saved to Downloads</span>
          </div>
          {downloadBlobUrl && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 hidden md:inline">Download didn't start?</span>
              <a
                href={downloadBlobUrl}
                download={downloadFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-md shadow-2xs transition-colors"
              >
                <span>📱 Tap to Open / Save File</span>
              </a>
            </div>
          )}
        </div>
      )}

      {exportError && (
        <div className="bg-amber-50 text-amber-900 text-xs px-4 py-2 border-b border-amber-200 flex items-center gap-2 no-print">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{exportError}</span>
        </div>
      )}

      {/* Preview Canvas */}
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
            id="student-cv-render"
            className="cv-document-container relative bg-white shadow-xl border border-slate-300 w-[210mm] min-h-[297mm] print:border-none print:shadow-none print:w-full print:m-0"
          >
            {/* Visual Page Break Guides for preview */}
            {Array.from({ length: totalPages - 1 }).map((_, idx) => {
              const pageIndex = idx + 1;
              const breakTopPx = pageIndex * A4_HEIGHT_PX;
              return (
                <div
                  key={`student-break-${pageIndex}`}
                  data-html2canvas-ignore="true"
                  className="absolute left-0 right-0 pointer-events-none no-print print:hidden z-20 flex flex-col items-center"
                  style={{ top: `${breakTopPx}px` }}
                >
                  <div className="w-full border-b-2 border-dashed border-rose-400/80" />
                  <div className="-translate-y-1/2 flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-0.5 rounded-full shadow-2xs">
                    <span className="text-[10px] font-bold text-rose-800">
                      ✂ Page {pageIndex} Ends · Page {pageIndex + 1} Starts
                    </span>
                  </div>
                </div>
              );
            })}

            {cv.templateId === 'student-simple' && <SimpleStudentTemplate cv={cv} />}
            {cv.templateId === 'student-modern' && <ModernStudentTemplate cv={cv} />}
            {cv.templateId === 'student-ats' && <AtsStudentTemplate cv={cv} />}
          </div>
        </div>
      </div>

      {/* Footer Info bar */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Student CV Live Preview</span>
          <span className="text-slate-400">·</span>
          <span>A4 Standard with Clickable Links</span>
        </div>
        <div className="text-[11px] text-slate-600">
          Last updated: {new Date(cv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
