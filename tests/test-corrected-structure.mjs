// Test with corrected column understanding
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCorrectedStructure() {
  console.log('🧪 Testing with corrected table structure...\n');

  // Test 1: Try with a valid user_id (not null)
  console.log('1️⃣ Testing with valid user_id...');
  const validUserTest = {
    user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd', // Your actual user ID
    user_email: 'garvpatel168@gmail.com',
    destination: 'Matheran',
    duration: 3,
    budget: 'Medium' // Try as string first
  };

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([validUserTest])
      .select()
      .single();

    if (error) {
      console.log('❌ Valid user test failed:', error.message);
      
      // Try with budget as number
      console.log('\n2️⃣ Trying with budget as number...');
      const numberBudgetTest = {
        user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
        user_email: 'garvpatel168@gmail.com',
        destination: 'Matheran',
        duration: 3,
        budget: 50000 // As number
      };
      
      const { data: numData, error: numError } = await supabase
        .from('itineraries')
        .insert([numberBudgetTest])
        .select()
        .single();

      if (numError) {
        console.log('❌ Number budget test failed:', numError.message);
      } else {
        console.log('✅ Number budget test worked!');
        console.log('📋 Available columns:', Object.keys(numData));
      }
    } else {
      console.log('✅ Valid user test worked!');
      console.log('📋 Available columns:', Object.keys(data));
      console.log('📍 Inserted ID:', data.id);
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

testCorrectedStructure();