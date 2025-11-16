// Test to discover the actual table schema by trying different column combinations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function discoverSchema() {
  console.log('🔍 Discovering actual table schema by testing column insertions...\n');

  const testData = {
    destination: 'Test Destination',
    duration: 5,
    budget: 'Medium',
    summary: 'Test summary'
  };

  // Test different column combinations
  const testCases = [
    {
      name: 'Basic columns only',
      data: {
        user_id: null,
        user_email: 'no-user',
        destination: testData.destination,
        duration: testData.duration,
        budget: testData.budget
      }
    },
    {
      name: 'With title',
      data: {
        user_id: null,
        user_email: 'no-user',
        destination: testData.destination,
        duration: testData.duration,
        budget: testData.budget,
        title: 'Test Title'
      }
    },
    {
      name: 'With JSON fields as text',
      data: {
        user_id: null,
        user_email: 'no-user',
        destination: testData.destination,
        duration: testData.duration,
        budget: testData.budget,
        itinerary: JSON.stringify([]),
        accommodationOptions: JSON.stringify([])
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert([testCase.data])
        .select()
        .single();

      if (error) {
        console.log(`❌ Failed: ${error.message}`);
        if (error.message.includes('column')) {
          const missingCol = error.message.match(/column '([^']+)'/);
          if (missingCol) {
            console.log(`   Missing column: ${missingCol[1]}`);
          }
        }
      } else {
        console.log(`✅ Success! Inserted with ID: ${data.id}`);
        console.log('Available columns:', Object.keys(data));
        return data; // Return successful structure
      }
      console.log('');
    } catch (error) {
      console.log(`❌ Exception: ${error.message}\n`);
    }
  }
}

discoverSchema();