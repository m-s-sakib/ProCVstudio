/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReferenceItem } from '../../types/cv';
import { Plus, Trash2, UserCheck } from 'lucide-react';

interface ReferencesFormProps {
  references: ReferenceItem[];
  isVisible: boolean;
  onToggleVisibility: (visible: boolean) => void;
  onChange: (updated: ReferenceItem[]) => void;
}

export const ReferencesForm: React.FC<ReferencesFormProps> = ({
  references,
  isVisible,
  onToggleVisibility,
  onChange,
}) => {
  const handleAdd = () => {
    const newItem: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: '',
      title: '',
      organization: '',
      email: '',
      phone: '',
    };
    onChange([...references, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ReferenceItem, value: string) => {
    onChange(
      references.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDelete = (id: string) => {
    onChange(references.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>References</span>
          </h3>
          <p className="text-xs text-slate-500">Add references or toggle visibility off if providing upon request.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => onToggleVisibility(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Include on CV</span>
          </label>

          {isVisible && (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Referee</span>
            </button>
          )}
        </div>
      </div>

      {!isVisible ? (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          References section is currently <strong>hidden</strong> from the CV. Check "Include on CV" above to display referee details.
        </div>
      ) : references.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs text-slate-600 font-medium">No references added yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Referee" to input manager or advisor contacts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {references.map((ref, index) => (
            <div
              key={ref.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {ref.name || 'New Reference'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(ref.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Referee Full Name
                  </label>
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => handleUpdate(ref.id, 'name', e.target.value)}
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={ref.title}
                    onChange={(e) => handleUpdate(ref.id, 'title', e.target.value)}
                    placeholder="e.g. Director of Analytics & BI"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Organization / University
                  </label>
                  <input
                    type="text"
                    value={ref.organization}
                    onChange={(e) => handleUpdate(ref.id, 'organization', e.target.value)}
                    placeholder="e.g. Apex Analytics Corp"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => handleUpdate(ref.id, 'email', e.target.value)}
                    placeholder="e.g. arthur.p@apexanalytics.com"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={ref.phone || ''}
                    onChange={(e) => handleUpdate(ref.id, 'phone', e.target.value)}
                    placeholder="e.g. +1 (555) 492-1100"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
