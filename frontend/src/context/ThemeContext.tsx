'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicSettings } from '@/types';
import apiClient from '@/lib/apiClient';

interface ThemeContextType {
  settings: PublicSettings;
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
  refreshSettings: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

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
    
    // Remove existing theme attribute
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font', font);

    // Apply font-family dynamically via Google Fonts if needed
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
    fetchSettings();
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
