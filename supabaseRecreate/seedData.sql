-- ============================================================================
-- CLINIC CONNECT - SEED DATA
-- Sample data to get started with the application
-- ============================================================================

-- ============================================================================
-- 1. CREATE ADMIN ACCOUNT
-- ============================================================================

INSERT INTO public.admins (email, password, name) VALUES
('admin@clinic.com', 'admin123', 'অ্যাডমিন')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 2. CREATE DOCTORS
-- ============================================================================

INSERT INTO public.doctors (name, email, phone, specialty, specialization, consultation_fee, experience, rating, review_count, is_available, passcode) VALUES
('ড. রাহিম আহমেদ', 'dr.rahim@clinic.com', '01712345601', 'মেডিসিন', 'মেডিসিন বিশেষজ্ঞ', 500, '১৫ বছর', 4.8, 156, true, '12345'),
('ড. ফারিহা সুলতানা', 'dr.fariha@clinic.com', '01712345602', 'গাইনি', 'স্ত্রীরোগ বিশেষজ্ঞ', 600, '১২ বছর', 4.9, 203, true, '23456'),
('ড. মো. করিম', 'dr.karim@clinic.com', '01712345603', 'চক্ষু', 'চক্ষু বিশেষজ্ঞ', 450, '১০ বছর', 4.7, 98, true, '34567'),
('ড. সালমা খাতুন', 'dr.salma@clinic.com', '01712345604', 'শিশু রোগ', 'শিশু বিশেষজ্ঞ', 400, '৮ বছর', 4.9, 287, true, '45678'),
('ড. আবুল হাসান', 'dr.hasan@clinic.com', '01712345605', 'হৃদরোগ', 'হৃদরোগ বিশেষজ্ঞ', 700, '১৮ বছর', 4.8, 145, true, '56789'),
('ড. নুরজাহান', 'dr.nurjahan@clinic.com', '01712345606', 'স্কিন', 'চর্ম বিশেষজ্ঞ', 550, '১১ বছর', 4.6, 112, true, '67890'),
('ড. মো. রফিক', 'dr.rafiq@clinic.com', '01712345607', 'নিউরো', 'স্নায়ু বিশেষজ্ঞ', 800, '২০ বছর', 4.9, 178, true, '78901'),
('ড. সাবিনা ইয়াসমিন', 'dr.sabina@clinic.com', '01712345608', 'অর্থো', 'হাড় বিশেষজ্ঞ', 650, '৯ বছর', 4.7, 89, true, '89012')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. CREATE PATIENTS
-- ============================================================================

INSERT INTO public.patients (name, email, phone, password, status) VALUES
('মো. রবিউল ইসলাম', 'rubel@example.com', '01812345601', 'patient123', 'active'),
('সাবিনা আক্তার', 'sabina@example.com', '01812345602', 'patient123', 'active'),
('আব্দুর রহিম', 'rahim@example.com', '01812345603', 'patient123', 'active'),
('ফাতেমা খাতুন', 'fatema@example.com', '01812345604', 'patient123', 'active'),
('মো. কামরুল', 'kamrul@example.com', '01812345605', 'patient123', 'active'),
('জাহানারা বেগম', 'jahana@example.com', '01812345606', 'patient123', 'active'),
('আবুল বারী', 'abul@example.com', '01812345607', 'patient123', 'active'),
('মিনা সুলতানা', 'mina@example.com', '01812345608', 'patient123', 'active')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 4. CREATE DOCTOR SCHEDULES (Next 7 days)
-- ============================================================================

-- Get doctor IDs for schedule creation
-- Assuming doctors are created in order, we'll use the order they were inserted

-- Dr. Rahim (মেডিসিন) - Mon, Wed, Fri
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '09:00', '14:00', 'active', true, ARRAY['monday', 'wednesday', 'friday']
FROM public.doctors d WHERE d.name LIKE '%রাহিম%'
ON CONFLICT DO NOTHING;

-- Dr. Fariha (গাইনি) - Sun, Tue, Thu
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '10:00', '16:00', 'active', true, ARRAY['sunday', 'tuesday', 'thursday']
FROM public.doctors d WHERE d.name LIKE '%ফারিহা%'
ON CONFLICT DO NOTHING;

-- Dr. Karim (চক্ষু) - Mon, Thu, Sat
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '08:00', '12:00', 'active', true, ARRAY['monday', 'thursday', 'saturday']
FROM public.doctors d WHERE d.name LIKE '%করিম%'
ON CONFLICT DO NOTHING;

-- Dr. Salma (শিশু রোগ) - Sun, Wed, Fri
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '09:00', '13:00', 'active', true, ARRAY['sunday', 'wednesday', 'friday']
FROM public.doctors d WHERE d.name LIKE '%সালমা%'
ON CONFLICT DO NOTHING;

-- Dr. Hasan (হৃদরোগ) - Tue, Wed, Thu
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '11:00', '17:00', 'active', true, ARRAY['tuesday', 'wednesday', 'thursday']
FROM public.doctors d WHERE d.name LIKE '%হাসান%'
ON CONFLICT DO NOTHING;

-- Dr. Nurjahan (স্কিন) - Mon, Tue, Sat
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '10:00', '15:00', 'active', true, ARRAY['monday', 'tuesday', 'saturday']
FROM public.doctors d WHERE d.name LIKE '%নুরজাহান%'
ON CONFLICT DO NOTHING;

-- Dr. Rafiq (নিউরো) - Sun, Tue, Thu
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '09:00', '14:00', 'active', true, ARRAY['sunday', 'tuesday', 'thursday']
FROM public.doctors d WHERE d.name LIKE '%রফিক%'
ON CONFLICT DO NOTHING;

-- Dr. Sabina (অর্থো) - Mon, Wed, Sat
INSERT INTO public.schedules (doctor_id, date, start_time, end_time, status, is_repeating, repeat_days)
SELECT d.id, CURRENT_DATE + (i * INTERVAL '1 day'), '08:00', '13:00', 'active', true, ARRAY['monday', 'wednesday', 'saturday']
FROM public.doctors d WHERE d.name LIKE '%সাবিনা%'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. CREATE SAMPLE APPOINTMENTS
-- ============================================================================

-- Today's appointments for different statuses

-- Pending appointments
INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '09:30',
    'appointment',
    'pending',
    'প্রথমবারের মতো আসছেন'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%রবিউল%' AND d.name LIKE '%রাহিম%';

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '10:00',
    'teleconsult',
    'pending',
    'ফলো-আপ কনসাল্টেশন'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%সাবিনা%' AND d.name LIKE '%ফারিহা%';

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '11:00',
    'appointment',
    'pending',
    'জ্বরের জন্য আসছেন'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%আব্দুর রহিম%' AND d.name LIKE '%সালমা%';

-- Confirmed appointments
INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '10:30',
    'appointment',
    'confirmed',
    'হার্ট চেকআপ'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%কামরুল%' AND d.name LIKE '%হাসান%';

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '14:00',
    'teleconsult',
    'confirmed',
    'চোখ পরীক্ষা'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%জাহানারা%' AND d.name LIKE '%করিম%';

-- Completed appointments (yesterday)
INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE - INTERVAL '1 day',
    '09:00',
    'appointment',
    'completed',
    'রুটিন চেকআপ'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%আবুল বারী%' AND d.name LIKE '%রাহিম%';

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE - INTERVAL '1 day',
    '11:30',
    'appointment',
    'completed',
    'হাড়ের সমস্যা'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%মিনা%' AND d.name LIKE '%সাবিনা%';

-- Cancelled appointment
INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE,
    '15:00',
    'appointment',
    'cancelled',
    'রোগী জানিয়েছেন আসতে পারবেন না'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%ফাতেমা%' AND d.name LIKE '%নুরজাহান%';

-- ============================================================================
-- 6. CREATE TELECONSULT RECORDS
-- ============================================================================

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE + INTERVAL '1 day',
    '16:00',
    'teleconsult',
    'pending',
    'ভিডিও কল কনসাল্টেশন'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%রবিউল%' AND d.name LIKE '%রফিক%';

INSERT INTO public.appointments (patient_id, doctor_id, date, time, type, status, notes)
SELECT 
    p.id,
    d.id,
    CURRENT_DATE + INTERVAL '2 days',
    '14:30',
    'teleconsult',
    'pending',
    'ফলো-আপ ভিডিও কল'
FROM public.patients p, public.doctors d 
WHERE p.name LIKE '%সাবিনা%' AND d.name LIKE '%করিম%';

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Check data counts
SELECT 'Admins' as table_name, COUNT(*) as count FROM public.admins
UNION ALL
SELECT 'Doctors', COUNT(*) FROM public.doctors
UNION ALL
SELECT 'Patients', COUNT(*) FROM public.patients
UNION ALL
SELECT 'Appointments', COUNT(*) FROM public.appointments
UNION ALL
SELECT 'Schedules', COUNT(*) FROM public.schedules;

-- View sample appointments with details
SELECT 
    a.date,
    a.time,
    a.type,
    a.status,
    p.name as patient_name,
    d.name as doctor_name,
    d.specialization
FROM public.appointments a
JOIN public.patients p ON a.patient_id = p.id
JOIN public.doctors d ON a.doctor_id = d.id
ORDER BY a.date DESC, a.time DESC
LIMIT 10;


-- ============================================================================
-- DONE! 
-- ============================================================================

/*
Login Credentials:
==================

Admin:
- Email: admin@clinic.com
- Password: admin123

Doctors (use passcode to login):
- Dr. Rahim: passcode = 12345
- Dr. Fariha: passcode = 23456
- Dr. Karim: passcode = 34567
- Dr. Salma: passcode = 45678
- Dr. Hasan: passcode = 56789
- Dr. Nurjahan: passcode = 67890
- Dr. Rafiq: passcode = 78901
- Dr. Sabina: passcode = 89012

Patients (register new or use these):
- rubel@example.com / patient123
- sabina@example.com / patient123
- rahim@example.com / patient123

Next Steps:
===========
1. Run the schema file (supabaseBackupSetup.sql) first
2. Then run this seed data file
3. Configure your .env.local with Supabase credentials
4. Start your development server
*/