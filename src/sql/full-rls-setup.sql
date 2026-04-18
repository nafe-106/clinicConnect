-- ============================================
-- COMPLETE RLS SETUP FOR CLINIC CONNECT
-- ============================================

-- Step 1: Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 2: Add user_id column to doctors if not exists
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id UUID;

-- Step 3: Drop existing policies (clean slate)
DROP POLICY IF EXISTS "Allow all users view" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view all data" ON public.users;
DROP POLICY IF EXISTS "Users can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

DROP POLICY IF EXISTS "Anyone can view doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "Anyone can update doctors" ON public.doctors;
DROP POLICY IF EXISTS "Doctors view by user_id" ON public.doctors;

DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON public.appointments;

DROP POLICY IF EXISTS "Anyone can view shifts" ON public.shifts;
DROP POLICY IF EXISTS "Admins can manage shifts" ON public.shifts;

-- Step 4: USER POLICIES
-- Allow any authenticated user to view all users (needed for admin to see all, doctors to see patients)
CREATE POLICY "All authenticated can view users" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow any authenticated user to insert (for registration)
CREATE POLICY "All authenticated can insert users" ON public.users
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Step 5: DOCTOR POLICIES  
-- Anyone can view doctors (patients need to see doctor list)
CREATE POLICY "Public can view doctors" ON public.doctors
  FOR SELECT USING (true);

-- Authenticated users can insert doctors (admin function)
CREATE POLICY "Authenticated can insert doctors" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can update doctors
CREATE POLICY "Authenticated can update doctors" ON public.doctors
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Step 6: APPOINTMENT POLICIES
-- Allow authenticated users to view all appointments (admin sees all, doctors see theirs, patients see theirs)
CREATE POLICY "All authenticated can view appointments" ON public.appointments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert appointments (patients book, admin adds)
CREATE POLICY "All authenticated can insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update appointments (doctors complete, admin cancels)
CREATE POLICY "All authenticated can update appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Step 7: SHIFT POLICIES
-- Anyone can view shifts
CREATE POLICY "Public can view shifts" ON public.shifts
  FOR SELECT USING (true);

-- Authenticated users can manage shifts (admin)
CREATE POLICY "Authenticated can manage shifts" ON public.shifts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Step 8: NOTIFICATION POLICIES
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 9: Link existing doctors to users (run this separately if needed)
-- UPDATE public.doctors SET user_id = u.id FROM public.users u WHERE u.email = doctors.email AND doctors.user_id IS NULL;