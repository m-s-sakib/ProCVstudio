/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarriageBiodata, BiodataCustomization } from '../../types/biodata';
import {
  sampleRomanticProfile,
  sampleIslamicProfile,
  sampleModernProfile,
  emptyBiodata,
} from '../../data/sampleBiodata';
import { PersonalForm } from './forms/PersonalForm';
import { EducationCareerForm } from './forms/EducationCareerForm';
import { FamilyForm } from './forms/FamilyForm';
import { ProfileForm } from './forms/ProfileForm';
import { PreferencesForm } from './forms/PreferencesForm';
import { ContactForm } from './forms/ContactForm';
import { BiodataCustomizationPanel } from './forms/BiodataCustomizationPanel';
import { BiodataPreview } from './BiodataPreview';
import { ConfirmModal } from '../ConfirmModal';
import { exportBiodataToPdf } from '../../utils/biodataPdfExport';
import {
  User,
  GraduationCap,
  Home,
  Heart,
  Compass,
  Phone,
  Palette,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  FileEdit,
  Eye,
  Columns2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

interface BiodataBuilderProps {
  onBackToHome?: () => void;
  onSwitchToCv?: () => void;
}

export type BiodataViewMode = 'form' | 'preview' | 'split';

const BIODATA_STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'education', title: 'Education & Career', icon: GraduationCap },
  { id: 'family', title: 'Family Background', icon: Home },
  { id: 'profile', title: 'About Me & Values', icon: Heart },
  { id: 'preferences', title: 'Partner Preferences', icon: Compass },
  { id: 'contact', title: 'Contact Info', icon: Phone },
  { id: 'styling', title: 'Design & Templates', icon: Palette },
];

const LOCAL_STORAGE_KEY = 'procv_marriage_biodata_v1';
const VIEW_MODE_STORAGE_KEY = 'procv_biodata_view_mode';

export const BiodataBuilder: React.FC<BiodataBuilderProps> = ({
  onBackToHome,
  onSwitchToCv,
}) => {
  const [biodata, setBiodata] = useState<MarriageBiodata>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved marriage biodata draft:', e);
        }
      }
    }
    return sampleRomanticProfile;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<BiodataViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as BiodataViewMode | null;
      if (saved && (saved === 'form' || saved === 'preview' || saved === 'split')) {
        return saved;
      }
    }
    return 'form';
  });

  const [saveStatus, setSaveStatus] = useState<string>('Draft saved locally');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);

  // Auto-save on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(biodata));
        setSaveStatus('Draft saved locally');
      } catch (e) {
        console.error('Error saving biodata draft to localStorage:', e);
      }
    }
  }, [biodata]);

  const handleSetViewMode = (mode: BiodataViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const handleLoadSample = (sample: MarriageBiodata) => {
    setBiodata(sample);
    setShowPresetModal(false);
  };

  const handleClearForm = () => {
    setBiodata(emptyBiodata);
    setShowClearModal(false);
  };

  const handleDownloadPdf = async () => {
    if (viewMode !== 'preview') {
      setViewMode('preview');
      // Allow preview DOM to mount and paginate
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    try {
      await exportBiodataToPdf(biodata, { elementId: 'biodata-document-render' });
    } catch (err) {
      console.warn('PDF export failed:', err);
    }
  };

  const currentStep = BIODATA_STEPS[currentStepIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar for Marriage Biodata Maker */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-b border-rose-200/80 px-4 sm:px-6 lg:px-8 py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left Title and Home Navigation */}
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xl">💍</span>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Marriage Biodata Maker</span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    Exclusive
                  </span>
                </h1>
                <p className="text-[11px] text-rose-800 font-medium">
                  Your Story, Your Forever.
                </p>
              </div>
            </div>
          </div>

          {/* Center / Right: PC, Tablet & Mobile View Switcher Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Form vs Preview vs Split */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-rose-200 shadow-2xs">
              <button
                type="button"
                onClick={() => handleSetViewMode('form')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'form'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Form</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetViewMode('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'preview'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetViewMode('split')}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'split'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Split View (Form & Preview side-by-side on desktop)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>

            {/* Quick Actions Dropdown / Presets */}
            <button
              type="button"
              onClick={() => setShowPresetModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Sample Profiles</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg shadow-xs transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Step Indicator Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs overflow-x-auto no-print">
          <div className="flex items-center min-w-max gap-1">
            {BIODATA_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStepIndex === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    if (viewMode === 'preview') {
                      // auto open form when selecting a field
                      setViewMode('form');
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area: Form / Preview / Split */}
        <div className="flex-1 grid grid-cols-1 gap-6 items-start">
          {viewMode === 'form' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs max-w-3xl mx-auto w-full">
              {renderFormContent(
                currentStep.id,
                biodata,
                setBiodata,
                () => setCurrentStepIndex((prev) => Math.min(prev + 1, BIODATA_STEPS.length - 1)),
                () => setCurrentStepIndex((prev) => Math.max(prev - 1, 0)),
                currentStepIndex,
                BIODATA_STEPS.length,
                () => handleSetViewMode('preview')
              )}
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="h-[calc(100vh-210px)] min-h-[650px] w-full">
              <BiodataPreview biodata={biodata} />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="hidden lg:grid grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] min-h-[650px]">
              {/* Left Column: Form (5 Cols) */}
              <div className="col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-full overflow-y-auto">
                {renderFormContent(
                  currentStep.id,
                  biodata,
                  setBiodata,
                  () => setCurrentStepIndex((prev) => Math.min(prev + 1, BIODATA_STEPS.length - 1)),
                  () => setCurrentStepIndex((prev) => Math.max(prev - 1, 0)),
                  currentStepIndex,
                  BIODATA_STEPS.length,
                  () => handleSetViewMode('preview')
                )}
              </div>

              {/* Right Column: Live Preview (7 Cols) */}
              <div className="col-span-7 h-full">
                <BiodataPreview biodata={biodata} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status & Reset Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500 shadow-2xs no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveStatus}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Blank Biodata</span>
            </button>

            {onSwitchToCv && (
              <button
                type="button"
                onClick={onSwitchToCv}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Switch to CV Maker →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preset Profiles Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Load Ready Sample Profile</h3>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Explore authentic pre-filled biodata profiles to see how each design formats personal, family, and preference details.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => handleLoadSample(sampleRomanticProfile)}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <div className="font-bold text-sm text-slate-900">
                  1. Ayesha Rahman (Romantic Elegant)
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Product Designer (M.Sc Westminster), cultural family values, Dhanmondi, Dhaka.
                </div>
              </div>

              <div
                onClick={() => handleLoadSample(sampleIslamicProfile)}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="font-bold text-sm text-slate-900">
                  2. Dr. Tariq Hasan (Traditional Islamic)
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Cardiologist & Specialist Registrar (FCPS/MBBS), Deen-conscious family background.
                </div>
              </div>

              <div
                onClick={() => handleLoadSample(sampleModernProfile)}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="font-bold text-sm text-slate-900">
                  3. Rohan Kapoor (Modern Minimal)
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Private Equity Associate VP (IIM Bangalore / IIT Bombay), Bengaluru/Mumbai.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPresetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <ConfirmModal
          isOpen={showClearModal}
          title="Reset to Blank Biodata?"
          message="Are you sure you want to clear all fields? Your current inputs will be removed and reset to empty state."
          confirmLabel="Reset Everything"
          onConfirm={handleClearForm}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  );
};

function renderFormContent(
  stepId: string,
  biodata: MarriageBiodata,
  setBiodata: React.Dispatch<React.SetStateAction<MarriageBiodata>>,
  onNext: () => void,
  onPrev: () => void,
  currentIndex: number,
  totalSteps: number,
  onOpenPreview: () => void
) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1;

  const updatePersonal = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: val },
    }));
  };

  const updateEducationCareer = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      educationCareer: { ...prev.educationCareer, [field]: val },
    }));
  };

  const updateFamily = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      family: { ...prev.family, [field]: val },
    }));
  };

  const updateProfile = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: val },
    }));
  };

  const updatePreferences = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: val },
    }));
  };

  const updateContact = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: val },
    }));
  };

  const updatePrivacy = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: val },
    }));
  };

  const updateCustomization = (field: any, val: any) => {
    setBiodata((prev) => ({
      ...prev,
      customization: { ...prev.customization, [field]: val },
    }));
  };

  return (
    <div className="space-y-6">
      {stepId === 'personal' && (
        <PersonalForm
          personal={biodata.personal}
          privacy={biodata.privacy}
          onChange={updatePersonal}
          onPrivacyChange={updatePrivacy}
        />
      )}

      {stepId === 'education' && (
        <EducationCareerForm
          educationCareer={biodata.educationCareer}
          privacy={biodata.privacy}
          onChange={updateEducationCareer}
          onPrivacyChange={updatePrivacy}
        />
      )}

      {stepId === 'family' && (
        <FamilyForm family={biodata.family} onChange={updateFamily} />
      )}

      {stepId === 'profile' && (
        <ProfileForm profile={biodata.profile} onChange={updateProfile} />
      )}

      {stepId === 'preferences' && (
        <PreferencesForm preferences={biodata.preferences} onChange={updatePreferences} />
      )}

      {stepId === 'contact' && (
        <ContactForm
          contact={biodata.contact}
          privacy={biodata.privacy}
          onChange={updateContact}
          onPrivacyChange={updatePrivacy}
        />
      )}

      {stepId === 'styling' && (
        <BiodataCustomizationPanel
          customization={biodata.customization}
          onChange={updateCustomization}
        />
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Preview</span>
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPreview}
              className="inline-flex items-center gap-1 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Finish & Preview</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
