'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { User, Phone, MapPin, Calendar, Save, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientProfile() {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('patientData');
    if (stored) {
      const data = JSON.parse(stored);
      setPatientData(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        date_of_birth: data.date_of_birth || '',
        gender: data.gender || '',
      });
      loadAppointments(data.id);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadAppointments(patientId: string) {
    const { data } = await supabase
      .from('appointments')
      .select('*, doctors(name, specialization)')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(10);

    if (data) setAppointments(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!patientData) return;

    const { error } = await supabase
      .from('patients')
      .update({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      })
      .eq('id', patientData.id);

    if (error) {
      toast.error('আপডেট ব্যর্থ');
    } else {
      const updated = { ...patientData, ...formData };
      localStorage.setItem('patientData', JSON.stringify(updated));
      setPatientData(updated);
      toast.success('প্রোফাইল আপডেট হয়েছে');
      setEditing(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">প্রোফাইল</h1>

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {formData.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{formData.name || 'রোগী'}</h2>
                <p className="text-slate-500">{patientData?.email}</p>
              </div>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>সম্পাদনা</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  <X className="w-4 h-4" /> বাতিল
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4" /> সেভ
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">নাম</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">ফোন নম্বর</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">জন্ম তারিখ</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  disabled={!editing}
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">লিঙ্গ</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={!editing}
                className="input"
              >
                <option value="">নির্বাচন করুন</option>
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-600">ঠিকানা</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  className="input pl-11 min-h-[80px]"
                  placeholder="ঠিকানা"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Appointments History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">অ্যাপয়েন্টমেন্ট ইতিহাস</h3>
          {appointments.length === 0 ? (
            <p className="text-slate-500 text-center py-4">কোনো অ্যাপয়েন্টমেন্ট নেই</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{apt.doctors?.name}</p>
                    <p className="text-sm text-slate-500">{apt.doctors?.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">{apt.date}</p>
                    <p className="text-xs text-slate-400">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
