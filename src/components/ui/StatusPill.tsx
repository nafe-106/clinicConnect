'use client';

import React from 'react';

interface StatusPillProps {
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'confirmed' | 'rejected' | 'upcoming';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}

const statusConfig = {
  pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'অপেক্ষায়',
  },
  upcoming: {
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    label: 'আসন্ন',
  },
  confirmed: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'নিশ্চিত',
  },
  active: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'সক্রিয়',
  },
  completed: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    label: 'সম্পন্ন',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'বাতিল',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'বাতিল',
  },
};

export function StatusPill({ status, children, size = 'md' }: StatusPillProps) {
  const config = statusConfig[status];
  
  const sizeStyles = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs';
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeStyles}`}>
      {children || config.label}
    </span>
  );
}

export default StatusPill;