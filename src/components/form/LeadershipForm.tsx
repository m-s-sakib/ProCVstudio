/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LeadershipItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, Users, PlusCircle, X } from 'lucide-react';

interface LeadershipFormProps {
  leadership: LeadershipItem[];
  onChange: (updated: LeadershipItem[]) => void;
}

export const LeadershipForm: React.FC<LeadershipFormProps> = ({ leadership, onChange }) => {
  const handleAdd = () => {
    const newItem: LeadershipItem = {
      id: `lead-${Date.now()}`,
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      location: '',
      bullets: [''],
    };
    onChange([...leadership, newItem]);
  };

  const handleUpdate = (id: string, field: keyof LeadershipItem, value: any) => {
    onChange(
      leadership.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(leadership.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= leadership.length) return;
    const items = [...leadership];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  const handleAddBullet = (leadId: string) => {
    const target = leadership.find((l) => l.id === leadId);
    if (!target) return;
    handleUpdate(leadId, 'bullets', [...target.bullets, '']);
  };

  const handleUpdateBullet = (leadId: string, bIndex: number, text: string) => {
    const target = leadership.find((l) => l.id === leadId);
    if (!target) return;
    const newBullets = [...target.bullets];
    newBullets[bIndex] = text;
    handleUpdate(leadId, 'bullets', newBullets);
  };

  const handleDeleteBullet = (leadId: string, bIndex: number) => {
    const target = leadership.find((l) => l.id === leadId);
    if (!target) return;
    const newBullets = target.bullets.filter((_, idx) => idx !== bIndex);
    handleUpdate(leadId, 'bullets', newBullets.length ? newBullets : ['']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Leadership, Activities & Achievements</h3>
          <p className="text-xs text-slate-500">Add student governance, volunteer initiatives, society leadership, or honors.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity</span>
        </button>
      </div>

      {leadership.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No leadership activities added.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Activity" to highlight community work or club leadership.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leadership.map((lead, index) => (
            <div
              key={lead.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {lead.role || 'New Role'} {lead.organization ? `· ${lead.organization}` : ''}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === leadership.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(lead.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={lead.role}
                    onChange={(e) => handleUpdate(lead.id, 'role', e.target.value)}
                    placeholder="e.g. Vice President of Technical Workshops"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Organization / Committee / Society
                  </label>
                  <input
                    type="text"
                    value={lead.organization}
                    onChange={(e) => handleUpdate(lead.id, 'organization', e.target.value)}
                    placeholder="e.g. Berkeley Data Science Society"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={lead.startDate || ''}
                    onChange={(e) => handleUpdate(lead.id, 'startDate', e.target.value)}
                    placeholder="e.g. Sep 2021"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={lead.endDate || ''}
                    onChange={(e) => handleUpdate(lead.id, 'endDate', e.target.value)}
                    placeholder="e.g. May 2023 or Present"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Bullets */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Activity Details & Impact
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(lead.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {lead.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(lead.id, bIdx, e.target.value)}
                        placeholder="e.g. Instructed hands-on technical workshops attended by 350+ students..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(lead.id, bIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
