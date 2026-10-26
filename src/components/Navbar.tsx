/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, FileText, Download, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'builder' | 'biodata';
  onNavigate: (view: 'home' | 'builder' | 'biodata') => void;
  onOpenQuickExport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenQuickExport }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand wordmark */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-xs border border-slate-200/80 p-0.5 shrink-0">
            <img
              src="/assets/aistudio/ProCV_Studio_Resume_Logo_4dcddd70.png"
              alt="ProCV Studio Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ProCV <span className="text-blue-600">Studio</span>
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              currentView === 'home' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('builder')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
              currentView === 'builder' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            CV Builder
          </button>
          <button
            onClick={() => onNavigate('biodata')}
            className={`hover:text-rose-700 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'biodata'
                ? 'text-rose-600 font-bold'
                : 'text-slate-700 hover:text-rose-600'
            }`}
          >
            <span>Marriage Biodata</span>
            <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full font-semibold">
              💍 New
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
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            Templates
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
            className="hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            How it Works
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
                onClick={() => onNavigate('builder')}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create CV</span>
              </button>
            </div>
          ) : currentView === 'biodata' ? (
            <button
              onClick={() => onNavigate('builder')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CV Maker</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenQuickExport && onOpenQuickExport()}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-[#0f2b48] hover:bg-slate-900 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CV</span>
            </button>
          )}

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
              onNavigate('builder');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'builder' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            CV Builder
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
