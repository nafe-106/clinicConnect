'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { TrendingUp, Users, Calendar, Video, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

export default function AdminReports() {
  const [stats, setStats] = useState<any[]>([]);
  const [doctorStats, setDoctorStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(0);
  const [monthlyCompleted, setMonthlyCompleted] = useState(0);
  const [dailyTeleconsult, setDailyTeleconsult] = useState(0);
  const [monthlyTeleconsult, setMonthlyTeleconsult] = useState(0);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [statsViewMode, setStatsViewMode] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    const { data: allApts } = await supabase
      .from('appointments')
      .select('*, doctors(id, name, consultation_fee), patients(id)')
      .order('date', { ascending: false });

    const { data: doctors } = await supabase
      .from('doctors')
      .select('id, name, consultation_fee')
      .order('name');

    if (allApts && doctors) {
      const todayAllConfirmed = allApts.filter((a: any) => a.date === todayStr && (a.status === 'confirmed' || a.status === 'completed'));
      const todayAppointmentCompleted = allApts.filter((a: any) => a.date === todayStr && a.status === 'completed' && a.type !== 'teleconsult');
      const todayTeleconsultConfirmed = allApts.filter((a: any) => a.date === todayStr && (a.status === 'confirmed' || a.status === 'completed') && a.type === 'teleconsult');
      const todayUniquePatients = new Set(todayAllConfirmed.map((a: any) => a.patient_id)).size;

      const monthAllConfirmed = allApts.filter((a: any) => a.date >= firstDayOfMonth && (a.status === 'confirmed' || a.status === 'completed'));
      const monthAppointmentCompleted = allApts.filter((a: any) => a.date >= firstDayOfMonth && a.status === 'completed' && a.type !== 'teleconsult');
      const monthTeleconsultConfirmed = allApts.filter((a: any) => a.date >= firstDayOfMonth && (a.status === 'confirmed' || a.status === 'completed') && a.type === 'teleconsult');
      const monthUniquePatients = new Set(monthAllConfirmed.map((a: any) => a.patient_id)).size;
      
      const calculateEarnings = (apts: any[]) => {
        if (!apts || apts.length === 0) return 0;
        return apts.reduce((sum: number, apt: any) => {
          const fee = Number(apt.doctors?.consultation_fee) || 500;
          return sum + fee;
        }, 0);
      };

      const dailyCompletedAmt = calculateEarnings(todayAppointmentCompleted);
      const dailyTeleconsultAmt = calculateEarnings(todayTeleconsultConfirmed);
      const dailyTotalAmt = dailyCompletedAmt + dailyTeleconsultAmt;

      const monthlyCompletedAmt = calculateEarnings(monthAppointmentCompleted);
      const monthlyTeleconsultAmt = calculateEarnings(monthTeleconsultConfirmed);
      const monthlyTotalAmt = monthlyCompletedAmt + monthlyTeleconsultAmt;

      setDailyEarnings(dailyTotalAmt);
      setMonthlyEarnings(monthlyTotalAmt);
      setDailyCompleted(dailyCompletedAmt);
      setMonthlyCompleted(monthlyCompletedAmt);
      setDailyTeleconsult(dailyTeleconsultAmt);
      setMonthlyTeleconsult(monthlyTeleconsultAmt);

      setStats([
        { label: 'মোট অ্যাপয়েন্টমেন্ট', value: todayAllConfirmed.length, monthlyValue: monthAllConfirmed.length },
        { label: 'নিশ্চিতকৃত টেলিকনসাল্ট', value: todayTeleconsultConfirmed.length, monthlyValue: monthTeleconsultConfirmed.length },
        { label: 'মোট সম্পন্ন', value: todayAppointmentCompleted.length + todayTeleconsultConfirmed.length, monthlyValue: monthAppointmentCompleted.length + monthTeleconsultConfirmed.length },
        { label: 'মোট রোগী', value: todayUniquePatients, monthlyValue: monthUniquePatients },
      ]);

      const docStats = doctors.map((doc: any) => {
        const docApts = allApts.filter((a: any) => a.doctor_id === doc.id);
        return {
          name: doc.name,
          appointments: docApts.length,
          teleconsult: docApts.filter((a: any) => a.type === 'teleconsult').length,
          completed: docApts.filter((a: any) => a.status === 'completed').length,
        };
      });
      setDoctorStats(docStats);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">রিপোর্ট</h1>
            <p className="text-slate-500">ক্লিনিকের পরিসংখ্যান</p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setStatsViewMode('daily')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                statsViewMode === 'daily' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              আজকের
            </button>
            <button
              onClick={() => setStatsViewMode('monthly')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                statsViewMode === 'monthly' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              মাসিক
            </button>
          </div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.length > 0 ? stats.map((stat) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={stat.label} 
              className="card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {statsViewMode === 'daily' ? stat.value : stat.monthlyValue}
              </p>
            </motion.div>
          )) : (
            <div className="col-span-4 text-center py-4 text-slate-400">
              কোনো ডেটা নেই
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-emerald-100 text-sm">আয়</p>
                  <p className="text-3xl font-bold">
                    ৳{viewMode === 'daily' ? dailyEarnings.toLocaleString() : monthlyEarnings.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'daily' ? 'bg-white text-emerald-600' : 'text-white/70 hover:text-white'
                  }`}
                >
                  আজকের
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'monthly' ? 'bg-white text-emerald-600' : 'text-white/70 hover:text-white'
                  }`}
                >
                  মাসিক
                </button>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {viewMode === 'daily' ? (
                <>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-emerald-100">সম্পন্ন সরাসরি আপয়েন্টমেন্ট</span>
                    <span className="font-semibold">৳{dailyCompleted.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-emerald-100">নিশ্চিতকৃত টেলিকনসাল্ট</span>
                    <span className="font-semibold">৳{dailyTeleconsult.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                    <span className="text-white font-medium">মোট</span>
                    <span className="text-white font-bold">৳{dailyEarnings.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-emerald-100">সম্পন্ন সরাসরি আপয়েন্টমেন্ট</span>
                    <span className="font-semibold">
                      ৳{monthlyCompleted.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <span className="text-emerald-100">নিশ্চিতকৃত টেলিকনসাল্ট</span>
                    <span className="font-semibold">
                      ৳{monthlyTeleconsult.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                    <span className="text-white font-medium">মোট</span>
                    <span className="text-white font-bold">
                      ৳{monthlyEarnings.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900 mb-4">ডাক্তার অনুযায়ী (মাসিক)</h2>
            {doctorStats.length > 0 ? (
              <div className="space-y-3">
                {doctorStats.map((doc) => (
                  <div key={doc.name} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{doc.name}</span>
                      <span className="text-sm text-slate-500">{doc.appointments} অ্যাপয়েন্টমেন্ট</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-purple-600 flex items-center gap-1">
                        <Video className="w-3 h-3" /> {doc.teleconsult}
                      </span>
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {doc.completed} সম্পন্ন
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                কোনো ডাক্তার নেই
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
