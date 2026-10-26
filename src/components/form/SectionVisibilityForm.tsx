/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionVisibility } from '../../types/cv';
import { Eye, EyeOff, Sliders } from 'lucide-react';

interface SectionVisibilityFormProps {
  visibility: SectionVisibility;
  onChange: (updated: SectionVisibility) => void;
}

export const SectionVisibilityForm: React.FC<SectionVisibilityFormProps> = ({ visibility, onChange }) => {
  const sections: { key: keyof SectionVisibility; label: string; desc: string }[] = [
    { key: 'summary', label: 'Professional Summary / Objective', desc: 'Brief introductory statement or research abstract' },
    { key: 'education', label: 'Education & Academics', desc: 'Universities, degrees, GPA, and coursework' },
    { key: 'experience', label: 'Work Experience', desc: 'Professional roles, internships, and quantified achievements' },
    { key: 'projects', label: 'Projects & Publications', desc: 'Software systems, machine learning models, or research papers' },
    { key: 'skills', label: 'Skills & Competencies', desc: 'Grouped categories of technical and domain tools' },
    { key: 'certifications', label: 'Certifications & Accreditations', desc: 'Verified credentials and certificates with links' },
    { key: 'leadership', label: 'Leadership, Activities & Awards', desc: 'Volunteer work, student societies, and honors' },
    { key: 'extracurricular', label: 'Extracurricular Activities (ECA)', desc: 'Debate, Model UN, clubs, sports, Olympiads, and competitions' },
    { key: 'languages', label: 'Languages', desc: 'Language proficiencies' },
    { key: 'interests', label: 'Interests & Activities', desc: 'Personal pursuits, sports, or creative hobbies' },
    { key: 'references', label: 'References', desc: 'Professional and academic recommendation contacts' },
  ];

  const handleToggle = (key: keyof SectionVisibility) => {
    onChange({
      ...visibility,
      [key]: !visibility[key],
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Section Visibility</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tailor your CV for specific job applications by toggling sections on or off.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map(({ key, label, desc }) => {
          const isVisible = visibility[key];
          return (
            <div
              key={key}
              onClick={() => handleToggle(key)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                isVisible
                  ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                  : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-900">{label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{desc}</div>
              </div>

              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  isVisible ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
