-- Create itineraries table with user association
CREATE TABLE itineraries (
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

-- Create index for better query performance
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies for different access levels
-- Allow users to see their own itineraries
CREATE POLICY "Users can view own itineraries" ON itineraries
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own itineraries
CREATE POLICY "Users can insert own itineraries" ON itineraries
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own itineraries
CREATE POLICY "Users can update own itineraries" ON itineraries
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own itineraries
CREATE POLICY "Users can delete own itineraries" ON itineraries
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON itineraries TO anon;
GRANT INSERT ON itineraries TO anon;
GRANT SELECT ON itineraries TO authenticated;
GRANT INSERT ON itineraries TO authenticated;
GRANT UPDATE ON itineraries TO authenticated;
GRANT DELETE ON itineraries TO authenticated;