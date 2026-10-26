/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageItem } from '../../types/cv';
import { Plus, Trash2, Globe2, Heart, X } from 'lucide-react';

interface LanguagesInterestsFormProps {
  languages: LanguageItem[];
  interests: string[];
  onChangeLanguages: (languages: LanguageItem[]) => void;
  onChangeInterests: (interests: string[]) => void;
}

export const LanguagesInterestsForm: React.FC<LanguagesInterestsFormProps> = ({
  languages,
  interests,
  onChangeLanguages,
  onChangeInterests,
}) => {
  const [interestInput, setInterestInput] = useState<string>('');

  const handleAddLanguage = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: 'Fluent',
    };
    onChangeLanguages([...languages, newItem]);
  };

  const handleUpdateLanguage = (id: string, field: keyof LanguageItem, value: any) => {
    onChangeLanguages(
      languages.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleDeleteLanguage = (id: string) => {
    onChangeLanguages(languages.filter((l) => l.id !== id));
  };

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    const parts = interestInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const set = new Set(interests);
    parts.forEach((p) => set.add(p));
    onChangeInterests(Array.from(set));
    setInterestInput('');
  };

  const handleRemoveInterest = (item: string) => {
    onChangeInterests(interests.filter((i) => i !== item));
  };

  return (
    <div className="space-y-6">
      {/* Languages Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Languages</span>
            </h3>
            <p className="text-xs text-slate-500">Specify languages and fluency levels.</p>
          </div>
          <button
            type="button"
            onClick={handleAddLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>

        {languages.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No languages added yet.</p>
        ) : (
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
              >
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => handleUpdateLanguage(lang.id, 'name', e.target.value)}
                  placeholder="e.g. English, French, Spanish"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => handleUpdateLanguage(lang.id, 'proficiency', e.target.value)}
                  className="w-36 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Elementary">Elementary</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteLanguage(lang.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interests Section */}
      <div className="space-y-3 pt-2">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Interests & Activities</span>
          </h3>
          <p className="text-xs text-slate-500">Optional personal hobbies that demonstrate cultural fit, curiosity, or discipline.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-lg border border-slate-200">
          {interests.length === 0 && (
            <span className="text-[11px] text-slate-400 italic">No interests added yet.</span>
          )}
          {interests.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs bg-white text-slate-800 rounded border border-slate-300 shadow-2xs"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(item)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest();
              }
            }}
            placeholder="Type interest (e.g. Competitive Chess, Marathon Running) and press Enter"
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
