import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import { clsx } from 'clsx';
import { ShieldCheck, X, LayoutDashboard, QrCode, GraduationCap, Users, BookOpen, FileBarChart, PieChart, ShieldAlert, Bell, Settings, Calendar, Clock, UserCheck, User as UserIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const AppShell: React.FC = () => {
  const [role, setRole] = useState<UserRole>(authService.getRole());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => {
      setRole(authService.getRole());
    };
    window.addEventListener('auth_changed', handleAuthChange);
    return () => window.removeEventListener('auth_changed', handleAuthChange);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

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

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col font-sans">
      {/* Sidebar for Desktop */}
      <Sidebar
        role={role}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-64 bg-[#0B0B0B] border-r border-[#262626] h-full flex flex-col justify-between p-4 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-black" />
                  </div>
                  <span className="font-mono font-bold text-white tracking-widest text-sm">
                    ATTENDANCE
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1.5">
                {getNavLinks().map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <NavLink
                      key={link.path + link.label}
                      to={link.path}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-[#1C1C1C] text-white font-semibold border border-[#333333]'
                          : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#262626] text-[11px] font-mono text-neutral-500">
              Role: <span className="text-white font-bold">{role}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col transition-all duration-300',
          isCollapsed ? 'md:pl-[72px]' : 'md:pl-[240px]'
        )}
      >
        <Header role={role} onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
