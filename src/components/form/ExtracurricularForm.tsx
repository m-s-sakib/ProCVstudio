/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExtracurricularItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, Trophy, PlusCircle, X } from 'lucide-react';

interface ExtracurricularFormProps {
  extracurricular: ExtracurricularItem[];
  onChange: (updated: ExtracurricularItem[]) => void;
}

export const ExtracurricularForm: React.FC<ExtracurricularFormProps> = ({
  extracurricular = [],
  onChange,
}) => {
  const handleAdd = () => {
    const newItem: ExtracurricularItem = {
      id: `eca-${Date.now()}`,
      activity: '',
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    };
    onChange([...extracurricular, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ExtracurricularItem, value: any) => {
    onChange(
      extracurricular.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(extracurricular.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= extracurricular.length) return;
    const items = [...extracurricular];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  const handleAddBullet = (id: string) => {
    const target = extracurricular.find((e) => e.id === id);
    if (!target) return;
    handleUpdate(id, 'bullets', [...target.bullets, '']);
  };

  const handleUpdateBullet = (id: string, bIndex: number, text: string) => {
    const target = extracurricular.find((e) => e.id === id);
    if (!target) return;
    const newBullets = [...target.bullets];
    newBullets[bIndex] = text;
    handleUpdate(id, 'bullets', newBullets);
  };

  const handleDeleteBullet = (id: string, bIndex: number) => {
    const target = extracurricular.find((e) => e.id === id);
    if (!target) return;
    const newBullets = target.bullets.filter((_, idx) => idx !== bIndex);
    handleUpdate(id, 'bullets', newBullets.length ? newBullets : ['']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Extracurricular Activities (ECA)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Showcase your club leadership, debate, Olympiads, Model UN, sports, cultural societies, or volunteer activities.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add ECA Activity</span>
        </button>
      </div>

      {extracurricular.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No extracurricular activities added yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Click "Add ECA Activity" to add debating, Olympiads, robotics, sports, or student clubs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {extracurricular.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {item.activity || 'New ECA Activity'} {item.role ? `(${item.role})` : ''}
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
                    disabled={index === extracurricular.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
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
                    Activity / Club / Competition Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => handleUpdate(item.id, 'activity', e.target.value)}
                    placeholder="e.g. National Inter-College Debate Championship"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Role / Position / Designation
                  </label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => handleUpdate(item.id, 'role', e.target.value)}
                    placeholder="e.g. Champion / Best Speaker / Organizing Secretary"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Organization / Institution / Host Body
                  </label>
                  <input
                    type="text"
                    value={item.organization || ''}
                    onChange={(e) => handleUpdate(item.id, 'organization', e.target.value)}
                    placeholder="e.g. Debating Society / Red Crescent Youth"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Dates / Year
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!item.isCurrent}
                        onChange={(e) => handleUpdate(item.id, 'isCurrent', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.startDate || ''}
                      onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                      placeholder="Start (e.g. 2022)"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                    />
                    <input
                      type="text"
                      disabled={item.isCurrent}
                      value={item.isCurrent ? 'Present' : item.endDate || ''}
                      onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                      placeholder="End (e.g. 2024)"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Achievements & Key Highlights
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Bullet</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {item.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-xs">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(item.id, bIdx, e.target.value)}
                        placeholder="e.g. Led a 4-member team to victory against 36 regional universities..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteBullet(item.id, bIdx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Remove bullet"
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
