'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicSettings } from '@/types';
import apiClient from '@/lib/apiClient';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  settings: PublicSettings;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: PublicSettings = {
  themePreset: 'SlateIndigo',
  fontFamily: 'Inter',
  institutionName: 'OnnoRokom College',
  maxUploadSizeBytes: 5242880,
  allowedExtensions: ['.pdf', '.docx', '.zip', '.txt'],
  latePenaltyPercentPerDay: 5,
};

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  themeMode: 'system',
  setThemeMode: () => {},
  refreshSettings: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const storedMode = localStorage.getItem('asms_theme_mode') as ThemeMode;
    if (storedMode && ['system', 'light', 'dark'].includes(storedMode)) {
      setThemeModeState(storedMode);
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('asms_theme_mode', mode);
  };

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get<PublicSettings>('/settings/public');
      if (res.data) {
        setSettings(res.data);
        applyTheme(res.data.themePreset, res.data.fontFamily);
      }
    } catch (err) {
      console.warn('Failed to fetch public settings, using defaults.', err);
      applyTheme(defaultSettings.themePreset, defaultSettings.fontFamily);
    }
  };

  const applyTheme = (theme: string, font: string) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font', font);

    const fontId = 'dynamic-google-font';
    let linkEl = document.getElementById(fontId) as HTMLLinkElement;
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = fontId;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }

    const formattedFont = font.replace(/\s+/g, '+');
    linkEl.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700&display=swap`;

    root.style.fontFamily = `'${font}', sans-serif`;
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const applyMode = () => {
      let isDark = true;
      if (themeMode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-mode', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-mode', 'light');
      }
    };

    applyMode();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyMode();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, themeMode, setThemeMode, refreshSettings: fetchSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
