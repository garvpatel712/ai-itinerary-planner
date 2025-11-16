-- FINAL FIX: Complete table and permissions setup
-- Run this ENTIRE script in your Supabase SQL editor

-- Step 1: Check if table exists and what columns it has
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'itineraries' ORDER BY ordinal_position;

-- Step 2: Drop existing table if it has wrong structure
DROP TABLE IF EXISTS itineraries CASCADE;

-- Step 3: Create the table with the EXACT structure the application expects
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

-- Step 4: Create indexes
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
CREATE INDEX idx_itineraries_destination ON itineraries(destination);
CREATE INDEX idx_itineraries_status ON itineraries(status);

-- Step 5: Enable RLS but make it permissive for inserts
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Step 6: Create permissive policies
CREATE POLICY "Allow all inserts" ON itineraries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view own itineraries" ON itineraries
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to update own itineraries" ON itineraries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own itineraries" ON itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Grant permissions
GRANT ALL ON itineraries TO anon;
GRANT ALL ON itineraries TO authenticated;
GRANT ALL ON itineraries TO service_role;

-- Step 8: Test the setup
-- INSERT INTO itineraries (user_id, user_email, destination, duration, budget, summary) 
-- VALUES (null, 'no-user', 'Test Destination', 5, 'Medium', 'Test summary');
-- SELECT * FROM itineraries WHERE destination = 'Test Destination';

-- Step 9: Clean up test data
-- DELETE FROM itineraries WHERE destination = 'Test Destination';

-- Step 10: Add comments
COMMENT ON TABLE itineraries IS 'Travel itineraries with user association - FINAL VERSION';
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