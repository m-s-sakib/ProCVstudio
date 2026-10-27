/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CustomizationOptions, FontFamily, FontSize, Spacing, TemplateId } from '../types/cv';
import { Palette, Type, Layout, Check } from 'lucide-react';

interface CustomizationPanelProps {
  customization: CustomizationOptions;
  onChange: (updated: CustomizationOptions) => void;
}

const ACCENT_COLORS = [
  { name: 'Classic Navy', value: '#0f2b48' },
  { name: 'Royal Blue', value: '#1e40af' },
  { name: 'Deep Slate', value: '#1e293b' },
  { name: 'Forest Emerald', value: '#065f46' },
  { name: 'Burgundy Wine', value: '#831843' },
  { name: 'Charcoal Black', value: '#18181b' },
];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ customization, onChange }) => {
  const update = (key: keyof CustomizationOptions, val: any) => {
    onChange({
      ...customization,
      [key]: val,
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>Styling & Typography Controls</span>
        </h3>
      </div>

      {/* Template Choice */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
          <Layout className="w-3.5 h-3.5 text-slate-500" />
          <span>Select Template Style</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'academic', title: 'Academic Serif', subtitle: 'Compact & Scholarly' },
            { id: 'data-analyst', title: 'Data Analyst', subtitle: 'Modern & Clean' },
            { id: 'premium-navy', title: 'Premium Navy', subtitle: 'Executive & Polished' },
            { id: 'ats', title: 'ATS Minimal', subtitle: 'Single-Column Linear' },
            { id: 'europass', title: 'Europass CV', subtitle: 'EU Official 2-Column' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update('templateId', t.id as TemplateId)}
              className={`p-2.5 rounded-lg border text-left transition-all relative ${
                customization.templateId === t.id
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">{t.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{t.subtitle}</div>
              {customization.templateId === t.id && (
                <div className="absolute top-2 right-2 text-blue-600">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Typography / Font Pairing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span>Font Family</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'modern', name: 'Plus Jakarta Sans', fontClass: 'font-modern' },
              { id: 'academic', name: 'Merriweather Serif', fontClass: 'font-academic' },
              { id: 'editorial', name: 'Cormorant Garamond', fontClass: 'font-editorial' },
              { id: 'mono', name: 'JetBrains Code', fontClass: 'font-mono-code' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => update('fontFamily', f.id as FontFamily)}
                className={`px-3 py-2 text-xs rounded-lg border text-left truncate transition-colors ${
                  customization.fontFamily === f.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={f.fontClass}>{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-500" />
            <span>Accent Theme Color</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => update('accentColor', c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                  customization.accentColor === c.value
                    ? 'ring-2 ring-offset-2 ring-blue-600 scale-110'
                    : 'hover:scale-105'
                }`}
                title={c.name}
              >
                {customization.accentColor === c.value && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sizing & Spacing Optimization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Font Scale
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sm', label: 'Compact' },
              { id: 'base', label: 'Standard' },
              { id: 'lg', label: 'Large' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => update('fontSize', s.id as FontSize)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  customization.fontSize === s.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Document Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'compact', label: 'Tight' },
              { id: 'normal', label: 'Balanced' },
              { id: 'relaxed', label: 'Spacious' },
            ].map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => update('spacing', sp.id as Spacing)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                  customization.spacing === sp.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
