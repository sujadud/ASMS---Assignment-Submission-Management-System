'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useTheme } from '@/context/ThemeContext';
import { StudentAssignment } from '@/types';
import { BookCheck, Calendar, Clock, Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

export default function StudentAssignmentsPage() {
  const { settings } = useTheme();
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<StudentAssignment[]>('/student/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openSubmitModal = (a: StudentAssignment) => {
    setSelectedAssignment(a);
    setFile(null);
    setError('');
    setSuccess('');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !file) return;

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post(`/student/assignments/${selectedAssignment.id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(res.data.message || 'File uploaded successfully.');
      setTimeout(() => {
        setSelectedAssignment(null);
        fetchAssignments();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload submission file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
          <BookCheck className="w-6 h-6 text-[var(--primary)]" /> My Class Assignments Feed
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          View assigned coursework tasks, monitor upcoming deadlines, and submit answer files
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--text-muted)]">Loading class assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="glass-panel p-12 text-center text-[var(--text-muted)]">
          No active assignments published for your classroom yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((a) => {
            const isPassedDeadline = new Date() > new Date(a.deadline);

            return (
              <div key={a.id} className="glass-panel p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {a.subjectName}
                    </span>

                    {a.hasSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                      </span>
                    ) : isPassedDeadline ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle className="w-3.5 h-3.5" /> Past Due
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-[var(--text-main)] line-clamp-1">{a.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-3">{a.description}</p>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[var(--primary)]" />
                      Deadline: <span className="text-[var(--text-main)] font-semibold">{new Date(a.deadline).toLocaleString()}</span>
                    </div>

                    <div className="font-semibold text-[var(--text-main)]">
                      Max Marks: {a.maxMarks}
                    </div>
                  </div>

                  {a.hasSubmitted && a.submittedFileName && (
                    <div className="p-2.5 rounded-lg bg-[var(--bg-main)]/60 border border-[var(--border-color)] text-xs text-[var(--text-muted)] flex items-center justify-between">
                      <span className="truncate">Attached: <strong className="text-[var(--text-main)]">{a.submittedFileName}</strong></span>
                      <span className="text-[10px] text-emerald-400">{new Date(a.submittedAt!).toLocaleDateString()}</span>
                    </div>
                  )}

                  <button
                    onClick={() => openSubmitModal(a)}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      a.hasSubmitted
                        ? 'bg-[var(--bg-sidebar)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--border-color)]/30'
                        : 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary-glow)] hover:opacity-95'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {a.hasSubmitted ? 'Resubmit Assignment File' : 'Submit Answer File'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload File Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative animate-fade-in">
            <button onClick={() => setSelectedAssignment(null)} className="absolute right-4 top-4 text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
              Submit Answer File
            </h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              {selectedAssignment.title} ({selectedAssignment.subjectName})
            </p>

            {error && <div className="mb-4 p-3 rounded bg-rose-500/10 text-rose-400 text-xs font-medium">{error}</div>}
            {success && <div className="mb-4 p-3 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium">{success}</div>}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="p-4 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-main)]/50 text-center space-y-2">
                <FileText className="w-8 h-8 mx-auto text-[var(--primary)]" />
                <div className="text-xs font-semibold text-[var(--text-main)]">
                  {file ? file.name : 'Select or drag answer file to upload'}
                </div>
                {file && (
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}
                <input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--primary)] file:text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-sidebar)] text-[11px] text-[var(--text-muted)] space-y-1">
                <div>• Allowed File Types: <strong className="text-[var(--text-main)]">{settings.allowedExtensions?.join(', ')}</strong></div>
                <div>• Maximum File Size: <strong className="text-[var(--text-main)]">{(settings.maxUploadSizeBytes / (1024 * 1024)).toFixed(1)} MB</strong></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedAssignment(null)} className="px-4 py-2 text-xs text-[var(--text-muted)]">Cancel</button>
                <button type="submit" disabled={uploading || !file} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg shadow-md">
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
