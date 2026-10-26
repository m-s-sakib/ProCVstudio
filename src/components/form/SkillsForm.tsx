/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SkillCategory } from '../../types/cv';
import { Plus, Trash2, X, Wrench } from 'lucide-react';

interface SkillsFormProps {
  skillCategories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skillCategories, onChange }) => {
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `sc-${Date.now()}`,
      name: 'New Skill Category',
      skills: [],
    };
    onChange([...skillCategories, newCat]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    onChange(
      skillCategories.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    onChange(skillCategories.filter((c) => c.id !== id));
  };

  const handleAddSkill = (catId: string) => {
    const raw = newSkillInputs[catId] || '';
    if (!raw.trim()) return;

    // Support comma-separated additions
    const toAdd = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onChange(
      skillCategories.map((c) => {
        if (c.id !== catId) return c;
        const current = new Set(c.skills);
        toAdd.forEach((item) => current.add(item));
        return { ...c, skills: Array.from(current) };
      })
    );

    setNewSkillInputs((prev) => ({ ...prev, [catId]: '' }));
  };

  const handleRemoveSkill = (catId: string, skillToRemove: string) => {
    onChange(
      skillCategories.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.filter((s) => s !== skillToRemove),
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Skills & Competencies</h3>
          <p className="text-xs text-slate-500">Group skills into structured categories (e.g. Languages, Frameworks, Cloud, Tools).</p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill Category</span>
        </button>
      </div>

      {skillCategories.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No skill categories defined yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Skill Category" to categorize technical and domain tools.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
                  placeholder="Category Name (e.g. Programming Languages, BI Tools, Soft Skills)"
                  className="font-bold text-xs text-slate-900 px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded"
                  title="Remove category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag Badges list */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 rounded-lg border border-slate-200">
                {cat.skills.length === 0 && (
                  <span className="text-[11px] text-slate-400 italic">No skills added yet. Type below and press Enter.</span>
                )}
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs bg-white text-slate-800 rounded border border-slate-300 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(cat.id, skill)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillInputs[cat.id] || ''}
                  onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [cat.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(cat.id);
                    }
                  }}
                  placeholder="Type skill name or comma-separated items (e.g. Python, SQL, Tableau) and press Enter"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(cat.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
