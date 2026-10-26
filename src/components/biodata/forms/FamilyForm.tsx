/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BiodataFamily } from '../../../types/biodata';
import { Home, Users, Heart } from 'lucide-react';

interface FamilyFormProps {
  family: BiodataFamily;
  onChange: (field: keyof BiodataFamily, value: string) => void;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({ family, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Home className="w-4 h-4 text-rose-600" />
          <span>Family Background</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide information about parents, siblings, family values, and native heritage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Father's Info */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Father's Name</label>
          <input
            type="text"
            value={family.fatherName || ''}
            onChange={(e) => onChange('fatherName', e.target.value)}
            placeholder="e.g. Engr. Mahbubur Rahman"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Father's Occupation</label>
          <input
            type="text"
            value={family.fatherOccupation || ''}
            onChange={(e) => onChange('fatherOccupation', e.target.value)}
            placeholder="e.g. Chief Engineer (Retd.), Govt. Officer, Businessman"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Mother's Info */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Mother's Name</label>
          <input
            type="text"
            value={family.motherName || ''}
            onChange={(e) => onChange('motherName', e.target.value)}
            placeholder="e.g. Begum Sultana Rahman"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Mother's Occupation</label>
          <input
            type="text"
            value={family.motherOccupation || ''}
            onChange={(e) => onChange('motherOccupation', e.target.value)}
            placeholder="e.g. Homemaker, Professor, Teacher, Doctor"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Brothers */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Number of Brothers</label>
          <input
            type="text"
            value={family.numberOfBrothers || ''}
            onChange={(e) => onChange('numberOfBrothers', e.target.value)}
            placeholder="e.g. 1 Younger Brother, None, 2 Brothers"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Brother's Occupation / Details</label>
          <input
            type="text"
            value={family.brotherDetails || ''}
            onChange={(e) => onChange('brotherDetails', e.target.value)}
            placeholder="e.g. Software Engineer in USA, Married"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Sisters */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Number of Sisters</label>
          <input
            type="text"
            value={family.numberOfSisters || ''}
            onChange={(e) => onChange('numberOfSisters', e.target.value)}
            placeholder="e.g. 1 Elder Sister (Married), None"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Sister's Occupation / Details</label>
          <input
            type="text"
            value={family.sisterDetails || ''}
            onChange={(e) => onChange('sisterDetails', e.target.value)}
            placeholder="e.g. Architect, Married and living in Canada"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Family Dynamics */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Family Type</label>
          <select
            value={family.familyType || 'Nuclear'}
            onChange={(e) => onChange('familyType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Nuclear">Nuclear Family</option>
            <option value="Joint">Joint Family</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Family Status</label>
          <select
            value={family.familyStatus || 'Upper Middle Class'}
            onChange={(e) => onChange('familyStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Upper Middle Class">Upper Middle Class</option>
            <option value="Middle Class">Middle Class</option>
            <option value="Affluent / Elite">Affluent / Elite</option>
            <option value="Aristocratic">Aristocratic</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Family Values</label>
          <select
            value={family.familyValues || 'Moderate'}
            onChange={(e) => onChange('familyValues', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="Moderate">Moderate & Cultured</option>
            <option value="Traditional">Traditional</option>
            <option value="Religious / Practicing">Religious / Practicing</option>
            <option value="Modern / Liberal">Modern & Progressive</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Native Place / Roots</label>
          <input
            type="text"
            value={family.nativePlace || ''}
            onChange={(e) => onChange('nativePlace', e.target.value)}
            placeholder="e.g. Sylhet, Cumilla, Amritsar, Mumbai"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Ancestral Roots / Heritage</label>
          <input
            type="text"
            value={family.ancestralRoots || ''}
            onChange={(e) => onChange('ancestralRoots', e.target.value)}
            placeholder="e.g. Respected aristocratic family with strong cultural roots"
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Brief Family Overview</label>
          <textarea
            rows={2}
            value={family.familyAbout || ''}
            onChange={(e) => onChange('familyAbout', e.target.value)}
            placeholder="e.g. A warm, close-knit and supportive family who values education, kindness, and mutual respect."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
