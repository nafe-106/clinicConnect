'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
    secondary: 'bg-white text-primary-600 border-2 border-primary-100 hover:bg-primary-50 hover:border-primary-200 active:bg-primary-100 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm gap-1.5',
    md: 'px-5 py-3 gap-2',
    lg: 'px-6 py-3.5 text-lg gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}

export default Button;