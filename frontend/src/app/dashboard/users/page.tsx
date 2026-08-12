'use client';

import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { User, Classroom, UserRole } from '@/types';
import { Users, Plus, Shield, GraduationCap, BookOpen, Trash2, Edit2, X, Check } from 'lucide-react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [classroomId, setClassroomId] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsersAndClassrooms = async () => {
    setLoading(true);
    try {
      const [uRes, cRes] = await Promise.all([
        apiClient.get<User[]>('/admin/users'),
        apiClient.get<Classroom[]>('/admin/classrooms'),
      ]);
      setUsers(uRes.data);
      setClassrooms(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndClassrooms();
  }, []);

  const openCreateModal = () => {
    setEditingUserId(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('Student');
    setClassroomId('');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUserId(user.id);
    setFullName(user.fullName);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setClassroomId(user.classroomId || '');
    setFormError('');
    setShowModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingUserId) {
        await apiClient.put(`/admin/users/${editingUserId}`, {
          fullName,
          email,
          password: password || undefined,
          role,
          classroomId: role === 'Student' && classroomId ? classroomId : null,
        });
      } else {
        await apiClient.post('/admin/users', {
          fullName,
          email,
          password,
          role,
          classroomId: role === 'Student' && classroomId ? classroomId : null,
        });
      }

      setShowModal(false);
      fetchUsersAndClassrooms();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      fetchUsersAndClassrooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--primary)]" /> User Management
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Provision accounts for Administrators, Teachers, and Students
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">Loading users list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-sidebar)]/50 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Classroom</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--border-color)]/20 transition-colors">
                    <td className="p-4 font-semibold text-[var(--text-main)]">{u.fullName}</td>
                    <td className="p-4 text-[var(--text-muted)]">{u.email}</td>
                    <td className="p-4">
                      {u.role === 'Admin' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      )}
                      {u.role === 'Teacher' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <GraduationCap className="w-3 h-3" /> Teacher
                        </span>
                      )}
                      {u.role === 'Student' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <BookOpen className="w-3 h-3" /> Student
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {u.classroomName || '—'}
                    </td>
                    <td className="p-4 text-xs text-[var(--text-muted)]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--border-color)]/40 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
              {editingUserId ? 'Edit User Profile' : 'Provision New User'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Password {editingUserId && '(Leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  required={!editingUserId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              {role === 'Student' && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Assigned Classroom</label>
                  <select
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">Select Classroom...</option>
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.academicYear})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-transparent border border-[var(--border-color)] text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold shadow-md shadow-[var(--primary-glow)] hover:opacity-95"
                >
                  {formLoading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
