'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiClient from '@/lib/apiClient';
import { SystemOverview } from '@/types';
import { 
  Users, 
  UserCheck,
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  ArrowRight,
  Shield,
  Award,
  Clock,
  ExternalLink,
  Calendar,
  Layers,
  Activity,
  PlusCircle,
  FileCheck,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { settings } = useTheme();
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'Admin' || (user?.role as any) === 1;
  const isTeacher = user?.role === 'Teacher' || (user?.role as any) === 2;
  const isStudent = user?.role === 'Student' || (user?.role as any) === 3;

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      apiClient.get<SystemOverview>('/admin/overview')
        .then((res) => setOverview(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 🔴 ADMIN OVERVIEW */}
      {isAdmin && (
        <>
          {/* Header Banner */}
          <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Admin Overview
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {settings.institutionName} • Assignment & Submission Management System
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <ExternalLink className="w-4 h-4" /> View Portal
            </Link>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Students</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{overview?.totalStudents || '2,100'}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Teachers</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{overview?.totalTeachers || '30'}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Active Classes</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{overview?.totalClassrooms || '4'}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Courses</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{overview?.totalSubjects || '12'}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submission Trends Visual */}
            <div className="lg:col-span-6 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Submission Trends (This Week)</h3>
              <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--border-color)]">
                {[
                  { day: 'Sun', v1: 65, v2: 28 },
                  { day: 'Mon', v1: 108, v2: 66 },
                  { day: 'Tue', v1: 82, v2: 54 },
                  { day: 'Wed', v1: 135, v2: 118 },
                  { day: 'Thu', v1: 73, v2: 101 },
                  { day: 'Fri', v1: 101, v2: 72 },
                  { day: 'Sat', v1: 126, v2: 109 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        className="w-1/2 bg-[var(--primary)] rounded-t transition-all group-hover:brightness-110"
                        style={{ height: `${(item.v1 / 150) * 100}%` }}
                      ></div>
                      <div
                        className="w-1/2 bg-indigo-400/50 rounded-t transition-all group-hover:brightness-110"
                        style={{ height: `${(item.v2 / 150) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)] mt-1">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 glass-panel p-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <Link
                  href="/dashboard/users"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold text-center shadow transition-all"
                >
                  Add New Teacher
                </Link>
                <Link
                  href="/dashboard/academics"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold text-center shadow transition-all"
                >
                  Create New Class
                </Link>
              </div>
            </div>

            {/* Recent System Activity */}
            <div className="lg:col-span-3 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Recent System Activity</h3>
              <div className="space-y-3 text-xs">
                {[
                  { icon: ArrowRight, title: 'Adanamant System Activity', time: '3 hostes 4 hours ago' },
                  { icon: FileText, title: 'Assignment Submission Management System', time: '3 hostes 4 hours ago' },
                  { icon: Activity, title: 'Assignmonk System Assumed', time: '3 hostes 4 hours ago' },
                  { icon: Settings, title: 'Application Assignment Setting', time: '3 hostes 4 hours ago' },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--bg-main)]/40">
                    <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-400 mt-0.5">
                      <act.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-main)]">{act.title}</div>
                      <div className="text-[var(--text-muted)] text-[10px]">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🔵 TEACHER OVERVIEW */}
      {isTeacher && (
        <>
          {/* Header Banner */}
          <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Welcome, Dr. {user.fullName}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {settings.institutionName} • Assignment & Submission Management System
              </p>
            </div>
            <Link
              href="/dashboard/assignments"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Layers className="w-4 h-4" /> Class Overview
            </Link>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Assigned Classes</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">4</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Students</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">180</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Published Assignments</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">15</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Pending Grading</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">35</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Class & Assignment Overview Table */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Class & Assignment Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="py-3 px-4">Class Name</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Assignment Title</th>
                    <th className="py-3 px-4">Submission Rate</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">CSE-102 Task</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">Science Tempute</td>
                    <td className="py-3 px-4 text-[var(--text-main)]">Assignment Task</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[var(--bg-main)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                          <div className="bg-[var(--primary)] h-full w-[65%]"></div>
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-main)]">15</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">Aug 13, 2026</td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/dashboard/submissions" className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block">
                        Action
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">CSE-102 Task</td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">Science</td>
                    <td className="py-3 px-4 text-[var(--text-main)]">Assignment Task</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[var(--bg-main)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                          <div className="bg-[var(--primary)] h-full w-[85%]"></div>
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-main)]">23</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">Aug 10, 2026</td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/dashboard/submissions" className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block">
                        Action
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submission Progress Chart */}
            <div className="lg:col-span-5 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Submission Progress Chart</h3>
              <div className="flex items-center justify-around py-4">
                <div className="w-32 h-32 rounded-full border-8 border-indigo-500 border-t-emerald-400 border-r-amber-500 flex items-center justify-center font-black text-xl text-[var(--text-main)] shadow-inner">
                  75%
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span className="text-[var(--text-main)] font-medium">CSE-102 Task</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
                    <span className="text-[var(--text-muted)]">75% submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-[var(--text-muted)]">15% pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-[var(--text-muted)]">10% late</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 glass-panel p-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <Link
                  href="/dashboard/assignments"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Create New Assignment
                </Link>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Post Announcement
                </button>
                <Link
                  href="/dashboard/submissions"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Bulk Grading
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="lg:col-span-4 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Upcoming Deadlines</h3>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg border-l-4 border-amber-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">CSE-102 Data Structures Task</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 13, 2026 11:59 PM - <span className="text-amber-400 font-semibold">Amber</span></div>
                </div>
                <div className="p-2.5 rounded-lg border-l-4 border-rose-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">CSE-102 Data Structures Task</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 13, 2026 11:59 PM - <span className="text-rose-400 font-semibold">past due</span></div>
                </div>
                <div className="p-2.5 rounded-lg border-l-4 border-rose-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">CSE-102 Data Structures Task</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 11, 2026 11:59 PM - <span className="text-rose-400 font-semibold">past due</span></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🟢 STUDENT OVERVIEW */}
      {isStudent && (
        <>
          {/* Header Banner */}
          <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Hi, {user.fullName}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {settings.institutionName} • Assignment & Submission Management System
              </p>
            </div>
            <Link
              href="/dashboard/my-assignments"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Calendar className="w-4 h-4" /> View Calendar
            </Link>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">My Courses</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">4</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Upcoming Assignments</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">3</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Submitted Tasks</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">12</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Average Grade</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">88%</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Assignments & Submission Status Table */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Assignments & Submission Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Task Title</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">CSE-102</td>
                    <td className="py-3 px-4 text-[var(--text-main)]">Data Structures Task</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">Aug 13, 2026</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/dashboard/my-assignments" className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block">
                        Submit
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">ENG-201</td>
                    <td className="py-3 px-4 text-[var(--text-main)]">Literature Essay</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">Aug 15, 2026</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/dashboard/results" className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block">
                        View Grade
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[var(--text-main)]">CSE-102</td>
                    <td className="py-3 px-4 text-[var(--text-main)]">Assignment Task Cocontant</td>
                    <td className="py-3 px-4 text-xs text-[var(--text-muted)]">Aug 10, 2026</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
                        Graded <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 92%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/dashboard/results" className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block">
                        Review
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Assignment Completion Status Chart */}
            <div className="lg:col-span-5 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Assignment Completion Status</h3>
              <div className="flex items-center justify-around py-4">
                <div className="w-32 h-32 rounded-full border-8 border-indigo-500 border-t-amber-500 border-r-rose-500 flex items-center justify-center font-black text-xl text-[var(--text-main)] shadow-inner">
                  75%
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span className="text-[var(--text-main)] font-medium">Submitted 75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-[var(--text-muted)]">Pending 15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-[var(--text-muted)]">Overdue 10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 glass-panel p-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <Link
                  href="/dashboard/my-assignments"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Submit Assignment
                </Link>
                <Link
                  href="/dashboard/results"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Check Grades
                </Link>
                <Link
                  href="/dashboard/my-assignments"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  View Course Material
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="lg:col-span-4 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Upcoming Deadlines</h3>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg border-l-4 border-amber-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">CSE-102 Data Structures Task</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 13, 2026 11:59 PM - <span className="text-amber-400 font-semibold">Amber</span></div>
                </div>
                <div className="p-2.5 rounded-lg border-l-4 border-amber-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">ENG-201 Literature Essay</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 15, 2026 11:59 PM - <span className="text-amber-400 font-semibold">Amber</span></div>
                </div>
                <div className="p-2.5 rounded-lg border-l-4 border-rose-500 bg-[var(--bg-main)]/40">
                  <div className="font-semibold text-[var(--text-main)]">ENG-201 Literature Essay</div>
                  <div className="text-[var(--text-muted)] mt-0.5">Aug 11, 2026 11:59 PM - <span className="text-rose-400 font-semibold">Red</span></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
