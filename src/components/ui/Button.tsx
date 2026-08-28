import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer rounded-lg active:scale-[0.98] select-none';

  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-200 border border-transparent font-semibold shadow-sm',
    secondary: 'bg-[#111111] text-white hover:bg-[#1C1C1C] border border-[#262626]',
    outline: 'bg-transparent text-neutral-300 hover:text-white hover:bg-[#111111] border border-[#262626]',
    danger: 'bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50',
    ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-[#161616]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-3.5 py-2 gap-2 h-9.5',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
    icon: 'p-2 h-9.5 w-9.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
