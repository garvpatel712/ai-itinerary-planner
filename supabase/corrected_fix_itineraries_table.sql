-- CORRECTED SQL: Fix the table based on actual constraints discovered
-- Run this in your Supabase SQL editor

-- First, let's see the current table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'itineraries' 
-- ORDER BY ordinal_position;

-- Fix the budget column type and user_id constraint
ALTER TABLE itineraries 
ALTER COLUMN budget TYPE TEXT USING budget::TEXT,
ALTER COLUMN user_id DROP NOT NULL;

-- Add missing columns that the application expects
-- Only add if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'title') THEN
        ALTER TABLE itineraries ADD COLUMN title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'summary') THEN
        ALTER TABLE itineraries ADD COLUMN summary TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'itinerary') THEN
        ALTER TABLE itineraries ADD COLUMN itinerary JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'accommodationOptions') THEN
        ALTER TABLE itineraries ADD COLUMN "accommodationOptions" JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'transportation') THEN
        ALTER TABLE itineraries ADD COLUMN transportation JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'budgetBreakdown') THEN
        ALTER TABLE itineraries ADD COLUMN "budgetBreakdown" JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'travelTips') THEN
        ALTER TABLE itineraries ADD COLUMN "travelTips" JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'payload') THEN
        ALTER TABLE itineraries ADD COLUMN payload JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'status') THEN
        ALTER TABLE itineraries ADD COLUMN status TEXT DEFAULT 'draft';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'itineraries' AND column_name = 'source') THEN
        ALTER TABLE itineraries ADD COLUMN source TEXT DEFAULT 'ai-generator-v1';
    END IF;
END
$$;

-- Ensure RLS is properly configured
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create new ones
DROP POLICY IF EXISTS "Allow all inserts" ON itineraries;
DROP POLICY IF EXISTS "Allow users to view all" ON itineraries;
DROP POLICY IF EXISTS "Users can view own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can insert own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can update own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can delete own itineraries" ON itineraries;

-- Create new permissive policies
CREATE POLICY "Allow all operations" ON itineraries
    FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON itineraries TO anon;
GRANT ALL ON itineraries TO authenticated;
GRANT ALL ON itineraries TO service_role;

-- Add comments
COMMENT ON TABLE itineraries IS 'Travel itineraries - CORRECTED VERSION';
COMMENT ON COLUMN itineraries.user_id IS 'User ID (nullable for anonymous users)';
COMMENT ON COLUMN itineraries.user_email IS 'User email or "no-user" for anonymous';
COMMENT ON COLUMN itineraries.destination IS 'Travel destination';
COMMENT ON COLUMN itineraries.title IS 'Itinerary title';
COMMENT ON COLUMN itineraries.summary IS 'Brief summary';
COMMENT ON COLUMN itineraries.duration IS 'Duration in days';
COMMENT ON COLUMN itineraries.budget IS 'Budget as text';
COMMENT ON COLUMN itineraries.itinerary IS 'Daily itinerary JSON';
COMMENT ON COLUMN itineraries."accommodationOptions" IS 'Accommodation options JSON';
COMMENT ON COLUMN itineraries.transportation IS 'Transportation JSON';
COMMENT ON COLUMN itineraries."budgetBreakdown" IS 'Budget breakdown JSON';
COMMENT ON COLUMN itineraries."travelTips" IS 'Travel tips JSON';
COMMENT ON COLUMN itineraries.payload IS 'Complete payload backup';
COMMENT ON COLUMN itineraries.status IS 'Status (draft, completed, etc.)';
COMMENT ON COLUMN itineraries.source IS 'Source of generation';