-- Final SQL script to fix itineraries table structure
-- Run this entire script in your Supabase SQL editor

-- First, let's see what columns we currently have
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'itineraries';

-- Drop existing table if it has wrong structure and recreate it
DROP TABLE IF EXISTS itineraries CASCADE;

-- Create the correct table structure matching the application
CREATE TABLE itineraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT DEFAULT 'no-user',
    destination TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    duration INTEGER,
    budget TEXT,
    itinerary JSONB,
    accommodationOptions JSONB,
    transportation JSONB,
    budgetBreakdown JSONB,
    travelTips JSONB,
    payload JSONB,
    status TEXT DEFAULT 'draft',
    source TEXT DEFAULT 'ai-generator-v1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX idx_itineraries_destination ON itineraries(destination);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_itineraries_user_email ON itineraries(user_email);

-- Enable RLS (Row Level Security)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can view own itineraries" ON itineraries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries" ON itineraries
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own itineraries" ON itineraries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries" ON itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to roles
GRANT SELECT ON itineraries TO anon;
GRANT INSERT ON itineraries TO anon;
GRANT SELECT ON itineraries TO authenticated;
GRANT INSERT ON itineraries TO authenticated;
GRANT UPDATE ON itineraries TO authenticated;
GRANT DELETE ON itineraries TO authenticated;

-- Add table and column comments
COMMENT ON TABLE itineraries IS 'Travel itineraries with user association';
COMMENT ON COLUMN itineraries.user_id IS 'Reference to auth.users table, nullable for anonymous users';
COMMENT ON COLUMN itineraries.user_email IS 'Email of the user who created the itinerary';
COMMENT ON COLUMN itineraries.destination IS 'Travel destination';
COMMENT ON COLUMN itineraries.title IS 'Generated title for the itinerary';
COMMENT ON COLUMN itineraries.summary IS 'Brief summary of the itinerary';
COMMENT ON COLUMN itineraries.duration IS 'Duration in days';
COMMENT ON COLUMN itineraries.budget IS 'Budget range or amount';
COMMENT ON COLUMN itineraries.itinerary IS 'Daily itinerary data as JSON';
COMMENT ON COLUMN itineraries.accommodationOptions IS 'Accommodation options as JSON array';
COMMENT ON COLUMN itineraries.transportation IS 'Transportation options as JSON';
COMMENT ON COLUMN itineraries.budgetBreakdown IS 'Detailed budget breakdown as JSON';
COMMENT ON COLUMN itineraries.travelTips IS 'Travel tips as JSON array';
COMMENT ON COLUMN itineraries.payload IS 'Complete original payload for backup';
COMMENT ON COLUMN itineraries.status IS 'Status: draft, completed, etc.';
COMMENT ON COLUMN itineraries.source IS 'Source of the itinerary generation';