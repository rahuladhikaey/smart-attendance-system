import React from 'react';
import { ShieldCheck, Lock, Globe, Server, CheckCircle2, Building, ShieldAlert } from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            SECURITY & INSTITUTIONAL TRUST
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
            The Philosophy of Verified Attendance
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            Why attendance must be an auditable, cryptographically validated event rather than a self-reported honor system.
          </p>
        </div>

        {/* Manifesto Content */}
        <div className="space-y-12 text-neutral-300 text-sm leading-relaxed">
          <div className="p-8 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
            <h2 className="text-xl font-bold text-white mb-3">Our Core Thesis</h2>
            <p className="text-neutral-400">
              In higher education, specialized medical academies, vocational licensing, and institutional operations, attendance is not merely a metric — it is a compliance requirement and a legal certificate of presence. When legacy systems allow proxy roll calls or shared QR screenshots, academic integrity suffers.
            </p>
            <p className="text-neutral-400 mt-4">
              <strong>ATTENDANCE</strong> was founded on a singular engineering principle: <em className="text-white">"Attendance is verified, not claimed."</em> An attendance record can only be committed to the database when location, dynamic session state, and biological identity all converge in the same physical space.
            </p>
          </div>

          {/* Privacy Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <Lock className="w-4 h-4" />
                <span>Zero Raw Biometrics Storage</span>
              </div>
              <p className="text-xs text-neutral-400">
                We never store photos or raw facial templates. Images are instantly processed on the edge into irreversible 512-dimension mathematical hash vectors protected by AES-256 encryption.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-[#262626]">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Immutable Audit Logs</span>
              </div>
              <p className="text-xs text-neutral-400">
                Every verification event, geofence rejection, and manual administrative override is signed and appended to a tamper-resistant institutional audit ledger with IP address and reason tracking.
              </p>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
