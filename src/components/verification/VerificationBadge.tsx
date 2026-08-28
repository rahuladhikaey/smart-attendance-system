import React from 'react';
import { MapPin, QrCode, Fingerprint, Check, X, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export interface VerificationBadgeProps {
  locationStatus?: boolean | 'PENDING' | 'PASS' | 'FAIL';
  qrStatus?: boolean | 'PENDING' | 'PASS' | 'FAIL';
  biometricStatus?: boolean | 'PENDING' | 'PASS' | 'FAIL';
  size?: 'sm' | 'md';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  locationStatus = true,
  qrStatus = true,
  biometricStatus = true,
  size = 'md',
  className,
}) => {
  const renderIcon = (status: boolean | 'PENDING' | 'PASS' | 'FAIL') => {
    if (status === true || status === 'PASS') {
      return <Check className={size === 'sm' ? 'w-2.5 h-2.5 text-white' : 'w-3 h-3 text-white'} />;
    }
    if (status === false || status === 'FAIL') {
      return <X className={size === 'sm' ? 'w-2.5 h-2.5 text-red-400' : 'w-3 h-3 text-red-400'} />;
    }
    return <Clock className={size === 'sm' ? 'w-2.5 h-2.5 text-neutral-500' : 'w-3 h-3 text-neutral-500'} />;
  };

  const getStyle = (status: boolean | 'PENDING' | 'PASS' | 'FAIL') => {
    if (status === true || status === 'PASS') return 'bg-white/10 text-white border-white/20';
    if (status === false || status === 'FAIL') return 'bg-red-950/30 text-red-400 border-red-900/40';
    return 'bg-[#141414] text-neutral-500 border-[#262626]';
  };

  return (
    <div className={clsx('inline-flex items-center gap-1.5 font-mono select-none', className)}>
      {/* Location node */}
      <div
        title="Physical Geofence Verification"
        className={clsx(
          'flex items-center gap-1 rounded-md border transition-colors',
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
          getStyle(locationStatus)
        )}
      >
        <MapPin className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        <span>LOC</span>
        {renderIcon(locationStatus)}
      </div>

      {/* QR node */}
      <div
        title="Live Dynamic QR Token"
        className={clsx(
          'flex items-center gap-1 rounded-md border transition-colors',
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
          getStyle(qrStatus)
        )}
      >
        <QrCode className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        <span>QR</span>
        {renderIcon(qrStatus)}
      </div>

      {/* Biometric node */}
      <div
        title="Facial Biometric & Liveness Verification"
        className={clsx(
          'flex items-center gap-1 rounded-md border transition-colors',
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
          getStyle(biometricStatus)
        )}
      >
        <Fingerprint className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        <span>BIO</span>
        {renderIcon(biometricStatus)}
      </div>
    </div>
  );
};
