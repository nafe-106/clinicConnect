-- ============================================
-- CLINIC CONNECT - COMPLETE DATABASE SCHEMA
-- ============================================

-- STEP 1: Create Admins Table
DROP TABLE IF EXISTS public.admins;
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  passcode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create Doctors Table
DROP TABLE IF EXISTS public.doctors;
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialization TEXT,
  phone TEXT,
  consultation_fee DECIMAL(10,2) DEFAULT 500,
  experience TEXT,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  passcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Create Patients Table
DROP TABLE IF EXISTS public.patients;
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: Create Appointments Table
DROP TABLE IF EXISTS public.appointments;
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT DEFAULT 'in-person' CHECK (type IN ('in-person', 'teleconsult')),
  reason TEXT,
  teleconsult_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 5: Create Shifts Table
DROP TABLE IF EXISTS public.shifts;
CREATE TABLE public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 6: Create Notifications Table
DROP TABLE IF EXISTS public.notifications;
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_type TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 7: Insert Default Admin
INSERT INTO public.admins (email, name, passcode) 
VALUES ('ktprodhan@gmail.com', 'Admin', '4246')
ON CONFLICT (email) DO NOTHING;

-- STEP 8: Insert Sample Doctors
INSERT INTO public.doctors (name, email, specialization, phone, passcode, consultation_fee, is_available)
VALUES 
('Dr. Rahim Ahmed', 'rahim@clinic.com', 'Medicine', '01711111111', '11111', 500, true),
('Dr. Farida Haque', 'farida@clinic.com', 'Gynecology', '01722222222', '22222', 600, true),
('Dr. Karim Smith', 'karim@clinic.com', 'Cardiology', '01733333333', '33333', 800, true)
ON CONFLICT (email) DO NOTHING;

-- STEP 9: Insert Sample Patients
INSERT INTO public.patients (name, email, phone, password)
VALUES 
('Nafe Prodhan', 'nafeprodhan@gmail.com', '01712345678', '61675'),
('Test Patient', 'patient@test.com', '01798765432', '1234')
ON CONFLICT (email) DO NOTHING;

-- STEP 10: Disable RLS (for development - enable later for security)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Done!
SELECT 'Database setup complete!' as status;