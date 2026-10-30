/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, FileText, Download, Menu, X, Home, GraduationCap, Briefcase, Heart, Layers, HelpCircle } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
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
            <span>Home</span>
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
            <span>Student CV</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded-full font-bold">
              New
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
            <span>Professional CV</span>
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
            <span>Marriage Biodata</span>
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
            <span>Templates</span>
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
            <span>How it Works</span>
          </a>
        </nav>

        {/* Zone 3: 1 primary action & Mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {currentView === 'home' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('biodata')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Biodata 💍</span>
              </button>
              <button
                onClick={() => {
                  if (onStartProfessional) {
                    onStartProfessional();
                  } else {
                    onNavigate('builder');
                  }
                }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create CV</span>
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
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CV Maker</span>
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
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
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
            <span>College Student CV 🎓</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">New</span>
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
            Professional CV Builder (Blank)
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
            <span>Marriage Biodata Maker 💍</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">New</span>
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
            Templates
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
            How it Works
          </a>
        </div>
      )}
    </header>
  );
};
