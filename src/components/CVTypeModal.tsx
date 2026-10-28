/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, Briefcase, BookOpen, X, Check, ArrowRight } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-2">
              <span>ProCVmaKer</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Choose Your CV Type
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select the best CV builder tailored to your background and career stage:
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
                  College Student CV
                </h4>
                <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                  🎓 New for Students
                </span>
                {activeType === 'student' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Designed for college and university students, fresh graduates, and beginners with little or no work experience. Simple step-by-step form focused on education, technical skills, coursework projects, and optional internships.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Simple Form</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">3 Student Templates</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">No Experience Needed</span>
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
                  Professional CV
                </h4>
                {activeType === 'professional' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                For software engineers, data analysts, corporate leads, and experienced job seekers. Features quantified achievements, multiple job positions, certifications, and ATS-optimized Modern &amp; Premium Navy templates.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Data Analyst Template</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Premium Navy</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Europass CV</span>
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
                  Academic CV
                </h4>
                {activeType === 'academic' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                For university professors, PhD scholars, and research fellows. Centered scholarly layout with Merriweather serif typography, academic divider bars, and research appointments.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-[11px] font-semibold text-slate-500">
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Classic Academic Serif</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Scholar Format</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform self-center">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-100">
          <span>You can switch between CV types anytime without losing saved drafts.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
