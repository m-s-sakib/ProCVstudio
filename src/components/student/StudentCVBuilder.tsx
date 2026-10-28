/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StudentCVData, StudentTemplateId } from '../../types/studentCv';
import { sampleStudentCV, emptyStudentCVData, OBJECTIVE_PRESETS } from '../../data/sampleStudentData';
import { StudentCVPreview } from './StudentCVPreview';
import { ConfirmModal } from '../ConfirmModal';
import {
  User,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  Award,
  Globe2,
  Palette,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  Columns2,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Upload,
  BookOpen,
  Camera,
  Image,
  Download,
} from 'lucide-react';

interface StudentCVBuilderProps {
  onSwitchCvType?: (type: 'student' | 'professional' | 'academic') => void;
  onBackToHome?: () => void;
}

export type StudentViewMode = 'form' | 'preview' | 'split';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'objective', title: 'Career Objective', icon: BookOpen },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Wrench },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'experience', title: 'Experience / Internship', icon: Briefcase },
  { id: 'activities', title: 'Certifications & ECA', icon: Award },
  { id: 'languages', title: 'Languages & References', icon: Globe2 },
  { id: 'template', title: 'Template & Design', icon: Palette },
];

const LOCAL_STORAGE_KEY = 'procv_student_cv_draft_v1';
const VIEW_MODE_STORAGE_KEY = 'procv_student_view_mode';

export const StudentCVBuilder: React.FC<StudentCVBuilderProps> = ({
  onSwitchCvType,
  onBackToHome,
}) => {
  const [cv, setCv] = useState<StudentCVData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved student CV draft:', e);
        }
      }
    }
    return sampleStudentCV;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<StudentViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY) as StudentViewMode | null;
      if (saved && (saved === 'form' || saved === 'preview' || saved === 'split')) {
        return saved;
      }
      if (window.innerWidth >= 1280) return 'split';
    }
    return 'form';
  });

  const [saveStatus, setSaveStatus] = useState<string>('Draft saved locally');
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showTypeModal, setShowTypeModal] = useState<boolean>(false);

  // Quick skill input buffer states
  const [newTechSkill, setNewTechSkill] = useState('');
  const [newCompSkill, setNewCompSkill] = useState('');
  const [newCommSkill, setNewCommSkill] = useState('');
  const [newOtherSkill, setNewOtherSkill] = useState('');

  // Auto-save on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cv));
        setSaveStatus('Draft saved locally');
      } catch (e) {
        console.error('Failed to save student CV draft:', e);
      }
    }
  }, [cv]);

  const handleSetViewMode = (mode: StudentViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const handleClearAll = () => {
    setCv({
      ...emptyStudentCVData,
      id: `student_cv_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
    setShowClearModal(false);
  };

  const handleLoadSample = () => {
    setCv({
      ...sampleStudentCV,
      id: `student_cv_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
  };

  // Helper updates
  const updatePersonal = (field: keyof StudentCVData['personal'], value: string) => {
    setCv((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);

  // Compress image to 400x400 JPEG so any phone camera picture (even 5-10MB) loads instantly
  const processAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.onerror = () => {
          resolve(readerEvent.target?.result as string);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingPhoto(true);
      try {
        const compressedDataUrl = await processAndCompressImage(file);
        if (compressedDataUrl) {
          updatePersonal('photoUrl', compressedDataUrl);
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
      } finally {
        setIsProcessingPhoto(false);
      }
    }
    e.target.value = '';
  };

  // Education updates
  const addEducation = () => {
    setCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu_${Date.now()}`,
          institution: '',
          degree: '',
          department: '',
          currentYearSemester: '',
          gpa: '',
          startYear: '',
          graduationYear: '',
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  // Skills updates
  const addSkill = (category: keyof StudentCVData['skills'], skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setCv((prev) => {
      if (prev.skills[category].includes(trimmed)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], trimmed],
        },
      };
    });
  };

  const removeSkill = (category: keyof StudentCVData['skills'], skillName: string) => {
    setCv((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skillName),
      },
    }));
  };

  // Projects updates
  const addProject = () => {
    setCv((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj_${Date.now()}`,
          name: '',
          description: '',
          technologies: '',
          projectUrl: '',
          githubUrl: '',
        },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removeProject = (id: string) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Experience updates
  const addExperience = () => {
    setCv((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp_${Date.now()}`,
          jobTitle: '',
          company: '',
          duration: '',
          responsibilities: [''],
        },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCv((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  // Certifications
  const addCert = () => {
    setCv((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: `cert_${Date.now()}`,
          name: '',
          organization: '',
          link: '',
          year: '',
        },
      ],
    }));
  };

  const updateCert = (id: string, field: string, value: string) => {
    setCv((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const removeCert = (id: string) => {
    setCv((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  // Extracurricular
  const addEca = () => {
    setCv((prev) => ({
      ...prev,
      extracurricular: [
        ...prev.extracurricular,
        {
          id: `eca_${Date.now()}`,
          title: '',
          category: 'Club Membership',
          description: '',
        },
      ],
    }));
  };

  const updateEca = (id: string, field: string, value: string) => {
    setCv((prev) => ({
      ...prev,
      extracurricular: prev.extracurricular.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  };

  const removeEca = (id: string) => {
    setCv((prev) => ({
      ...prev,
      extracurricular: prev.extracurricular.filter((e) => e.id !== id),
    }));
  };

  // Languages
  const addLanguage = () => {
    setCv((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: `lang_${Date.now()}`, name: '', proficiency: 'Intermediate' },
      ],
    }));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setCv((prev) => ({
      ...prev,
      languages: prev.languages.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setCv((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  };

  // References
  const addReference = () => {
    setCv((prev) => ({
      ...prev,
      references: [
        ...prev.references,
        {
          id: `ref_${Date.now()}`,
          name: '',
          designation: '',
          institution: '',
          email: '',
          phone: '',
        },
      ],
    }));
  };

  const updateReference = (id: string, field: string, value: string) => {
    setCv((prev) => ({
      ...prev,
      references: prev.references.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  };

  const removeReference = (id: string) => {
    setCv((prev) => ({
      ...prev,
      references: prev.references.filter((r) => r.id !== id),
    }));
  };

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: CV Type indicator & Switcher button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                <span>College Student CV</span>
              </span>
              <button
                type="button"
                onClick={() => setShowTypeModal(true)}
                className="text-[11px] font-semibold text-slate-500 hover:text-blue-700 underline decoration-slate-300 underline-offset-2 transition-colors"
              >
                Change CV Type
              </button>
            </div>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-xs text-slate-500">
              Tailored for students &amp; fresh graduates with little or no experience
            </span>
          </div>

          {/* Right: Actions & View mode toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              title="Load sample student profile (Tanvir Ahmed)"
            >
              Demo Profile
            </button>
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-xs font-semibold text-slate-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              title="Clear all fields to blank"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* View Mode Toggle: Form / Split / Preview */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => handleSetViewMode('form')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'form' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium">Form</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetViewMode('split')}
                className={`hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetViewMode('preview')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium">Preview</span>
              </button>
            </div>

            {/* Quick Mobile & Desktop Download PDF Action */}
            <button
              type="button"
              onClick={() => {
                handleSetViewMode('preview');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              title="Preview & Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex gap-6 overflow-hidden">
        {/* LEFT PANE: Form Workflow (Shown in 'form' and 'split' modes) */}
        {(viewMode === 'form' || viewMode === 'split') && (
          <div
            className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${
              viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'
            }`}
          >
            {/* Step navigation tabs (scrollable) */}
            <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-1 shrink-0">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStepIndex === idx;
                const isCompleted = idx < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : isCompleted
                        ? 'text-slate-700 hover:bg-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{idx + 1}. {step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Step progress bar */}
            <div className="w-full bg-slate-100 h-1">
              <div
                className="bg-blue-600 h-1 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            {/* Step Content Form Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* STEP 1: Personal Info */}
              {currentStepIndex === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Personal Information</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your contact details so recruiters and interviewers can easily reach you.
                    </p>
                  </div>

                  {/* Enhanced Profile Photo Uploader Card */}
                  <div className="p-4 bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/50 rounded-2xl border border-blue-200/80 shadow-2xs">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div
                          className="relative group cursor-pointer shrink-0"
                          onClick={() => photoInputRef.current?.click()}
                          title="Click to choose a photo"
                        >
                          {cv.personal.photoUrl ? (
                            <img
                              src={cv.personal.photoUrl}
                              alt="Student profile"
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white text-slate-400 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-2xs">
                              <Camera className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                              <span className="text-[9px] font-bold text-blue-600 mt-0.5">Add Photo</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                            Change
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>Profile Picture</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                              Optional
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload your formal passport or headshot photo (JPG, PNG, WebP).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                        <input
                          type="file"
                          ref={photoInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          disabled={isProcessingPhoto}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {isProcessingPhoto
                              ? 'Processing...'
                              : cv.personal.photoUrl
                              ? 'Change Photo'
                              : 'Upload Photo'}
                          </span>
                        </button>

                        {cv.personal.photoUrl && (
                          <button
                            type="button"
                            onClick={() => updatePersonal('photoUrl', '')}
                            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Or enter Image URL */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500 shrink-0">Or Image URL:</span>
                      <input
                        type="url"
                        value={cv.personal.photoUrl?.startsWith('data:') ? '' : cv.personal.photoUrl || ''}
                        onChange={(e) => updatePersonal('photoUrl', e.target.value)}
                        placeholder="https://example.com/my-photo.jpg"
                        className="flex-1 w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cv.personal.fullName}
                        onChange={(e) => updatePersonal('fullName', e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={cv.personal.email}
                        onChange={(e) => updatePersonal('email', e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={cv.personal.phone}
                        onChange={(e) => updatePersonal('phone', e.target.value)}
                        placeholder="+880 1712-345678"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={cv.personal.city}
                        onChange={(e) => updatePersonal('city', e.target.value)}
                        placeholder="Dhaka"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={cv.personal.country}
                        onChange={(e) => updatePersonal('country', e.target.value)}
                        placeholder="Bangladesh"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        LinkedIn Profile (optional)
                      </label>
                      <input
                        type="url"
                        value={cv.personal.linkedin || ''}
                        onChange={(e) => updatePersonal('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GitHub Profile (optional)
                      </label>
                      <input
                        type="url"
                        value={cv.personal.github || ''}
                        onChange={(e) => updatePersonal('github', e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Portfolio or Personal Website (optional)
                      </label>
                      <input
                        type="url"
                        value={cv.personal.website || ''}
                        onChange={(e) => updatePersonal('website', e.target.value)}
                        placeholder="https://yourportfolio.dev"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Career Objective */}
              {currentStepIndex === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Career Objective</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      A short 2-3 sentence statement describing your background, enthusiasm, and what you aim to achieve in an internship or entry-level role.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Objective Statement
                    </label>
                    <textarea
                      rows={4}
                      value={cv.objective}
                      onChange={(e) => setCv((prev) => ({ ...prev, objective: e.target.value }))}
                      placeholder="Write your career objective or choose from ready suggestions below..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed"
                    />
                  </div>

                  {/* Ready Suggestions */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Suggested Objectives (Click to apply &amp; edit):</span>
                    </label>
                    <div className="space-y-2">
                      {OBJECTIVE_PRESETS.map((preset, i) => (
                        <div
                          key={i}
                          onClick={() => setCv((prev) => ({ ...prev, objective: preset.text }))}
                          className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 cursor-pointer transition-colors group"
                        >
                          <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                            <span>{preset.field}</span>
                            <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                              Click to use →
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {preset.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Education */}
              {currentStepIndex === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>Education</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add your university, college, or school education records.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cv.education.map((edu, idx) => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-700">
                            Record #{idx + 1}
                          </span>
                          {cv.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(edu.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Institution / University Name
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                              placeholder="e.g. University of Dhaka"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Degree or Qualification
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              placeholder="e.g. B.Sc. in Engineering / BBA / HSC"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Department or Major
                            </label>
                            <input
                              type="text"
                              value={edu.department}
                              onChange={(e) => updateEducation(edu.id, 'department', e.target.value)}
                              placeholder="e.g. Computer Science / Finance / Science"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Current Year / Semester (optional)
                            </label>
                            <input
                              type="text"
                              value={edu.currentYearSemester || ''}
                              onChange={(e) => updateEducation(edu.id, 'currentYearSemester', e.target.value)}
                              placeholder="e.g. Final Year (8th Semester)"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              GPA or CGPA (optional)
                            </label>
                            <input
                              type="text"
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                              placeholder="e.g. 3.82 / 4.00"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Start Year
                            </label>
                            <input
                              type="text"
                              value={edu.startYear}
                              onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                              placeholder="e.g. 2021"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                              Graduation Year or Expected
                            </label>
                            <input
                              type="text"
                              value={edu.graduationYear}
                              onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                              placeholder="e.g. 2025 (Expected)"
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Skills */}
              {currentStepIndex === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>Skills &amp; Competencies</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add your skills by category. You can type and press Enter or click Add.
                    </p>
                  </div>

                  {/* 1. Technical Skills */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      1. Technical Skills (Coding, Database, Analytics, Lab, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTechSkill}
                        onChange={(e) => setNewTechSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('technical', newTechSkill);
                            setNewTechSkill('');
                          }
                        }}
                        placeholder="e.g. Python, React, SQL, Java..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addSkill('technical', newTechSkill);
                          setNewTechSkill('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cv.skills.technical.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill('technical', s)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Computer Skills */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      2. Computer &amp; Software Tools (MS Excel, VS Code, Figma, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCompSkill}
                        onChange={(e) => setNewCompSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('computer', newCompSkill);
                            setNewCompSkill('');
                          }
                        }}
                        placeholder="e.g. MS Excel, Google Sheets, Canva, VS Code..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addSkill('computer', newCompSkill);
                          setNewCompSkill('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cv.skills.computer.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill('computer', s)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Communication Skills */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      3. Communication Skills (Presentation, Teamwork, Report Writing, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommSkill}
                        onChange={(e) => setNewCommSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('communication', newCommSkill);
                            setNewCommSkill('');
                          }
                        }}
                        placeholder="e.g. Technical Presentation, Team Collaboration..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addSkill('communication', newCommSkill);
                          setNewCommSkill('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cv.skills.communication.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill('communication', s)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 4. Other Skills */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      4. Other Relevant Skills (Problem-Solving, Fast Learner, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOtherSkill}
                        onChange={(e) => setNewOtherSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill('other', newOtherSkill);
                            setNewOtherSkill('');
                          }
                        }}
                        placeholder="e.g. Problem Solving, Time Management..."
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addSkill('other', newOtherSkill);
                          setNewOtherSkill('');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cv.skills.other.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill('other', s)}
                            className="hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Projects (Optional) */}
              {currentStepIndex === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-blue-600" />
                        <span>Academic &amp; Personal Projects</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Optional section. Highlight university course projects, personal apps, or study research.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addProject}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {cv.projects.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-600">No projects added yet.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">This section is completely optional and will be hidden if empty.</p>
                      <button
                        type="button"
                        onClick={addProject}
                        className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                      >
                        + Add a Project
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cv.projects.map((proj, idx) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeProject(proj.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Project Name
                              </label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                placeholder="e.g. Campus Blood Donation Finder"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Technologies Used (optional)
                              </label>
                              <input
                                type="text"
                                value={proj.technologies || ''}
                                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                                placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Short Description
                              </label>
                              <textarea
                                rows={2}
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                placeholder="What does the project do and what problem did it solve?"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Live Project URL (optional)
                              </label>
                              <input
                                type="url"
                                value={proj.projectUrl || ''}
                                onChange={(e) => updateProject(proj.id, 'projectUrl', e.target.value)}
                                placeholder="https://myproject.com"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                GitHub Repository URL (optional)
                              </label>
                              <input
                                type="url"
                                value={proj.githubUrl || ''}
                                onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                                placeholder="https://github.com/username/project"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Work Experience or Internship (Optional - Easily Skippable) */}
              {currentStepIndex === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                        <span>Work Experience or Internship</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Completely optional. If you have no experience, leave this empty and it will be hidden automatically.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  {cv.experience.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-700">No work experience added.</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Students without prior experience can safely skip this step! Your education, projects, and skills will form a strong CV.
                      </p>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                      >
                        + Add Internship / Part-time Job
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cv.experience.map((exp, idx) => (
                        <div
                          key={exp.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-xs font-bold text-slate-700">Experience #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Job Title or Internship Role
                              </label>
                              <input
                                type="text"
                                value={exp.jobTitle}
                                onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                placeholder="e.g. Web Development Intern"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Company or Organization
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                placeholder="e.g. InnovateTech Solutions"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                placeholder="e.g. June 2024 – August 2024 (3 Months)"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Responsibilities (one per line)
                              </label>
                              <textarea
                                rows={3}
                                value={exp.responsibilities.join('\n')}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    'responsibilities',
                                    e.target.value.split('\n')
                                  )
                                }
                                placeholder="Assisted with frontend web pages&#10;Tested features for mobile responsiveness"
                                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: Certifications & Extracurricular Activities */}
              {currentStepIndex === 6 && (
                <div className="space-y-6">
                  {/* Certifications & Achievements */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>Certifications &amp; Achievements (Optional)</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Online courses, awards, workshop certificates, or competition prizes.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addCert}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cv.certifications.map((cert) => (
                        <div key={cert.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cert.name}
                              onChange={(e) => updateCert(cert.id, 'name', e.target.value)}
                              placeholder="Certificate / Award Name"
                              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                            />
                            <input
                              type="text"
                              value={cert.organization || ''}
                              onChange={(e) => updateCert(cert.id, 'organization', e.target.value)}
                              placeholder="Issuing Organization (e.g. Coursera)"
                              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                            />
                            <input
                              type="url"
                              value={cert.link || ''}
                              onChange={(e) => updateCert(cert.id, 'link', e.target.value)}
                              placeholder="Verification URL (optional)"
                              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={cert.year || ''}
                                onChange={(e) => updateCert(cert.id, 'year', e.target.value)}
                                placeholder="Year (e.g. 2024)"
                                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeCert(cert.id)}
                                className="text-xs text-rose-600 hover:text-rose-800 px-2 font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracurricular Activities */}
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Extracurricular &amp; Leadership Activities (Optional)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Student clubs, volunteering, campus committees, or sports.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addEca}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cv.extracurricular.map((eca) => (
                        <div key={eca.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={eca.title}
                              onChange={(e) => updateEca(eca.id, 'title', e.target.value)}
                              placeholder="Role &amp; Club (e.g. General Secretary – Computer Club)"
                              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                            />
                            <select
                              value={eca.category}
                              onChange={(e) => updateEca(eca.id, 'category', e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                            >
                              <option value="Club Membership">Club Membership</option>
                              <option value="Volunteering">Volunteering</option>
                              <option value="Leadership Activities">Leadership Activities</option>
                              <option value="Sports">Sports</option>
                              <option value="Other">Other</option>
                            </select>
                            <input
                              type="text"
                              value={eca.description || ''}
                              onChange={(e) => updateEca(eca.id, 'description', e.target.value)}
                              placeholder="Brief description of what you did..."
                              className="sm:col-span-2 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                            />
                          </div>
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => removeEca(eca.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                            >
                              Remove Activity
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Languages & References */}
              {currentStepIndex === 7 && (
                <div className="space-y-6">
                  {/* Languages */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-blue-600" />
                          <span>Languages</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Add the languages you speak and your proficiency level.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cv.languages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                            placeholder="Language Name (e.g. English)"
                            className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md"
                          />
                          <select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 px-1 font-semibold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* References (Hidden by default, optional toggle) */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          References (Optional)
                        </h3>
                        <p className="text-xs text-slate-500">
                          By default, references are hidden for students. Only enable if required by an employer.
                        </p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cv.showReferences}
                          onChange={(e) =>
                            setCv((prev) => ({ ...prev, showReferences: e.target.checked }))
                          }
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-semibold text-slate-700">Enable References</span>
                      </label>
                    </div>

                    {cv.showReferences && (
                      <div className="space-y-3 pt-2">
                        <button
                          type="button"
                          onClick={addReference}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Reference Contact</span>
                        </button>

                        {cv.references.map((ref) => (
                          <div key={ref.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={ref.name}
                                onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                                placeholder="Professor / Referee Name"
                                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={ref.designation}
                                onChange={(e) => updateReference(ref.id, 'designation', e.target.value)}
                                placeholder="Designation (e.g. Assistant Professor)"
                                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                              />
                              <input
                                type="text"
                                value={ref.institution}
                                onChange={(e) => updateReference(ref.id, 'institution', e.target.value)}
                                placeholder="University / Organization"
                                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                              />
                              <input
                                type="email"
                                value={ref.email || ''}
                                onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                                placeholder="Email"
                                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                              />
                            </div>
                            <div className="text-right">
                              <button
                                type="button"
                                onClick={() => removeReference(ref.id)}
                                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 9: Template & Design */}
              {currentStepIndex === 8 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-600" />
                      <span>Choose Student CV Template</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Switch between templates freely. All your entered data is always safely preserved.
                    </p>
                  </div>

                  {/* 3 Templates Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'student-simple',
                        title: 'Template A: Simple Student CV',
                        desc: 'Clean single-column layout, traditional structure, contact on top, education, skills and projects.',
                      },
                      {
                        id: 'student-modern',
                        title: 'Template B: Modern Student CV',
                        desc: 'Contemporary styling with blue accents, category badges, section icons, and modern typography.',
                      },
                      {
                        id: 'student-ats',
                        title: 'Template C: ATS-Friendly Student CV',
                        desc: 'Straightforward linear text, standard uppercase headers, zero graphics for strict ATS parsers.',
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setCv((prev) => ({
                            ...prev,
                            templateId: t.id as StudentTemplateId,
                          }))
                        }
                        className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                          cv.templateId === t.id
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.title}</div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{t.desc}</p>
                        </div>
                        {cv.templateId === t.id && (
                          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-700">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active Template</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Accent Color for Modern Template */}
                  {cv.templateId === 'student-modern' && (
                    <div className="pt-3 border-t border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { name: 'Royal Blue', val: '#1d4ed8' },
                          { name: 'Deep Navy', val: '#0f2b48' },
                          { name: 'Emerald', val: '#047857' },
                          { name: 'Slate Gray', val: '#334155' },
                          { name: 'Purple', val: '#6d28d9' },
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() =>
                              setCv((prev) => ({
                                ...prev,
                                customization: {
                                  ...prev.customization,
                                  accentColor: c.val,
                                },
                              }))
                            }
                            style={{ backgroundColor: c.val }}
                            className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                              cv.customization?.accentColor === c.val
                                ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                                : 'hover:scale-105'
                            }`}
                            title={c.name}
                          >
                            {cv.customization?.accentColor === c.val && (
                              <Check className="w-3.5 h-3.5 text-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Final Export CTA Box */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-center space-y-2">
                    <Sparkles className="w-5 h-5 text-blue-600 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900">Your Student CV is Ready!</h3>
                    <p className="text-xs text-slate-600">
                      Switch to Preview mode to download your vector-crisp PDF or editable Microsoft Word (.docx) document with clickable links.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSetViewMode('preview')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Preview &amp; Download</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetViewMode('preview')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview CV</span>
                </button>

                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                  >
                    <span>Next: {STEPS[currentStepIndex + 1].title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetViewMode('preview')}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finish &amp; Download</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT PANE: Live Preview (Shown in 'preview' and 'split' modes) */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`flex-1 flex flex-col h-[calc(100vh-8.5rem)] ${
              viewMode === 'preview' ? 'w-full max-w-5xl mx-auto' : 'hidden lg:flex'
            }`}
          >
            <StudentCVPreview
              cv={cv}
              onUpdateCV={setCv}
              showBackToFormButton={viewMode === 'preview'}
              onBackToForm={() => handleSetViewMode('form')}
            />
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Student CV Form?"
        message="This will reset all student fields to a clean blank slate. Are you sure you want to proceed?"
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setShowClearModal(false)}
      />

      {/* Choose Your CV Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Choose Your CV Type</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select the format that best fits your experience level</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTypeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: College Student CV */}
              <div
                onClick={() => setShowTypeModal(false)}
                className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/40 cursor-pointer transition-all flex items-start gap-3.5 relative"
              >
                <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">1. College Student CV</h4>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                      Current Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Designed for college students, university students, fresh graduates, and beginners with little or no work experience. Simple form with education, skills, academic projects &amp; career objectives.
                  </p>
                </div>
              </div>

              {/* Option 2: Professional CV */}
              <div
                onClick={() => {
                  setShowTypeModal(false);
                  if (onSwitchCvType) onSwitchCvType('professional');
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-slate-50/70 cursor-pointer transition-all flex items-start gap-3.5 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 mt-0.5 transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    2. Professional CV
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For experienced industry professionals, data analysts, software engineers, and corporate managers. Features comprehensive employment history, quantifiable impact metrics, and executive styling.
                  </p>
                </div>
              </div>

              {/* Option 3: Academic CV */}
              <div
                onClick={() => {
                  setShowTypeModal(false);
                  if (onSwitchCvType) onSwitchCvType('academic');
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-slate-50/70 cursor-pointer transition-all flex items-start gap-3.5 group"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 mt-0.5 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    3. Academic CV
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For university professors, PhD scholars, and research fellowship candidates. Features Merriweather serif typography, scholarly divider bars, publication citations, and research appointments.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTypeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Stay on Student CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
