// Test with absolute minimum columns to find what actually works
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findWorkingColumns() {
  console.log('🔍 Finding the absolute minimum working columns...\n');

  // Try with just user_id and destination
  console.log('1️⃣ Testing: user_id + destination only');
  const test1 = {
    user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
    destination: 'Matheran'
  };

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([test1])
      .select()
      .single();

    if (error) {
      console.log('❌ Failed:', error.message);
      
      // Try with just destination (no user_id)
      console.log('\n2️⃣ Testing: destination only');
      const test2 = {
        destination: 'Matheran'
      };
      
      const { data: data2, error: error2 } = await supabase
        .from('itineraries')
        .insert([test2])
        .select()
        .single();

      if (error2) {
        console.log('❌ Also failed:', error2.message);
        
        // Try empty record
        console.log('\n3️⃣ Testing: empty record');
        const { data: data3, error: error3 } = await supabase
          .from('itineraries')
          .insert([{}])
          .select()
          .single();

        if (error3) {
          console.log('❌ Empty record failed:', error3.message);
        } else {
          console.log('✅ Empty record worked!');
          console.log('📋 Available columns:', Object.keys(data3));
        }
      } else {
        console.log('✅ Destination only worked!');
        console.log('📋 Available columns:', Object.keys(data2));
      }
    } else {
      console.log('✅ User_id + destination worked!');
      console.log('📋 Available columns:', Object.keys(data));
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

findWorkingColumns();