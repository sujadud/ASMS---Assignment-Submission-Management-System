'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Classroom, Subject } from '@/types';
import { BookOpen, School, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function AcademicsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Classroom Modal
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  // Subject Modal
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        apiClient.get<Classroom[]>('/admin/classrooms'),
        apiClient.get<Subject[]>('/admin/subjects'),
      ]);
      setClassrooms(cRes.data);
      setSubjects(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Classroom Handlers
  const handleSaveClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClassId) {
        await apiClient.put(`/admin/classrooms/${editingClassId}`, { name: className, academicYear });
      } else {
        await apiClient.post('/admin/classrooms', { name: className, academicYear });
      }
      setShowClassModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClassroom = async (id: string) => {
    if (!confirm('Delete classroom?')) return;
    try {
      await apiClient.delete(`/admin/classrooms/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Subject Handlers
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubjectId) {
        await apiClient.put(`/admin/subjects/${editingSubjectId}`, { name: subjectName, code: subjectCode });
      } else {
        await apiClient.post('/admin/subjects', { name: subjectName, code: subjectCode });
      }
      setShowSubjectModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Delete subject?')) return;
    try {
      await apiClient.delete(`/admin/subjects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[var(--primary)]" /> Academic Mapping
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage Classrooms, Courses, and Academic Curriculum Subjects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Classrooms Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <School className="w-5 h-5 text-purple-400" /> Classrooms & Courses
            </h2>
            <button
              onClick={() => {
                setEditingClassId(null);
                setClassName('');
                setAcademicYear('2026');
                setShowClassModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Class
            </button>
          </div>

          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]/50 text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="p-3.5">Classroom Name</th>
                  <th className="p-3.5">Academic Year</th>
                  <th className="p-3.5">Students</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {classrooms.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--border-color)]/20">
                    <td className="p-3.5 font-semibold text-[var(--text-main)]">{c.name}</td>
                    <td className="p-3.5 text-[var(--text-muted)]">{c.academicYear}</td>
                    <td className="p-3.5 text-[var(--text-muted)]">{c.studentCount} students</td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingClassId(c.id);
                          setClassName(c.name);
                          setAcademicYear(c.academicYear);
                          setShowClassModal(true);
                        }}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClassroom(c.id)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Academic Subjects
            </h2>
            <button
              onClick={() => {
                setEditingSubjectId(null);
                setSubjectName('');
                setSubjectCode('');
                setShowSubjectModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
          </div>

          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]/50 text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="p-3.5">Subject Code</th>
                  <th className="p-3.5">Subject Title</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--border-color)]/20">
                    <td className="p-3.5 font-mono font-semibold text-[var(--primary)]">{s.code}</td>
                    <td className="p-3.5 text-[var(--text-main)]">{s.name}</td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingSubjectId(s.id);
                          setSubjectName(s.name);
                          setSubjectCode(s.code);
                          setShowSubjectModal(true);
                        }}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(s.id)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Classroom Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button onClick={() => setShowClassModal(false)} className="absolute right-4 top-4 text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">
              {editingClassId ? 'Edit Classroom' : 'Create Classroom'}
            </h3>
            <form onSubmit={handleSaveClassroom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Classroom Name</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Class 10-A"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Academic Year</label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button onClick={() => setShowSubjectModal(false)} className="absolute right-4 top-4 text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">
              {editingSubjectId ? 'Edit Subject' : 'Create Subject'}
            </h3>
            <form onSubmit={handleSaveSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="MATH101"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Mathematics"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
