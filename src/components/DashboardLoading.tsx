'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { PageSkeleton } from '@/components/ui/Skeleton';

interface DashboardLoadingProps {
  role: 'admin' | 'doctor' | 'patient';
}

export default function DashboardLoading({ role }: DashboardLoadingProps) {
  return (
    <DashboardLayout role={role}>
      <PageSkeleton />
    </DashboardLayout>
  );
}