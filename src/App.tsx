/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Builder } from './components/Builder';
import { StudentCVBuilder } from './components/student/StudentCVBuilder';
import { BiodataBuilder } from './components/biodata/BiodataBuilder';
import { Footer } from './components/Footer';
import { CVTypeModal, CVTypeSelection } from './components/CVTypeModal';
import { CVData, TemplateId } from './types/cv';
import { dataAnalystSample, academicSample, corporateSample, europassSample, emptyCVData } from './data/sampleData';
import { exportToPdf } from './utils/pdfExport';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'builder' | 'student-builder' | 'biodata'>('home');
  const [activeCv, setActiveCv] = useState<CVData>(() => ({
    ...emptyCVData,
    id: `cv_empty_${Date.now()}`,
  }));
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(false);

  const handleStartBuilder = (templateId: TemplateId = 'data-analyst', blank: boolean = true) => {
    if (blank) {
      setActiveCv({
        ...emptyCVData,
        id: `cv_${Date.now()}`,
        customization: {
          ...emptyCVData.customization,
          templateId,
        },
      });
    } else {
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

  const handleStartStudentBuilder = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('procv_student_cv_draft_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.personal?.fullName === 'Tanvir Ahmed') {
            localStorage.removeItem('procv_student_cv_draft_v1');
          }
        }
      } catch {
        // ignore
      }
    }
    setCurrentView('student-builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadPreset = (presetKey: 'academic' | 'data-analyst' | 'corporate' | 'europass') => {
    if (presetKey === 'academic') {
      setActiveCv(academicSample);
    } else if (presetKey === 'data-analyst') {
      // Demo (Salman Sakib)
      setActiveCv({
        ...dataAnalystSample,
        id: `cv_demo_${Date.now()}`,
        updatedAt: new Date().toISOString(),
      });
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

  const handleSelectCvType = (type: CVTypeSelection) => {
    if (type === 'student') {
      setCurrentView('student-builder');
    } else if (type === 'professional') {
      // Professional CV starts completely blank with all options empty
      setActiveCv({
        ...emptyCVData,
        id: `cv_${Date.now()}`,
        customization: {
          ...emptyCVData.customization,
          templateId: 'data-analyst',
        },
      });
      setCurrentView('builder');
    } else if (type === 'academic') {
      setActiveCv({
        ...emptyCVData,
        id: `cv_${Date.now()}`,
        customization: {
          ...emptyCVData.customization,
          templateId: 'academic',
        },
      });
      setCurrentView('builder');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCvType: CVTypeSelection =
    currentView === 'student-builder'
      ? 'student'
      : activeCv.customization.templateId === 'academic'
      ? 'academic'
      : 'professional';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartProfessional={() => handleStartBuilder('data-analyst', true)}
        onStartStudent={handleStartStudentBuilder}
        onOpenQuickExport={handleQuickExport}
        onOpenTypeModal={() => setIsTypeModalOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'home' ? (
          <Hero
            onStartBuilder={handleStartBuilder}
            onStartStudentBuilder={handleStartStudentBuilder}
            onLoadPreset={handleLoadPreset}
            onOpenBiodata={handleOpenBiodata}
            onOpenTypeModal={() => setIsTypeModalOpen(true)}
          />
        ) : currentView === 'student-builder' ? (
          <StudentCVBuilder
            onSwitchCvType={handleSelectCvType}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
          <Builder
            initialCv={activeCv}
            onOpenTypeModal={() => setIsTypeModalOpen(true)}
            onSwitchToStudent={handleStartStudentBuilder}
          />
        )}
      </main>

      <Footer />

      {/* Global Choose Your CV Type Dialog */}
      <CVTypeModal
        isOpen={isTypeModalOpen}
        activeType={activeCvType}
        onSelect={handleSelectCvType}
        onClose={() => setIsTypeModalOpen(false)}
      />
    </div>
  );
}
