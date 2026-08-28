import React, { useState } from 'react';
import { 
  Building, MapPin, Fingerprint, Lock, ShieldCheck, 
  Save, CheckCircle2, Sliders, BellRing 
} from 'lucide-react';
import { INITIAL_INSTITUTION } from '../../data/mockData';
import { Button } from '../../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState(INITIAL_INSTITUTION);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Institutional Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Configure campus geofences, rolling QR tokens, and biometric security parameters
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-1.5" />
          Save Configurations
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Institutional security configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Institution Profile */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
            <Building className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Institution Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Institution Code
              </label>
              <input
                type="text"
                value={config.code}
                onChange={(e) => setConfig({ ...config, code: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Attendance Policies & Thresholds */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
            <Sliders className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Attendance Policies & Thresholds</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <label className="block text-neutral-400 uppercase text-[11px] mb-1">
                Minimum Quota Threshold (%)
              </label>
              <input
                type="number"
                value={config.minimumAttendanceThreshold}
                onChange={(e) => setConfig({ ...config, minimumAttendanceThreshold: Number(e.target.value) })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Triggers low-attendance alert</span>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase text-[11px] mb-1">
                Late Arrival Threshold (Mins)
              </label>
              <input
                type="number"
                value={config.lateThresholdMinutes}
                onChange={(e) => setConfig({ ...config, lateThresholdMinutes: Number(e.target.value) })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Marks status as LATE</span>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase text-[11px] mb-1">
                Live QR Rotation (Seconds)
              </label>
              <input
                type="number"
                value={config.qrRotationIntervalSeconds}
                onChange={(e) => setConfig({ ...config, qrRotationIntervalSeconds: Number(e.target.value) })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Rotates dynamic nonces</span>
            </div>
          </div>
        </div>

        {/* Section 3: Geofence Location Defaults */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
            <MapPin className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Geofence Location Defaults</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-neutral-400 uppercase text-[11px] mb-1">
                Default Classroom Radius (Meters)
              </label>
              <input
                type="number"
                value={config.defaultRadiusMeters}
                onChange={(e) => setConfig({ ...config, defaultRadiusMeters: Number(e.target.value) })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 uppercase text-[11px] mb-1">
                Campus Complex Reference Name
              </label>
              <input
                type="text"
                value={config.campusCenter.name}
                onChange={(e) => setConfig({ ...config, campusCenter: { ...config.campusCenter, name: e.target.value } })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Biometric Neural Matcher */}
        <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626]">
            <Fingerprint className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Biometric Identity Engine</h3>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] text-xs font-mono text-neutral-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-neutral-400">Neural Provider:</span>
              <span className="text-white">{config.biometricProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Anti-Spoofing Standard:</span>
              <span className="text-emerald-400">ISO 30107-3 Level 2 Compliant</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Vector Tokenization:</span>
              <span className="text-white">AES-256 (Zero Raw Image Storage)</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
