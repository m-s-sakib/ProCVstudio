/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Builder } from './components/Builder';
import { BiodataBuilder } from './components/biodata/BiodataBuilder';
import { Footer } from './components/Footer';
import { CVData, TemplateId } from './types/cv';
import { dataAnalystSample, academicSample, corporateSample, europassSample } from './data/sampleData';

import { exportToPdf } from './utils/pdfExport';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'builder' | 'biodata'>('home');
  const [activeCv, setActiveCv] = useState<CVData>(dataAnalystSample);

  const handleStartBuilder = (templateId?: TemplateId) => {
    if (templateId) {
      setActiveCv((prev) => ({
        ...prev,
        customization: {
          ...prev.customization,
          templateId,
        },
      }));
    }
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadPreset = (presetKey: 'academic' | 'data-analyst' | 'corporate' | 'europass') => {
    if (presetKey === 'academic') {
      setActiveCv(academicSample);
    } else if (presetKey === 'data-analyst') {
      setActiveCv(dataAnalystSample);
    } else if (presetKey === 'corporate') {
      setActiveCv(corporateSample);
    } else if (presetKey === 'europass') {
      setActiveCv(europassSample);
    }
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBiodata = () => {
    setCurrentView('biodata');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickExport = async () => {
    try {
      await exportToPdf(activeCv);
    } catch {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuickExport={handleQuickExport}
      />

      <main className="flex-1">
        {currentView === 'home' ? (
          <Hero
            onStartBuilder={handleStartBuilder}
            onLoadPreset={handleLoadPreset}
            onOpenBiodata={handleOpenBiodata}
          />
        ) : currentView === 'biodata' ? (
          <BiodataBuilder
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToCv={() => {
              setCurrentView('builder');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <Builder initialCv={activeCv} />
        )}
      </main>

      <Footer />
    </div>
  );
}
