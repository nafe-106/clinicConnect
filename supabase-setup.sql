-- Clinic Connect Database Setup
-- Run this in Supabase SQL Editor

-- 1. Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  specialty TEXT,
  phone TEXT,
  avatar_url TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 500,
  experience TEXT,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  passcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Shifts table (doctor schedules)
CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT NOT NULL DEFAULT 'in-person' CHECK (type IN ('in-person', 'teleconsult')),
  reason TEXT,
  notes TEXT,
  teleconsult_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('appointment', 'shift', 'teleconsult', 'general')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for doctors table
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can delete doctors" ON public.doctors;

CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Anyone can insert doctors" ON public.doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update doctors" ON public.doctors FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for shifts table
DROP POLICY IF EXISTS "Anyone can view shifts" ON public.shifts;
DROP POLICY IF EXISTS "Admins can manage shifts" ON public.shifts;

CREATE POLICY "Anyone can view shifts" ON public.shifts FOR SELECT USING (true);
CREATE POLICY "Admins can manage shifts" ON public.shifts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for appointments table
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON public.appointments;

CREATE POLICY "Patients can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Admins can view all appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Patients can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for notifications table
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_shifts_doctor ON public.shifts(doctor_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_doctors_specialty ON public.doctors(specialty);

-- Insert sample doctors (for demo)
INSERT INTO public.doctors (name, specialty, phone, consultation_fee, experience, rating, review_count)
VALUES 
  ('Dr. Rahim Ahmed', 'Medicine', '01712345678', 500, '15 years', 4.8, 156),
  ('Dr. Fariha Sultana', 'Gynecology', '01712345679', 600, '12 years', 4.9, 203),
  ('Dr. Mohammad Karim', 'Eye', '01712345680', 450, '10 years', 4.7, 98),
  ('Dr. Salma Khatun', 'Pediatrics', '01712345681', 400, '8 years', 4.9, 287)
ON CONFLICT DO NOTHING;

-- Trigger function to auto-create user record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'role');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
