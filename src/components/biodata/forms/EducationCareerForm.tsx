/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BiodataEducationCareer, BiodataPrivacySettings } from '../../../types/biodata';
import { GraduationCap, Briefcase, Eye, EyeOff, DollarSign } from 'lucide-react';

interface EducationCareerFormProps {
  educationCareer: BiodataEducationCareer;
  privacy: BiodataPrivacySettings;
  onChange: (field: keyof BiodataEducationCareer, value: string) => void;
  onPrivacyChange: (field: keyof BiodataPrivacySettings, value: boolean) => void;
}

export const EducationCareerForm: React.FC<EducationCareerFormProps> = ({
  educationCareer,
  privacy,
  onChange,
  onPrivacyChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-rose-600" />
          <span>Education & Career Details</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Share your academic achievements and current profession. You can keep annual income confidential or visible.
        </p>
      </div>

      {/* Academic Qualifications */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
          <span>Academic Qualifications</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Highest Degree</label>
            <input
              type="text"
              value={educationCareer.highestDegree || ''}
              onChange={(e) => onChange('highestDegree', e.target.value)}
              placeholder="e.g. Master of Science (M.Sc), MBA, MBBS, B.Tech"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Field of Study / Major</label>
            <input
              type="text"
              value={educationCareer.majorOrField || ''}
              onChange={(e) => onChange('majorOrField', e.target.value)}
              placeholder="e.g. Computer Science, Medicine, Finance"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Institution / University</label>
            <input
              type="text"
              value={educationCareer.institution || ''}
              onChange={(e) => onChange('institution', e.target.value)}
              placeholder="e.g. Dhaka Medical College, University of Westminster"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Graduation Year</label>
            <input
              type="text"
              value={educationCareer.graduationYear || ''}
              onChange={(e) => onChange('graduationYear', e.target.value)}
              placeholder="e.g. 2022"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Additional Educational Background
            </label>
            <textarea
              rows={2}
              value={educationCareer.additionalEducation || ''}
              onChange={(e) => onChange('additionalEducation', e.target.value)}
              placeholder="e.g. B.Sc in Computer Science (CGPA 3.86), HSC & SSC with Golden GPA 5.0"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Professional Career */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-rose-500" />
          <span>Current Occupation & Career</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Current Occupation / Role</label>
            <input
              type="text"
              value={educationCareer.currentOccupation || ''}
              onChange={(e) => onChange('currentOccupation', e.target.value)}
              placeholder="e.g. Lead Product Designer, Doctor, Software Engineer"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Official Designation</label>
            <input
              type="text"
              value={educationCareer.designation || ''}
              onChange={(e) => onChange('designation', e.target.value)}
              placeholder="e.g. Senior Specialist, Assistant Vice President"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Company / Organization</label>
            <input
              type="text"
              value={educationCareer.organization || ''}
              onChange={(e) => onChange('organization', e.target.value)}
              placeholder="e.g. FinTech Innovations Ltd. or Government Hospital"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Work Location</label>
            <input
              type="text"
              value={educationCareer.workLocation || ''}
              onChange={(e) => onChange('workLocation', e.target.value)}
              placeholder="e.g. Dhaka (Hybrid), Bengaluru, London"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Annual Income with Privacy Toggle */}
          <div className="sm:col-span-2 space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Annual Income / Package (Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => onPrivacyChange('showIncome', !privacy.showIncome)}
                className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 transition-colors ${
                  privacy.showIncome
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                {privacy.showIncome ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{privacy.showIncome ? 'Income Visible' : 'Income Hidden'}</span>
              </button>
            </div>
            <input
              type="text"
              value={educationCareer.annualIncome || ''}
              onChange={(e) => onChange('annualIncome', e.target.value)}
              placeholder="e.g. BDT 20,00,000+ per annum or ₹ 45 Lakhs CTC"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Career Aspirations</label>
            <input
              type="text"
              value={educationCareer.careerAspirations || ''}
              onChange={(e) => onChange('careerAspirations', e.target.value)}
              placeholder="e.g. Continuous professional growth while balancing a tranquil family life."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
