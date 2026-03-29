import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  role?: 'student' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ role = 'student' }) => {
  const studentLinks = [
    { to: '/dashboard', icon: BookOpen, label: 'Available Exams' },
    { to: '/analytics', icon: BarChart3, label: 'Performance Analytics' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/questions', icon: BookOpen, label: 'Question Bank' },
    { to: '/admin/exams', icon: Settings, label: 'Exam Manager' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-[240px] bg-surface border-r border-border h-[calc(100vh-60px)] sticky top-[60px] hidden md:block">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-textMuted hover:bg-background hover:text-textPrimary'
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
