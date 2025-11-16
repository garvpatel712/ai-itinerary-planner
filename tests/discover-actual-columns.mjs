// Test to see what columns actually exist after the SQL fix
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discoverActualColumns() {
  console.log('🔍 Discovering actual columns after SQL fix...\n');

  // Try to insert with just basic columns that should exist
  const basicTest = {
    destination: 'Test Destination',
    duration: 5,
    budget: 'Medium'
  };

  console.log('1️⃣ Testing with basic columns only...');
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([basicTest])
      .select()
      .single();

    if (error) {
      console.log('❌ Basic insert failed:', error.message);
      
      // Try with user_id
      console.log('\n2️⃣ Testing with user_id...');
      const userTest = {
        user_id: null,
        destination: 'Test Destination'
      };
      
      const { data: userData, error: userError } = await supabase
        .from('itineraries')
        .insert([userTest])
        .select()
        .single();

      if (userError) {
        console.log('❌ User test failed:', userError.message);
      } else {
        console.log('✅ User test worked! Available columns:', Object.keys(userData));
      }
    } else {
      console.log('✅ Basic insert worked!');
      console.log('📋 Available columns:', Object.keys(data));
      
      // Now let's see what the actual table structure is
      console.log('\n3️⃣ Checking full table structure...');
      const { data: allData, error: allError } = await supabase
        .from('itineraries')
        .select('*')
        .limit(1);

      if (!allError && allData && allData.length > 0) {
        console.log('📊 Full table columns:', Object.keys(allData[0]));
      }
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

discoverActualColumns();