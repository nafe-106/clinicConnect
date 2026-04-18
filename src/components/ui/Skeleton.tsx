'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div 
      className={`skeleton-shimmer ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton width="100%" height={60} />
      <div className="flex gap-2">
        <Skeleton width="30%" height={32} />
        <Skeleton width="30%" height={32} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton width="80%" height={16} />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton width="40%" height={14} />
      </div>
      <Skeleton width="50%" height={32} className="mb-1" />
      <Skeleton width="30%" height={12} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton width={180} height={28} className="rounded-lg" />
          <Skeleton width={280} height={14} className="rounded" />
        </div>
        <Skeleton width={100} height={40} className="rounded-xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
      </div>
      <Skeleton width="100%" height={180} className="rounded-2xl" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton width="100%" height={280} className="rounded-2xl" />
        <Skeleton width="100%" height={280} className="rounded-2xl" />
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton width={160} height={24} className="rounded-lg" />
            <Skeleton width={200} height={14} className="rounded" />
          </div>
          <Skeleton width={80} height={36} className="rounded-xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-2 p-3 bg-slate-50 rounded-xl">
              <Skeleton variant="circular" width={36} height={36} className="mx-auto" />
              <Skeleton width="60%" height={12} className="rounded mx-auto" />
              <Skeleton width="40%" height={20} className="rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5">
          <Skeleton width={140} height={20} className="rounded-lg mb-4" />
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-1">
                  <Skeleton width="70%" height={14} className="rounded" />
                  <Skeleton width="50%" height={12} className="rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5">
          <Skeleton width={120} height={20} className="rounded-lg mb-4" />
          <div className="space-y-2">
            {[1,2,3,4].map(i => (
              <Skeleton key={i} width="100%" height={48} className="rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppointmentSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={16} />
          <Skeleton width="50%" height={14} />
        </div>
        <Skeleton width={60} height={24} className="rounded-full" />
      </div>
      <div className="flex gap-3 mt-4">
        <Skeleton width="30%" height={36} className="rounded-lg" />
        <Skeleton width="30%" height={36} className="rounded-lg" />
      </div>
    </div>
  );
}

export function DoctorListSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-5">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={56} height={56} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Skeleton width="100%" height={32} className="rounded-lg" />
        <Skeleton width="100%" height={32} className="rounded-lg" />
      </div>
    </div>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4">
          <Skeleton width={80} height={24} className="rounded-lg" />
          <Skeleton width="30%" height={16} />
          <Skeleton width={60} height={24} className="rounded-full ml-auto" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;