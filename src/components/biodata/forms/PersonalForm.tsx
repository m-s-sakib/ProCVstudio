/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { BiodataPersonalInfo, BiodataPrivacySettings } from '../../../types/biodata';
import { User, Camera, Trash2, Eye, EyeOff, ShieldCheck, Calendar, MapPin } from 'lucide-react';

interface PersonalFormProps {
  personal: BiodataPersonalInfo;
  privacy: BiodataPrivacySettings;
  onChange: (field: keyof BiodataPersonalInfo, value: string) => void;
  onPrivacyChange: (field: keyof BiodataPrivacySettings, value: boolean) => void;
}

export const PersonalForm: React.FC<PersonalFormProps> = ({
  personal,
  privacy,
  onChange,
  onPrivacyChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange('photoUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-rose-600" />
          <span>Personal Information</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide primary personal details. All fields are optional. Use privacy toggles to hide sensitive details from export.
        </p>
      </div>

      {/* Photo Upload & Preview Card */}
      <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group shrink-0">
          {personal.photoUrl ? (
            <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-rose-200 shadow-2xs bg-white">
              <img
                src={personal.photoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-28 rounded-lg border-2 border-dashed border-rose-300 bg-white flex flex-col items-center justify-center text-rose-400 gap-1">
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-medium">Add Photo</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="text-xs font-semibold text-slate-800">Candidate Profile Photo</div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Upload a clear, polite portrait photo (PNG, JPG up to 5MB). You can toggle visibility at any time.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg shadow-2xs transition-colors"
            >
              Upload Photo
            </button>

            {personal.photoUrl && (
              <button
                type="button"
                onClick={() => onChange('photoUrl', '')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onPrivacyChange('showPhoto', !privacy.showPhoto)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${
                privacy.showPhoto
                  ? 'bg-rose-100/70 border-rose-200 text-rose-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {privacy.showPhoto ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{privacy.showPhoto ? 'Photo Visible' : 'Photo Hidden'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Basic Particulars Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Full Name *</label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="e.g. Ayesha Rahman or Dr. Tariq Hasan"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
          <input
            type="text"
            value={personal.dateOfBirth || ''}
            onChange={(e) => onChange('dateOfBirth', e.target.value)}
            placeholder="e.g. 14 May 1998"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Age</label>
          <input
            type="text"
            value={personal.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="e.g. 26 Years"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Height */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Height</label>
          <input
            type="text"
            value={personal.height || ''}
            onChange={(e) => onChange('height', e.target.value)}
            placeholder="e.g. 5' 5&quot; (165 cm)"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Religion */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Religion</label>
          <input
            type="text"
            value={personal.religion || ''}
            onChange={(e) => onChange('religion', e.target.value)}
            placeholder="e.g. Islam (Sunni), Hindu, Christian"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Caste / Sect */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Caste / Sect (Optional)</label>
          <input
            type="text"
            value={personal.casteOrSect || ''}
            onChange={(e) => onChange('casteOrSect', e.target.value)}
            placeholder="e.g. Sunni / Hanafi, Khatri, Brahmin"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Marital Status */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Marital Status</label>
          <select
            value={personal.maritalStatus || 'Never Married'}
            onChange={(e) => onChange('maritalStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Never Married">Never Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Awaiting Divorce">Awaiting Divorce</option>
          </select>
        </div>

        {/* Nationality */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Nationality</label>
          <input
            type="text"
            value={personal.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
            placeholder="e.g. Bangladeshi, Indian, British, American"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Complexion */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Complexion</label>
          <input
            type="text"
            value={personal.complexion || ''}
            onChange={(e) => onChange('complexion', e.target.value)}
            placeholder="e.g. Fair, Very Fair, Wheatish"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Blood Group</label>
          <input
            type="text"
            value={personal.bloodGroup || ''}
            onChange={(e) => onChange('bloodGroup', e.target.value)}
            placeholder="e.g. B+, O+, A+, AB+"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Mother Tongue */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Mother Tongue</label>
          <input
            type="text"
            value={personal.motherTongue || ''}
            onChange={(e) => onChange('motherTongue', e.target.value)}
            placeholder="e.g. Bengali, Hindi, Urdu, English"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Current Location */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Current Residence / Location</label>
          <input
            type="text"
            value={personal.currentLocation || ''}
            onChange={(e) => onChange('currentLocation', e.target.value)}
            placeholder="e.g. Gulshan-2, Dhaka, Bangladesh or Bengaluru, India"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Permanent Address with Privacy Toggle */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Permanent Address</label>
            <button
              type="button"
              onClick={() => onPrivacyChange('showPermanentAddress', !privacy.showPermanentAddress)}
              className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              {privacy.showPermanentAddress ? <Eye className="w-3 h-3 text-rose-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
              <span>{privacy.showPermanentAddress ? 'Visible in Biodata' : 'Hidden from Biodata'}</span>
            </button>
          </div>
          <textarea
            rows={2}
            value={personal.permanentAddress || ''}
            onChange={(e) => onChange('permanentAddress', e.target.value)}
            placeholder="e.g. Ancestral home address, district or city"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
