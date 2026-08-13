'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  FileText, 
  CheckSquare, 
  Award,
  BookCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'Admin' || (user.role as any) === 1;
  const isTeacher = user.role === 'Teacher' || (user.role as any) === 2;

  const adminLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'User Management', href: '/dashboard/users', icon: Users },
    { label: 'Academic Setup', href: '/dashboard/academics', icon: BookOpen },
    { label: 'Application Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const teacherLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Assignments', href: '/dashboard/assignments', icon: FileText },
    { label: 'Submissions & Grading', href: '/dashboard/submissions', icon: CheckSquare },
  ];

  const studentLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Assignments', href: '/dashboard/my-assignments', icon: BookCheck },
    { label: 'Gradebook & Results', href: '/dashboard/results', icon: Award },
  ];

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;
  const roleTitle = isAdmin ? 'Admin' : isTeacher ? 'Teacher' : 'Student';

  return (
    <aside className="w-64 glass-panel border-r border-[var(--border-color)] p-4 flex flex-col gap-2 min-h-[calc(100vh-65px)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
        {roleTitle} Navigation
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === '/dashboard' 
            ? pathname === '/dashboard'
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary-glow)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)]/30'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
