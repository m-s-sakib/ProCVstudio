/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CVData, TemplateId, ExperienceItem, EducationItem, ProjectItem, SkillCategory, CertificationItem } from '../../types/cv';
import { CVPreview } from '../preview/CVPreview';
import { exportToDocx } from '../../utils/docxExport';
import { exportToPdf } from '../../utils/pdfExport';
import { useLanguage } from '../../context/LanguageContext';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Edit3,
  RefreshCw,
  Download,
  Eye,
  Layers,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe2,
  ExternalLink,
  Sliders,
  Check,
  FileCheck,
} from 'lucide-react';

interface AICVUpdaterProps {
  onBackToHome: () => void;
  onOpenInFullBuilder?: (cv: CVData) => void;
}

export type UpdaterStep = 'upload' | 'processing' | 'review' | 'preview';

export const AICVUpdater: React.FC<AICVUpdaterProps> = ({
  onBackToHome,
  onOpenInFullBuilder,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [currentStep, setCurrentStep] = useState<UpdaterStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Processing state
  const [processingStage, setProcessingStage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extracted CV Data
  const [cvData, setCvData] = useState<CVData | null>(null);

  // Active section tab in Review step
  type ReviewTabId = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  const [activeTab, setActiveTab] = useState<ReviewTabId>('personal');

  const reviewTabs: Array<{ id: ReviewTabId; label: string; icon: any; count?: number }> = [
    { id: 'personal', label: isBn ? 'ব্যক্তিগত ও যোগাযোগ' : 'Personal & Contact', icon: Briefcase },
    { id: 'experience', label: isBn ? 'কাজের অভিজ্ঞতা' : 'Experience', icon: Briefcase, count: cvData?.experience.length },
    { id: 'education', label: isBn ? 'শিক্ষাগত যোগ্যতা' : 'Education', icon: GraduationCap, count: cvData?.education.length },
    { id: 'skills', label: isBn ? 'দক্ষতা (Skills)' : 'Skills', icon: Wrench, count: cvData?.skillCategories.length },
    { id: 'projects', label: isBn ? 'প্রজেক্ট' : 'Projects', icon: FolderGit2, count: cvData?.projects.length },
    { id: 'certifications', label: isBn ? 'সার্টিফিকেশন' : 'Certifications', icon: Award, count: cvData?.certifications.length },
  ];

  const activeTabIndex = reviewTabs.findIndex((t) => t.id === activeTab);

  const goToStep = (step: UpdaterStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToReviewTab = (tabId: ReviewTabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousSection = () => {
    if (activeTabIndex > 0) {
      goToReviewTab(reviewTabs[activeTabIndex - 1].id);
    } else {
      goToStep('upload');
    }
  };

  const handleNextSection = () => {
    if (activeTabIndex < reviewTabs.length - 1) {
      goToReviewTab(reviewTabs[activeTabIndex + 1].id);
    } else {
      goToStep('preview');
    }
  };

  // AI Improve writing states
  const [isImprovingText, setIsImprovingText] = useState<boolean>(false);
  const [improveSuccessToast, setImproveSuccessToast] = useState<string | null>(null);

  // Export states in Preview
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const PROCESSING_STAGES = isBn
    ? [
        { label: 'সিভি ফাইল আপলোড করা হচ্ছে...', sub: 'ডকুমেন্টটি সুরক্ষিতভাবে প্রস্তুত হচ্ছে' },
        { label: 'ডকুমেন্ট এবং টেক্সট পড়া হচ্ছে...', sub: 'PDF / DOCX ফাইলটি বিশ্লেষণ করা হচ্ছে' },
        { label: 'তথ্য এবং সেকশনগুলো এক্সট্রাক্ট করা হচ্ছে...', sub: 'কাজের অভিজ্ঞতা, শিক্ষা এবং স্কিল শনাক্ত করা হচ্ছে' },
        { label: 'সিভির প্রতিটি অংশ বিন্যাস করা হচ্ছে...', sub: 'হেডার, টাইমলাইন এবং কন্টাক্ট লিঙ্ক সাজানো হচ্ছে' },
        { label: 'আপনার নতুন পেশাদার সিভি সম্পূর্ণ প্রস্তুত!', sub: 'এডিটিং এবং প্রিভিউ প্যানেল লোড করা হচ্ছে' },
      ]
    : [
        { label: 'Uploading CV document...', sub: 'Preparing file for secure AI processing' },
        { label: 'Reading document & structure...', sub: 'Analyzing single or multi-column layout' },
        { label: 'Extracting information & sections...', sub: 'Identifying work history, education, and skills' },
        { label: 'Organizing CV data & links...', sub: 'Structuring timeline and contact profiles' },
        { label: 'Preparing your new CV...', sub: 'Finishing touches on your modern CV profile' },
      ];

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setErrorMessage(null);

    // Validate size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage(
        isBn
          ? 'ফাইলের সাইজ ১০ মেগাবাইটের (10 MB) বেশি হতে পারবে না।'
          : 'File size exceeds 10 MB limit. Please upload a smaller file.'
      );
      return;
    }

    // Validate format
    const name = selectedFile.name.toLowerCase();
    const isSupported = name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.doc');

    if (!isSupported) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে শুধুমাত্র PDF অথবা Word (.docx) ফরম্যাটের সিভি আপলোড করুন।'
          : 'Unsupported file format. Please upload a PDF or Word (.docx) file.'
      );
      return;
    }

    setFile(selectedFile);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileBase64(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage(
        isBn
          ? 'ফাইল পড়তে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।'
          : 'Failed to read file. Please try again.'
      );
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Perform AI Extraction
  const handleStartAnalysis = async () => {
    if (!file || !fileBase64) {
      setErrorMessage(
        isBn
          ? 'অনুগ্রহ করে প্রথমে আপনার সিভি ফাইলটি নির্বাচন করুন।'
          : 'Please select a CV file to upload first.'
      );
      return;
    }

    setCurrentStep('processing');
    setProcessingStage(0);
    setErrorMessage(null);

    // Progress stage simulation sync with actual fetch
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/cv/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: fileBase64,
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const data = await response.json();
      clearInterval(stageInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze CV.');
      }

      setProcessingStage(4);
      setTimeout(() => {
        setCvData(data.cv);
        setCurrentStep('review');
      }, 700);
    } catch (err: any) {
      clearInterval(stageInterval);
      setCurrentStep('upload');
      const msg = String(err.message || '');
      const isHighDemand = msg.includes('high demand') || msg.includes('503') || msg.includes('temporary') || msg.includes('UNAVAILABLE');
      setErrorMessage(
        isHighDemand
          ? (isBn
              ? 'এআই সার্ভিসে সাময়িকভাবে অতিরিক্ত ট্রাফিকের চাপ রয়েছে। আপনার ফাইলটি প্রস্তুত রয়েছে — অনুগ্রহ করে কয়েক মুহূর্ত পর নিচে "আবার চেষ্টা করুন" বাটনে ক্লিক করুন।'
              : 'The AI service is experiencing high demand right now. Your uploaded file is ready — please click "Try Again" in a few moments.')
          : (err.message ||
              (isBn
                ? 'সিভি বিশ্লেষণ করতে সমস্যা হয়েছে। দয়া করে ফাইলের ফরম্যাট চেক করে আবার চেষ্টা করুন।'
                : 'Could not extract information from this file. Please verify it is a valid CV and try again.'))
      );
    }
  };

  // AI Improve Writing Helper
  const handleImproveWriting = async (text: string, fieldType: string, onApply: (improved: string) => void) => {
    if (!text.trim()) return;
    setIsImprovingText(true);
    setImproveSuccessToast(null);

    try {
      const response = await fetch('/api/cv/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          fieldType,
          roleContext: cvData?.personal?.jobTitle || 'Professional',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to improve text');
      }

      onApply(data.improvedText);
      setImproveSuccessToast(
        isBn ? '✨ এআই লেখাটি সফলভাবে প্রফেশনাল করেছে!' : '✨ AI successfully improved the phrasing!'
      );
      setTimeout(() => setImproveSuccessToast(null), 3500);
    } catch (err: any) {
      console.error('Improve text error:', err);
      alert(err.message || 'AI writing improvement failed.');
    } finally {
      setIsImprovingText(false);
    }
  };

  // Template options for the existing system
  const TEMPLATES: Array<{ id: TemplateId; name: string; tag: string; desc: string; color: string }> = [
    {
      id: 'data-analyst',
      name: isBn ? 'মডার্ন ডাটা অ্যানালিস্ট ও টেক' : 'Modern Data Analyst & Tech',
      tag: isBn ? 'প্রস্তাবিত' : 'Recommended',
      desc: isBn ? 'পরিষ্কার ও আধুনিক টেক্সট ফরম্যাট' : 'Clean modern layout with skill badges and clean URLs',
      color: '#1e3a8a',
    },
    {
      id: 'academic',
      name: isBn ? 'ক্লাসিক একাডেমিক সেরিফ' : 'Classic Academic Serif',
      tag: isBn ? 'গবেষক' : 'Scholarly',
      desc: isBn ? 'ঐতিহ্যবাহী একাডেমিক ও পাবলিকেশন ফরম্যাট' : 'Traditional serif with publication citations and centered headers',
      color: '#1e293b',
    },
    {
      id: 'premium-navy',
      name: isBn ? 'এক্সিকিউটিভ প্রিমিয়াম নেভি' : 'Executive Premium Navy',
      tag: isBn ? 'কর্পোরেট' : 'Leadership',
      desc: isBn ? 'নেভি অ্যাকসেন্ট ও এক্সিকিউটিভ প্রোফাইল' : 'Corporate navy accents, impact metrics, and leadership structure',
      color: '#0f2b48',
    },
    {
      id: 'ats',
      name: isBn ? 'এটিএস মিনিমাল' : 'ATS Clean Minimal',
      tag: isBn ? 'হাই-পাস রেট' : 'ATS Friendly',
      desc: isBn ? 'রেকর্ড ব্রেকিং এটিএস স্ক্যানিং নিশ্চিত করে' : 'Monochrome, standard typography optimized for ATS parsers',
      color: '#000000',
    },
    {
      id: 'europass',
      name: isBn ? 'অফিসিয়াল ইউরোপাস' : 'Official Europass (EU)',
      tag: isBn ? 'ইউরোপ' : 'Official EU',
      desc: isBn ? 'ইউরোপীয় ইউনিয়নের অফিসিয়াল ফরম্যাট' : 'Authentic EU two-column format with date brackets and CEFR levels',
      color: '#0e4194',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title={isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>AI CV Updater</span>
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-medium text-slate-600">
                    {isBn ? 'বিদ্যমান সিভি আপডেট' : 'Update Existing CV'}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  {isBn
                    ? 'আপনার পুরনো সিভি আপলোড করে নতুন আধুনিক সিভি তৈরি করুন'
                    : 'Transform Your Old CV into a Modern Professional Resume'}
                </h1>
              </div>
            </div>

            {/* Quick Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <button
                type="button"
                onClick={() => goToStep('upload')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  currentStep === 'upload' || currentStep === 'processing'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>1. {isBn ? 'আপলোড' : 'Upload'}</span>
              </button>
              <span>→</span>
              <button
                type="button"
                disabled={!cvData}
                onClick={() => cvData && goToStep('review')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  currentStep === 'review'
                    ? 'bg-blue-600 text-white font-bold shadow-xs cursor-pointer'
                    : cvData
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>2. {isBn ? 'রিভিউ ও এডিট' : 'Review & Edit'}</span>
              </button>
              <span>→</span>
              <button
                type="button"
                disabled={!cvData}
                onClick={() => cvData && goToStep('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                  currentStep === 'preview'
                    ? 'bg-blue-600 text-white font-bold shadow-xs cursor-pointer'
                    : cvData
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>3. {isBn ? 'প্রিভিউ ও ডাউনলোড' : 'Preview & Export'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area based on currentStep */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ================= STEP 1: UPLOAD SCREEN ================= */}
        {currentStep === 'upload' && (
          <div key="step-upload" className="max-w-2xl mx-auto space-y-6 animate-page-enter">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? 'আপনার পুরনো সিভি ফাইলটি দিন' : 'Upload Your Existing CV'}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                {isBn
                  ? 'আপনার বিদ্যমান সিভি আপলোড করুন এবং এআই-এর মাধ্যমে তথ্য স্বয়ংক্রিয়ভাবে এক্সট্রাক্ট করে নতুন প্রফেশনাল সিভিতে রূপান্তর করুন। পুনরায় ম্যানুয়ালি কিছু লিখতে হবে না।'
                  : 'Upload your existing CV and let AI transform it into a modern, professional CV. No need to enter your information again.'}
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                    : file
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50/60'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-2xs">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {isBn ? 'সিভি ফাইল এখানে ড্র্যাগ ও ড্রপ করুন' : 'Drag & drop your CV file here'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {isBn ? 'অথবা আপনার কম্পিউটার বা মোবাইল থেকে ফাইল নির্বাচন করুন' : 'or browse from your computer or phone'}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 shadow-2xs transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'ফাইল ব্রাউজ করুন' : 'Browse Files'}</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-slate-400 mt-6 pt-4 border-t border-slate-200/80">
                  <span>PDF & DOCX</span>
                  <span>•</span>
                  <span>Max 10 MB</span>
                  <span>•</span>
                  <span>100% Private & Secure</span>
                </div>
              </div>

              {/* Selected File Details */}
              {file && (
                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.name.endsWith('.pdf') ? 'PDF Document' : 'Word Document'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFileBase64(null);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={isBn ? 'ফাইল মুছুন' : 'Remove file'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
                    >
                      {isBn ? 'পরিবর্তন করুন' : 'Change'}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-2xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{errorMessage}</span>
                  </div>
                  {file && (
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isBn ? 'আবার চেষ্টা করুন' : 'Try Again'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পূর্ববর্তী (হোম)' : 'Previous (Home)'}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {cvData && (
                    <button
                      type="button"
                      onClick={() => goToStep('review')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{isBn ? 'পরবর্তী (রিভিউ পেজ)' : 'Next (Review Page)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={!file}
                    onClick={handleStartAnalysis}
                    className={`inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm ${
                      file
                        ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isBn ? 'আপলোড ও এআই বিশ্লেষণ করুন' : 'Upload & Analyze with AI'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Feature reassurance badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">100% Accurate</div>
                <div className="text-[11px] text-slate-500">Preserves original facts, dates, and companies</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">Clickable Links</div>
                <div className="text-[11px] text-slate-500">Extracts LinkedIn, GitHub, email & phone URLs</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">Instant PDF & Word</div>
                <div className="text-[11px] text-slate-500">Download formatted vector PDF or editable DOCX</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PROCESSING SCREEN ================= */}
        {currentStep === 'processing' && (
          <div className="max-w-lg mx-auto py-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-30" />
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse">
                <Sparkles className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {PROCESSING_STAGES[processingStage]?.label || 'Processing CV...'}
              </h3>
              <p className="text-xs text-slate-500">
                {PROCESSING_STAGES[processingStage]?.sub || 'Please wait while AI analyzes your document.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (processingStage + 1) * 20)}%` }}
              />
            </div>

            {/* Step list checklist */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-3 shadow-2xs max-w-md mx-auto">
              {PROCESSING_STAGES.map((stg, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {idx < processingStage ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : idx === processingStage ? (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span
                    className={
                      idx <= processingStage
                        ? 'font-bold text-slate-900'
                        : 'text-slate-400'
                    }
                  >
                    {stg.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              {isBn
                ? 'বড় ফাইল বা মাল্টি-কলাম ডকুমেন্টের ক্ষেত্রে কয়েক সেকেন্ড সময় লাগতে পারে।'
                : 'May take a few seconds for complex multi-column or multi-page documents.'}
            </p>
          </div>
        )}

        {/* ================= STEP 3: REVIEW & EDIT SCREEN ================= */}
        {currentStep === 'review' && cvData && (
          <div key="step-review" className="space-y-6 animate-page-enter">
            {/* Header info & AI Improve notification toast */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'তথ্য সফলভাবে এক্সট্রাক্ট করা হয়েছে' : 'Information Extracted Successfully'}</span>
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {cvData.personal.fullName || 'Candidate'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isBn ? 'এক্সট্রাক্ট করা তথ্য যাচাই ও প্রয়োজনমতো এডিট করুন' : 'Review & Edit Extracted CV Information'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'আপনার সিভির প্রতিটি অংশ নিচে সুন্দরভাবে সাজানো হয়েছে। কোনো তথ্য পরিবর্তন, নতুন যোগ বা এআই-এর মাধ্যমে লেখার মান উন্নত করতে পারেন।'
                    : 'All sections were extracted accurately. You can edit any field, add new items, or use AI to refine wording.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => goToStep('upload')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পূর্ববর্তী (আপলোড)' : 'Previous (Upload)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep('preview')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isBn ? 'পরবর্তী: প্রিভিউ ও টেমপ্লেট' : 'Next: Template & Preview'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {improveSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold animate-fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{improveSuccessToast}</span>
              </div>
            )}

            {/* Section Navigation Tabs + Quick Prev/Next Section Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {reviewTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => goToReviewTab(tab.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {typeof tab.count === 'number' && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={handlePreviousSection}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আগে' : 'Prev'}</span>
                </button>
                <span className="text-[11px] font-bold text-slate-500 px-2 tabular-nums">
                  {activeTabIndex + 1} / {reviewTabs.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div key={activeTab} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-page-enter">
              {/* TAB 1: PERSONAL & CONTACT */}
              {activeTab === 'personal' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'ব্যক্তিগত তথ্য ও যোগাযোগের লিঙ্ক' : 'Personal Details & Contact Links'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'নাম, পদবি, ইমেইল, ফোন এবং সামাজিক লিঙ্কসমূহ' : 'Full name, job title, contact channels, and links'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'পূর্ণ নাম' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.fullName}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, fullName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'পেশাদার পদবি' : 'Professional Job Title'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.jobTitle}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, jobTitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={cvData.personal.phone}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'শহর (City)' : 'City'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.city}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, city: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {isBn ? 'দেশ (Country)' : 'Country'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.country}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, country: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        LinkedIn Profile URL / Username
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.linkedin || ''}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, linkedin: e.target.value },
                          })
                        }
                        placeholder="e.g. linkedin.com/in/username"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        GitHub Profile URL / Username
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.github || ''}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, github: e.target.value },
                          })
                        }
                        placeholder="e.g. github.com/username"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Personal Website / Portfolio
                      </label>
                      <input
                        type="text"
                        value={cvData.personal.website || ''}
                        onChange={(e) =>
                          setCvData({
                            ...cvData,
                            personal: { ...cvData.personal, website: e.target.value },
                          })
                        }
                        placeholder="https://yourportfolio.com"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Summary / Objective */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-900">
                        {isBn ? 'প্রফেশনাল সামারি বা ক্যারিয়ার অবজেক্টিভ' : 'Professional Summary / Career Objective'}
                      </label>
                      <button
                        type="button"
                        disabled={isImprovingText || !cvData.personal.summary}
                        onClick={() =>
                          handleImproveWriting(
                            cvData.personal.summary,
                            'Professional Summary',
                            (improved) =>
                              setCvData({
                                ...cvData,
                                personal: { ...cvData.personal, summary: improved },
                              })
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isImprovingText ? 'Improving...' : isBn ? 'এআই দিয়ে লেখা উন্নত করুন' : 'AI Improve Writing'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={cvData.personal.summary}
                      onChange={(e) =>
                        setCvData({
                          ...cvData,
                          personal: { ...cvData.personal, summary: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'কাজের অভিজ্ঞতা (Work Experience)' : 'Work Experience'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'পদবি, কোম্পানি, সময়কাল এবং দায়িত্বসমূহ' : 'Employment history, achievements, and responsibilities'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          experience: [
                            {
                              id: `exp_${Date.now()}`,
                              jobTitle: '',
                              company: '',
                              startDate: '',
                              endDate: '',
                              isCurrent: false,
                              bullets: [''],
                            },
                            ...cvData.experience,
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'নতুন অভিজ্ঞতা যোগ' : 'Add Experience'}</span>
                    </button>
                  </div>

                  {cvData.experience.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                      <p className="text-xs text-slate-500 mb-2">No work experience entries extracted.</p>
                      <button
                        type="button"
                        onClick={() =>
                          setCvData({
                            ...cvData,
                            experience: [
                              {
                                id: `exp_${Date.now()}`,
                                jobTitle: 'Senior Role',
                                company: 'Company Name',
                                startDate: '2022',
                                endDate: 'Present',
                                isCurrent: true,
                                bullets: ['Led core initiatives and achieved key outcomes.'],
                              },
                            ],
                          })
                        }
                        className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-white border border-slate-300 rounded-lg"
                      >
                        + Add Work Experience
                      </button>
                    </div>
                  ) : (
                    cvData.experience.map((exp, expIdx) => (
                      <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-700">
                            #{expIdx + 1} {exp.jobTitle || 'Job Role'} — {exp.company || 'Company'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCvData({
                                ...cvData,
                                experience: cvData.experience.filter((_, i) => i !== expIdx),
                              })
                            }
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Job Title</label>
                            <input
                              type="text"
                              value={exp.jobTitle}
                              onChange={(e) => {
                                const copy = [...cvData.experience];
                                copy[expIdx].jobTitle = e.target.value;
                                setCvData({ ...cvData, experience: copy });
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const copy = [...cvData.experience];
                                copy[expIdx].company = e.target.value;
                                setCvData({ ...cvData, experience: copy });
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              placeholder="e.g. Jan 2021"
                              onChange={(e) => {
                                const copy = [...cvData.experience];
                                copy[expIdx].startDate = e.target.value;
                                setCvData({ ...cvData, experience: copy });
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              placeholder="e.g. Present"
                              onChange={(e) => {
                                const copy = [...cvData.experience];
                                copy[expIdx].endDate = e.target.value;
                                setCvData({ ...cvData, experience: copy });
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                            />
                          </div>
                        </div>

                        {/* Bullet points */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-800">
                              Achievements & Responsibilities
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...cvData.experience];
                                copy[expIdx].bullets = [...copy[expIdx].bullets, ''];
                                setCvData({ ...cvData, experience: copy });
                              }}
                              className="text-[11px] text-blue-700 hover:underline font-semibold"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="text-slate-400">•</span>
                              <input
                                type="text"
                                value={b}
                                onChange={(e) => {
                                  const copy = [...cvData.experience];
                                  copy[expIdx].bullets[bIdx] = e.target.value;
                                  setCvData({ ...cvData, experience: copy });
                                }}
                                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...cvData.experience];
                                  copy[expIdx].bullets = copy[expIdx].bullets.filter((_, i) => i !== bIdx);
                                  setCvData({ ...cvData, experience: copy });
                                }}
                                className="p-1 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'শিক্ষাগত যোগ্যতা (Education)' : 'Educational Qualifications'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'ডিগ্রি, প্রতিষ্ঠান, মেজর এবং জিপিএ' : 'Degrees, universities, CGPA/GPA, and coursework'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          education: [
                            {
                              id: `edu_${Date.now()}`,
                              institution: '',
                              degree: '',
                              major: '',
                              startDate: '',
                              endDate: '',
                              gpa: '',
                            },
                            ...cvData.education,
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ডিগ্রি যোগ করুন' : 'Add Degree'}</span>
                    </button>
                  </div>

                  {cvData.education.map((edu, eduIdx) => (
                    <div key={edu.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">
                          #{eduIdx + 1} {edu.degree || 'Degree'} — {edu.institution || 'Institution'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              education: cvData.education.filter((_, i) => i !== eduIdx),
                            })
                          }
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Institution / University</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const copy = [...cvData.education];
                              copy[eduIdx].institution = e.target.value;
                              setCvData({ ...cvData, education: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Degree & Major</label>
                          <input
                            type="text"
                            value={edu.degree}
                            placeholder="e.g. B.Sc in Computer Science"
                            onChange={(e) => {
                              const copy = [...cvData.education];
                              copy[eduIdx].degree = e.target.value;
                              setCvData({ ...cvData, education: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Start Date</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => {
                              const copy = [...cvData.education];
                              copy[eduIdx].startDate = e.target.value;
                              setCvData({ ...cvData, education: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">End Date</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => {
                              const copy = [...cvData.education];
                              copy[eduIdx].endDate = e.target.value;
                              setCvData({ ...cvData, education: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'দক্ষতাসমূহ (Skills Categories)' : 'Categorized Skills'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'টেকনিক্যাল, টুলস ও সফট স্কিলস ক্যাটাগরি' : 'Organize skills into distinct domains (e.g. Languages, Frameworks, Analytics)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          skillCategories: [
                            ...cvData.skillCategories,
                            {
                              id: `skill_${Date.now()}`,
                              name: 'New Category',
                              skills: ['Skill 1'],
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ক্যাটাগরি যোগ' : 'Add Category'}</span>
                    </button>
                  </div>

                  {cvData.skillCategories.map((cat, catIdx) => (
                    <div key={cat.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const copy = [...cvData.skillCategories];
                            copy[catIdx].name = e.target.value;
                            setCvData({ ...cvData, skillCategories: copy });
                          }}
                          className="font-bold text-xs text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              skillCategories: cvData.skillCategories.filter((_, i) => i !== catIdx),
                            })
                          }
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        {cat.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded-lg"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...cvData.skillCategories];
                                copy[catIdx].skills = copy[catIdx].skills.filter((_, i) => i !== sIdx);
                                setCvData({ ...cvData, skillCategories: copy });
                              }}
                              className="text-slate-400 hover:text-red-500 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}

                        <input
                          type="text"
                          placeholder="+ Type skill & press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                const copy = [...cvData.skillCategories];
                                copy[catIdx].skills = [...copy[catIdx].skills, val];
                                setCvData({ ...cvData, skillCategories: copy });
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="px-2.5 py-1 text-xs bg-white border border-dashed border-slate-300 rounded-lg outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'প্রজেক্ট ও পোর্টফোলিও' : 'Projects & Portfolio'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'প্রজেক্টের নাম, বিবরণ এবং লাইভ/গিটহাব লিঙ্ক' : 'Key technical projects with clickable GitHub or demo links'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          projects: [
                            {
                              id: `proj_${Date.now()}`,
                              name: '',
                              description: '',
                              technologies: '',
                              projectUrl: '',
                              githubUrl: '',
                            },
                            ...cvData.projects,
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'প্রজেক্ট যোগ' : 'Add Project'}</span>
                    </button>
                  </div>

                  {cvData.projects.map((proj, pIdx) => (
                    <div key={proj.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">
                          #{pIdx + 1} {proj.name || 'Project Name'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              projects: cvData.projects.filter((_, i) => i !== pIdx),
                            })
                          }
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              const copy = [...cvData.projects];
                              copy[pIdx].name = e.target.value;
                              setCvData({ ...cvData, projects: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Technologies Used</label>
                          <input
                            type="text"
                            value={proj.technologies}
                            placeholder="e.g. React, Node.js, PostgreSQL"
                            onChange={(e) => {
                              const copy = [...cvData.projects];
                              copy[pIdx].technologies = e.target.value;
                              setCvData({ ...cvData, projects: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Live Demo URL</label>
                          <input
                            type="text"
                            value={proj.projectUrl || ''}
                            placeholder="https://myproject.com"
                            onChange={(e) => {
                              const copy = [...cvData.projects];
                              copy[pIdx].projectUrl = e.target.value;
                              setCvData({ ...cvData, projects: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">GitHub Repository URL</label>
                          <input
                            type="text"
                            value={proj.githubUrl || ''}
                            placeholder="https://github.com/username/project"
                            onChange={(e) => {
                              const copy = [...cvData.projects];
                              copy[pIdx].githubUrl = e.target.value;
                              setCvData({ ...cvData, projects: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-slate-700">Project Description</label>
                          <button
                            type="button"
                            disabled={isImprovingText || !proj.description}
                            onClick={() =>
                              handleImproveWriting(
                                proj.description,
                                'Project Description',
                                (improved) => {
                                  const copy = [...cvData.projects];
                                  copy[pIdx].description = improved;
                                  setCvData({ ...cvData, projects: copy });
                                }
                              )
                            }
                            className="text-[11px] text-blue-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>AI Polish</span>
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const copy = [...cvData.projects];
                            copy[pIdx].description = e.target.value;
                            setCvData({ ...cvData, projects: copy });
                          }}
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: CERTIFICATIONS */}
              {activeTab === 'certifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {isBn ? 'সার্টিফিকেশন ও প্রশিক্ষণ' : 'Certifications & Training'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'পেশাদার সনদপত্র ও ভেরিফিকেশন লিঙ্ক' : 'Professional credentials, licenses, and badges'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          certifications: [
                            {
                              id: `cert_${Date.now()}`,
                              name: '',
                              issuer: '',
                              issueDate: '',
                            },
                            ...cvData.certifications,
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সার্টিফিকেশন যোগ' : 'Add Certification'}</span>
                    </button>
                  </div>

                  {cvData.certifications.map((cert, cIdx) => (
                    <div key={cert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700">
                          #{cIdx + 1} {cert.name || 'Certification'} — {cert.issuer}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCvData({
                              ...cvData,
                              certifications: cvData.certifications.filter((_, i) => i !== cIdx),
                            })
                          }
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Certificate Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const copy = [...cvData.certifications];
                              copy[cIdx].name = e.target.value;
                              setCvData({ ...cvData, certifications: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Issuer / Organization</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const copy = [...cvData.certifications];
                              copy[cIdx].issuer = e.target.value;
                              setCvData({ ...cvData, certifications: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Issue Date</label>
                          <input
                            type="text"
                            value={cert.issueDate}
                            placeholder="e.g. 2023"
                            onChange={(e) => {
                              const copy = [...cvData.certifications];
                              copy[cIdx].issueDate = e.target.value;
                              setCvData({ ...cvData, certifications: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Verification URL</label>
                          <input
                            type="text"
                            value={cert.verificationUrl || ''}
                            placeholder="https://credential.net/..."
                            onChange={(e) => {
                              const copy = [...cvData.certifications];
                              copy[cIdx].verificationUrl = e.target.value;
                              setCvData({ ...cvData, certifications: copy });
                            }}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Section / Page Navigation Actions */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePreviousSection}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>
                  {activeTabIndex > 0
                    ? `${isBn ? 'পূর্ববর্তী:' : 'Previous:'} ${reviewTabs[activeTabIndex - 1].label}`
                    : isBn
                    ? 'পূর্ববর্তী (আপলোড)'
                    : 'Previous (Upload)'}
                </span>
              </button>

              <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span>{isBn ? 'সেকশন' : 'Page'}</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {activeTabIndex + 1} / {reviewTabs.length}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {activeTabIndex < reviewTabs.length - 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => goToStep('preview')}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সরাসরি প্রিভিউ' : 'Skip to Preview'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSection}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>
                        {isBn ? 'পরবর্তী:' : 'Next:'} {reviewTabs[activeTabIndex + 1].label}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToStep('preview')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isBn ? 'পরবর্তী: টেমপ্লেট ও প্রিভিউ' : 'Next: Template & Preview'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PREVIEW & DOWNLOAD SCREEN ================= */}
        {currentStep === 'preview' && cvData && (
          <div key="step-preview" className="space-y-6 animate-page-enter">
            {/* Top Toolbar: Template Chooser & Download Options */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep('review')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isBn ? 'পূর্ববর্তী (তথ্য এডিট)' : 'Previous (Edit Info)'}</span>
                  </button>

                  {onOpenInFullBuilder && (
                    <button
                      type="button"
                      onClick={() => onOpenInFullBuilder(cvData)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ফুল স্টুডিও বিল্ডারে খুলুন' : 'Open in Full Studio Builder'}</span>
                    </button>
                  )}
                </div>

                {/* Primary Download Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isExportingDocx}
                    onClick={async () => {
                      setIsExportingDocx(true);
                      try {
                        await exportToDocx(cvData);
                      } catch (err) {
                        console.error('Word export error:', err);
                        alert('DOCX export failed.');
                      } finally {
                        setIsExportingDocx(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-2xs active:scale-95"
                  >
                    <Download className="w-4 h-4 text-blue-700" />
                    <span>{isExportingDocx ? 'Generating Word...' : 'Download Word (.docx)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExportingPdf}
                    onClick={async () => {
                      setIsExportingPdf(true);
                      try {
                        await exportToPdf(cvData);
                      } catch (err) {
                        console.error('PDF export error:', err);
                        alert('PDF export failed.');
                      } finally {
                        setIsExportingPdf(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Step 5: Template Picker */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isBn ? 'সিভি টেমপ্লেট পছন্দ করুন' : 'Select Professional CV Template'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {TEMPLATES.map((tpl) => {
                    const isSelected = cvData.customization.templateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() =>
                          setCvData({
                            ...cvData,
                            customization: {
                              ...cvData.customization,
                              templateId: tpl.id,
                            },
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: tpl.color }}
                          />
                          <span className="text-[10px] font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                            {tpl.tag}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">{tpl.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{tpl.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Embedded Live CV Preview */}
            <div className="bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-300 shadow-md">
              <CVPreview
                cv={cvData}
                onUpdateCV={(updater) => setCvData((prev) => (prev ? updater(prev) : prev))}
                onBackToForm={() => goToStep('review')}
                showBackToFormButton={true}
              />
            </div>

            {/* Bottom Step Navigation on Preview Page */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goToStep('review')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isBn ? 'পূর্ববর্তী (তথ্য এডিট পেজ)' : 'Previous (Edit Info Page)'}</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep('upload')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isBn ? 'নতুন সিভি আপলোড করুন' : 'Upload Another CV'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
