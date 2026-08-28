import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, MapPin, QrCode, Fingerprint, Lock, 
  Activity, ArrowRight, Shield, RefreshCw, Cpu 
} from 'lucide-react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Button } from '../../components/ui/Button';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-white selection:text-black">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            ENGINEERING & CAPABILITIES
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
            Multi-Layer Verification Architecture
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            Explore the cryptographic, geographical, and biometric safeguards that make ATTENDANCE impervious to proxy manipulation.
          </p>
        </div>

        {/* Feature Pillars Grid */}
        <div className="space-y-16">
          {/* Pillar 1: Location */}
          <div className="p-8 rounded-3xl bg-[#0B0B0B] border border-[#262626] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase text-neutral-500">PILLAR 01</span>
              <h2 className="text-2xl font-bold text-white mt-1">Geofenced Location Verification</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                Attendance sessions are bound to specific physical coordinates with configurable radius thresholds (e.g. 50m to 120m). The platform calculates precise geodesic distance using the Haversine algorithm and validates coordinate integrity against mock location providers.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-neutral-300 font-mono">
                <li className="flex items-center gap-2">✓ Sub-meter satellite triangulation validation</li>
                <li className="flex items-center gap-2">✓ Multi-building & campus zoning support</li>
                <li className="flex items-center gap-2">✓ Automatic proxy detection outside perimeter</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] text-center font-mono text-xs">
              <div className="text-neutral-400 text-[10px] uppercase mb-3">Live Geofence Telemetry</div>
              <div className="p-4 rounded-xl bg-[#050505] border border-[#262626] space-y-2 text-left">
                <div className="flex justify-between text-neutral-400">
                  <span>Target Zone:</span> <span className="text-white">Hall Alpha (37.7749° N)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Perimeter Radius:</span> <span className="text-white">100 meters</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Student Offset:</span> <span className="text-emerald-400">38m (PASS)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Dynamic Live QR */}
          <div className="p-8 rounded-3xl bg-[#0B0B0B] border border-[#262626] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 p-6 rounded-2xl bg-[#111111] border border-[#222222] text-center font-mono text-xs">
              <div className="text-neutral-400 text-[10px] uppercase mb-3">Rolling Token Engine</div>
              <div className="p-4 rounded-xl bg-[#050505] border border-[#262626] space-y-2 text-left">
                <div className="flex justify-between text-neutral-400">
                  <span>Rotation Interval:</span> <span className="text-white">30 Seconds</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Cryptographic Nonce:</span> <span className="text-white">#7492 (Dynamic)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Anti-Screenshot:</span> <span className="text-emerald-400">ACTIVE (Zero Delay)</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase text-neutral-500">PILLAR 02</span>
              <h2 className="text-2xl font-bold text-white mt-1">Dynamic Rolling Nonce QR Codes</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                Static QR codes can be photographed and shared in seconds. ATTENDANCE projects a rolling cryptographic token that generates a new signature every 30 seconds. Scans of old tokens or screenshot images are instantly invalidated.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-neutral-300 font-mono">
                <li className="flex items-center gap-2">✓ Dynamic time-based token generation</li>
                <li className="flex items-center gap-2">✓ Single-use attendance check per device</li>
                <li className="flex items-center gap-2">✓ Anti-replay cryptographic nonces</li>
              </ul>
            </div>
          </div>

          {/* Pillar 3: Biometrics */}
          <div className="p-8 rounded-3xl bg-[#0B0B0B] border border-[#262626] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <Fingerprint className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase text-neutral-500">PILLAR 03</span>
              <h2 className="text-2xl font-bold text-white mt-1">Facial Vector Matching & Liveness</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                Registered students authenticate their identity via an on-device facial neural feature extraction model. Embedded anti-spoofing liveness checks detect static photographs, printed masks, and screen recordings to guarantee live biological presence.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-neutral-300 font-mono">
                <li className="flex items-center gap-2">✓ ISO 30107-3 certified anti-spoofing</li>
                <li className="flex items-center gap-2">✓ Zero raw image storage (vector embeddings only)</li>
                <li className="flex items-center gap-2">✓ Sub-second neural inference speed</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] text-center font-mono text-xs">
              <div className="text-neutral-400 text-[10px] uppercase mb-3">Neural Biometric Pass</div>
              <div className="p-4 rounded-xl bg-[#050505] border border-[#262626] space-y-2 text-left">
                <div className="flex justify-between text-neutral-400">
                  <span>Match Confidence:</span> <span className="text-white">98.4% (Threshold 85%)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Liveness Score:</span> <span className="text-white">0.992 (LIVE HUMAN)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Privacy Protocol:</span> <span className="text-emerald-400">Zero Raw Pixels</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link to="/login">
            <Button variant="primary" size="lg">
              Launch Interactive Live Demo
            </Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
