import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Bell, Search, Menu, X, Shield, Check, LogOut, 
  ExternalLink, UserCheck, Sparkles 
} from 'lucide-react';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface HeaderProps {
  role: UserRole;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadNotifs = notificationService.getUnreadCount(role);
  const notifsList = notificationService.getNotifications(role);

  // Generate breadcrumb items
  const pathParts = location.pathname.split('/').filter(Boolean);

  const handleSwitchRole = (newRole: UserRole) => {
    authService.loginAsDemo(newRole);
    if (newRole === 'ADMIN') navigate('/admin/dashboard');
    else if (newRole === 'TEACHER') navigate('/teacher/dashboard');
    else if (newRole === 'STUDENT') navigate('/student/dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161616]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">
            ATTENDANCE
          </Link>
          {pathParts.map((part, index) => (
            <React.Fragment key={part + index}>
              <span className="text-neutral-600">/</span>
              <span className={clsx('capitalize', index === pathParts.length - 1 ? 'text-white font-medium' : 'hover:text-neutral-200')}>
                {part.replace('-', ' ')}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Controls: Role Switcher Demo Pills + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Interactive Demo Switcher */}
        <div className="hidden sm:flex items-center p-1 bg-[#111111] border border-[#262626] rounded-xl text-xs font-mono">
          <span className="px-2 text-[10px] text-neutral-500 uppercase flex items-center gap-1 font-sans font-semibold">
            <Sparkles className="w-3 h-3 text-white" /> Demo:
          </span>
          <button
            onClick={() => handleSwitchRole('ADMIN')}
            className={clsx(
              'px-2.5 py-1 rounded-lg transition-all text-xs',
              role === 'ADMIN'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            Admin
          </button>
          <button
            onClick={() => handleSwitchRole('TEACHER')}
            className={clsx(
              'px-2.5 py-1 rounded-lg transition-all text-xs',
              role === 'TEACHER'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            Teacher
          </button>
          <button
            onClick={() => handleSwitchRole('STUDENT')}
            className={clsx(
              'px-2.5 py-1 rounded-lg transition-all text-xs',
              role === 'STUDENT'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            )}
          >
            Student
          </button>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg border border-[#262626] bg-[#0E0E0E] text-neutral-300 hover:text-white hover:bg-[#161616] relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E0E0E] border border-[#262626] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Alerts & Notifications
                </span>
                <button
                  onClick={() => notificationService.markAllAsRead()}
                  className="text-[11px] text-neutral-400 hover:text-white font-mono"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {notifsList.length > 0 ? (
                  notifsList.map((n) => (
                    <div
                      key={n.id}
                      className={clsx(
                        'p-2.5 rounded-lg border text-xs text-left transition-colors',
                        n.read ? 'bg-[#141414] border-[#222222] text-neutral-400' : 'bg-[#181818] border-neutral-700 text-white'
                      )}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-neutral-500 py-4">No notifications.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl border border-[#262626] bg-[#0E0E0E] hover:bg-[#161616] transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-[#333333]"
            />
            <div className="hidden lg:flex flex-col text-left pr-1">
              <span className="text-xs font-semibold text-white leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{currentUser.role}</span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0E0E0E] border border-[#262626] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="px-2 py-1.5 border-b border-[#262626]">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-neutral-400 font-mono truncate">{currentUser.email}</div>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  to="/"
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-[#181818]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Public Landing Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
