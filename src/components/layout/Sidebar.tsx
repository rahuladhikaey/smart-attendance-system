import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, LayoutDashboard, QrCode, Users, GraduationCap, 
  BookOpen, FileBarChart, PieChart, ShieldAlert, Bell, Settings, 
  Calendar, Clock, UserCheck, ChevronLeft, ChevronRight, User as UserIcon
} from 'lucide-react';
import { UserRole } from '../../types';
import { clsx } from 'clsx';

export interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Attendance', path: '/admin/attendance', icon: QrCode },
          { label: 'Students', path: '/admin/students', icon: GraduationCap },
          { label: 'Teachers', path: '/admin/teachers', icon: Users },
          { label: 'Classes', path: '/admin/classes', icon: BookOpen },
          { label: 'Reports', path: '/admin/reports', icon: FileBarChart },
          { label: 'Analytics', path: '/admin/analytics', icon: PieChart },
          { label: 'Verification', path: '/admin/verification', icon: ShieldAlert },
          { label: 'Notifications', path: '/admin/notifications', icon: Bell },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'TEACHER':
        return [
          { label: 'Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
          { label: 'My Classes', path: '/teacher/classes', icon: BookOpen },
          { label: 'Attendance', path: '/teacher/attendance', icon: QrCode },
          { label: 'Students', path: '/teacher/students', icon: GraduationCap },
          { label: 'Reports', path: '/teacher/reports', icon: FileBarChart },
          { label: 'Profile', path: '/teacher/profile', icon: UserIcon },
        ];
      case 'STUDENT':
        return [
          { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Mark Attendance', path: '/student/attendance', icon: UserCheck, highlight: true },
          { label: 'My Attendance', path: '/student/history', icon: QrCode },
          { label: 'Schedule', path: '/student/schedule', icon: Calendar },
          { label: 'History', path: '/student/history', icon: Clock },
          { label: 'Profile', path: '/student/profile', icon: UserIcon },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 bottom-0 z-40 bg-[#0B0B0B] border-r border-[#262626] transition-all duration-300 flex flex-col justify-between hidden md:flex',
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#262626]">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-widest text-white uppercase font-mono">
                  ATTENDANCE
                </span>
                <span className="text-[10px] text-neutral-500 font-mono tracking-tight">
                  Verified Physical Presence
                </span>
              </div>
            )}
          </NavLink>
        </div>

        {/* Role Badge */}
        {!isCollapsed && (
          <div className="px-4 py-2 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
              WORKSPACE ROLE
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
              {role}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

            return (
              <NavLink
                key={link.path + link.label}
                to={link.path}
                title={isCollapsed ? link.label : undefined}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group select-none',
                  isActive
                    ? 'bg-[#1C1C1C] text-white font-semibold border border-[#333333]'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]',
                  link.highlight && !isActive && 'text-white border border-neutral-700 bg-[#111111]'
                )}
              >
                <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white')} />
                {!isCollapsed && <span className="truncate">{link.label}</span>}
                {!isCollapsed && link.highlight && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#262626] bg-[#0E0E0E]">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors text-xs font-mono"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <span className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
