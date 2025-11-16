-- FINAL FIX: Allow null user_id for anonymous users
-- Run this in your Supabase SQL editor

-- Fix the foreign key constraint to allow null user_id
ALTER TABLE itineraries 
ALTER COLUMN user_id DROP NOT NULL;

-- Make the foreign key constraint optional
ALTER TABLE itineraries 
DROP CONSTRAINT IF EXISTS itineraries_user_id_fkey,
ADD CONSTRAINT itineraries_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) 
  ON DELETE SET NULL 
  DEFERRABLE INITIALLY DEFERRED;