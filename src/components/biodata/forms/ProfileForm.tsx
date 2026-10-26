/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BiodataProfile } from '../../../types/biodata';
import { Heart, Sparkles, Coffee } from 'lucide-react';

interface ProfileFormProps {
  profile: BiodataProfile;
  onChange: (field: keyof BiodataProfile, value: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-600" />
          <span>Personal Profile & Lifestyle</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Share your personality, hobbies, everyday lifestyle, and what matters most to you.
        </p>
      </div>

      <div className="space-y-4">
        {/* About Me */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">About Me (Bio)</label>
          <textarea
            rows={4}
            value={profile.aboutMe || ''}
            onChange={(e) => onChange('aboutMe', e.target.value)}
            placeholder="Write a brief, genuine summary about your character, outlook on life, and marriage aspirations..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
          />
        </div>

        {/* Hobbies & Interests */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Hobbies & Interests</label>
          <input
            type="text"
            value={profile.hobbiesAndInterests || ''}
            onChange={(e) => onChange('hobbiesAndInterests', e.target.value)}
            placeholder="e.g. Photography, reading, travel, music, cooking, badminton"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Personality Traits */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Personality & Character Traits</label>
          <input
            type="text"
            value={profile.personalityTraits || ''}
            onChange={(e) => onChange('personalityTraits', e.target.value)}
            placeholder="e.g. Calm, empathetic, articulate, caring, optimistic, respectful"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Lifestyle & Diet */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Lifestyle & Dietary Habits</label>
          <input
            type="text"
            value={profile.lifestyleAndDiet || ''}
            onChange={(e) => onChange('lifestyleAndDiet', e.target.value)}
            placeholder="e.g. Strictly Halal / Vegetarian, non-smoker, active lifestyle"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Personal & Religious Values */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Personal & Faith Values</label>
          <textarea
            rows={2}
            value={profile.personalValues || ''}
            onChange={(e) => onChange('personalValues', e.target.value)}
            placeholder="e.g. Practicing believer who balances spiritual devotion with contemporary professional ambition."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
