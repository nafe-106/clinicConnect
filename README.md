# Clinic Connect

A mobile-first clinic management app built with Next.js and TailwindCSS for small clinics in Bangladesh.

## Features

- **Admin Dashboard**: Schedule management, appointment overview, reports
- **Doctor Dashboard**: Daily schedule, appointments, teleconsult
- **Patient Dashboard**: Book appointments, view appointments, join teleconsult
- **Teleconsult**: Video calls using Jitsi integration
- **PWA**: Add to Home Screen, offline support

## Tech Stack

- Next.js 14+
- React 18+
- TailwindCSS
- Supabase (Backend)
- Firebase (Push Notifications - setup required)
- Jitsi (Video calls)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
npm install
```

### Configuration

1. Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the following SQL in your Supabase SQL editor to create the necessary tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'doctor', 'patient')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  specialty TEXT,
  phone TEXT,
  avatar_url TEXT,
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shifts table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT CHECK (type IN ('in-person', 'teleconsult')),
  reason TEXT,
  notes TEXT,
  teleconsult_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('appointment', 'shift', 'teleconsult', 'general')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## PWA Setup

The app is configured with next-pwa for offline support. Custom icons can be added to the public folder.

## UX Recommendations

1. **Trust building**: Show doctor credentials, patient reviews, clinic certifications
2. **Simplicity**: Minimize steps for booking - 3 clicks max
3. **Accessibility**: Large fonts (16px+), high contrast, simple icons
4. **Notifications**: Send SMS + Push for rural areas with poor internet
5. **Language**: Support Bengali throughout the app
6. **Offline**: Cache appointments and doctor list for offline access
# clinicConnect
