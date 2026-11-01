/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Menu, X, Home, GraduationCap, Briefcase, Heart, Layers, HelpCircle, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentView: 'home' | 'builder' | 'student-builder' | 'biodata';
  onNavigate: (view: 'home' | 'builder' | 'student-builder' | 'biodata') => void;
  onOpenQuickExport?: () => void;
  onOpenTypeModal?: () => void;
  onStartProfessional?: () => void;
  onStartStudent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenQuickExport,
  onOpenTypeModal,
  onStartProfessional,
  onStartStudent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand wordmark */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center cursor-pointer shrink-0 py-1"
          aria-label="ProCVmaKer Home"
        >
          <img
            src="/assets/aistudio/ProCVmaKer_Resume_Builder_Logo_ccf153de.png"
            alt="ProCVmaKer"
            className="h-8 sm:h-9 w-auto object-contain hover:opacity-90 transition-opacity"
          />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 flex items-center gap-1.5 active:scale-95 ${
              currentView === 'home'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.nav.home}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onStartStudent) {
                onStartStudent();
              } else {
                onNavigate('student-builder');
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 flex items-center gap-1.5 active:scale-95 ${
              currentView === 'student-builder'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200/90'
                : 'text-slate-700 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.nav.studentCv}</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded-full font-bold">
              {t.nav.newBadge}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onStartProfessional) {
                onStartProfessional();
              } else {
                onNavigate('builder');
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 flex items-center gap-1.5 active:scale-95 ${
              currentView === 'builder'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-700" />
            <span>{t.nav.professionalCv}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('biodata')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 flex items-center gap-1.5 active:scale-95 ${
              currentView === 'biodata'
                ? 'bg-white text-rose-700 shadow-xs font-bold border border-rose-200/90'
                : 'text-slate-600 hover:text-rose-700 hover:bg-white/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{t.nav.marriageBiodata}</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-full font-semibold">
              💍
            </span>
          </button>

          <a
            href="#templates"
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 text-slate-600 hover:text-slate-900 hover:bg-white/60 flex items-center gap-1.5 active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.templates}</span>
          </a>

          <a
            href="#how-it-works"
            onClick={(e) => {
              if (currentView !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 text-slate-600 hover:text-slate-900 hover:bg-white/60 hidden xl:flex items-center gap-1.5 active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.howItWorks}</span>
          </a>
        </nav>

        {/* Zone 3: 1-Click Language Switcher, Action Button & Mobile menu toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 1-CLICK INSTANT LANGUAGE TOGGLE (Always visible on mobile & desktop) */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={language === 'en' ? 'বাংলায় পরিবর্তন করুন' : 'Switch to English'}
            aria-label="Toggle language between English and Bangla"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-blue-50/70 text-slate-800 hover:text-blue-700 transition-all active:scale-95 shadow-2xs cursor-pointer select-none ring-1 ring-slate-100"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-extrabold text-blue-700 tracking-wide text-[11px] sm:text-xs">
              {language === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
            </span>
          </button>

          {currentView === 'home' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate('biodata')}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>{t.nav.marriageBiodata} 💍</span>
              </button>
              <button
                onClick={() => {
                  if (onStartProfessional) {
                    onStartProfessional();
                  } else {
                    onNavigate('builder');
                  }
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.nav.createCv}</span>
              </button>
            </div>
          ) : currentView === 'biodata' ? (
            <button
              onClick={() => {
                if (onStartProfessional) {
                  onStartProfessional();
                } else {
                  onNavigate('builder');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.cvMaker}</span>
            </button>
          ) : null}

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Quick Language Toggle in Mobile Drawer */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Language / ভাষা</span>
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? '🇧🇩 বাংলায় দেখুন' : '🇬🇧 Switch to English'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => {
              if (onStartStudent) {
                onStartStudent();
              } else {
                onNavigate('student-builder');
              }
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
              currentView === 'student-builder' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t.nav.studentCv} 🎓</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">{t.nav.newBadge}</span>
          </button>
          <button
            onClick={() => {
              if (onStartProfessional) {
                onStartProfessional();
              } else {
                onNavigate('builder');
              }
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'builder' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.nav.professionalCv}
          </button>
          <button
            onClick={() => {
              onNavigate('biodata');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
              currentView === 'biodata' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-rose-50/60'
            }`}
          >
            <span>{t.nav.marriageBiodata} 💍</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">{t.nav.newBadge}</span>
          </button>
          <a
            href="#templates"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (currentView !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {t.nav.templates}
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (currentView !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {t.nav.howItWorks}
          </a>
        </div>
      )}
    </header>
  );
};
