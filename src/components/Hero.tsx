/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TemplateId } from '../types/cv';
import { ArrowRight, CheckCircle2, FileCheck, Layers, DownloadCloud, Sparkles, BookOpen, BarChart3, ShieldCheck, Award, Heart, HelpCircle, GraduationCap, Briefcase } from 'lucide-react';

interface HeroProps {
  onStartBuilder: (templateId?: TemplateId) => void;
  onStartStudentBuilder?: () => void;
  onLoadPreset: (presetKey: 'academic' | 'data-analyst' | 'corporate' | 'europass') => void;
  onOpenBiodata?: () => void;
  onOpenTypeModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartBuilder,
  onStartStudentBuilder,
  onLoadPreset,
  onOpenBiodata,
  onOpenTypeModal,
}) => {
  return (
    <div className="space-y-16 pb-16 no-print">
      {/* Hero Section */}
      <section className="relative pt-10 pb-14 lg:pt-16 lg:pb-20 overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Pro CV Maker • #1 Free Online CV &amp; Resume Builder</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Pro CV Maker — <br className="hidden sm:inline" />
              <span className="text-[#0f2b48]">Free Online CV &amp; Resume Builder</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Build your professional resume with Pro CV Maker. Free forever with instant vector PDF and editable Word (.docx) downloads for college students, developers, and corporate professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onStartStudentBuilder && (
                <button
                  type="button"
                  onClick={onStartStudentBuilder}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>College Student CV 🎓</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onStartBuilder('data-analyst')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#0f2b48] hover:bg-slate-900 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
              >
                <span>Professional CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onLoadPreset('data-analyst')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
              >
                <span>Demo (Salman Sakib)</span>
              </button>
            </div>

            {/* Value checklist */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free &amp; No Sign-Up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PDF &amp; Word (.docx) Exports</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recruiter &amp; ATS Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your CV Type Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Choose Your CV Type
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Dedicated builders tailored for your career stage and experience level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: College Student CV */}
          <div className="p-6 bg-white rounded-2xl border-2 border-blue-500/80 shadow-xs flex flex-col justify-between relative hover:border-blue-600 transition-all">
            <div className="absolute top-4 right-4 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
              New 🎓
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1. College Student CV</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For university students and fresh graduates. Highlights education, skills, and coursework projects with optional work experience.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={onStartStudentBuilder}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
              >
                <span>Build Student CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Professional CV */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Professional CV</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For developers, analysts, and corporate professionals. Features comprehensive employment history, quantifiable metrics, and custom styling.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => onStartBuilder('data-analyst')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-slate-900 rounded-xl transition-all shadow-xs"
              >
                <span>Build Professional CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Academic CV */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Academic CV</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For university scholars, researchers, and PhD candidates. Traditional scholarly serif format with publication citations and appointments.
              </p>
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => onStartBuilder('academic')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs"
              >
                <span>Build Academic CV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow Explanation */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Three simple steps to your finished resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Enter Details</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill out your education, projects, skills, and experience with a step-by-step form.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Choose Template</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your favorite layout and customize fonts, colors, and margins in live preview.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Download</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export in vector PDF or editable Microsoft Word (.docx) format with clickable links.
            </p>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Professional CV Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Crafted for international academia, tech industry, EU institutions, and corporate roles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Template 1 Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">1. Classic Academic</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Traditional serif format with centered headers, divider lines, and scholarly citation layouts.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/60 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onLoadPreset('academic')}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                Sample Profile
              </button>
              <button
                type="button"
                onClick={() => onStartBuilder('academic')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Template 2 Card */}
          <div className="bg-white rounded-2xl border-2 border-blue-600/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative">
            <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Popular
            </div>
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">2. Modern Data Analyst</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean modern layout designed for analysts and developers with categorized tech skills and URLs.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50/30 flex items-center justify-between gap-2 border-t border-blue-100/60">
              <button
                type="button"
                onClick={() => onLoadPreset('data-analyst')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                title="View Salman Sakib Demo CV"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Profile</span>
              </button>
              <button
                type="button"
                onClick={() => onStartBuilder('data-analyst')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Start Blank
              </button>
            </div>
          </div>

          {/* Template 3 Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">3. Premium Navy</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Executive styling with navy accents, impact metrics, and leadership governance sections.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/60 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onLoadPreset('corporate')}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                Sample Profile
              </button>
              <button
                type="button"
                onClick={() => onStartBuilder('premium-navy')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#0f2b48] hover:bg-slate-900 rounded-lg transition-colors"
              >
                Use Template
              </button>
            </div>
          </div>

          {/* Template 4 Card: Official Europass CV */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative">
            <div className="absolute top-2.5 right-2.5 bg-[#0e4194] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="text-amber-300">★</span> EU Standard
            </div>
            <div className="p-5 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#0e4194] rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">4. Official Europass</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authentic EU two-column format with passport photo frame, date brackets, and CEFR language levels.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/60 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onLoadPreset('europass')}
                className="text-[11px] font-semibold text-[#0e4194] hover:underline"
              >
                Elena's Profile
              </button>
              <button
                type="button"
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
          <div className="rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-pink-50/60 border border-rose-200/90 p-8 sm:p-10 shadow-2xs relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-rose-200 text-xs font-semibold text-rose-700 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Marriage Biodata Maker 💍</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Marriage Biodata
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Refined, respectful biodata for marriage proposals. Includes personal info, family background, partner expectations, sensitive field toggles, and genuine PDF download.
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onOpenBiodata}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <span>Open Biodata Maker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Common questions about our free online CV maker and exports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Is this truly a Free Online CV Maker?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, 100% free with no credit card, no subscriptions, and no hidden paywalls at download time.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              How do PDF and Word (.docx) downloads work?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Downloads generate clean vector PDFs and genuine editable Word files with clickable URLs for LinkedIn and portfolios.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Are the templates ATS-friendly?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All layouts follow Applicant Tracking System formatting rules to ensure your application passes automated screenings.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Is my information saved securely?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All your entries are saved privately in your local browser storage. You can backup or clear your data anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
