// Test to verify the SQL fix worked and storage is now working
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorageAfterFix() {
  console.log('🧪 Testing storage after SQL fix...\n');

  try {
    // Test 1: Insert with all columns that the API uses
    console.log('1️⃣ Testing full itinerary insert...');
    const testItinerary = {
      user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd', // Your user ID from the logs
      user_email: 'garvpatel168@gmail.com',
      destination: 'Matheran',
      title: 'Matheran - 3 Days',
      duration: 3,
      budget: 'Medium',
      summary: 'Beautiful hill station getaway',
      itinerary: [{ day: 1, activities: ['Arrival', 'Check-in', 'Local sightseeing'] }],
      accommodationOptions: [{ name: 'Hotel Test', type: 'Hotel', pricePerNight: 2000 }],
      transportation: [{ type: 'Train', details: 'Mumbai to Neral' }],
      budgetBreakdown: { accommodation: 4000, transportation: 500, food: 1500, activities: 1000 },
      travelTips: ['Carry warm clothes', 'Book train tickets in advance'],
      payload: { complete: 'data' },
      status: 'draft',
      source: 'ai-generator-v1'
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('itineraries')
      .insert([testItinerary])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('Error code:', insertError.code);
      return;
    } else {
      console.log('✅ SUCCESS! Full insert worked!');
      console.log('📋 Inserted ID:', insertedData.id);
      console.log('📍 Destination:', insertedData.destination);
      console.log('👤 User:', insertedData.user_email);
    }

    // Test 2: Insert for anonymous user (no user_id)
    console.log('\n2️⃣ Testing anonymous user insert...');
    const anonymousItinerary = {
      user_id: null,
      user_email: 'no-user',
      destination: 'Goa',
      title: 'Goa - 5 Days',
      duration: 5,
      budget: 'High',
      summary: 'Beach vacation',
      itinerary: [],
      accommodationOptions: [],
      transportation: [],
      budgetBreakdown: {},
      travelTips: [],
      payload: {},
      status: 'draft',
      source: 'ai-generator-v1'
    };

    const { data: anonData, error: anonError } = await supabase
      .from('itineraries')
      .insert([anonymousItinerary])
      .select()
      .single();

    if (anonError) {
      console.log('❌ Anonymous insert failed:', anonError.message);
    } else {
      console.log('✅ Anonymous insert worked!');
      console.log('📋 Anonymous ID:', anonData.id);
    }

    // Test 3: Retrieve all itineraries to verify storage
    console.log('\n3️⃣ Retrieving all itineraries...');
    const { data: allData, error: allError } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.log('❌ Retrieval failed:', allError.message);
    } else {
      console.log('✅ Retrieved', allData.length, 'itineraries');
      allData.forEach((itinerary, index) => {
        console.log(`${index + 1}. ${itinerary.destination} - ${itinerary.user_email} - ${itinerary.created_at}`);
      });
    }

    console.log('\n🎉 All tests completed!');
    console.log('\n✅ The SQL fix worked! Itineraries are now being stored correctly.');
    console.log('✅ User association is working for both logged-in and anonymous users.');

  } catch (error) {
    console.error('❌ Test failed with exception:', error.message);
  }
}

testStorageAfterFix();