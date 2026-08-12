'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useTheme } from '@/context/ThemeContext';
import { Settings, Palette, Type, Upload, Clock, Check, Save } from 'lucide-react';

export default function SystemSettingsPage() {
  const { settings, refreshSettings } = useTheme();

  const [themePreset, setThemePreset] = useState(settings.themePreset || 'SlateIndigo');
  const [fontFamily, setFontFamily] = useState(settings.fontFamily || 'Inter');
  const [institutionName, setInstitutionName] = useState(settings.institutionName || 'OnnoRokom College');
  const [maxUploadMb, setMaxUploadMb] = useState((settings.maxUploadSizeBytes / (1024 * 1024)).toString() || '5');
  const [allowedExtensions, setAllowedExtensions] = useState(settings.allowedExtensions?.join(', ') || '.pdf, .docx, .zip, .txt');
  const [latePenalty, setLatePenalty] = useState(settings.latePenaltyPercentPerDay?.toString() || '5');

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setThemePreset(settings.themePreset);
    setFontFamily(settings.fontFamily);
    setInstitutionName(settings.institutionName);
    setMaxUploadMb((settings.maxUploadSizeBytes / (1024 * 1024)).toString());
    setAllowedExtensions(settings.allowedExtensions?.join(', ') || '.pdf, .docx, .zip, .txt');
    setLatePenalty(settings.latePenaltyPercentPerDay?.toString());
  }, [settings]);

  const saveSetting = async (key: string, value: string) => {
    setSavingKey(key);
    setSuccessMsg('');
    try {
      await apiClient.put(`/admin/settings/${key}`, { value });
      await refreshSettings();
      setSuccessMsg(`Setting '${key}' updated successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKey(null);
    }
  };

  const themes = [
    { name: 'SlateIndigo', label: 'Slate & Indigo', color: '#6366f1' },
    { name: 'CorporateBlue', label: 'Corporate Blue & Teal', color: '#0284c7' },
    { name: 'EmeraldTeal', label: 'Emerald & Mint', color: '#10b981' },
    { name: 'AmberSunset', label: 'Amber & Bronze', color: '#f59e0b' },
    { name: 'DarkViolet', label: 'Electric Violet', color: '#8b5cf6' },
  ];

  const fonts = ['Inter', 'Plus Jakarta Sans', 'Roboto', 'Outfit'];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--primary)]" /> Configurable System Settings
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Dynamically alter application UI themes, font families, file upload constraints, and academic policy parameters in real-time without code changes.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Theme Switcher Card */}
      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[var(--primary)]" /> Dynamic UI Color Theme Preset
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Select a brand color palette preset. The frontend injects CSS variables instantly on update.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setThemePreset(t.name);
                saveSetting('ThemePreset', t.name);
              }}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                themePreset === t.name
                  ? 'border-[var(--primary)] bg-[var(--primary-glow)] ring-2 ring-[var(--primary)]/50'
                  : 'border-[var(--border-color)] bg-[var(--bg-main)]/50 hover:border-[var(--primary)]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }}></span>
                <span className="text-sm font-semibold text-[var(--text-main)]">{t.label}</span>
              </div>
              {themePreset === t.name && <Check className="w-4 h-4 text-[var(--primary)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family Card */}
      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Type className="w-5 h-5 text-accent" /> Global Font Family Engine
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFontFamily(f);
                saveSetting('FontFamily', f);
              }}
              className={`p-4 rounded-xl border text-center transition-all ${
                fontFamily === f
                  ? 'border-[var(--primary)] bg-[var(--primary-glow)] ring-2 ring-[var(--primary)]/50'
                  : 'border-[var(--border-color)] bg-[var(--bg-main)]/50 hover:border-[var(--primary)]/50'
              }`}
            >
              <div className="text-lg font-bold text-[var(--text-main)]" style={{ fontFamily: f }}>
                {f}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">Sample Typography</div>
            </button>
          ))}
        </div>
      </div>

      {/* Global Assignment Policy & Branding */}
      <div className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" /> Global Upload & Academic Policy Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
              Institution Branding Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
              />
              <button
                onClick={() => saveSetting('InstitutionName', institutionName)}
                disabled={savingKey === 'InstitutionName'}
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
              Maximum Upload File Size (MB)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
              />
              <button
                onClick={() => saveSetting('MaxUploadSizeBytes', (parseFloat(maxUploadMb) * 1024 * 1024).toString())}
                disabled={savingKey === 'MaxUploadSizeBytes'}
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
              Allowed Extension Whitelist (Comma Separated)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={allowedExtensions}
                onChange={(e) => setAllowedExtensions(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
              />
              <button
                onClick={() => saveSetting('AllowedExtensions', allowedExtensions)}
                disabled={savingKey === 'AllowedExtensions'}
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
              Late Submission Penalty (% Per Day)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={latePenalty}
                onChange={(e) => setLatePenalty(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)]"
              />
              <button
                onClick={() => saveSetting('LatePenaltyPercentPerDay', latePenalty)}
                disabled={savingKey === 'LatePenaltyPercentPerDay'}
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
