'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Calendar, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { getDoctors } from '@/lib/supabase';

const fallbackDoctors = [
  { id: 1, name: 'ড. রাহিম আহমেদ', degree: 'MBBS, FCPS', specialty: 'মেডিসিন', rating: 4.8, review_count: 156, is_available: true, consultation_fee: 500, experience: '১৫ বছর', available_days: ['রবিবার', 'সোমবার', 'বুধবার'] },
  { id: 2, name: 'ড. ফারিহা সুলতানা', degree: 'MBBS, MS', specialty: 'গাইনি', rating: 4.9, review_count: 203, is_available: true, consultation_fee: 600, experience: '১২ বছর', available_days: ['সোমবার', 'মঙ্গলবার', 'বৃহস্পতিবার'] },
  { id: 3, name: 'ড. মো. করিম', degree: 'MBBS, DO', specialty: 'চক্ষু', rating: 4.7, review_count: 98, is_available: true, consultation_fee: 450, experience: '১০ বছর', available_days: ['মঙ্গলবার', 'বৃহস্পতিবার', 'শুক্রবার'] },
  { id: 4, name: 'ড. সালমা খাতুন', degree: 'MBBS, MPH', specialty: 'শিশু রোগ', rating: 4.9, review_count: 287, is_available: true, consultation_fee: 400, experience: '৮ বছর', available_days: ['রবিবার', 'বুধবার', 'শুক্রবার'] },
  { id: 5, name: 'ড. আবুল হাসান', degree: 'MBBS, MD', specialty: 'হৃদরোগ', rating: 4.8, review_count: 145, is_available: true, consultation_fee: 700, experience: '১৮ বছর', available_days: ['সোমবার', 'বুধবার', 'শুক্রবার'] },
];

export default function PatientDoctors() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      const dbDoctors = await getDoctors();
      
      if (dbDoctors && dbDoctors.length > 0) {
        // Map Supabase data to our format
        const mapped = dbDoctors.map(d => ({
          id: d.id,
          name: d.name,
          specialty: d.specialization || d.specialty || '',
          degree: d.degree || '',
          rating: d.rating || 4.5,
          review_count: d.review_count || 0,
          is_available: d.is_available,
          consultation_fee: d.consultation_fee || 500,
          experience: d.experience || '০ বছর',
          available_days: d.available_days || [],
        }));
        setDoctors(mapped);
      } else {
        // Fallback to default doctors
        setDoctors(fallbackDoctors);
        // Save to localStorage for demo
        localStorage.setItem('doctors', JSON.stringify(fallbackDoctors));
      }
      setLoading(false);
    }

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                        d.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === 'all' || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  if (loading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ডাক্তার</h1>
          <p className="text-gray-500">আপনার প্রয়োজন অনুযায়ী ডাক্তার বেছে নিন</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ডাক্তার বা বিশেষজ্ঞ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                specialty === spec 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {spec === 'all' ? 'সব' : spec}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-semibold shrink-0">
                  {doctor.name?.charAt(2) || 'ডা'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm mt-1">
                        <span className="text-primary-600 font-medium">{doctor.degree}</span>
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-gray-600">{doctor.specialty}</span>
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{doctor.experience} অভিজ্ঞতা</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">৳{doctor.consultation_fee}</p>
                      <p className="text-xs text-gray-500">প্রতি ভিজিট</p>
                    </div>
                  </div>
                  {/*}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">{doctor.review_count} রিভিউ</span>
                  </div>
                  {*/}
                  {doctor.available_days && doctor.available_days.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctor.available_days.map((day: string) => (
                        <span key={day} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {doctor.is_available ? (
                  <Link 
                    href={`/dashboard/patient/book?doctor=${doctor.id}`}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> অ্যাপয়েন্টমেন্ট বুক করুন
                  </Link>
                ) : (
                  <button disabled className="btn-secondary flex-1 opacity-50 cursor-not-allowed">
                    এখনে অনুপলব্ধ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
