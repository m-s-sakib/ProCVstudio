/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CVData } from '../types/cv';
import { dataAnalystSample, academicSample, corporateSample, emptyCVData } from '../data/sampleData';
import { PersonalInfoForm } from './form/PersonalInfoForm';
import { EducationForm } from './form/EducationForm';
import { ExperienceForm } from './form/ExperienceForm';
import { ProjectsForm } from './form/ProjectsForm';
import { SkillsForm } from './form/SkillsForm';
import { CertificationsForm } from './form/CertificationsForm';
import { LeadershipForm } from './form/LeadershipForm';
import { ExtracurricularForm } from './form/ExtracurricularForm';
import { LanguagesInterestsForm } from './form/LanguagesInterestsForm';
import { ReferencesForm } from './form/ReferencesForm';
import { SectionVisibilityForm } from './form/SectionVisibilityForm';
import { CustomizationPanel } from './CustomizationPanel';
import { CVPreview } from './preview/CVPreview';
import { ConfirmModal } from './ConfirmModal';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  Award,
  Users,
  Trophy,
  Globe2,
  UserCheck,
  Sliders,
  Palette,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Download,
  Copy,
  Eye,
  FileEdit,
  CheckCircle2,
} from 'lucide-react';

interface BuilderProps {
  initialCv?: CVData;
  onOpenTypeModal?: () => void;
  onSwitchToStudent?: () => void;
}

export type ViewMode = 'form' | 'preview';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'skills', title: 'Skills', icon: Wrench },
  { id: 'certifications', title: 'Certifications', icon: Award },
  { id: 'leadership', title: 'Leadership', icon: Users },
  { id: 'extracurricular', title: 'ECA / Activities', icon: Trophy },
  { id: 'languages', title: 'Languages', icon: Globe2 },
  { id: 'references', title: 'References', icon: UserCheck },
  { id: 'visibility', title: 'Sections', icon: Sliders },
  { id: 'styling', title: 'Design & Colors', icon: Palette },
];

const LOCAL_STORAGE_KEY = 'procv_studio_draft_v1';
const VIEW_MODE_STORAGE_KEY = 'procv_studio_view_mode';

export const Builder: React.FC<BuilderProps> = ({ initialCv, onOpenTypeModal, onSwitchToStudent }) => {
  const [cv, setCv] = useState<CVData>(() => {
    if (initialCv) return initialCv;
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved draft from localStorage:', e);
      }
    }
    return emptyCVData;
  });

  // Automatically sync state when initialCv changes (e.g. user clicks Professional CV or Demo)
  useEffect(() => {
    if (initialCv) {
      setCv(initialCv);
    }
  }, [initialCv]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as ViewMode | null;
      if (saved && (saved === 'form' || saved === 'preview')) {
        return saved;
      }
    }
    return 'form';
  });

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<string | null>(null);

  // Auto-save draft changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cv));
  }, [cv]);

  const handleManualSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cv));
    setSaveToast('Draft saved securely to your browser storage.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleClearAll = () => {
    setCv({ ...emptyCVData, id: `cv_${Date.now()}` });
    setShowClearModal(false);
    setSaveToast('CV cleared to a blank slate.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDuplicate = () => {
    const duplicated: CVData = {
      ...cv,
      id: `cv_copy_${Date.now()}`,
      title: `${cv.title || 'CV'} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setCv(duplicated);
    setSaveToast('CV duplicated as a new copy.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'data-analyst') setCv(dataAnalystSample);
    if (presetKey === 'academic') setCv(academicSample);
    if (presetKey === 'corporate') setCv(corporateSample);
    setShowPresetModal(null);
    setSaveToast(`Loaded ${presetKey} sample profile.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const cleanName = (cv.personal.fullName || 'CV').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadAnchor.setAttribute('download', `${cleanName}_draft_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSaveToast('JSON draft backup downloaded.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed && typeof parsed === 'object' && parsed.personal) {
            setCv(parsed);
            setSaveToast('Draft restored from JSON file.');
            setTimeout(() => setSaveToast(null), 3000);
          } else {
            alert('Invalid CV JSON file structure.');
          }
        } catch (err) {
          alert('Could not parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const currentStep = STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
      {/* Responsive View Mode Switcher: Edit Form vs Live CV Preview */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs mb-5 sm:mb-6 no-print print:hidden">
        {/* The 2 Primary Mode Buttons: 'Edit Form' and 'Live CV Preview' */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => handleSetViewMode('form')}
            className={`flex-1 py-2 px-3 sm:px-5 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'form'
                ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileEdit className={`w-4 h-4 ${viewMode === 'form' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Edit Form</span>
            <span className="hidden sm:inline-block text-[11px] font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-1">
              Step {currentStepIndex + 1}/{STEPS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSetViewMode('preview')}
            className={`flex-1 py-2 px-3 sm:px-5 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              viewMode === 'preview'
                ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Eye className={`w-4 h-4 ${viewMode === 'preview' ? 'text-blue-600' : 'text-slate-500'}`} />
            <span>Live CV Preview</span>
          </button>
        </div>

        {/* Device View Status & Quick Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 px-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-600">Draft saved locally</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleManualSave}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              title="Save draft"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="w-full">
        {/* FORM & STEP NAVIGATION */}
        {viewMode === 'form' && (
          <div className="max-w-4xl mx-auto w-full space-y-4 no-print print:hidden">
          {/* Top Step Bar & Quick Preset Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 no-print">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Step {currentStepIndex + 1} of {STEPS.length}
                </span>
                <h2 className="text-base font-bold text-slate-900">{currentStep.title}</h2>
              </div>

              {/* Action buttons: Save, Presets, Clear, JSON Backup */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Save draft locally"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Export JSON file backup"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Backup</span>
                </button>

                <label className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer" title="Import JSON backup file">
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  <span className="hidden sm:inline">Restore</span>
                </label>

                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Duplicate CV draft"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>

                <div className="relative inline-block text-left">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setShowPresetModal(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors outline-none cursor-pointer"
                  >
                    <option value="" disabled>Other Presets...</option>
                    <option value="data-analyst">Demo: Salman Sakib (Data Analyst)</option>
                    <option value="academic">Dr. Elena Rostova (Academic)</option>
                    <option value="corporate">Marcus Vance (Corporate Leader)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowClearModal(true)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors"
                  title="Clear all fields"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-blue-600 h-full transition-all duration-300"
              />
            </div>

            {/* Horizontal step pills (scrollable on smaller screens) */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isActive = currentStepIndex === idx;
                const isCompleted = idx < currentStepIndex;

                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                        : isCompleted
                        ? 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toast Notification */}
          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveToast}</span>
              </div>
            </div>
          )}

          {/* Form Step Body */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
            {currentStep.id === 'personal' && (
              <PersonalInfoForm
                personal={cv.personal}
                onChange={(updated) => setCv((prev) => ({ ...prev, personal: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'education' && (
              <EducationForm
                education={cv.education}
                onChange={(updated) => setCv((prev) => ({ ...prev, education: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'experience' && (
              <ExperienceForm
                experience={cv.experience}
                onChange={(updated) => setCv((prev) => ({ ...prev, experience: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'projects' && (
              <ProjectsForm
                projects={cv.projects}
                onChange={(updated) => setCv((prev) => ({ ...prev, projects: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'skills' && (
              <SkillsForm
                skillCategories={cv.skillCategories}
                onChange={(updated) => setCv((prev) => ({ ...prev, skillCategories: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'certifications' && (
              <CertificationsForm
                certifications={cv.certifications}
                onChange={(updated) => setCv((prev) => ({ ...prev, certifications: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'leadership' && (
              <LeadershipForm
                leadership={cv.leadership}
                onChange={(updated) => setCv((prev) => ({ ...prev, leadership: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'extracurricular' && (
              <ExtracurricularForm
                extracurricular={cv.extracurricular || []}
                onChange={(updated) => setCv((prev) => ({ ...prev, extracurricular: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'languages' && (
              <LanguagesInterestsForm
                languages={cv.languages}
                interests={cv.interests}
                onChangeLanguages={(updated) => setCv((prev) => ({ ...prev, languages: updated, updatedAt: new Date().toISOString() }))}
                onChangeInterests={(updated) => setCv((prev) => ({ ...prev, interests: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'references' && (
              <ReferencesForm
                references={cv.references}
                isVisible={cv.sectionVisibility.references}
                onToggleVisibility={(visible) =>
                  setCv((prev) => ({
                    ...prev,
                    sectionVisibility: { ...prev.sectionVisibility, references: visible },
                    updatedAt: new Date().toISOString(),
                  }))
                }
                onChange={(updated) => setCv((prev) => ({ ...prev, references: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'visibility' && (
              <SectionVisibilityForm
                visibility={cv.sectionVisibility}
                onChange={(updated) => setCv((prev) => ({ ...prev, sectionVisibility: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {currentStep.id === 'styling' && (
              <CustomizationPanel
                customization={cv.customization}
                onChange={(updated) => setCv((prev) => ({ ...prev, customization: updated, updatedAt: new Date().toISOString() }))}
              />
            )}

            {/* Step Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('preview')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live CV Preview</span>
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetViewMode('preview')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Final Preview & Download</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* PREVIEW VIEW */}
        {viewMode === 'preview' && (
          <div className="max-w-5xl mx-auto w-full min-h-[85vh] print:static print:h-auto print:w-full print:block">
            <CVPreview
              cv={cv}
              onUpdateCV={(updater) => setCv((prev) => updater(prev))}
              onBackToForm={() => handleSetViewMode('form')}
              showBackToFormButton={true}
            />
          </div>
        )}
      </div>

      {/* Mobile Floating Quick Preview Pill */}
      {viewMode === 'form' && (
        <div className="fixed bottom-5 right-5 z-30 lg:hidden no-print">
          <button
            type="button"
            onClick={() => handleSetViewMode('preview')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-lg border border-blue-400/40 transition-transform active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Live CV Preview</span>
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear All CV Data?"
        message="This action will reset all form sections to an empty slate. Your current changes in this browser session will be cleared. Do you wish to continue?"
        confirmLabel="Clear Everything"
        cancelLabel="Keep My Data"
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
      />

      <ConfirmModal
        isOpen={!!showPresetModal}
        title="Load Demo Profile?"
        message="Loading a demo preset will replace your currently entered information with a realistic sample CV. Ensure you have saved any work you want to keep."
        confirmLabel="Load Demo Data"
        cancelLabel="Cancel"
        isDestructive={false}
        onConfirm={() => showPresetModal && handleApplyPreset(showPresetModal)}
        onCancel={() => setShowPresetModal(null)}
      />
    </div>
  );
};
