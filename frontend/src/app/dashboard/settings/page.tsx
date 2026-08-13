'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useTheme } from '@/context/ThemeContext';
import { Settings, Palette, Type, Upload, Check, Save, ShieldAlert } from 'lucide-react';

export default function SystemSettingsPage() {
  const { settings, refreshSettings } = useTheme();

  const [themePreset, setThemePreset] = useState(settings.themePreset || 'SlateIndigo');
  const [fontFamily, setFontFamily] = useState(settings.fontFamily || 'Inter');
  const [institutionName, setInstitutionName] = useState(settings.institutionName || 'OnnoRokom College');
  const [maxUploadMb, setMaxUploadMb] = useState((settings.maxUploadSizeBytes / (1024 * 1024)).toString() || '5');
  const [allowedExtensions, setAllowedExtensions] = useState(settings.allowedExtensions?.join(', ') || '.pdf, .docx, .zip, .txt');
  const [latePenalty, setLatePenalty] = useState(settings.latePenaltyPercentPerDay?.toString() || '5');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setThemePreset(settings.themePreset || 'SlateIndigo');
    setFontFamily(settings.fontFamily || 'Inter');
    setInstitutionName(settings.institutionName || 'OnnoRokom College');
    setMaxUploadMb((settings.maxUploadSizeBytes / (1024 * 1024)).toString() || '5');
    setAllowedExtensions(settings.allowedExtensions?.join(', ') || '.pdf, .docx, .zip, .txt');
    setLatePenalty(settings.latePenaltyPercentPerDay?.toString() || '5');
  }, [settings]);

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const extList = allowedExtensions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        themePreset,
        fontFamily,
        institutionName,
        maxUploadSizeBytes: Math.round(parseFloat(maxUploadMb) * 1024 * 1024),
        allowedExtensions: extList,
        latePenaltyPercentPerDay: parseFloat(latePenalty),
      };

      await apiClient.put('/settings', payload);
      await refreshSettings();

      setSuccessMsg('Application settings saved & dynamic themes refreshed successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save system settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const themeOptions = [
    { name: 'SlateIndigo', label: 'Slate & Indigo', color: '#6366f1' },
    { name: 'CorporateBlue', label: 'Corporate Blue', color: '#0284c7' },
    { name: 'EmeraldTeal', label: 'Emerald Teal', color: '#10b981' },
    { name: 'AmberSunset', label: 'Amber Sunset', color: '#f59e0b' },
    { name: 'DarkViolet', label: 'Dark Violet', color: '#8b5cf6' },
  ];

  const fontOptions = ['Inter', 'Plus Jakarta Sans', 'Roboto', 'Outfit'];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--primary)]" /> Application Settings Engine
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Configure brand themes, typography, institution branding, and global assignment upload policies.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveAll()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-white font-semibold text-sm shadow-lg shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save All Settings
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
          <ShieldAlert className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Brand & UI Theme Settings Section */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Palette className="w-5 h-5 text-[var(--primary)]" /> Brand & UI Theme Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Preset Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Theme Preset
              </label>
              <select
                value={themePreset}
                onChange={(e) => setThemePreset(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                {themeOptions.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.label} ({t.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Font Family Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme Color Cards Selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Color Palette Preview
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {themeOptions.map((t) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => setThemePreset(t.name)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    themePreset === t.name
                      ? 'border-[var(--primary)] bg-[var(--primary-glow)] ring-2 ring-[var(--primary)]/50'
                      : 'border-[var(--border-color)] bg-[var(--bg-main)]/50 hover:border-[var(--primary)]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: t.color }}></span>
                    <span className="text-sm font-semibold text-[var(--text-main)]">{t.label}</span>
                  </div>
                  {themePreset === t.name && <Check className="w-4 h-4 text-[var(--primary)]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Institution Branding Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Institution Name (Live Application Header Update)
            </label>
            <input
              type="text"
              required
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. OnnoRokom College"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>

        {/* Global Assignment Policies Section */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Upload className="w-5 h-5 text-indigo-400" /> Global Assignment Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Upload Size (MB) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Max Upload File Size (MB)
              </label>
              <input
                type="number"
                required
                min="1"
                max="500"
                value={maxUploadMb}
                onChange={(e) => setMaxUploadMb(e.target.value)}
                placeholder="e.g. 5, 10, 20"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Allowed Extensions */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Allowed File Extensions (Comma Separated)
              </label>
              <input
                type="text"
                required
                value={allowedExtensions}
                onChange={(e) => setAllowedExtensions(e.target.value)}
                placeholder="e.g. .pdf,.docx,.zip"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Late Penalty Percent Per Day */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Late Penalty (% Per Day)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={latePenalty}
                onChange={(e) => setLatePenalty(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Action Bar */}
        <div className="glass-panel p-4 flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Changes persist directly in PostgreSQL database and trigger instant ThemeContext refresh.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-white font-semibold text-sm shadow-lg shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
