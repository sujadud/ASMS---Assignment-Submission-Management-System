'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import apiClient from '@/lib/apiClient';
import { 
  SystemOverview, 
  User, 
  Classroom, 
  Subject, 
  Assignment, 
  StudentAssignment, 
  StudentSubmission 
} from '@/types';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Shield, 
  Award, 
  Clock, 
  ExternalLink, 
  Calendar, 
  Layers, 
  Activity, 
  FileCheck, 
  AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { settings } = useTheme();
  const [loading, setLoading] = useState(true);

  // Admin Data
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminClassrooms, setAdminClassrooms] = useState<Classroom[]>([]);
  const [adminSubjects, setAdminSubjects] = useState<Subject[]>([]);

  // Teacher Data
  const [teacherAssignments, setTeacherAssignments] = useState<Assignment[]>([]);
  const [teacherClassrooms, setTeacherClassrooms] = useState<Classroom[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<Subject[]>([]);

  // Student Data
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);

  const isAdmin = user?.role === 'Admin' || (user?.role as any) === 1;
  const isTeacher = user?.role === 'Teacher' || (user?.role as any) === 2;
  const isStudent = user?.role === 'Student' || (user?.role as any) === 3;

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    if (isAdmin) {
      Promise.all([
        apiClient.get<SystemOverview>('/admin/overview').catch(() => null),
        apiClient.get<User[]>('/admin/users').catch(() => ({ data: [] })),
        apiClient.get<Classroom[]>('/admin/classrooms').catch(() => ({ data: [] })),
        apiClient.get<Subject[]>('/admin/subjects').catch(() => ({ data: [] })),
      ])
        .then(([oRes, uRes, cRes, sRes]) => {
          if (oRes?.data) setOverview(oRes.data);
          if (uRes?.data) setAdminUsers(uRes.data);
          if (cRes?.data) setAdminClassrooms(cRes.data);
          if (sRes?.data) setAdminSubjects(sRes.data);
        })
        .finally(() => setLoading(false));
    } else if (isTeacher) {
      Promise.all([
        apiClient.get<Assignment[]>('/teacher/assignments').catch(() => ({ data: [] })),
        apiClient.get<Classroom[]>('/teacher/classrooms').catch(() => ({ data: [] })),
        apiClient.get<Subject[]>('/teacher/subjects').catch(() => ({ data: [] })),
      ])
        .then(([aRes, cRes, sRes]) => {
          if (aRes?.data) setTeacherAssignments(aRes.data);
          if (cRes?.data) setTeacherClassrooms(cRes.data);
          if (sRes?.data) setTeacherSubjects(sRes.data);
        })
        .finally(() => setLoading(false));
    } else if (isStudent) {
      Promise.all([
        apiClient.get<StudentAssignment[]>('/student/assignments').catch(() => ({ data: [] })),
        apiClient.get<StudentSubmission[]>('/student/submissions').catch(() => ({ data: [] })),
      ])
        .then(([aRes, sRes]) => {
          if (aRes?.data) setStudentAssignments(aRes.data);
          if (sRes?.data) setStudentSubmissions(sRes.data);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, isTeacher, isStudent]);

  if (!user) return null;

  // Render Skeleton Loading
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-24 bg-[var(--bg-sidebar)]/50 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[var(--bg-sidebar)]/50 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-[var(--bg-sidebar)]/50 rounded-2xl w-full"></div>
      </div>
    );
  }

  // Derived Admin Metrics
  const totalStudentsCount = adminUsers.filter((u) => u.role === 'Student' || (u.role as any) === 3).length || overview?.totalStudents || 0;
  const totalTeachersCount = adminUsers.filter((u) => u.role === 'Teacher' || (u.role as any) === 2).length || overview?.totalTeachers || 0;
  const totalClassroomsCount = adminClassrooms.length || overview?.totalClassrooms || 0;
  const totalSubjectsCount = adminSubjects.length || overview?.totalSubjects || 0;

  // Derived Teacher Metrics
  const teacherClassCount = teacherClassrooms.length;
  const teacherStudentCount = teacherClassrooms.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const publishedAssignmentsCount = teacherAssignments.filter((a) => a.isPublished).length;
  const pendingGradingCount = teacherAssignments.reduce((acc, a) => acc + (a.submissionCount || 0), 0);

  // Derived Student Metrics
  const studentUniqueCoursesCount = Array.from(new Set(studentAssignments.map((a) => a.subjectName))).length;
  const upcomingStudentTasksCount = studentAssignments.filter((a) => !a.hasSubmitted && new Date(a.deadline) > new Date()).length;
  const submittedStudentTasksCount = studentSubmissions.length;
  const gradedSubmissions = studentSubmissions.filter((s) => s.marksObtained !== null && s.marksObtained !== undefined);
  const averageGradeFormatted = gradedSubmissions.length > 0
    ? (gradedSubmissions.reduce((acc, curr) => acc + ((curr.marksObtained! / curr.maxMarks) * 100), 0) / gradedSubmissions.length).toFixed(0) + '%'
    : 'N/A';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 🔴 ADMIN OVERVIEW */}
      {isAdmin && (
        <>
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
              <ExternalLink className="w-4 h-4" /> System Settings
            </Link>
          </div>

          {/* 4 Dynamic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Students</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{totalStudentsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Teachers</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{totalTeachersCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Active Classes</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{totalClassroomsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Courses</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{totalSubjectsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Classrooms List Widget */}
            <div className="lg:col-span-6 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Classroom Enrollment Overview</h3>
              {adminClassrooms.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-muted)]">No active classrooms configured yet.</div>
              ) : (
                <div className="space-y-3">
                  {adminClassrooms.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[var(--bg-main)]/50 border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm text-[var(--text-main)]">{c.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">Academic Year: {c.academicYear}</div>
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {c.studentCount} Students
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3 glass-panel p-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <Link
                  href="/dashboard/users"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Manage System Users
                </Link>
                <Link
                  href="/dashboard/academics"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Manage Academic Setup
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Configure System Settings
                </Link>
              </div>
            </div>

            {/* Dynamic System Activity */}
            <div className="lg:col-span-3 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Recent System Activity</h3>
              <div className="space-y-3 text-xs">
                {adminUsers.slice(0, 4).map((u) => (
                  <div key={u.id} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--bg-main)]/40">
                    <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-400 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--text-main)]">{u.fullName}</div>
                      <div className="text-[var(--text-muted)] text-[10px]">
                        Registered as <span className="font-semibold text-[var(--primary)]">{u.role}</span>
                      </div>
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
          <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
                Welcome, {user.fullName}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {settings.institutionName} • Assignment & Submission Management System
              </p>
            </div>
            <Link
              href="/dashboard/assignments"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Layers className="w-4 h-4" /> Manage Assignments
            </Link>
          </div>

          {/* 4 Dynamic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Assigned Classes</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{teacherClassCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Total Students</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{teacherStudentCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Published Assignments</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{publishedAssignmentsCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Submissions Received</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{pendingGradingCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Class & Assignment Overview Table */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Class & Assignment Overview</h3>
            {teacherAssignments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No assignments created yet. Click "Manage Assignments" above to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Classroom</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Assignment Title</th>
                      <th className="py-3 px-4">Submissions</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {teacherAssignments.map((a) => (
                      <tr key={a.id} className="hover:bg-[var(--border-color)]/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[var(--text-main)]">{a.classroomName}</td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">{a.subjectName}</td>
                        <td className="py-3 px-4 text-[var(--text-main)] font-medium">{a.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {a.submissionCount} Submissions
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-[var(--text-muted)]">
                          {new Date(a.deadline).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                            a.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {a.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/dashboard/submissions?assignmentId=${a.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block"
                          >
                            Review Submissions
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-4 glass-panel p-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-4">Quick Actions</h3>
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <Link
                  href="/dashboard/assignments"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Create New Assignment
                </Link>
                <Link
                  href="/dashboard/submissions"
                  className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold text-center shadow transition-all"
                >
                  Review & Grade Submissions
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="lg:col-span-8 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Upcoming Assignment Deadlines</h3>
              {teacherAssignments.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">No active deadlines.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {teacherAssignments
                    .slice()
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 4)
                    .map((a) => {
                      const isPast = new Date() > new Date(a.deadline);
                      return (
                        <div
                          key={a.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            isPast ? 'border-rose-500 bg-rose-500/5' : 'border-amber-500 bg-amber-500/5'
                          }`}
                        >
                          <div className="font-semibold text-[var(--text-main)] truncate">{a.title}</div>
                          <div className="text-[var(--text-muted)] mt-1 flex items-center justify-between">
                            <span>{new Date(a.deadline).toLocaleString()}</span>
                            <span className={`font-semibold ${isPast ? 'text-rose-400' : 'text-amber-400'}`}>
                              {isPast ? 'Past Due' : 'Active'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 🟢 STUDENT OVERVIEW */}
      {isStudent && (
        <>
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
              <Calendar className="w-4 h-4" /> My Class Feed
            </Link>
          </div>

          {/* 4 Dynamic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Enrolled Subjects</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{studentUniqueCoursesCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Upcoming Tasks</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{upcomingStudentTasksCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Submitted Tasks</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{submittedStudentTasksCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[var(--text-muted)]">Average Grade</div>
                <div className="text-3xl font-black text-[var(--text-main)] mt-1">{averageGradeFormatted}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Assignments & Submission Status Table */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-main)]">Assignments & Submission Status</h3>
            {studentAssignments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                No assignments published for your classroom yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Task Title</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {studentAssignments.map((a) => {
                      const isPast = new Date() > new Date(a.deadline);
                      const isGraded = a.hasSubmitted && a.submissionStatus === 'Evaluated';

                      return (
                        <tr key={a.id} className="hover:bg-[var(--border-color)]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[var(--text-main)]">{a.subjectName}</td>
                          <td className="py-3 px-4 text-[var(--text-main)] font-medium">{a.title}</td>
                          <td className="py-3 px-4 text-xs text-[var(--text-muted)]">
                            {new Date(a.deadline).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            {isGraded ? (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Graded ({a.marksObtained !== null && a.marksObtained !== undefined ? Math.round((a.marksObtained / a.maxMarks) * 100) : 100}%)
                              </span>
                            ) : a.hasSubmitted ? (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                Submitted
                              </span>
                            ) : isPast ? (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Overdue
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {a.hasSubmitted ? (
                              <Link
                                href="/dashboard/results"
                                className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block"
                              >
                                View Grade
                              </Link>
                            ) : (
                              <Link
                                href="/dashboard/my-assignments"
                                className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-all inline-block"
                              >
                                Submit
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-4 glass-panel p-6 flex flex-col justify-between">
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
                  Check Gradebook & Feedback
                </Link>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="lg:col-span-8 glass-panel p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-main)]">Upcoming Deadlines</h3>
              {studentAssignments.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">No active deadlines.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {studentAssignments
                    .filter((a) => !a.hasSubmitted)
                    .slice()
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 4)
                    .map((a) => {
                      const isPast = new Date() > new Date(a.deadline);
                      return (
                        <div
                          key={a.id}
                          className={`p-3 rounded-lg border-l-4 ${
                            isPast ? 'border-rose-500 bg-rose-500/5' : 'border-amber-500 bg-amber-500/5'
                          }`}
                        >
                          <div className="font-semibold text-[var(--text-main)] truncate">{a.title} ({a.subjectName})</div>
                          <div className="text-[var(--text-muted)] mt-1 flex items-center justify-between">
                            <span>{new Date(a.deadline).toLocaleString()}</span>
                            <span className={`font-semibold ${isPast ? 'text-rose-400' : 'text-amber-400'}`}>
                              {isPast ? 'Past Due' : 'Active'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
