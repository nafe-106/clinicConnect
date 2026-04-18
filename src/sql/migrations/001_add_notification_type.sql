-- Migration: Add type column to notifications table
-- Run this in your Supabase SQL Editor

-- Add type column if it doesn't exist
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';

-- Rename user_type to type if user_type exists (update existing data)
-- Note: user_type is now called type for simplicity

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'notifications';

-- Sample data check
SELECT * FROM public.notifications LIMIT 5;
