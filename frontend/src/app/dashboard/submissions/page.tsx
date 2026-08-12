'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { Assignment, SubmissionReview, SubmissionStatus } from '@/types';
import { CheckSquare, Download, Award, AlertTriangle, Check, X, FileText } from 'lucide-react';

export default function SubmissionsReviewPage() {
  const searchParams = useSearchParams();
  const initialAssignmentId = searchParams.get('assignmentId') || '';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId);
  const [submissions, setSubmissions] = useState<SubmissionReview[]>([]);
  const [loading, setLoading] = useState(false);

  // Evaluate Modal
  const [evaluatingSub, setEvaluatingSub] = useState<SubmissionReview | null>(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('Evaluated');
  const [evalLoading, setEvalLoading] = useState(false);

  useEffect(() => {
    apiClient.get<Assignment[]>('/teacher/assignments')
      .then((res) => {
        setAssignments(res.data);
        if (!selectedAssignmentId && res.data.length > 0) {
          setSelectedAssignmentId(res.data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const fetchSubmissions = async (aId: string) => {
    if (!aId) return;
    setLoading(true);
    try {
      const res = await apiClient.get<SubmissionReview[]>(`/teacher/assignments/${aId}/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAssignmentId) {
      fetchSubmissions(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const openEvalModal = (s: SubmissionReview) => {
    setEvaluatingSub(s);
    setMarks(s.marksObtained?.toString() || '');
    setFeedback(s.feedback || '');
    setStatus(s.status === 'Submitted' ? 'Evaluated' : s.status);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSub) return;
    setEvalLoading(true);

    try {
      await apiClient.post(`/teacher/submissions/${evaluatingSub.id}/evaluate`, {
        marksObtained: parseFloat(marks),
        feedback,
        status,
      });

      setEvaluatingSub(null);
      fetchSubmissions(selectedAssignmentId);
    } catch (err) {
      console.error(err);
    } finally {
      setEvalLoading(false);
    }
  };

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[var(--primary)]" /> Submission Review & Evaluation
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Review student answer file uploads, check late status, award marks, and provide feedback.
        </p>
      </div>

      {/* Assignment Selector */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-[var(--text-main)]">Select Assignment:</span>
        </div>

        <select
          value={selectedAssignmentId}
          onChange={(e) => setSelectedAssignmentId(e.target.value)}
          className="px-3.5 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] max-w-md w-full"
        >
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} ({a.classroomName} • {a.subjectName})
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Table */}
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">Loading student submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            No submissions recorded for this assignment yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]/50 text-xs font-semibold uppercase text-[var(--text-muted)]">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Submitted File</th>
                  <th className="p-4">Submission Time</th>
                  <th className="p-4">Status & Late Info</th>
                  <th className="p-4">Score</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--border-color)]/20">
                    <td className="p-4">
                      <div className="font-semibold text-[var(--text-main)]">{s.studentName}</div>
                      <div className="text-xs text-[var(--text-muted)]">{s.studentEmail}</div>
                    </td>

                    <td className="p-4">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/student/download/${s.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline bg-[var(--primary-glow)] px-2.5 py-1 rounded-md border border-[var(--primary)]/20"
                      >
                        <Download className="w-3.5 h-3.5" /> {s.originalFileName}
                      </a>
                    </td>

                    <td className="p-4 text-xs text-[var(--text-muted)]">
                      {new Date(s.submittedAt).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit ${
                          s.status === 'Evaluated'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {s.status}
                        </span>

                        {s.isLate && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
                            <AlertTriangle className="w-3 h-3" /> {s.daysLate} day(s) late
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-[var(--text-main)]">
                      {s.marksObtained !== null && s.marksObtained !== undefined ? (
                        <span className="text-emerald-400 font-bold">
                          {s.marksObtained} / {selectedAssignment?.maxMarks || 100}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs font-normal">Pending Grade</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEvalModal(s)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold shadow-sm hover:opacity-95 flex items-center gap-1.5 ml-auto"
                      >
                        <Award className="w-3.5 h-3.5" /> Grade & Feedback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evaluate Modal */}
      {evaluatingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative animate-fade-in">
            <button onClick={() => setEvaluatingSub(null)} className="absolute right-4 top-4 text-[var(--text-muted)]">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
              Evaluate Student Work
            </h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Student: {evaluatingSub.studentName} ({evaluatingSub.studentEmail})
            </p>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Obtained Marks (Max: {selectedAssignment?.maxMarks || 100})
                </label>
                <input
                  type="number"
                  required
                  step="0.5"
                  max={selectedAssignment?.maxMarks || 100}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g. 90"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Submission Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                >
                  <option value="Evaluated">Evaluated</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Teacher Written Feedback / Comments
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Excellent analysis of Onion Architecture..."
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button type="button" onClick={() => setEvaluatingSub(null)} className="px-4 py-2 text-sm text-[var(--text-muted)]">Cancel</button>
                <button type="submit" disabled={evalLoading} className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">
                  {evalLoading ? 'Saving...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
