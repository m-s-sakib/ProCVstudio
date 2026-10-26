/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BiodataPreferences } from '../../../types/biodata';
import { Compass, HeartHandshake } from 'lucide-react';

interface PreferencesFormProps {
  preferences: BiodataPreferences;
  onChange: (field: keyof BiodataPreferences, value: string) => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-4 h-4 text-rose-600" />
          <span>Partner Preferences</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Specify what you look for in a life partner. You can leave any criteria open or flexible.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Age Range */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Preferred Age Range</label>
          <input
            type="text"
            value={preferences.ageRange || ''}
            onChange={(e) => onChange('ageRange', e.target.value)}
            placeholder="e.g. 27 – 32 Years or 24 – 28 Years"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Height Range */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Preferred Height Range</label>
          <input
            type="text"
            value={preferences.heightRange || ''}
            onChange={(e) => onChange('heightRange', e.target.value)}
            placeholder="e.g. 5' 8&quot; and above or 5' 2&quot; – 5' 6&quot;"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Marital Status Preference */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Marital Status Preference</label>
          <select
            value={preferences.maritalStatusPreference || 'Never Married'}
            onChange={(e) => onChange('maritalStatusPreference', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Never Married">Never Married</option>
            <option value="Does Not Matter">Does Not Matter / Flexible</option>
            <option value="Divorced / Widowed Considered">Divorced / Widowed Considered</option>
          </select>
        </div>

        {/* Location Preference */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Location / Relocation</label>
          <input
            type="text"
            value={preferences.locationPreference || ''}
            onChange={(e) => onChange('locationPreference', e.target.value)}
            placeholder="e.g. Dhaka, Abroad (UK, USA, Canada) or Flexible"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Education Preference */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Educational Qualification</label>
          <input
            type="text"
            value={preferences.educationPreference || ''}
            onChange={(e) => onChange('educationPreference', e.target.value)}
            placeholder="e.g. Minimum Graduate / Masters / Doctor / Engineer"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Profession Preference */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Profession / Occupation</label>
          <input
            type="text"
            value={preferences.professionPreference || ''}
            onChange={(e) => onChange('professionPreference', e.target.value)}
            placeholder="e.g. Professional career or business background with integrity and financial stability"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Values and Expectations */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Personality, Character & Values Expectations</label>
          <textarea
            rows={3}
            value={preferences.valuesExpectations || ''}
            onChange={(e) => onChange('valuesExpectations', e.target.value)}
            placeholder="e.g. Looking for a respectful, empathetic partner who is committed to a peaceful family life, values honesty, and shares similar cultural or religious values."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
          />
        </div>

        {/* Other Notes */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Additional Expectations / Notes</label>
          <input
            type="text"
            value={preferences.otherNotes || ''}
            onChange={(e) => onChange('otherNotes', e.target.value)}
            placeholder="e.g. Looking for a sincere life partner and best friend to embark on life’s blessed journey together."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
