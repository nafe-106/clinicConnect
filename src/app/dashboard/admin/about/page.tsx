'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Info, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard/admin" 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">About</h1>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Info className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Clinic Connect</h2>
              <p className="text-sm text-slate-500">Version v1.0.0</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              Clinic Connect is a comprehensive clinic management system designed to streamline 
              appointment scheduling, doctor schedules, teleconsultations, and patient management.
            </p>
            
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">Developed by</p>
              <p className="font-medium">
                <Link 
                  href="https://nafeplexus.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Nafe Ibne Dalower
                </Link>
                {' · '}
                <span className="text-slate-600">Plexus</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
