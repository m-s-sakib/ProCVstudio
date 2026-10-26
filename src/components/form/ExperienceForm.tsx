/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExperienceItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase, PlusCircle, X } from 'lucide-react';

interface ExperienceFormProps {
  experience: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange }) => {
  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      employmentType: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    };
    onChange([...experience, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experience.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;
    const items = [...experience];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  const handleAddBullet = (expId: string) => {
    const target = experience.find((e) => e.id === expId);
    if (!target) return;
    handleUpdate(expId, 'bullets', [...target.bullets, '']);
  };

  const handleUpdateBullet = (expId: string, bulletIndex: number, text: string) => {
    const target = experience.find((e) => e.id === expId);
    if (!target) return;
    const newBullets = [...target.bullets];
    newBullets[bulletIndex] = text;
    handleUpdate(expId, 'bullets', newBullets);
  };

  const handleDeleteBullet = (expId: string, bulletIndex: number) => {
    const target = experience.find((e) => e.id === expId);
    if (!target) return;
    const newBullets = target.bullets.filter((_, idx) => idx !== bulletIndex);
    handleUpdate(expId, 'bullets', newBullets.length ? newBullets : ['']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Work Experience</h3>
          <p className="text-xs text-slate-500">Add your professional roles, internships, achievements, and impact.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No experience added yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Experience" to add employment or internships.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {exp.jobTitle || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === experience.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={exp.jobTitle}
                    onChange={(e) => handleUpdate(exp.id, 'jobTitle', e.target.value)}
                    placeholder="e.g. Senior Data Analyst"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                    placeholder="e.g. Apex Analytics Corp"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={exp.employmentType || 'Full-time'}
                    onChange={(e) => handleUpdate(exp.id, 'employmentType', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Research Fellow">Research Fellow</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location || ''}
                    onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA (or Remote)"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                    placeholder="e.g. Jun 2023"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      End Date
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!exp.isCurrent}
                        onChange={(e) => handleUpdate(exp.id, 'isCurrent', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Present</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={exp.isCurrent}
                    value={exp.isCurrent ? 'Present' : exp.endDate}
                    onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                    placeholder="e.g. May 2024"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Responsibilities and Achievements (Bullets) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Responsibilities & Achievements (Action-Oriented Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(exp.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                        placeholder="e.g. Spearheaded SQL optimization reducing pipeline latency by 40% across 12M records..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(exp.id, bIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Remove bullet point"
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
