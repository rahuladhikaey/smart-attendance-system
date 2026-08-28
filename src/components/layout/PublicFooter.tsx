import React from 'react';
import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#080808] border-t border-[#262626] text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-black" />
            </div>
            <span className="font-mono font-bold text-white tracking-wider text-sm">
              ATTENDANCE
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Next-generation physical presence verification platform engineered for enterprise institutions, universities, and schools.
          </p>
          <div className="text-[10px] font-mono text-neutral-600">
            © 2026 ATTENDANCE SaaS Inc. All rights reserved.
          </div>
        </div>

        {/* Product Column */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Platform
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link to="/features" className="hover:text-white transition-colors">Geofence Location Engine</Link></li>
            <li><Link to="/features" className="hover:text-white transition-colors">Dynamic Nonce Live QR</Link></li>
            <li><Link to="/features" className="hover:text-white transition-colors">Neural Biometric Match</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Anti-Proxy Architecture</Link></li>
          </ul>
        </div>

        {/* Demos Column */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Role Workspaces
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Security Center</Link></li>
            <li><Link to="/teacher/dashboard" className="hover:text-white transition-colors">Teacher Live Session</Link></li>
            <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Student Attendance Flow</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Demo Login Hub</Link></li>
          </ul>
        </div>

        {/* Compliance & Security */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">
            Security & Trust
          </div>
          <div className="space-y-2 text-[11px] text-neutral-500 font-mono">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>AES-256 Token Encryption</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Server className="w-3.5 h-3.5 text-white" />
              <span>SOC2 & ISO 30107 Liveness</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Globe className="w-3.5 h-3.5 text-white" />
              <span>Zero Raw Template Storage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
