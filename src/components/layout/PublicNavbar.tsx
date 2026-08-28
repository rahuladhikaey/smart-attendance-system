import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const PublicNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest text-white uppercase font-mono">
              ATTENDANCE
            </span>
            <span className="text-[10px] text-neutral-500 font-mono tracking-tight -mt-0.5">
              Attendance, Verified.
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-white font-semibold' : 'hover:text-white transition-colors')}>
            Overview
          </NavLink>
          <NavLink to="/features" className={({ isActive }) => (isActive ? 'text-white font-semibold' : 'hover:text-white transition-colors')}>
            Verification Pipeline
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-white font-semibold' : 'hover:text-white transition-colors')}>
            Security & Architecture
          </NavLink>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs text-neutral-300 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm" className="text-xs">
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
