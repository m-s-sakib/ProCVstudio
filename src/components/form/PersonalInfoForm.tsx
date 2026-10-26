/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PersonalDetails } from '../../types/cv';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, FileText, Camera, Trash2, Upload } from 'lucide-react';

interface PersonalInfoFormProps {
  personal: PersonalDetails;
  onChange: (updated: PersonalDetails) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ personal, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onChange({
      ...personal,
      [field]: value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('photoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-base font-semibold text-slate-900">Personal & Contact Information</h3>
        <p className="text-xs text-slate-500">Provide your basic contact details and professional summary.</p>
      </div>

      {/* Profile Photo Upload Row */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {personal.photoUrl ? (
            <img
              src={personal.photoUrl}
              alt="Profile preview"
              className="w-12 h-12 rounded-full object-cover border border-slate-300 shadow-2xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center border border-slate-300">
              <Camera className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div>
            <div className="text-xs font-semibold text-slate-800">Profile Photo (Optional)</div>
            <div className="text-[11px] text-slate-500">PNG or JPG. Recommended square 1:1 ratio.</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Upload Photo</span>
          </button>
          {personal.photoUrl && (
            <button
              type="button"
              onClick={() => handleChange('photoUrl', '')}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g. Salman Sakib"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Job Title
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder="e.g. Senior Data Analyst & ML Engineer"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={personal.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. salman.sakib@example.com"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number (with Country Code)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={personal.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. +1 (555) 342-8901"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            City & Country
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={[personal.city, personal.country].filter(Boolean).join(', ')}
              onChange={(e) => {
                const parts = e.target.value.split(',');
                handleChange('city', parts[0]?.trim() || '');
                handleChange('country', parts.slice(1).join(',').trim() || '');
              }}
              placeholder="e.g. San Francisco, United States"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Personal Website / Portfolio
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              value={personal.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            LinkedIn Profile URL
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              value={personal.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub Profile URL
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="url"
              value={personal.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/username"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Professional Summary or Career Objective
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <textarea
            rows={4}
            value={personal.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Highlight your core achievements, domain focus, and key qualifications..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
