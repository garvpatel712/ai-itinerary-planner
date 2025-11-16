-- SQL script to create itineraries table for travel itinerary storage
-- Run this in your Supabase SQL editor

-- Create itineraries table with user association
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    destination TEXT NOT NULL,
    duration INTEGER NOT NULL,
    budget TEXT NOT NULL,
    summary TEXT,
    itinerary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON itineraries(destination);

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

-- Add a comment to document the table
COMMENT ON TABLE itineraries IS 'Stores travel itineraries with user association for the AI Travel Planner app';
COMMENT ON COLUMN itineraries.user_id IS 'Reference to the auth.users table, nullable for non-authenticated users';
COMMENT ON COLUMN itineraries.user_email IS 'Email of the user who created the itinerary, defaults to "no-user" for anonymous users';
COMMENT ON COLUMN itineraries.itinerary_data IS 'Complete itinerary data as JSON including daily plans, accommodations, transportation, etc.';