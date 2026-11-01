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
import { useLanguage } from '../context/LanguageContext';
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

const LOCAL_STORAGE_KEY = 'procv_studio_draft_v1';
const VIEW_MODE_STORAGE_KEY = 'procv_studio_view_mode';

export const Builder: React.FC<BuilderProps> = ({ initialCv }) => {
  const { t } = useLanguage();

  const STEPS = [
    { id: 'personal', title: t.builder.steps.personal, icon: User },
    { id: 'education', title: t.builder.steps.education, icon: GraduationCap },
    { id: 'experience', title: t.builder.steps.experience, icon: Briefcase },
    { id: 'projects', title: t.builder.steps.projects, icon: FolderGit2 },
    { id: 'skills', title: t.builder.steps.skills, icon: Wrench },
    { id: 'certifications', title: t.builder.steps.certifications, icon: Award },
    { id: 'leadership', title: t.builder.steps.leadership, icon: Users },
    { id: 'extracurricular', title: t.builder.steps.extracurricular, icon: Trophy },
    { id: 'languages', title: t.builder.steps.languages, icon: Globe2 },
    { id: 'references', title: t.builder.steps.references, icon: UserCheck },
    { id: 'visibility', title: t.builder.steps.visibility, icon: Sliders },
    { id: 'styling', title: t.builder.steps.styling, icon: Palette },
  ];

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
    setSaveToast(t.builder.savedToast);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleClearAll = () => {
    setCv({ ...emptyCVData, id: `cv_${Date.now()}` });
    setShowClearModal(false);
    setSaveToast(t.builder.clearToast);
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
    setSaveToast(t.builder.duplicatedToast);
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
    setSaveToast(t.builder.backupToast);
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
            setSaveToast(t.builder.restoreToast);
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
      {/* Responsive View Mode Switcher: Edit Form vs Live CV Preview - Highlighted & Modern */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white p-2.5 sm:p-3 rounded-2xl border-2 border-blue-200/90 shadow-xs ring-1 ring-blue-500/10 mb-5 sm:mb-6 no-print print:hidden">
        {/* The 2 Primary Mode Buttons: 'Edit Form' and 'Live CV Preview' */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl flex-1 max-w-xl border border-blue-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => handleSetViewMode('form')}
            className={`flex-1 py-2.5 px-3 sm:px-5 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'form'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileEdit className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${viewMode === 'form' ? 'text-white' : 'text-blue-600'}`} />
            <span>{t.builder.editForm}</span>
            <span className={`hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ml-1 ${
              viewMode === 'form' ? 'bg-blue-700/60 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {t.builder.stepCount.replace('{current}', String(currentStepIndex + 1)).replace('{total}', String(STEPS.length))}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSetViewMode('preview')}
            className={`flex-1 py-2.5 px-4 sm:px-6 text-xs sm:text-sm md:text-base font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-400/30'
                : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/70 shadow-2xs'
            }`}
          >
            <Eye className={`w-4 h-4 sm:w-5 sm:h-5 ${viewMode === 'preview' ? 'text-white' : 'text-blue-600'}`} />
            <span className="tracking-tight">{t.builder.livePreview}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${viewMode === 'preview' ? 'bg-white/20 text-white' : 'bg-blue-200/80 text-blue-900'}`}>
              PRO
            </span>
          </button>
        </div>

        {/* Device View Status & Quick Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 px-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-slate-700">{t.builder.draftSavedLocally}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleManualSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Save draft"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.builder.save}</span>
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
                  {t.builder.stepOf.replace('{current}', String(currentStepIndex + 1)).replace('{total}', String(STEPS.length))}
                </span>
                <h2 className="text-base font-bold text-slate-900">{currentStep.title}</h2>
              </div>

              {/* Action buttons: Save, Presets, Clear, JSON Backup */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Save draft locally"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{t.builder.save}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Export JSON file backup"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{t.builder.backup}</span>
                </button>

                <label className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer" title="Import JSON backup file">
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  <span className="hidden sm:inline">{t.builder.restore}</span>
                </label>

                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Duplicate CV draft"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{t.builder.duplicate}</span>
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
                    <option value="" disabled>{t.builder.otherPresets}</option>
                    <option value="data-analyst">Demo: Salman Sakib (Data Analyst)</option>
                    <option value="academic">Dr. Elena Rostova (Academic)</option>
                    <option value="corporate">Marcus Vance (Corporate Leader)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowClearModal(true)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                  title={t.builder.clearAllTooltip}
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

            {/* Horizontal step pills (touch-slidable on mobile & smaller screens) */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full touch-pan-x overscroll-x-contain scroll-smooth flex-nowrap"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isActive = currentStepIndex === idx;
                const isCompleted = idx < currentStepIndex;

                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors active:scale-95 cursor-pointer ${
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.builder.previousStep}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('preview')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.builder.livePreview}</span>
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{t.builder.nextStep}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetViewMode('preview')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.builder.finalPreviewDownload}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* PREVIEW VIEW */}
        {viewMode === 'preview' && (
          <div className="max-w-6xl xl:max-w-7xl mx-auto w-full min-h-[90vh] print:static print:h-auto print:w-full print:block">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-lg border border-blue-400/40 transition-transform active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{t.builder.livePreview}</span>
          </button>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showClearModal}
        title={t.builder.clearModalTitle}
        message={t.builder.clearModalMessage}
        confirmLabel={t.builder.clearConfirm}
        cancelLabel={t.builder.clearCancel}
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
      />

      <ConfirmModal
        isOpen={!!showPresetModal}
        title={t.builder.presetModalTitle}
        message={t.builder.presetModalMessage}
        confirmLabel={t.builder.presetConfirm}
        cancelLabel={t.builder.presetCancel}
        isDestructive={false}
        onConfirm={() => showPresetModal && handleApplyPreset(showPresetModal)}
        onCancel={() => setShowPresetModal(null)}
      />
    </div>
  );
};
