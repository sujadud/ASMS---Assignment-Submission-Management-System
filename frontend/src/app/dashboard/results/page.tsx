'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { StudentSubmission } from '@/types';
import { Award, Download, MessageSquare, CheckCircle2, Clock, FileText } from 'lucide-react';

export default function GradebookPage() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<StudentSubmission[]>('/student/submissions')
      .then((res) => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalScore = submissions.reduce((acc, curr) => acc + (curr.marksObtained || 0), 0);
  const totalMax = submissions.reduce((acc, curr) => acc + (curr.maxMarks || 100), 0);
  const averagePercent = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-[var(--primary)]" /> Student Gradebook & Results Portal
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Review obtained scores, teacher written feedback, and submission academic records
        </p>
      </div>

      {/* Grade Summary Header Card */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-sidebar)] flex flex-col sm:flex-row items-center justify-between gap-6 border border-[var(--border-color)]">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[var(--primary-glow)] text-[var(--primary)] border border-[var(--primary)]/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase text-[var(--text-muted)]">Cumulative Performance</div>
            <div className="text-3xl font-black text-[var(--text-main)] mt-0.5">
              {totalScore} <span className="text-lg font-medium text-[var(--text-muted)]">/ {totalMax} Marks</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold uppercase text-[var(--text-muted)] mb-1">Average Percentage Score</div>
          <div className="text-2xl font-black text-emerald-400">
            {averagePercent}%
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-8 text-center text-[var(--text-muted)]">Loading gradebook entries...</div>
      ) : submissions.length === 0 ? (
        <div className="glass-panel p-12 text-center text-[var(--text-muted)]">
          No submission evaluations recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => {
            const scorePercent = s.marksObtained !== null && s.marksObtained !== undefined
              ? ((s.marksObtained / s.maxMarks) * 100).toFixed(0)
              : null;

            return (
              <div key={s.id} className="glass-panel p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {s.subjectName}
                    </span>
                    <h2 className="text-lg font-bold text-[var(--text-main)] mt-1">{s.assignmentTitle}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    {s.marksObtained !== null && s.marksObtained !== undefined ? (
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-emerald-400">
                          {s.marksObtained} / {s.maxMarks}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">{scorePercent}% Score</div>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Under Evaluation
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Progress Bar */}
                {scorePercent && (
                  <div className="w-full bg-[var(--bg-main)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[var(--primary)] to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, parseFloat(scorePercent)))}%` }}
                    ></div>
                  </div>
                )}

                {/* Feedback Box */}
                {s.feedback && (
                  <div className="p-4 rounded-xl bg-[var(--bg-main)]/60 border border-[var(--border-color)] space-y-1">
                    <div className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Teacher Written Remarks & Feedback:
                    </div>
                    <p className="text-xs text-[var(--text-main)] italic">{s.feedback}</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Submitted: {new Date(s.submittedAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const res = await apiClient.get(`/student/download/${s.id}`, { responseType: 'blob' });
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', s.originalFileName);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode?.removeChild(link);
                      } catch (err) {
                        console.error('Failed to download file:', err);
                      }
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Attached File ({s.originalFileName})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
