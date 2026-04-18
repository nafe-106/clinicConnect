-- ============================================================================
-- CLINIC CONNECT - SUPABASE DATABASE SETUP
-- Full Schema with RLS (Row Level Security) Policies
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialty TEXT NOT NULL,
    specialization TEXT,
    consultation_fee NUMERIC DEFAULT 500,
    experience TEXT DEFAULT '0 বছর',
    rating NUMERIC DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    passcode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TEXT,
    type TEXT DEFAULT 'appointment',
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedules Table (Doctor Shifts)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    is_repeating BOOLEAN DEFAULT false,
    repeat_days TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (for Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Appointments Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON public.appointments(type);

-- Schedules Indexes
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON public.schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.schedules(date);

-- Doctors Indexes
CREATE INDEX IF NOT EXISTS idx_doctors_is_available ON public.doctors(is_available);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON public.doctors(specialization);

-- Patients Indexes
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================

-- ----------------------
-- PATIENTS POLICIES
-- ----------------------

-- Patients can read their own data
CREATE POLICY "Patients can view own profile" ON public.patients
    FOR SELECT USING (auth.uid() = id);

-- Patients can update their own data
CREATE POLICY "Patients can update own profile" ON public.patients
    FOR UPDATE USING (auth.uid() = id);

-- Anyone can insert new patients (registration)
CREATE POLICY "Anyone can insert patients" ON public.patients
    FOR INSERT WITH CHECK (true);

-- Admins can view all patients
CREATE POLICY "Admins can view all patients" ON public.patients
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );

-- Doctors can view patients with appointments
CREATE POLICY "Doctors can view their patients" ON public.patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.appointments a
            WHERE a.patient_id = patients.id
            AND a.doctor_id IN (
                SELECT id FROM public.doctors WHERE user_id = auth.uid()
            )
        )
    );


-- ----------------------
-- DOCTORS POLICIES
-- ----------------------

-- Anyone can view available doctors (for patient booking)
CREATE POLICY "Anyone can view available doctors" ON public.doctors
    FOR SELECT USING (is_available = true);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile" ON public.doctors
    FOR UPDATE USING (user_id = auth.uid());

-- Admins can do everything with doctors
CREATE POLICY "Admins can manage doctors" ON public.doctors
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );


-- ----------------------
-- APPOINTMENTS POLICIES
-- ----------------------

-- Patients can view their own appointments
CREATE POLICY "Patients view own appointments" ON public.appointments
    FOR SELECT USING (
        patient_id IN (SELECT id FROM public.patients WHERE email = auth.jwt()->>'email')
        OR patient_id = auth.uid()
    );

-- Patients can create appointments
CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        patient_id IN (SELECT id FROM public.patients WHERE email = auth.jwt()->>'email')
        OR auth.jwt()->>'role' = 'patient'
    );

-- Patients can update their own appointments
CREATE POLICY "Patients can update own appointments" ON public.appointments
    FOR UPDATE USING (
        patient_id IN (SELECT id FROM public.patients WHERE email = auth.jwt()->>'email')
    );

-- Doctors can view their appointments
CREATE POLICY "Doctors view own appointments" ON public.appointments
    FOR SELECT USING (
        doctor_id IN (
            SELECT id FROM public.doctors 
            WHERE user_id = auth.uid() 
            OR email = auth.jwt()->>'email'
        )
    );

-- Doctors can update patient appointments
CREATE POLICY "Doctors can update appointments" ON public.appointments
    FOR UPDATE USING (
        doctor_id IN (
            SELECT id FROM public.doctors 
            WHERE user_id = auth.uid()
            OR email = auth.jwt()->>'email'
        )
    );

-- Admins can view all appointments
CREATE POLICY "Admins view all appointments" ON public.appointments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );

-- Admins can update all appointments
CREATE POLICY "Admins update all appointments" ON public.appointments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );


-- ----------------------
-- SCHEDULES POLICIES
-- ----------------------

-- Anyone can view doctor schedules (for booking)
CREATE POLICY "Anyone can view schedules" ON public.schedules
    FOR SELECT USING (true);

-- Doctors can manage their own schedules
CREATE POLICY "Doctors manage own schedules" ON public.schedules
    FOR ALL USING (
        doctor_id IN (
            SELECT id FROM public.doctors 
            WHERE user_id = auth.uid()
            OR email = auth.jwt()->>'email'
        )
    );

-- Admins can manage all schedules
CREATE POLICY "Admins manage all schedules" ON public.schedules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );


-- ----------------------
-- ADMINS POLICIES
-- ----------------------

-- Admins can view other admins
CREATE POLICY "Admins view admins" ON public.admins
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );

-- Only system can manage admins (disable for now - manage manually)
CREATE POLICY "System manages admins" ON public.admins
    FOR ALL USING (false);


-- ----------------------
-- USERS POLICIES
-- ----------------------

-- Anyone can create users (registration)
CREATE POLICY "Anyone can create users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users view own profile" ON public.users
    FOR SELECT USING (id = auth.uid() OR email = auth.jwt()->>'email');

-- Admins can view all users
CREATE POLICY "Admins view all users" ON public.users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE email = auth.jwt()->>'email')
    );


-- ============================================================================
-- 5. DISABLE RLS FOR DEVELOPMENT (OPTIONAL - comment out for production)
-- ============================================================================

-- Uncomment the following lines to disable RLS (for development only):
-- ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 6. SET UP SUPABASE AUTH (Run in Supabase Dashboard > Authentication)
-- ============================================================================

/*
Go to Supabase Dashboard > Authentication > Providers:
1. Enable "Email" provider
2. Configure settings:
   - Enable "Confirm email" (optional - disable for faster testing)
   - Set "Site URL" to your app URL
   - Set "Redirect URLs" to your app URL

Go to Supabase Dashboard > Settings > API:
1. Note your Project URL and anon key
2. Update your .env.local file with:
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
*/


-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Check tables created
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check RLS enabled
SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('patients', 'doctors', 'appointments', 'schedules', 'admins', 'users');

-- Check policies created
SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;

-- Add zoom_link column to doctors table if it doesn't exist
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS zoom_link TEXT;
-- notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
ALTER TABLE doctors ADD COLUMN degree TEXT;

ALTER TABLE doctors ADD COLUMN doctor_code TEXT UNIQUE;
ALTER TABLE appointments ADD COLUMN serial_number INTEGER;

-- ============================================================================
-- DONE!
-- ============================================================================