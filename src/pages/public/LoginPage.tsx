import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, Sparkles, UserCheck, GraduationCap, Users } from 'lucide-react';
import { authService } from '../../services/authService';
import { UserRole } from '../../types';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      authService.loginAsDemo(role);
      setIsLoading(false);
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'TEACHER') navigate('/teacher/dashboard');
      else if (role === 'STUDENT') navigate('/student/dashboard');
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your institutional email');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const user = authService.loginWithCredentials(email);
      setIsLoading(false);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else if (user.role === 'STUDENT') navigate('/student/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 selection:bg-white selection:text-black">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0B0B0B] border border-[#262626] rounded-2xl p-8 shadow-2xl shadow-black/80">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-black" />
            </div>
            <span className="font-mono font-bold tracking-widest text-lg text-white uppercase">
              ATTENDANCE
            </span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Institutional Physical Presence Verification
          </p>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div className="mb-6 p-3 rounded-xl bg-[#111111] border border-[#222222]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 uppercase font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Instant Demo Access (Select Role):</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2 rounded-lg bg-[#181818] border border-[#2E2E2E] hover:border-white text-center transition-all text-xs group"
            >
              <div className="text-white font-bold group-hover:text-white flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Admin
              </div>
              <span className="text-[9px] text-neutral-500 block mt-0.5">Control Center</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('TEACHER')}
              className="p-2 rounded-lg bg-[#181818] border border-[#2E2E2E] hover:border-white text-center transition-all text-xs group"
            >
              <div className="text-white font-bold group-hover:text-white flex items-center justify-center gap-1">
                <GraduationCap className="w-3 h-3" /> Teacher
              </div>
              <span className="text-[9px] text-neutral-500 block mt-0.5">Live QR Host</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('STUDENT')}
              className="p-2 rounded-lg bg-[#181818] border border-[#2E2E2E] hover:border-white text-center transition-all text-xs group"
            >
              <div className="text-white font-bold group-hover:text-white flex items-center justify-center gap-1">
                <UserCheck className="w-3 h-3" /> Student
              </div>
              <span className="text-[9px] text-neutral-500 block mt-0.5">3-Step Check</span>
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#222222]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-[#0B0B0B] px-2 text-neutral-500">Or sign in with email</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/50 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@institution.edu"
                className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono uppercase text-neutral-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-neutral-400 hover:text-white transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#141414] border-[#262626]" />
              <span>Remember this trusted device</span>
            </label>
          </div>

          <Button variant="primary" type="submit" className="w-full text-xs font-bold" isLoading={isLoading}>
            Sign In to Workspace
          </Button>
        </form>

        {/* Google SSO */}
        <div className="mt-4">
          <Button
            variant="secondary"
            type="button"
            className="w-full text-xs"
            onClick={() => handleDemoLogin('ADMIN')}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Institutional SSO
          </Button>
        </div>
      </div>
    </div>
  );
};
