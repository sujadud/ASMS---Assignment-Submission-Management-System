'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme, ThemeMode } from '@/context/ThemeContext';
import { 
  LogOut, 
  Shield, 
  GraduationCap, 
  BookOpen, 
  Sun, 
  Moon, 
  Monitor, 
  ChevronDown 
} from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings, themeMode, setThemeMode } = useTheme();

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: string | number) => {
    const roleStr = typeof role === 'number' 
      ? (role === 1 ? 'Admin' : role === 2 ? 'Teacher' : 'Student')
      : role;

    switch (roleStr) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Shield className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'Teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-3.5 h-3.5" /> Teacher
          </span>
        );
      case 'Student':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" /> Student
          </span>
        );
      default:
        return null;
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      default:
        return <Monitor className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-[var(--border-color)] px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[var(--primary-glow)] transition-transform group-hover:scale-105">
            A
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
              ASMS Portal
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {settings.institutionName}
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Topbar Theme Mode Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--border-color)]/30 hover:scale-105 transition-all flex items-center justify-center"
            title={`Switch Theme Mode (Current: ${themeMode})`}
          >
            {getThemeIcon()}
          </button>

          {themeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 glass-panel p-1.5 shadow-xl border border-[var(--border-color)] z-50 animate-fade-in flex flex-col gap-1">
              <button
                type="button"
                onClick={() => { setThemeMode('system'); setThemeDropdownOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  themeMode === 'system' 
                    ? 'bg-[var(--primary)] text-white font-semibold' 
                    : 'text-[var(--text-main)] hover:bg-[var(--border-color)]/30'
                }`}
              >
                <Monitor className="w-4 h-4" />
                System
              </button>

              <button
                type="button"
                onClick={() => { setThemeMode('light'); setThemeDropdownOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  themeMode === 'light' 
                    ? 'bg-[var(--primary)] text-white font-semibold' 
                    : 'text-[var(--text-main)] hover:bg-[var(--border-color)]/30'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>

              <button
                type="button"
                onClick={() => { setThemeMode('dark'); setThemeDropdownOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  themeMode === 'dark' 
                    ? 'bg-[var(--primary)] text-white font-semibold' 
                    : 'text-[var(--text-main)] hover:bg-[var(--border-color)]/30'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-[var(--text-main)]">
                {user.fullName}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {user.email}
              </div>
            </div>
            
            {getRoleBadge(user.role)}

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
