import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, MapPin, QrCode, Fingerprint, 
  AlertTriangle, RefreshCw, Lock, Eye, Filter 
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { VerificationAttempt, AuditLogEntry } from '../../types';
import { VerificationBadge } from '../../components/verification/VerificationBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const VerificationSecurity: React.FC = () => {
  const [attempts, setAttempts] = useState<VerificationAttempt[]>(attendanceService.getVerificationAttempts());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(attendanceService.getAuditLogs());
  const [filterResult, setFilterResult] = useState<'ALL' | 'VERIFIED' | 'REJECTED'>('ALL');

  useEffect(() => {
    const unsub = attendanceService.subscribe(() => {
      setAttempts(attendanceService.getVerificationAttempts());
      setAuditLogs(attendanceService.getAuditLogs());
    });
    return unsub;
  }, []);

  const filteredAttempts = attempts.filter(a => {
    if (filterResult === 'ALL') return true;
    return a.finalResult === filterResult;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Verification & Security Operations
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
              ● ANTI-PROXY ACTIVE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Cryptographic verification funnel, geofence breaches & administrative manual audit trail
          </p>
        </div>
      </div>

      {/* Security Telemetry Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Total Attempts</div>
          <div className="text-2xl font-bold text-white mt-1">{attempts.length}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Real-time packet logs</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Verified Passes</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {attempts.filter(a => a.finalResult === 'VERIFIED').length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">All 3 factors passed</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Proxies Blocked</div>
          <div className="text-2xl font-bold text-red-400 mt-1">
            {attempts.filter(a => a.finalResult === 'REJECTED').length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Geofence / Nonce / Bio</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#262626]">
          <div className="text-[10px] text-neutral-500 uppercase">Manual Overrides</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {auditLogs.filter(a => a.action === 'MANUAL_OVERRIDE').length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Audited & signed</div>
        </div>
      </div>

      {/* Live Verification Stream */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E0E0E]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h3 className="text-sm font-semibold text-white">Live Verification Stream</h3>
            </div>
            <p className="text-xs text-neutral-400">Step-by-step verification pipeline telemetry</p>
          </div>

          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-lg border border-[#262626] text-xs font-mono">
            {['ALL', 'VERIFIED', 'REJECTED'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterResult(mode as any)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  filterResult === mode ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#141414] text-neutral-400 border-b border-[#262626] uppercase text-[11px] font-mono">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Class</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Distance Offset</th>
                <th className="px-5 py-3 font-medium">Verification Factors</th>
                <th className="px-5 py-3 font-medium">Result / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {filteredAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-[#121212] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">{att.studentName}</td>
                  <td className="px-5 py-3.5 text-neutral-300">{att.className}</td>
                  <td className="px-5 py-3.5 font-mono">{att.timestamp}</td>
                  <td className="px-5 py-3.5 font-mono text-neutral-300">{att.distance}m</td>
                  <td className="px-5 py-3.5">
                    <VerificationBadge
                      locationStatus={att.locationResult}
                      qrStatus={att.qrResult}
                      biometricStatus={att.biometricResult}
                      size="sm"
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    {att.finalResult === 'VERIFIED' ? (
                      <Badge variant="live" dot>VERIFIED</Badge>
                    ) : (
                      <div>
                        <Badge variant="rejected" dot>REJECTED</Badge>
                        {att.failureReason && (
                          <div className="text-[11px] text-red-300 font-mono mt-1">
                            {att.failureReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable Audit Ledger */}
      <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Immutable Institutional Audit Log</h3>
            <p className="text-xs text-neutral-400">Cryptographically signed security events & manual overrides</p>
          </div>
          <Lock className="w-4 h-4 text-neutral-500" />
        </div>

        <div className="space-y-2 font-mono text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-[10px] text-neutral-500">• {log.timestamp}</span>
                  <span className="text-[10px] text-neutral-400">by {log.userName} ({log.role})</span>
                </div>
                <p className="text-neutral-400 mt-1 font-sans text-xs">{log.details}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-neutral-500 block">IP: {log.ipAddress}</span>
                <span className={`text-[10px] font-bold ${log.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  STATUS: {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
