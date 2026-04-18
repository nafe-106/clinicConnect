'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  padding = 'md',
  onClick 
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const baseStyles = glass
    ? 'bg-white/70 backdrop-blur-xl border border-white/20'
    : 'bg-white border border-slate-100/50';

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-0.5'
    : '';

  return (
    <div 
      className={`rounded-2xl shadow-sm ${baseStyles} ${paddingStyles[padding]} ${hoverStyles} transition-all duration-200 ease-out ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

export default Card;