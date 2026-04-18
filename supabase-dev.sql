-- Disable email confirmation (for development)
-- Run this in Supabase SQL Editor

-- Option 1: Disable email confirmation globally
ALTER TABLE auth.users ALTER COLUMN email_confirm_at SET DEFAULT NOW();

-- Or use Authentication → Settings → Email in Supabase Dashboard
-- Disable "Confirm email" to allow instant signup

-- For now, let's create a simple bypass - insert user directly without waiting for trigger
