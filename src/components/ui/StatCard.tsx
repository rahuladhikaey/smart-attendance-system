import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  badge,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative p-5 bg-[#0B0B0B] border border-[#262626] rounded-xl hover:border-neutral-700 transition-all duration-200 group flex flex-col justify-between overflow-hidden',
          className
        )
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-[#141414] border border-[#262626] text-neutral-300 group-hover:text-white transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </span>
          {badge && (
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/20">
              {badge}
            </span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
            {trend && (
              <span
                className={clsx(
                  'font-medium inline-flex items-center gap-0.5',
                  trend.isPositive ? 'text-white' : 'text-neutral-500'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>

      {/* Subtle bottom edge glow on hover */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
