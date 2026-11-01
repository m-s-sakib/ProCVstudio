/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, Briefcase, BookOpen, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type CVTypeSelection = 'student' | 'professional' | 'academic';

interface CVTypeModalProps {
  isOpen: boolean;
  activeType: CVTypeSelection;
  onSelect: (type: CVTypeSelection) => void;
  onClose: () => void;
}

export const CVTypeModal: React.FC<CVTypeModalProps> = ({
  isOpen,
  activeType,
  onSelect,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2">
              <span>{t.cvTypeModal.badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.cvTypeModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.cvTypeModal.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 CV Type Cards */}
        <div className="space-y-3.5">
          {/* 1. College Student CV */}
          <div
            onClick={() => {
              onSelect('student');
              onClose();
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative group ${
              activeType === 'student'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/70'
            }`}
          >
            <div
              className={`p-3 rounded-xl mt-0.5 ${
                activeType === 'student' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {t.cvTypeModal.studentTitle}
                </h4>
                <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {t.cvTypeModal.studentBadge}
                </span>
                {activeType === 'student' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {t.cvTypeModal.activeBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.cvTypeModal.studentDesc}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.studentTag1}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.studentTag2}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.studentTag3}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center text-blue-600 group-hover:translate-x-1 transition-transform self-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Professional CV */}
          <div
            onClick={() => {
              onSelect('professional');
              onClose();
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative group ${
              activeType === 'professional'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/70'
            }`}
          >
            <div
              className={`p-3 rounded-xl mt-0.5 ${
                activeType === 'professional' ? 'bg-[#0f2b48] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Briefcase className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {t.cvTypeModal.proTitle}
                </h4>
                {activeType === 'professional' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {t.cvTypeModal.activeBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.cvTypeModal.proDesc}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.proTag1}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.proTag2}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.proTag3}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform self-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Academic CV */}
          <div
            onClick={() => {
              onSelect('academic');
              onClose();
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 relative group ${
              activeType === 'academic'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/70'
            }`}
          >
            <div
              className={`p-3 rounded-xl mt-0.5 ${
                activeType === 'academic' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {t.cvTypeModal.academicTitle}
                </h4>
                {activeType === 'academic' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {t.cvTypeModal.activeBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.cvTypeModal.academicDesc}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.academicTag1}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.academicTag2}</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">{t.cvTypeModal.academicTag3}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform self-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-100">
          <span>{t.nav.home} • ProCVmaKer</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {t.footer.close}
          </button>
        </div>
      </div>
    </div>
  );
};
