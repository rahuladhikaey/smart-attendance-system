import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, QrCode, Fingerprint, ArrowRight, 
  CheckCircle2, AlertTriangle, Activity, Lock, Cpu, Sparkles, 
  Check, BarChart3, Users, Building, Eye, ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
      <PublicNavbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Small Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#262626] text-[11px] font-mono tracking-wide text-neutral-300 mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SMART ATTENDANCE PLATFORM</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Attendance, <span className="underline decoration-1 underline-offset-8 decoration-neutral-600">Verified.</span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Verify student and personnel physical presence with multi-factor location geofencing, dynamic live QR sessions, and registered neural biometric identity — all unified in one intelligent platform.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button variant="primary" size="lg" className="px-7 text-sm font-semibold">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button variant="secondary" size="lg" className="px-7 text-sm">
              <span>View Interactive Demo</span>
            </Button>
          </Link>
        </div>

        {/* Realistic Live Dashboard Preview */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-[#262626] bg-[#0A0A0A] p-3 shadow-2xl shadow-black/80">
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl p-5 text-left">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="w-3 h-3 rounded-full bg-[#262626]" />
                <span className="ml-2 text-xs font-mono text-neutral-400">
                  ATTENDANCE // LIVE INSTITUTION MONITOR
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  ● 4 LIVE SESSIONS
                </span>
              </div>
            </div>

            {/* Quick KPI stats row */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-[#121212] border border-[#222222]">
                <div className="text-[10px] uppercase font-mono text-neutral-400">Attendance Rate</div>
                <div className="text-xl font-bold font-mono text-white mt-1">91.4%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">↑ +2.8% this week</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121212] border border-[#222222]">
                <div className="text-[10px] uppercase font-mono text-neutral-400">Present Today</div>
                <div className="text-xl font-bold font-mono text-white mt-1">1,108</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">out of 1,248 total</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121212] border border-[#222222]">
                <div className="text-[10px] uppercase font-mono text-neutral-400">Active Geofences</div>
                <div className="text-xl font-bold font-mono text-white mt-1">100m</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Campus perimeter</div>
              </div>
              <div className="p-3 rounded-lg bg-[#121212] border border-[#222222]">
                <div className="text-[10px] uppercase font-mono text-neutral-400">Verification Rate</div>
                <div className="text-xl font-bold font-mono text-white mt-1">96.4%</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Zero proxies recorded</div>
              </div>
            </div>

            {/* Live verification stream preview */}
            <div className="mt-4 p-3 rounded-lg bg-[#121212] border border-[#222222]">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                <span className="font-semibold text-white">Live Physical Presence Stream (Distributed Systems CS-401)</span>
                <span>Real-Time Hash Logs</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[#171717] text-neutral-300">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Aryan Raj (STU-2026-090)
                  </span>
                  <span className="text-[11px] text-neutral-500">10:04:21 AM • 38m • Face 98.4%</span>
                  <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/20">
                    VERIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#171717] text-neutral-300">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Priya Shah (STU-2026-091)
                  </span>
                  <span className="text-[11px] text-neutral-500">10:04:39 AM • 42m • Face 99.1%</span>
                  <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/20">
                    VERIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#171717] text-neutral-300">
                  <span className="flex items-center gap-2 text-red-400">
                    <span>✕</span> Kavita Rao (STU-2026-092)
                  </span>
                  <span className="text-[11px] text-neutral-500">10:05:02 AM • 280m (Outside 100m)</span>
                  <span className="text-[10px] bg-red-950/50 text-red-300 px-2 py-0.5 rounded border border-red-800">
                    BLOCKED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED INSTITUTIONS MARQUEE */}
      <section className="py-12 border-y border-[#262626] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6">
            Engineered for Top Academic Institutions, Engineering Colleges & Training Centers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider">
              <Building className="w-4 h-4" /> IMPERIAL INSTITUTE
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider">
              <Building className="w-4 h-4" /> STANFORD POLYTECH
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider">
              <Building className="w-4 h-4" /> CAMBRIDGE TECH
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider">
              <Building className="w-4 h-4" /> MIT RESEARCH LABS
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wider">
              <Building className="w-4 h-4" /> GLOBAL ENTERPRISE
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM (Why Claimed Attendance Fails) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">THE PROXY CRISIS</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            Why Generic Attendance Apps Fail
          </h2>
          <p className="mt-4 text-sm text-neutral-400">
            Traditional apps allow students to tap "Mark Present" from their dorm, forward static QR screenshots over WhatsApp, or share login credentials.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] text-left">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Static QR Screenshots</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              When teachers project a static QR code, absent students scan photos sent via instant messaging, compromising institutional compliance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] text-left">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Remote GPS Spoofing</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Basic location apps trust client-reported coordinates without geofence perimeter validation or multi-source sensor verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] text-left">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Proxy Friend Check-Ins</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Students log into each other's accounts. Without real-time neural facial liveness matching, identity cannot be verified.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW VERIFICATION WORKS (The Hero 4-Pillar Pipeline) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#080808] border-y border-[#262626] rounded-3xl my-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">THE PIPELINE</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            "Attendance is verified, not claimed."
          </h2>
          <p className="mt-4 text-sm text-neutral-400">
            Every attendance record requires passing all four sequential cryptographic security checks.
          </p>
        </div>

        {/* 4 Steps Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] text-left relative">
            <div className="text-[10px] font-mono uppercase text-neutral-500">STAGE 01</div>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Geofence Check</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Validates that the student's physical device is within the classroom boundary (e.g. 100m).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] text-left relative">
            <div className="text-[10px] font-mono uppercase text-neutral-500">STAGE 02</div>
            <div className="flex items-center gap-2 mt-2">
              <QrCode className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Live Rotating QR</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Scans rolling cryptographic token that rotates every 30 seconds with dynamic nonces.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] text-left relative">
            <div className="text-[10px] font-mono uppercase text-neutral-500">STAGE 03</div>
            <div className="flex items-center gap-2 mt-2">
              <Fingerprint className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Biometric Liveness</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Facial vector matching + ISO 30107 liveness challenge ensures real student presence.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] text-left relative">
            <div className="text-[10px] font-mono uppercase text-neutral-500">STAGE 04</div>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              <h3 className="text-sm font-bold text-white">Digital Pass Issued</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Cryptographic signature hash generated and logged to immutable audit ledger.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ROLE-BASED EXPERIENCE TABS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">UNIFIED WORKSPACE</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          Tailored Workspaces for Every Stakeholder
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Admin */}
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                ADMIN CONSOLE
              </span>
              <h3 className="text-lg font-bold text-white mt-4">Institutional Security & Analytics</h3>
              <ul className="mt-4 space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">✓ Real-time physical presence telemetry</li>
                <li className="flex items-center gap-2">✓ Geofence boundary configuration</li>
                <li className="flex items-center gap-2">✓ Manual override audit logging</li>
                <li className="flex items-center gap-2">✓ Multi-department CSV & PDF reports</li>
              </ul>
            </div>
            <Link to="/admin/dashboard" className="mt-6">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Launch Admin Demo
              </Button>
            </Link>
          </div>

          {/* Teacher */}
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                FACULTY PORTAL
              </span>
              <h3 className="text-lg font-bold text-white mt-4">One-Click Live QR Sessions</h3>
              <ul className="mt-4 space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">✓ Dynamic 30-second rolling QR projector</li>
                <li className="flex items-center gap-2">✓ Live check-in stream with verification badges</li>
                <li className="flex items-center gap-2">✓ Instant attendance percentage tracking</li>
                <li className="flex items-center gap-2">✓ Classroom roster management</li>
              </ul>
            </div>
            <Link to="/teacher/dashboard" className="mt-6">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Launch Teacher Demo
              </Button>
            </Link>
          </div>

          {/* Student */}
          <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                STUDENT APP
              </span>
              <h3 className="text-lg font-bold text-white mt-4">Frictionless 3-Step Verification</h3>
              <ul className="mt-4 space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2">✓ Mobile-first fast camera scanner</li>
                <li className="flex items-center gap-2">✓ Automatic GPS location check</li>
                <li className="flex items-center gap-2">✓ Instant facial liveness pass</li>
                <li className="flex items-center gap-2">✓ Verifiable digital attendance receipt</li>
              </ul>
            </div>
            <Link to="/student/dashboard" className="mt-6">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                Launch Student Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 px-4 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-[#111111] to-[#080808] border border-[#262626] shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Transform Your Institution's Attendance Integrity
          </h2>
          <p className="mt-4 text-sm text-neutral-400 max-w-xl mx-auto">
            Eliminate proxy attendance completely with multi-factor location, dynamic QR, and neural biometric verification.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/login">
              <Button variant="primary" size="lg" className="px-8 text-sm">
                Explore Demo Environment
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg" className="px-8 text-sm">
                View Features & Security
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
