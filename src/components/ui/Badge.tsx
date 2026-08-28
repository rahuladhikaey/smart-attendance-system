import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'live' | 'verified' | 'rejected' | 'pending' | 'warning' | 'neutral' | 'outline';
  className?: string;
  dot?: boolean;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  dot = false,
  title,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight';

  const variants = {
    default: 'bg-[#1C1C1C] text-neutral-200 border border-[#262626]',
    live: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 font-semibold',
    verified: 'bg-white/10 text-white border border-white/20',
    rejected: 'bg-red-950/40 text-red-400 border border-red-800/40',
    pending: 'bg-amber-950/40 text-amber-300 border border-amber-800/40',
    warning: 'bg-amber-950/40 text-amber-300 border border-amber-800/40',
    neutral: 'bg-[#111111] text-neutral-400 border border-[#262626]',
    outline: 'bg-transparent text-neutral-300 border border-[#333333]',
  };

  return (
    <span title={title} className={twMerge(clsx(baseStyles, variants[variant], className))}>
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'live' && 'bg-emerald-400 animate-pulse',
            variant === 'verified' && 'bg-white',
            variant === 'rejected' && 'bg-red-400',
            variant === 'pending' && 'bg-amber-400',
            (variant === 'default' || variant === 'neutral' || variant === 'outline') && 'bg-neutral-400'
          )}
        />
      )}
      {children}
    </span>
  );
};
