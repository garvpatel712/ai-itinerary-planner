-- SQL script to add missing columns to itineraries table
-- Run this in your Supabase SQL editor to add the missing columns

-- Add missing columns to match the existing application structure
ALTER TABLE itineraries 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS itinerary JSONB,
ADD COLUMN IF NOT EXISTS accommodationOptions JSONB,
ADD COLUMN IF NOT EXISTS transportation JSONB,
ADD COLUMN IF NOT EXISTS budgetBreakdown JSONB,
ADD COLUMN IF NOT EXISTS travelTips JSONB,
ADD COLUMN IF NOT EXISTS payload JSONB,
ADD COLUMN IF NOT EXISTS status TEXT;

-- Update existing columns if needed
ALTER TABLE itineraries 
ALTER COLUMN user_email SET DEFAULT 'no-user',
ALTER COLUMN duration TYPE INTEGER USING duration::INTEGER,
ALTER COLUMN budget TYPE TEXT USING budget::TEXT;

-- Add indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_itineraries_title ON itineraries(title);
CREATE INDEX IF NOT EXISTS idx_itineraries_status ON itineraries(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_source ON itineraries(source);

-- Update comments for new columns
COMMENT ON COLUMN itineraries.title IS 'Title of the itinerary';
COMMENT ON COLUMN itineraries.source IS 'Source of the itinerary (e.g., ai-generator-v1)';
COMMENT ON COLUMN itineraries.itinerary IS 'Daily itinerary data as JSON';
COMMENT ON COLUMN itineraries.accommodationOptions IS 'Accommodation options as JSON';
COMMENT ON COLUMN itineraries.transportation IS 'Transportation options as JSON';
COMMENT ON COLUMN itineraries.budgetBreakdown IS 'Budget breakdown as JSON';
COMMENT ON COLUMN itineraries.travelTips IS 'Travel tips as JSON array';
COMMENT ON COLUMN itineraries.payload IS 'Complete payload data for backup';
COMMENT ON COLUMN itineraries.status IS 'Status of the itinerary (draft, completed, etc.)';