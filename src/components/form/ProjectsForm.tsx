/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProjectItem } from '../../types/cv';
import { Plus, Trash2, ArrowUp, ArrowDown, FolderGit2 } from 'lucide-react';

interface ProjectsFormProps {
  projects: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      startDate: '',
      endDate: '',
    };
    onChange([...projects, newItem]);
  };

  const handleUpdate = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      projects.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const items = [...projects];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Projects & Publications</h3>
          <p className="text-xs text-slate-500">Showcase technical builds, machine learning systems, or research papers.</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-600 font-medium">No projects added yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Project" to showcase key software or research work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1} {proj.name || 'New Project'}
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
                    disabled={index === projects.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(proj.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                    placeholder="e.g. Customer Churn Predictor & Retention Engine"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Technologies Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => handleUpdate(proj.id, 'technologies', e.target.value)}
                    placeholder="e.g. Python, Scikit-Learn, XGBoost, FastAPI, Streamlit, Docker"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Live Demo / Publication URL
                  </label>
                  <input
                    type="url"
                    value={proj.projectUrl || ''}
                    onChange={(e) => handleUpdate(proj.id, 'projectUrl', e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    GitHub / Source Code Repository URL
                  </label>
                  <input
                    type="url"
                    value={proj.githubUrl || ''}
                    onChange={(e) => handleUpdate(proj.id, 'githubUrl', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={proj.startDate || ''}
                    onChange={(e) => handleUpdate(proj.id, 'startDate', e.target.value)}
                    placeholder="e.g. Jan 2024"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="text"
                    value={proj.endDate || ''}
                    onChange={(e) => handleUpdate(proj.id, 'endDate', e.target.value)}
                    placeholder="e.g. Apr 2024"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Project Description & Impact
                  </label>
                  <textarea
                    rows={3}
                    value={proj.description}
                    onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
                    placeholder="Describe what the system solves, dataset size, architecture highlights, or benchmark results..."
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
