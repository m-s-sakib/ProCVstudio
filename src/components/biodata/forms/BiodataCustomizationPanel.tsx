/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BiodataCustomization,
  BiodataTemplateId,
  BiodataColorTheme,
  BiodataFontFamily,
} from '../../../types/biodata';
import { Palette, Sparkles, Heart, BookOpen, Layers, Check } from 'lucide-react';

interface CustomizationPanelProps {
  customization: BiodataCustomization;
  onChange: <K extends keyof BiodataCustomization>(field: K, value: BiodataCustomization[K]) => void;
}

const TEMPLATES: { id: BiodataTemplateId; name: string; tag: string; description: string }[] = [
  {
    id: 'romantic-elegant',
    name: '1. Romantic Elegant',
    tag: 'Popular',
    description: 'Blush pink & rose gold borders, elegant serif typography, delicate heart accents.',
  },
  {
    id: 'traditional-islamic',
    name: '2. Traditional Islamic',
    tag: 'Spiritual',
    description: 'Bismillah calligraphy header, emerald & gold geometric motifs, Quranic quote.',
  },
  {
    id: 'modern-minimal',
    name: '3. Modern Minimal',
    tag: 'Contemporary',
    description: 'Clean ivory & slate layout, borderless refined grid, modern lifestyle aesthetic.',
  },
  {
    id: 'premium-floral',
    name: '4. Premium Floral',
    tag: 'Graceful',
    description: 'Botanical rose & sage greenery motifs, soft double dashed borders, vintage floral tone.',
  },
  {
    id: 'classic-family',
    name: '5. Classic Family Biodata',
    tag: 'Traditional',
    description: 'Royal maroon & gold ornate framing, structured 2-column ancestral roots & family layout.',
  },
];

export const BiodataCustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-rose-600" />
          <span>Templates & Styling</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select from 5 hand-crafted marriage biodata designs, typography, and personalized quotes.
        </p>
      </div>

      {/* Template Chooser */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-rose-600" />
          <span>Choose Marriage Biodata Template</span>
        </label>

        <div className="grid grid-cols-1 gap-2.5">
          {TEMPLATES.map((tmpl) => {
            const isSelected = customization.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onChange('templateId', tmpl.id);
                  if (tmpl.id === 'traditional-islamic') {
                    onChange('showBismillah', true);
                    onChange('title', 'Islamic Marriage Biodata');
                  }
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-rose-50/80 border-rose-500 shadow-xs ring-1 ring-rose-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{tmpl.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{tmpl.description}</p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Title & Heading Text */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Document Header Title
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {['Marriage Biodata', 'Bio-Data For Marriage', 'Islamic Marriage Biodata'].map((titleOption) => (
            <button
              key={titleOption}
              type="button"
              onClick={() => onChange('title', titleOption)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                customization.title === titleOption
                  ? 'bg-rose-100 border-rose-300 text-rose-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {titleOption}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={customization.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. Marriage Biodata"
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Bismillah Header Controls */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Bismillah / Religious Header Calligraphy
          </label>
          <button
            type="button"
            onClick={() => onChange('showBismillah', !customization.showBismillah)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              customization.showBismillah
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            {customization.showBismillah ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {customization.showBismillah && (
          <div className="space-y-1.5 pt-1">
            <input
              type="text"
              value={customization.bismillahText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              onChange={(e) => onChange('bismillahText', e.target.value)}
              placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-center font-serif text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Subtitle Quote / Motto */}
      <div className="space-y-2 pt-4 border-t border-slate-200">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Subtitle Motto / Ayah Quote</span>
        </label>
        <div className="flex flex-col gap-1.5 mb-2">
          {[
            '“Two souls with but a single thought, two hearts that beat as one.”',
            '“And We created you in pairs.” — Surah An-Naba 78:8',
            '“A blessed union of hearts, friendship, and shared aspirations.”',
          ].map((presetQuote) => (
            <button
              key={presetQuote}
              type="button"
              onClick={() => onChange('subtitleQuote', presetQuote)}
              className="text-left text-xs p-2 rounded border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 transition-colors text-slate-600 italic"
            >
              {presetQuote}
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          value={customization.subtitleQuote || ''}
          onChange={(e) => onChange('subtitleQuote', e.target.value)}
          placeholder="Enter a meaningful quote or prayer..."
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Typography Selector */}
      <div className="space-y-2 pt-4 border-t border-slate-200">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Typography Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'serif', label: 'Classic Serif' },
            { id: 'sans', label: 'Modern Sans' },
            { id: 'classic', label: 'Traditional' },
          ].map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onChange('fontFamily', font.id as BiodataFontFamily)}
              className={`p-2.5 rounded-lg border text-center transition-colors ${
                customization.fontFamily === font.id
                  ? 'bg-rose-100 border-rose-400 text-rose-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs">{font.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
