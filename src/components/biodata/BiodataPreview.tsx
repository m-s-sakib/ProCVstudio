/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MarriageBiodata } from '../../types/biodata';
import { RomanticElegantTemplate } from './templates/RomanticElegantTemplate';
import { TraditionalIslamicTemplate } from './templates/TraditionalIslamicTemplate';
import { ModernMinimalTemplate } from './templates/ModernMinimalTemplate';
import { PremiumFloralTemplate } from './templates/PremiumFloralTemplate';
import { ClassicFamilyTemplate } from './templates/ClassicFamilyTemplate';
import { exportBiodataToPdf } from '../../utils/biodataPdfExport';
import { applyPageBoundaries, resetPageBoundaries } from '../../utils/pagination';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
} from 'lucide-react';

interface BiodataPreviewProps {
  biodata: MarriageBiodata;
  onOpenExportModal?: () => void;
}

export const BiodataPreview: React.FC<BiodataPreviewProps> = ({ biodata }) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [docHeight, setDocHeight] = useState<number>(1123);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const A4_HEIGHT_PX = 1123;
  const totalPages = Math.max(1, Math.ceil((docHeight - 20) / A4_HEIGHT_PX));

  // Auto-fit on small screens initially
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setZoom(0.52);
      } else if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setZoom(0.7);
      } else {
        setZoom(0.85);
      }
    };
    handleResize();
  }, []);

  // Dynamically apply intelligent page breaks and update height
  useEffect(() => {
    const updatePaginationAndHeight = () => {
      const renderEl = document.getElementById('biodata-document-render');
      if (renderEl) {
        applyPageBoundaries(renderEl);
        setDocHeight(renderEl.offsetHeight);
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
  }, [biodata, zoom, biodata.customization.templateId]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => setZoom(0.85);
  const handleFitWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const docWidth = 794; // standard A4 px
      const calculated = Math.min(Math.max(containerWidth / docWidth, 0.4), 1.2);
      setZoom(Number(calculated.toFixed(2)));
    }
  };

  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('Marriage_Biodata.pdf');

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportMessage('Generating high-resolution Biodata PDF...');
    try {
      const res = await exportBiodataToPdf(biodata, { elementId: 'biodata-document-render' });
      if (res?.blobUrl) {
        setDownloadBlobUrl(res.blobUrl);
        setDownloadFilename(`${(biodata.personal.fullName || 'Marriage_Biodata').trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_Marriage_Biodata.pdf`);
      }
      setExportMessage('Biodata PDF is ready and downloading!');
      setTimeout(() => setExportMessage(null), 8000);
    } catch (err) {
      console.error('Biodata PDF Export error:', err);
      setExportMessage('Failed to export PDF. Please try again.');
      setTimeout(() => setExportMessage(null), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const renderActiveTemplate = () => {
    switch (biodata.customization.templateId) {
      case 'romantic-elegant':
        return <RomanticElegantTemplate biodata={biodata} totalPages={totalPages} />;
      case 'traditional-islamic':
        return <TraditionalIslamicTemplate biodata={biodata} totalPages={totalPages} />;
      case 'modern-minimal':
        return <ModernMinimalTemplate biodata={biodata} totalPages={totalPages} />;
      case 'premium-floral':
        return <PremiumFloralTemplate biodata={biodata} totalPages={totalPages} />;
      case 'classic-family':
        return <ClassicFamilyTemplate biodata={biodata} totalPages={totalPages} />;
      default:
        return <RomanticElegantTemplate biodata={biodata} totalPages={totalPages} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Preview Toolbar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-500" />
            <span>Live Biodata Preview</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full capitalize">
            {biodata.customization.templateId.replace('-', ' ')}
          </span>
          {/* Dynamic Page Count Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
              totalPages > 1
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Layers className="w-3 h-3 text-rose-500" />
            <span>{totalPages === 1 ? '1 Page (A4)' : `${totalPages} Pages (A4)`}</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-slate-700 w-11 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom (85%)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors text-[10px] font-semibold px-1"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={handleFitWidth}
            title="Fit to Width"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Action Buttons: Export PDF & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg shadow-xs transition-all active:scale-95 disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Export notification banner */}
      {exportMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs font-medium text-rose-900 flex flex-wrap items-center justify-between gap-2 animate-in fade-in no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{exportMessage}</span>
          </div>
          {downloadBlobUrl && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-700 hidden sm:inline">Mobile download didn't start?</span>
              <a
                href={downloadBlobUrl}
                download={downloadFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-md shadow-2xs transition-colors"
              >
                <span>📱 Tap to Open / Save PDF</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Main Canvas Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-200/50"
      >
        <div
          id="biodata-document-render"
          className="biodata-document-container relative bg-white shadow-xl transition-transform origin-top duration-150"
          style={{
            width: '794px', // A4 width in standard screen pixels
            minHeight: '1123px', // A4 height
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Visual Page Break Guides for preview */}
          {Array.from({ length: totalPages - 1 }).map((_, idx) => {
            const pageIndex = idx + 1;
            const breakTopPx = pageIndex * A4_HEIGHT_PX;
            return (
              <div
                key={`biodata-break-${pageIndex}`}
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

          {renderActiveTemplate()}
        </div>
      </div>
    </div>
  );
};
