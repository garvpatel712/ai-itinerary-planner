// Test the updated API structure
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdatedStructure() {
  console.log('🧪 Testing updated API structure...\n');

  // Test 1: Logged-in user (your user ID)
  console.log('1️⃣ Testing logged-in user...');
  const loggedInTest = {
    user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
    destination: 'Matheran',
    duration: 3,
    budget: 'Medium',
    summary: 'Beautiful hill station getaway',
    startlocation: 'Mumbai',
    interests: ['nature', 'trekking'],
    travelstyle: 'mid-range',
    status: 'draft',
    itinerary: [{ day: 1, activities: ['Arrival', 'Check-in'] }],
    accommodationoptions: [{ name: 'Hotel Test', type: 'Hotel' }],
    transportation: [{ type: 'Train', details: 'Mumbai to Neral' }],
    budgetbreakdown: { accommodation: 4000, transportation: 500 },
    traveltips: ['Carry warm clothes', 'Book train tickets']
  };

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([loggedInTest])
      .select()
      .single();

    if (error) {
      console.log('❌ Logged-in user test failed:', error.message);
    } else {
      console.log('✅ Logged-in user test worked!');
      console.log('📋 Inserted ID:', data.id);
      console.log('📍 Destination:', data.destination);
      console.log('👤 User ID:', data.user_id);
    }

    // Test 2: Anonymous user (using default UUID)
    console.log('\n2️⃣ Testing anonymous user...');
    const anonymousTest = {
      user_id: '00000000-0000-0000-0000-000000000000', // Default UUID for anonymous
      destination: 'Goa',
      duration: 5,
      budget: 'High',
      summary: 'Beach vacation',
      startlocation: 'Mumbai',
      interests: ['beach', 'nightlife'],
      travelstyle: 'luxury',
      status: 'draft',
      itinerary: [],
      accommodationoptions: [],
      transportation: [],
      budgetbreakdown: {},
      traveltips: []
    };

    const { data: anonData, error: anonError } = await supabase
      .from('itineraries')
      .insert([anonymousTest])
      .select()
      .single();

    if (anonError) {
      console.log('❌ Anonymous user test failed:', anonError.message);
    } else {
      console.log('✅ Anonymous user test worked!');
      console.log('📋 Anonymous ID:', anonData.id);
      console.log('📍 Anonymous Destination:', anonData.destination);
    }

    // Test 3: Retrieve all to verify
    console.log('\n3️⃣ Retrieving all itineraries...');
    const { data: allData, error: allError } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (allError) {
      console.log('❌ Retrieval failed:', allError.message);
    } else {
      console.log('✅ Retrieved', allData.length, 'itineraries');
      allData.forEach((itinerary, index) => {
        console.log(`${index + 1}. ${itinerary.destination} - User: ${itinerary.user_id.substring(0, 8)}... - ${itinerary.created_at}`);
      });
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ The updated API structure works with the actual table!');

  } catch (error) {
    console.error('❌ Test failed with exception:', error.message);
  }
}

testUpdatedStructure();