-- ============================================
-- CLINIC CONNECT - SCHEDULING SYSTEM
-- ============================================

-- Departments table
DROP TABLE IF EXISTS public.departments;
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
('Medicine', 'General Medicine Department'),
('Surgery', 'Surgery Department'),
('Gynecology', 'Gynecology and Obstetrics'),
('Cardiology', 'Heart and Cardiovascular'),
('Others', 'Other Specialties')
ON CONFLICT (name) DO NOTHING;

-- Update doctors table to include department
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);

-- Create schedules table (main scheduling system)
DROP TABLE IF EXISTS public.schedules;
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  is_repeating BOOLEAN DEFAULT false,
  repeat_days INTEGER[], -- Array of days of week (0-6) for weekly repeat
  repeat_until DATE, -- Until when to repeat
  created_by UUID, -- Admin who created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables (will be disabled for dev)
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules DISABLE ROW LEVEL SECURITY;

SELECT 'Scheduling system tables created!' as status;