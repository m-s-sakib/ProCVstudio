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
import { exportBiodataToPdf, printBiodata } from '../../utils/biodataPdfExport';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface BiodataPreviewProps {
  biodata: MarriageBiodata;
  onOpenExportModal?: () => void;
}

export const BiodataPreview: React.FC<BiodataPreviewProps> = ({ biodata }) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportMessage('Generating high-resolution Biodata PDF...');
    try {
      await exportBiodataToPdf(biodata, { elementId: 'biodata-document-render' });
      setExportMessage('PDF downloaded successfully!');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err) {
      console.error('Biodata PDF Export error:', err);
      setExportMessage('Opening browser print to save PDF...');
      printBiodata(biodata);
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printBiodata(biodata);
  };

  const renderActiveTemplate = () => {
    switch (biodata.customization.templateId) {
      case 'romantic-elegant':
        return <RomanticElegantTemplate biodata={biodata} />;
      case 'traditional-islamic':
        return <TraditionalIslamicTemplate biodata={biodata} />;
      case 'modern-minimal':
        return <ModernMinimalTemplate biodata={biodata} />;
      case 'premium-floral':
        return <PremiumFloralTemplate biodata={biodata} />;
      case 'classic-family':
        return <ClassicFamilyTemplate biodata={biodata} />;
      default:
        return <RomanticElegantTemplate biodata={biodata} />;
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
            onClick={handlePrint}
            title="Print or Save as Vector PDF"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Print</span>
          </button>

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
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs font-medium text-rose-800 flex items-center justify-between animate-in fade-in no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{exportMessage}</span>
          </div>
        </div>
      )}

      {/* Main Canvas Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-200/50"
      >
        <div
          id="biodata-document-render"
          className="biodata-document-container bg-white shadow-xl transition-transform origin-top duration-150"
          style={{
            width: '794px', // A4 width in standard screen pixels
            minHeight: '1123px', // A4 height
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          {renderActiveTemplate()}
        </div>
      </div>
    </div>
  );
};
