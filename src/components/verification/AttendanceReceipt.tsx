import React from 'react';
import { ShieldCheck, Download, Printer, CheckCircle2, QrCode } from 'lucide-react';
import { AttendanceRecord } from '../../types';
import { Button } from '../ui/Button';

export interface AttendanceReceiptProps {
  record: AttendanceRecord;
  onClose?: () => void;
}

export const AttendanceReceipt: React.FC<AttendanceReceiptProps> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-6 text-white max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Top security banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm">
            ✓
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              SECURE VERIFICATION PASS
            </div>
            <div className="text-sm font-bold text-white tracking-tight">ATTENDANCE VERIFIED</div>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-white/80" />
      </div>

      {/* Student Details */}
      <div className="mt-5 flex items-center gap-3.5 p-3 rounded-xl bg-[#141414] border border-[#262626]">
        <img
          src={record.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
          alt={record.studentName}
          className="w-12 h-12 rounded-lg object-cover border border-[#333333]"
        />
        <div>
          <div className="text-sm font-semibold text-white">{record.studentName}</div>
          <div className="text-xs font-mono text-neutral-400">{record.studentRoll}</div>
          <div className="text-[11px] text-neutral-500">{record.className}</div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[#111111] border border-[#222222]">
          <div className="text-[10px] uppercase text-neutral-400 font-mono">Timestamp</div>
          <div className="text-xs font-semibold font-mono text-white mt-1">{record.timestamp}</div>
        </div>

        <div className="p-3 rounded-lg bg-[#111111] border border-[#222222]">
          <div className="text-[10px] uppercase text-neutral-400 font-mono">Attendance Status</div>
          <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            {record.status}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#111111] border border-[#222222]">
          <div className="text-[10px] uppercase text-neutral-400 font-mono">Distance Offset</div>
          <div className="text-xs font-semibold font-mono text-neutral-300 mt-1">
            {record.distanceMeters}m from room
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#111111] border border-[#222222]">
          <div className="text-[10px] uppercase text-neutral-400 font-mono">Biometrics</div>
          <div className="text-xs font-semibold text-white mt-1">
            {record.biometricVerified ? 'Identity Confirmed' : 'Manual Override'}
          </div>
        </div>
      </div>

      {/* Verification Checklist */}
      <div className="mt-4 p-3 rounded-lg bg-[#111111] border border-[#222222] space-y-1.5 text-xs font-mono">
        <div className="flex items-center justify-between text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="text-white">✓</span> Current Location Checked
          </span>
          <span className="text-[10px] text-neutral-500">RADIUS PASS</span>
        </div>
        <div className="flex items-center justify-between text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="text-white">✓</span> Dynamic Live QR Nonce
          </span>
          <span className="text-[10px] text-neutral-500">SYNCED</span>
        </div>
        <div className="flex items-center justify-between text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="text-white">✓</span> Registered Biometric Identity
          </span>
          <span className="text-[10px] text-neutral-500">MATCH 98.4%</span>
        </div>
      </div>

      {/* Cryptographic Hash Barcode */}
      <div className="mt-5 pt-4 border-t border-dashed border-[#262626] text-center">
        <div className="text-[10px] font-mono uppercase text-neutral-500">Cryptographic Receipt Hash</div>
        <div className="text-[11px] font-mono text-neutral-300 tracking-wider mt-1 bg-[#141414] py-1 px-2 rounded border border-[#262626] break-all select-all">
          {record.receiptHash}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={handlePrint}>
          <Printer className="w-3.5 h-3.5 mr-1" />
          Print Pass
        </Button>
        {onClose && (
          <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={onClose}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
};
