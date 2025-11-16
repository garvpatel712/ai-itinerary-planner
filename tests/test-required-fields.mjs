// Test with the actual required fields discovered
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithRequiredFields() {
  console.log('🧪 Testing with actual required fields...\n');

  // Test 1: With required fields only
  console.log('1️⃣ Testing: user_id + destination + duration (required fields)');
  const requiredTest = {
    user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
    destination: 'Matheran',
    duration: 3
  };

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([requiredTest])
      .select()
      .single();

    if (error) {
      console.log('❌ Required fields test failed:', error.message);
    } else {
      console.log('✅ Required fields test worked!');
      console.log('📋 Available columns:', Object.keys(data));
      console.log('📍 Inserted ID:', data.id);
      
      // Test 2: Now let's add more fields to see what's available
      console.log('\n2️⃣ Testing with additional fields...');
      const extendedTest = {
        user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
        destination: 'Goa',
        duration: 5,
        budget: 'High', // Try budget
        title: 'Goa Trip' // Try title
      };
      
      const { data: extData, error: extError } = await supabase
        .from('itineraries')
        .insert([extendedTest])
        .select()
        .single();

      if (extError) {
        console.log('❌ Extended test failed:', extError.message);
      } else {
        console.log('✅ Extended test worked!');
        console.log('📋 Extended columns:', Object.keys(extData));
      }
      
      // Test 3: Test anonymous user (user_id = null)
      console.log('\n3️⃣ Testing anonymous user...');
      const anonTest = {
        user_id: null, // This should fail due to NOT NULL constraint
        destination: 'Anonymous Test',
        duration: 2
      };
      
      const { data: anonData, error: anonError } = await supabase
        .from('itineraries')
        .insert([anonTest])
        .select()
        .single();

      if (anonError) {
        console.log('❌ Anonymous test failed (expected):', anonError.message);
        console.log('💡 Anonymous users need a different approach - maybe use a special user_id');
      } else {
        console.log('✅ Anonymous test worked!');
      }
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

testWithRequiredFields();