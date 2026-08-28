import React from 'react';
import { MapPin, Navigation, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { ClassLocation } from '../../types';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface LocationRadarProps {
  location: ClassLocation;
  status: 'IDLE' | 'LOCATING' | 'VERIFIED' | 'OUTSIDE_RADIUS' | 'ERROR';
  distanceMeters?: number;
  onRetry?: () => void;
  onSimulateToggle?: (simulateOutside: boolean) => void;
  isSimulatedOutside?: boolean;
}

export const LocationRadar: React.FC<LocationRadarProps> = ({
  location,
  status,
  distanceMeters = 35,
  onRetry,
  onSimulateToggle,
  isSimulatedOutside = false,
}) => {
  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 text-center relative overflow-hidden flex flex-col items-center">
      {/* Target Classroom Card Header */}
      <div className="w-full text-left mb-6 pb-4 border-b border-[#262626] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            CLASSROOM GEOFENCE
          </span>
          <h4 className="text-sm font-semibold text-white mt-0.5">{location.name}</h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-neutral-400">ALLOWED RADIUS</span>
          <div className="text-xs font-mono font-bold text-white">{location.allowedRadius}m</div>
        </div>
      </div>

      {/* Interactive Radar Visualizer */}
      <div className="relative w-64 h-64 my-4 flex items-center justify-center">
        {/* Outer 150m Ring */}
        <div className="absolute inset-0 rounded-full border border-neutral-800/80" />
        
        {/* Geofence Perimeter Ring (Allowed Radius) */}
        <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-neutral-600 bg-white/[0.02]" />

        {/* Inner 50m Ring */}
        <div className="absolute w-24 h-24 rounded-full border border-neutral-800" />

        {/* Crosshair grid lines */}
        <div className="absolute w-full h-[1px] bg-neutral-800/60" />
        <div className="absolute h-full w-[1px] bg-neutral-800/60" />

        {/* Rotating Radar Sweep when locating */}
        {status === 'LOCATING' && (
          <div className="absolute inset-0 rounded-full border border-white/20 animate-radar" />
        )}

        {/* Center Target (Classroom Hub) */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-[#161616] border border-white/40 flex items-center justify-center shadow-lg shadow-black">
          <MapPin className="w-4 h-4 text-white" />
        </div>

        {/* User GPS Pin */}
        {status === 'VERIFIED' && (
          <div
            className="absolute z-20 transition-all duration-700 ease-out"
            style={{
              top: '38%',
              left: '58%',
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-white opacity-40" />
              <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[9px] shadow-lg">
                ●
              </div>
            </div>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-[#262626] px-2 py-0.5 rounded text-[10px] font-mono text-white">
              You ({distanceMeters}m)
            </div>
          </div>
        )}

        {status === 'OUTSIDE_RADIUS' && (
          <div
            className="absolute z-20 transition-all duration-700 ease-out"
            style={{
              top: '8%',
              right: '8%',
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-500 opacity-40" />
              <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[9px]">
                ✕
              </div>
            </div>
            <div className="absolute top-5 right-0 whitespace-nowrap bg-red-950/90 border border-red-800 px-2 py-0.5 rounded text-[10px] font-mono text-red-200">
              Outside ({distanceMeters}m)
            </div>
          </div>
        )}
      </div>

      {/* State Feedback Info */}
      <div className="w-full mt-2">
        {status === 'LOCATING' && (
          <div className="flex items-center justify-center gap-2 text-neutral-300 text-sm font-mono py-2">
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Triangulating GPS coordinates...</span>
          </div>
        )}

        {status === 'VERIFIED' && (
          <div className="bg-[#121812] border border-emerald-900/60 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Location Verified</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              You are <strong className="text-white font-mono">{distanceMeters} meters</strong> from {location.name} (within the allowed {location.allowedRadius}m radius).
            </p>
          </div>
        )}

        {status === 'OUTSIDE_RADIUS' && (
          <div className="bg-[#181111] border border-red-900/60 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Outside Allowed Geofence</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Your detected distance is <strong className="text-red-300 font-mono">{distanceMeters} meters</strong>. Maximum allowed limit is {location.allowedRadius}m.
            </p>
            {onRetry && (
              <Button variant="secondary" size="sm" className="mt-3 w-full text-xs" onClick={onRetry}>
                Try Location Again
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Demo Simulation Toggle */}
      {onSimulateToggle && (
        <div className="w-full mt-4 pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] text-neutral-400">
          <span className="font-mono">Demo Geofence Simulator:</span>
          <button
            type="button"
            onClick={() => onSimulateToggle(!isSimulatedOutside)}
            className={clsx(
              'px-2.5 py-1 rounded font-mono border text-[11px] transition-colors',
              isSimulatedOutside
                ? 'bg-red-950/50 text-red-300 border-red-800'
                : 'bg-[#161616] text-neutral-300 border-[#262626] hover:text-white'
            )}
          >
            {isSimulatedOutside ? 'Simulating: OUTSIDE GEOFENCE (280m)' : 'Simulating: INSIDE CAMPUS (35m)'}
          </button>
        </div>
      )}
    </div>
  );
};
