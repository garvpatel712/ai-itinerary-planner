// Test with minimal columns to discover what's actually available
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMinimalInsert() {
  console.log('🔍 Testing with minimal columns to find what exists...\n');

  // Try with just one column at a time
  const minimalTests = [
    {
      name: 'Just destination',
      data: { destination: 'Test Destination' }
    },
    {
      name: 'Just user_id',
      data: { user_id: null }
    },
    {
      name: 'Empty record',
      data: {}
    }
  ];

  for (const test of minimalTests) {
    console.log(`Testing: ${test.name}`);
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert([test.data])
        .select()
        .single();

      if (error) {
        console.log(`❌ Failed: ${error.message}`);
      } else {
        console.log(`✅ Success! Inserted with ID: ${data.id}`);
        console.log('Available columns from result:', Object.keys(data));
        
        // Now let's see what columns exist by selecting everything
        const { data: allData, error: allError } = await supabase
          .from('itineraries')
          .select('*')
          .eq('id', data.id)
          .single();
        
        if (!allError) {
          console.log('All columns in table:', Object.keys(allData));
        }
        return data;
      }
      console.log('');
    } catch (error) {
      console.log(`❌ Exception: ${error.message}\n`);
    }
  }

  // If all else fails, let's try to see what happens with a raw query
  console.log('🔍 Trying to get table info with raw SQL...');
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', { 
        query: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'itineraries' ORDER BY ordinal_position;"
      });

    if (error) {
      console.log('❌ Raw query failed:', error.message);
    } else {
      console.log('✅ Raw query result:', data);
    }
  } catch (error) {
    console.log('❌ Raw query exception:', error.message);
  }
}

testMinimalInsert();