/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateId } from '../types/cv';
import { ArrowRight, CheckCircle2, FileCheck, Layers, DownloadCloud, Sparkles, BookOpen, BarChart3, ShieldCheck, Award, Heart } from 'lucide-react';

interface HeroProps {
  onStartBuilder: (templateId?: TemplateId) => void;
  onLoadPreset: (presetKey: 'academic' | 'data-analyst' | 'corporate' | 'europass') => void;
  onOpenBiodata?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBuilder, onLoadPreset, onOpenBiodata }) => {
  return (
    <div className="space-y-20 pb-20 no-print">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Production-Ready PDF & Editable Word (.docx) Generator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
              Create Your Professional CV <br className="hidden sm:inline" />
              <span className="text-[#0f2b48]">in Minutes</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Design, customize, and export ATS-friendly resumes tailored for academic applications, data science careers, and executive leadership. Featuring real-time preview, live formatting, and genuine Word and PDF downloads.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onStartBuilder('data-analyst')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <span>Create My CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLoadPreset('data-analyst')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <span>Try Demo Data (Salman Sakib)</span>
              </button>
            </div>

            {/* Value checklist */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 pt-4">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free & No Sign-up Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Editable .docx & Selectable PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Private Local Draft Auto-Save</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow Explanation */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Build and export a recruiter-approved CV in three seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Enter Your Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill out your education, work experience, key projects, technical skills, certifications, and leadership roles using our intuitive structured form.
            </p>
            <div className="pt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Repeatable and reorderable fields</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Choose a Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switch effortlessly between Classic Academic, Modern Data Analyst, and Premium Navy styles. Customize fonts, colors, and margins with instant live preview.
            </p>
            <div className="pt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Real-time dynamic rendering</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Download Your CV</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download your CV in vector-crisp PDF format or genuine Microsoft Word (.docx) format with live clickable hyperlinks for LinkedIn, GitHub, and portfolios.
            </p>
            <div className="pt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>True editable text and clickable URLs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 mb-2">
            <span>Precision Hand-Crafted Layouts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Professional CV Templates
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Faithfully modeled after proven resume styles used across international academia, tech industry, European Union institutions, and corporate leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Template 1 Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="p-1.5 bg-slate-200 rounded-lg text-slate-800">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">1. Classic Academic CV</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Single-column academic design with centered header, traditional serif typography, horizontal divider bars, publication citations, and research appointments.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div>• Traditional Serif font (Merriweather)</div>
                <div>• Centered contact details with dividers</div>
                <div>• Best for: Research, PhD, Fellowships</div>
              </div>
            </div>

            <div className="p-3.5 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => onLoadPreset('academic')}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                Sample Profile
              </button>
              <button
                onClick={() => onStartBuilder('academic')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Template 2 Card */}
          <div className="bg-white rounded-2xl border-2 border-blue-600 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col relative">
            <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Popular
            </div>
            <div className="p-5 border-b border-slate-100 bg-blue-50/20 flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-800">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">2. Modern Data Analyst</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean, contemporary sans layout designed for data analysts and developers. Structured technical competencies, ML projects with live links, and ATS hierarchy.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div>• Modern Sans & categorized tech skills</div>
                <div>• Machine learning projects with URLs</div>
                <div>• Best for: Data Analysts, Engineers</div>
              </div>
            </div>

            <div className="p-3.5 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => onLoadPreset('data-analyst')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
              >
                Salman's Profile
              </button>
              <button
                onClick={() => onStartBuilder('data-analyst')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Template 3 Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="p-1.5 bg-[#0f2b48] rounded-lg text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">3. Premium Navy CV</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sophisticated executive presentation featuring navy blue accent blocks, crisp dates, high-density impact metrics, and corporate leadership governance.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div>• Navy header band & executive typography</div>
                <div>• High-density quantified achievements</div>
                <div>• Best for: Directors, Senior Leads</div>
              </div>
            </div>

            <div className="p-3.5 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => onLoadPreset('corporate')}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                Sample Profile
              </button>
              <button
                onClick={() => onStartBuilder('premium-navy')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-slate-900 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Template 4 Card: Official Europass CV */}
          <div className="bg-white rounded-2xl border-2 border-[#0e4194] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col relative">
            <div className="absolute top-2.5 right-2.5 bg-[#0e4194] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="text-amber-300">★</span> EU Standard
            </div>
            <div className="p-5 border-b border-slate-100 bg-blue-50/30 flex-1">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="p-1.5 bg-[#0e4194] rounded-lg text-white">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">4. Official Europass CV</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% faithful European Union 2-column layout. Official Europass Blue branding, passport photo frame, date brackets, CEFR language levels, and digital skills.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div>• Official Europass Blue (#0e4194)</div>
                <div>• 2-column [DD/MM/YYYY] date rail</div>
                <div>• Best for: EU Jobs, Erasmus, European Visas</div>
              </div>
            </div>

            <div className="p-3.5 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => onLoadPreset('europass')}
                className="text-[11px] font-semibold text-[#0e4194] hover:underline"
              >
                Elena's Profile
              </button>
              <button
                onClick={() => onStartBuilder('europass')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0e4194] hover:bg-blue-900 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Marriage Biodata Maker Showcase Section */}
      {onOpenBiodata && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#fff5f6] via-[#fff0f2] to-[#fef8f0] border-2 border-rose-200/80 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            {/* Soft decorative background motifs */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-rose-200 text-xs font-bold text-rose-800 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Dedicated Feature</span>
                <span className="text-amber-500">💍</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Marriage Biodata Maker
              </h2>
              <p className="text-base sm:text-lg font-serif italic text-rose-800">
                “Your Story, Your Forever.”
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Create a refined, respectful, and visually stunning marriage biodata for marriage proposals and family alliances. Complete with personal details, family background, partner expectations, sensitive field privacy toggles, and genuine PDF download.
              </p>

              {/* 5 Templates Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  '1. Romantic Elegant 🌸',
                  '2. Traditional Islamic ۞',
                  '3. Modern Minimal ✦',
                  '4. Premium Floral ❦',
                  '5. Classic Family ❖',
                ].map((tmplName) => (
                  <span
                    key={tmplName}
                    className="px-3 py-1 rounded-full bg-white/90 border border-rose-200 text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    {tmplName}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={onOpenBiodata}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Open Marriage Biodata Maker</span>
                  <span className="text-lg">💍</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
