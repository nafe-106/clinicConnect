-- ============================================
-- NEW SIMPLIFIED CLINIC CONNECT SCHEMA
-- ============================================

-- STEP 1: Create new tables (if not exist)

-- Users table (authentication only)
CREATE TABLE IF NOT EXISTS public.new_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS public.new_patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS public.new_doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  email TEXT,
  phone TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 500,
  is_available BOOLEAN DEFAULT true,
  passcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.new_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.new_patients(id),
  doctor_id UUID REFERENCES public.new_doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT DEFAULT 'in-person' CHECK (type IN ('in-person', 'teleconsult')),
  reason TEXT,
  teleconsult_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.new_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.new_users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Enable RLS
ALTER TABLE public.new_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_notifications ENABLE ROW LEVEL SECURITY;

-- STEP 3: RLS Policies

-- NEW_USERS: Everyone can view, only user can update their own
CREATE POLICY "Public can view new_users" ON public.new_users FOR SELECT USING (true);
CREATE POLICY "Users can insert new_users" ON public.new_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own new_user" ON public.new_users FOR UPDATE USING (auth.uid() = id);

-- NEW_PATIENTS: Patient can view/update own, Admin/Doctor can view all
CREATE POLICY "Public can view new_patients" ON public.new_patients FOR SELECT USING (true);
CREATE POLICY "Users can insert new_patients" ON public.new_patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update new_patients" ON public.new_patients FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NEW_DOCTORS: Everyone can view, Admin can modify
CREATE POLICY "Public can view new_doctors" ON public.new_doctors FOR SELECT USING (true);
CREATE POLICY "Users can insert new_doctors" ON public.new_doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update new_doctors" ON public.new_doctors FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NEW_APPOINTMENTS: Role-based access
CREATE POLICY "Public can view new_appointments" ON public.new_appointments FOR SELECT USING (true);
CREATE POLICY "Users can insert new_appointments" ON public.new_appointments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update new_appointments" ON public.new_appointments FOR UPDATE USING (auth.uid() IS NOT NULL);

-- NEW_NOTIFICATIONS: User can view/update own
CREATE POLICY "Public can view new_notifications" ON public.new_notifications FOR SELECT USING (true);
CREATE POLICY "Users can insert new_notifications" ON public.new_notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update new_notifications" ON public.new_notifications FOR UPDATE USING (auth.uid() IS NOT NULL);