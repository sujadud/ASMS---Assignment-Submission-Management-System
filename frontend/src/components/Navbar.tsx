'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LogOut, User as UserIcon, Shield, GraduationCap, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useTheme();

  const getRoleBadge = (role?: string) => {
    switch (role) {
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

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-[var(--border-color)] px-6 py-3.5 flex items-center justify-between">
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

      {user && (
        <div className="flex items-center gap-4">
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
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
