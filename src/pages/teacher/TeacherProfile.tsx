import React from 'react';
import { authService } from '../../services/authService';
import { Mail, Phone, Building, ShieldCheck, QrCode, BookOpen } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const TeacherProfile: React.FC = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-[#262626]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Faculty Account Profile
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Authorized instructor credentials & broadcast security identity
        </p>
      </div>

      <div className="p-6 bg-[#0B0B0B] border border-[#262626] rounded-2xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-[#262626]"
        />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <Badge variant="live">VERIFIED FACULTY</Badge>
          </div>
          <div className="text-xs font-mono text-neutral-400">{currentUser.email}</div>
          <div className="text-xs text-neutral-500">{currentUser.department}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-5 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-2">
          <div className="text-neutral-400 uppercase text-[10px]">Academic Authority</div>
          <div className="text-white font-bold text-sm">Professor & Dept Chair</div>
          <div className="text-neutral-500">Authorized to create geofences & rolling QR tokens</div>
        </div>

        <div className="p-5 bg-[#0B0B0B] border border-[#262626] rounded-2xl space-y-2">
          <div className="text-neutral-400 uppercase text-[10px]">Security Protocols</div>
          <div className="text-white font-bold text-sm">2FA Enforced • Session Nonces</div>
          <div className="text-emerald-400">● Dynamic AES Nonce Generator Connected</div>
        </div>
      </div>
    </div>
  );
};
