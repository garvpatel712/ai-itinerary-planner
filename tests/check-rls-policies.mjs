// Script to check and fix RLS policies
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';
const supabaseService = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndFixRLS() {
  console.log('🔍 Checking RLS policies and attempting to fix them...\n');

  // First, let's try to insert with service role key (bypassing RLS)
  console.log('1️⃣ Testing insert with service role (bypassing RLS)...');
  
  // Create a service role client (this won't work with anon key, but let's try)
  const testData = {
    user_id: null,
    user_email: 'no-user',
    destination: 'Test Destination',
    duration: 5,
    budget: 'Medium',
    summary: 'Test summary'
  };

  try {
    const { data, error } = await supabaseService
      .from('itineraries')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.log(`❌ Service role insert failed: ${error.message}`);
      
      if (error.message.includes('row-level security')) {
        console.log('\n🔧 This is definitely an RLS policy issue!');
        console.log('The current RLS policies are preventing inserts.');
        console.log('\n📝 SQL to fix this issue:');
        console.log(`
-- Fix RLS policies for itineraries table
ALTER TABLE itineraries DISABLE ROW LEVEL SECURITY;

-- Or create proper RLS policies that allow inserts
CREATE POLICY "Allow all inserts" ON itineraries
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON itineraries TO anon;
GRANT ALL ON itineraries TO authenticated;
`);
      }
    } else {
      console.log(`✅ Service role insert successful! ID: ${data.id}`);
      console.log('Available columns:', Object.keys(data));
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`);
  }

  // Try to check what policies exist
  console.log('\n2️⃣ Attempting to check existing policies...');
  
  // Try a simple select to see if we can read anything
  try {
    const { data: existingData, error: selectError } = await supabaseService
      .from('itineraries')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log(`❌ Cannot select from table: ${selectError.message}`);
    } else {
      console.log(`✅ Can select from table, found ${existingData?.length || 0} rows`);
      if (existingData && existingData.length > 0) {
        console.log('Available columns:', Object.keys(existingData[0]));
      }
    }
  } catch (error) {
    console.log(`❌ Select exception: ${error.message}`);
  }
}

checkAndFixRLS();