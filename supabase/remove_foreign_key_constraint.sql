-- FINAL FIX: Remove foreign key constraint to allow anonymous users
-- Run this in your Supabase SQL editor

-- Remove the foreign key constraint completely
ALTER TABLE itineraries 
DROP CONSTRAINT IF EXISTS itineraries_user_id_fkey;

-- Create a simple index on user_id instead
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);

-- This allows:
-- 1. Logged-in users: use their actual user_id
-- 2. Anonymous users: use '00000000-0000-0000-0000-000000000000' or any UUID
-- 3. No foreign key violations