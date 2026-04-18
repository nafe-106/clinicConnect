-- ============================================
-- PROPER RLS POLICIES FOR CLINIC CONNECT
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view all data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Allow anyone authenticated to view users (needed for admin to see patients, doctors to see patients)
CREATE POLICY "Authenticated users can view all users" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert for new user registration
CREATE POLICY "Anyone can insert users" ON public.users
  FOR INSERT WITH CHECK (true);

-- ============================================
-- DOCTORS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admins can update doctors" ON public.doctors;

-- Allow anyone to view doctors (patients need to see doctor list)
CREATE POLICY "Anyone can view doctors" ON public.doctors
  FOR SELECT USING (true);

-- Allow authenticated users to insert doctors (admin only in practice)
CREATE POLICY "Authenticated can insert doctors" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update doctors
CREATE POLICY "Authenticated can update doctors" ON public.doctors
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================
-- APPOINTMENTS TABLE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Patients can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

-- Doctors can view appointments where they are the doctor (via user link)
CREATE POLICY "Doctors can view own appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() 
      AND d.id = appointments.doctor_id
    )
  );

-- Admins can view all appointments
CREATE POLICY "Admins can view all appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Patients can create appointments
CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Doctors and admins can update appointments
CREATE POLICY "Doctors can update appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.user_id = auth.uid() 
      AND d.id = appointments.doctor_id
    )
  );

CREATE POLICY "Admins can update appointments" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- ============================================
-- SHIFTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Anyone can view shifts" ON public.shifts;
DROP POLICY IF EXISTS "Admins can manage shifts" ON public.shifts;

-- Everyone can view shifts (for booking)
CREATE POLICY "Anyone can view shifts" ON public.shifts
  FOR SELECT USING (true);

-- Only admins can manage shifts
CREATE POLICY "Admins can manage shifts" ON public.shifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SETUP DOCTOR LINKING
-- ============================================

-- This ensures when doctors sign up/authenticate, their user record gets linked
-- The doctors table needs a user_id column to link to auth.users

-- If user_id column doesn't exist, add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'doctors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.doctors ADD COLUMN user_id UUID REFERENCES public.users(id);
  END IF;
END $$;