/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BiodataContact, BiodataPrivacySettings } from '../../../types/biodata';
import { Phone, Mail, User, Clock, Eye, EyeOff } from 'lucide-react';

interface ContactFormProps {
  contact: BiodataContact;
  privacy: BiodataPrivacySettings;
  onChange: (field: keyof BiodataContact, value: string) => void;
  onPrivacyChange: (field: keyof BiodataPrivacySettings, value: boolean) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  privacy,
  onChange,
  onPrivacyChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-600" />
          <span>Contact Information</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide guardian or primary contact details for marriage inquiries. You can hide phone or email if desired.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Person Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Contact Person Name</label>
          <input
            type="text"
            value={contact.contactPersonName || ''}
            onChange={(e) => onChange('contactPersonName', e.target.value)}
            placeholder="e.g. Engr. Mahbubur Rahman (Father)"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Relationship */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Relationship to Candidate</label>
          <select
            value={contact.relationship || 'Father'}
            onChange={(e) => onChange('relationship', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Self">Self (Candidate)</option>
            <option value="Guardian">Guardian / Relative</option>
          </select>
        </div>

        {/* Phone Number with Privacy Toggle */}
        <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>Primary Phone Number</span>
            </label>
            <button
              type="button"
              onClick={() => onPrivacyChange('showPhone', !privacy.showPhone)}
              className={`text-[11px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                privacy.showPhone
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              {privacy.showPhone ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{privacy.showPhone ? 'Visible' : 'Hidden'}</span>
            </button>
          </div>
          <input
            type="text"
            value={contact.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="e.g. +880 1711-234567"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded-sm">
              WA
            </span>
            <span>WhatsApp Number</span>
          </label>
          <input
            type="text"
            value={contact.whatsapp || ''}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            placeholder="e.g. +880 1711-234567"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Email Address with Privacy Toggle */}
        <div className="sm:col-span-2 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-600" />
              <span>Email Address</span>
            </label>
            <button
              type="button"
              onClick={() => onPrivacyChange('showEmail', !privacy.showEmail)}
              className={`text-[11px] px-1.5 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                privacy.showEmail
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-300'
              }`}
            >
              {privacy.showEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{privacy.showEmail ? 'Visible' : 'Hidden'}</span>
            </button>
          </div>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="e.g. family.contact@gmail.com"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Calling Hours */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Convenient Time to Call</span>
          </label>
          <input
            type="text"
            value={contact.convenientTimeToCall || ''}
            onChange={(e) => onChange('convenientTimeToCall', e.target.value)}
            placeholder="e.g. Evenings (6:00 PM – 9:30 PM) or Weekends anytime"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Contact Address (Optional)</label>
          <input
            type="text"
            value={contact.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="e.g. House 42, Road 11, Dhanmondi R/A, Dhaka"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
