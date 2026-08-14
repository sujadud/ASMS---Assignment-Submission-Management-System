'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Assignment, Classroom, Subject } from '@/types';
import { FileText, Plus, Calendar, CheckCircle2, Clock, Trash2, Edit2, X, Eye } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [isPublished, setIsPublished] = useState(true);
  const [classroomId, setClassroomId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aRes, cRes, sRes] = await Promise.all([
        apiClient.get<Assignment[]>('/teacher/assignments'),
        apiClient.get<Classroom[]>('/teacher/classrooms'),
        apiClient.get<Subject[]>('/teacher/subjects'),
      ]);
      setAssignments(aRes.data);
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

  const openCreateModal = async () => {
    let currentClassrooms = classrooms;
    let currentSubjects = subjects;
    if (currentClassrooms.length === 0 || currentSubjects.length === 0) {
      try {
        const [cRes, sRes] = await Promise.all([
          apiClient.get<Classroom[]>('/teacher/classrooms'),
          apiClient.get<Subject[]>('/teacher/subjects'),
        ]);
        currentClassrooms = cRes.data;
        currentSubjects = sRes.data;
        setClassrooms(currentClassrooms);
        setSubjects(currentSubjects);
      } catch (e) {
        console.error(e);
      }
    }

    setEditingId(null);
    setTitle('');
    setDescription('');
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setMaxMarks('100');
    setIsPublished(true);
    setClassroomId(currentClassrooms[0]?.id || '');
    setSubjectId(currentSubjects[0]?.id || '');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (a: Assignment) => {
    setEditingId(a.id);
    setTitle(a.title);
    setDescription(a.description);
    setDeadline(new Date(a.deadline).toISOString().slice(0, 16));
    setMaxMarks(a.maxMarks.toString());
    setIsPublished(a.isPublished);
    setClassroomId(a.classroomId);
    setSubjectId(a.subjectId);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        maxMarks: parseFloat(maxMarks),
        isPublished,
        classroomId,
        subjectId,
      };

      if (editingId) {
        await apiClient.put(`/teacher/assignments/${editingId}`, payload);
      } else {
        await apiClient.post('/teacher/assignments', payload);
      }

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save assignment.');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await apiClient.patch(`/teacher/assignments/${id}/publish`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await apiClient.delete(`/teacher/assignments/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[var(--primary)]" /> Assignment Management
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Create, edit, draft, publish, and track class academic assignments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Assignment Grid */}
      {loading ? (
        <div className="p-8 text-center text-[var(--text-muted)]">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="glass-panel p-12 text-center text-[var(--text-muted)]">
          No assignments found. Click "Create Assignment" above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((a) => (
            <div key={a.id} className="glass-panel p-6 space-y-4 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {a.subjectName} • {a.classroomName}
                  </span>

                  <button
                    onClick={() => handleTogglePublish(a.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      a.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {a.isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <h2 className="text-lg font-bold text-[var(--text-main)] line-clamp-1">{a.title}</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{a.description}</p>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  Due: <span className="text-[var(--text-main)] font-semibold">{new Date(a.deadline).toLocaleString()}</span>
                </div>

                <div className="font-semibold text-[var(--text-main)]">
                  Max Marks: {a.maxMarks}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/dashboard/submissions?assignmentId=${a.id}`}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Submissions ({a.submissionCount})
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-1.5 rounded text-[var(--text-muted)] hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-black/80 backdrop-blur-sm flex min-h-full items-center justify-center p-4 sm:p-6">
          {/* Modal Card */}
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[88vh] text-slate-100 animate-fade-in">
            {/* 1. Modal Fixed Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Assignment' : 'Create New Assignment'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Modal Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                {error && <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>}

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Description / Instructions</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Target Classroom</label>
                    <select
                      value={classroomId}
                      onChange={(e) => setClassroomId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                    >
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Subject</label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Deadline Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Max Marks</label>
                    <input
                      type="number"
                      required
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pubCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)]"
                  />
                  <label htmlFor="pubCheck" className="text-sm font-medium text-[var(--text-main)]">
                    Publish immediately for students
                  </label>
                </div>
              </div>

              {/* 3. Modal Fixed Footer Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-500/30"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
