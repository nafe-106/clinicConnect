'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Input({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3.5 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-4
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100/50' 
              : 'border-slate-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100/50'
            }
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default Input;