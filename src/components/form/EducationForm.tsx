/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EducationItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, GraduationCap } from 'lucide-react';

interface EducationFormProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      major: '',
      gpa: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      coursework: '',
      achievements: '',
    };
    onChange([...education, newItem]);
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: any) => {
    onChange(
      education.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;
    const items = [...education];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Education</h3>
          <p className="text-xs text-slate-500">Add your degrees, diplomas, universities, and academic awards.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No education entries added yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Education" to list your academic background.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {edu.institution || 'New Institution'}
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
                    disabled={index === education.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Institution / University Name
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Degree / Qualification
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Major / Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) => handleUpdate(edu.id, 'major', e.target.value)}
                    placeholder="e.g. Computer Science & Statistics"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    GPA / Grade (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.85 / 4.00 or First Class Honors"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                    placeholder="e.g. Aug 2019"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      End Date (or Expected)
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!edu.isCurrent}
                        onChange={(e) => handleUpdate(edu.id, 'isCurrent', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Currently Studying</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={edu.isCurrent}
                    value={edu.isCurrent ? 'Present' : edu.endDate}
                    onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                    placeholder="e.g. May 2023"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                    placeholder="e.g. Berkeley, California"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Relevant Coursework
                  </label>
                  <input
                    type="text"
                    value={edu.coursework || ''}
                    onChange={(e) => handleUpdate(edu.id, 'coursework', e.target.value)}
                    placeholder="e.g. Distributed Systems, Algorithms, Deep Learning, Linear Algebra"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Honors, Scholarships & Academic Achievements
                  </label>
                  <input
                    type="text"
                    value={edu.achievements || ''}
                    onChange={(e) => handleUpdate(edu.id, 'achievements', e.target.value)}
                    placeholder="e.g. Dean's List (6 Semesters), University Merit Scholarship"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
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
