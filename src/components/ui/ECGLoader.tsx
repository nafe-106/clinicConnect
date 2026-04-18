'use client';

import React from 'react';

interface ECGLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  color?: 'blue' | 'green';
  showText?: boolean;
  text?: string;
  className?: string;
}

export default function ECGLoader({ 
  size = 'md', 
  color = 'blue',
  showText = true,
  text = 'Loading patient data...',
  className = ''
}: ECGLoaderProps) {
  
  const strokeColor = color === 'green' ? '#22c55e' : '#0ea5e9';
  
  const sizeClasses = {
    sm: 'w-20 h-8',
    md: 'w-32 h-12',
    lg: 'w-48 h-16',
    full: 'w-64 h-20'
  };

  const containerClass = `
    relative ${sizeClasses[size]} overflow-hidden 
    flex flex-col items-center justify-center
    ${className}
  `;

  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  if (size === 'sm') {
    return (
      <div className={containerClass}>
        <svg
          viewBox="0 0 200 40"
          className="w-full h-full animate-ecg"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 3px rgba(14, 165, 233, 0.3))' }}
        >
          <path d="M0 20 L15 20 L22 8 L30 32 L38 20 L50 20 L60 12 L70 28 L80 20 L200 20" />
        </svg>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <svg
        viewBox="0 0 200 50"
        className="w-full h-full animate-ecg"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        style={{ 
          filter: `drop-shadow(0 0 4px ${strokeColor}40)`,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
      >
        <path d="M0 25 L20 25 L28 12 L36 38 L44 25 L60 25 L70 15 L80 35 L90 25 L110 25 L120 18 L130 32 L140 25 L200 25" />
      </svg>
      
      {showText && (
        <p className={`mt-3 text-slate-500 ${textClass} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}