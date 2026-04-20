'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, Lock, ArrowLeft, Check } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('নাম, ইমেইল এবং ফোন নম্বর পূরণ করুন');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('সঠিক ইমেইল দিন');
      return;
    }
    if (!/^\d{11}$/.test(formData.phone.replace(/\D/g, ''))) {
      toast.error('সঠিক ফোন নম্বর দিন (১১ অংক)');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('পাসওয়ার্ড মিলে না');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে');
      return;
    }

    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from('patients')
        .select('email')
        .eq('email', formData.email.toLowerCase())
        .single();

      if (existing) {
        toast.error('এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: formData.name,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          password: formData.password,
        })
        .select()
        .single();

      if (error) {
        toast.error('রেজিস্ট্রেশন ব্যর্থ: ' + error.message);
        setLoading(false);
        return;
      }

      toast.success('রেজিস্ট্রেশন সফল!');
      localStorage.setItem('userRole', 'patient');
      localStorage.setItem('patientData', JSON.stringify(data));
      router.push('/dashboard/patient');
    } catch (err) {
      toast.error('কিছু সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen premium-bg floating-orbs flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">লগইনে ফিরে যান</span>
        </Link>

        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">নতুন অ্যাকাউন্ট</h1>
          <p className="text-slate-500 mt-1">রোগী হিসেবে রেজিস্টার করুন</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-up" style={{ animationDelay: '50ms' }}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 1 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${step > 1 ? 'bg-primary-500' : 'bg-slate-200'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 2 ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            2
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          {step === 1 ? (
            <div className="space-y-4 sm:space-y-5 animate-fade-up">
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10 sm:pl-14 py-3 text-sm sm:text-base"
                  placeholder="আপনার নাম"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10 sm:pl-14 py-3 text-sm sm:text-base"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input pl-10 sm:pl-14 py-3 text-sm sm:text-base"
                  placeholder="০১১২৩৪৫৬৭৮৯"
                  required
                />
              </div>

              <Button onClick={handleNext} className="w-full">
                পরবর্তী ধাপ
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 animate-fade-up">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">ইমেইল</p>
                <p className="font-medium text-slate-900 truncate">{formData.email}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">ফোন</p>
                <p className="font-medium text-slate-900">{formData.phone}</p>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 sm:pl-14 py-3 text-sm sm:text-base"
                  placeholder="পাসওয়ার্ড"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pl-10 sm:pl-14 py-3 text-sm sm:text-base"
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  পিছনে
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  রেজিস্টার
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}