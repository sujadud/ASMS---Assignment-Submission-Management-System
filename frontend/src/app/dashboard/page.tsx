'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiClient from '@/lib/apiClient';
import { SystemOverview } from '@/types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  School, 
  FileText, 
  CheckSquare, 
  ArrowRight,
  Shield,
  Sparkles,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { settings } = useTheme();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin') {
      setLoading(true);
      apiClient.get<SystemOverview>('/admin/overview')
        .then((res) => setOverview(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-sidebar)] border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-64 h-64 rounded-full bg-[var(--primary-glow)] blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Welcome back
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              Hello, {user.fullName}!
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Role: <span className="font-semibold text-[var(--text-main)]">{user.role}</span> {user.classroomName ? `• Class: ${user.classroomName}` : ''} • {settings.institutionName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'Admin' && (
              <Link
                href="/dashboard/settings"
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Config Portal
              </Link>
            )}

            {user.role === 'Teacher' && (
              <Link
                href="/dashboard/assignments"
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> Manage Assignments
              </Link>
            )}

            {user.role === 'Student' && (
              <Link
                href="/dashboard/my-assignments"
                className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> View My Assignments
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Admin Stat Grid */}
      {user.role === 'Admin' && (
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--primary)]" /> System Performance Overview
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-panel p-5 h-28 animate-pulse bg-[var(--border-color)]/20"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalUsers || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Total Registered Users</div>
                </div>
              </div>

              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalTeachers || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Active Teachers</div>
                </div>
              </div>

              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalStudents || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Enrolled Students</div>
                </div>
              </div>

              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalClassrooms || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Classrooms & Courses</div>
                </div>
              </div>

              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalAssignments || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Assignments Created</div>
                </div>
              </div>

              <div className="glass-panel p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{overview?.totalSubmissions || 0}</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Student Submissions</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teacher Quick Actions */}
      {user.role === 'Teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/assignments" className="glass-panel p-6 group hover:border-[var(--primary)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Assignment Hub</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Create, edit, set deadlines, and draft/publish assignments for your classes.
            </p>
          </Link>

          <Link href="/dashboard/submissions" className="glass-panel p-6 group hover:border-[var(--primary)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckSquare className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Submission Evaluation Portal</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Review student uploaded files, check late submission status, assign marks & feedback.
            </p>
          </Link>
        </div>
      )}

      {/* Student Quick Actions */}
      {user.role === 'Student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/my-assignments" className="glass-panel p-6 group hover:border-[var(--primary)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Class Assignments Feed</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              View active homework & essays, check deadlines, and submit answer files.
            </p>
          </Link>

          <Link href="/dashboard/results" className="glass-panel p-6 group hover:border-[var(--primary)] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">My Gradebook & Feedback</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Track obtained scores, evaluation marks, and teacher remarks.
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
