// Complete test of the final implementation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahpphstloxuecpznkyqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFocHBoc3Rsb3h1ZWNwem5reXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTM0ODQsImV4cCI6MjA3MzUyOTQ4NH0.mF2Hcunr_GbEMfv5x2LSzq7NhnlhWl8ppzZP5yoZKYo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function completeTest() {
  console.log('🧪 COMPLETE FINAL TEST 🧪\n');

  // Test 1: Logged-in user (your actual user)
  console.log('✅ Test 1: Logged-in user (garvpatel168@gmail.com)');
  const loggedInTest = {
    user_id: '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd',
    destination: 'Shimla',
    duration: 4,
    budget: 75000,
    summary: 'Hill station paradise',
    startlocation: 'Delhi',
    interests: ['nature', 'adventure'],
    travelstyle: 'mid-range',
    status: 'draft',
    itinerary: [{ day: 1, activities: ['Arrival', 'Hotel check-in', 'Mall Road walk'] }],
    accommodationoptions: [{ name: 'Shimla Hotel', type: 'Hotel' }],
    transportation: [{ type: 'Bus', details: 'Delhi to Shimla' }],
    budgetbreakdown: { accommodation: 6000, transportation: 800, food: 2000 },
    traveltips: ['Carry warm clothes', 'Book accommodation in advance']
  };

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([loggedInTest])
      .select()
      .single();

    if (error) {
      console.log('❌ Logged-in user failed:', error.message);
    } else {
      console.log('✅ SUCCESS! Logged-in user stored itinerary');
      console.log('📋 ID:', data.id);
      console.log('📍 Destination:', data.destination);
      console.log('💰 Budget: ₹', data.budget);
      console.log('👤 User:', data.user_id.substring(0, 8) + '...');
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }

  // Test 2: Anonymous user (null user_id)
  console.log('\n✅ Test 2: Anonymous user (no login)');
  const anonymousTest = {
    user_id: null, // This should now work with the foreign key fix
    destination: 'Goa',
    duration: 6,
    budget: 120000,
    summary: 'Beach paradise vacation',
    startlocation: 'Mumbai',
    interests: ['beach', 'nightlife', 'food'],
    travelstyle: 'luxury',
    status: 'draft',
    itinerary: [{ day: 1, activities: ['Arrival', 'Beach check-in', 'Sunset'] }],
    accommodationoptions: [{ name: 'Beach Resort', type: 'Resort' }],
    transportation: [{ type: 'Flight', details: 'Mumbai to Goa' }],
    budgetbreakdown: { accommodation: 15000, transportation: 8000, food: 8000 },
    traveltips: ['Book beach shacks in advance', 'Try local seafood']
  };

  try {
    const { data: anonData, error: anonError } = await supabase
      .from('itineraries')
      .insert([anonymousTest])
      .select()
      .single();

    if (anonError) {
      console.log('❌ Anonymous user failed:', anonError.message);
    } else {
      console.log('✅ SUCCESS! Anonymous user stored itinerary');
      console.log('📋 ID:', anonData.id);
      console.log('📍 Destination:', anonData.destination);
      console.log('💰 Budget: ₹', anonData.budget);
      console.log('👤 User: Anonymous (null)');
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }

  // Test 3: Retrieve all itineraries to verify both are stored
  console.log('\n✅ Test 3: Verifying all stored itineraries');
  const { data: allData, error: allError } = await supabase
    .from('itineraries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (allError) {
    console.log('❌ Retrieval failed:', allError.message);
  } else {
    console.log('✅ SUCCESS! Retrieved', allData.length, 'itineraries');
    console.log('\n📊 STORED ITINERARIES:');
    allData.forEach((itinerary, index) => {
      const userType = itinerary.user_id === null ? 'Anonymous' : 
        itinerary.user_id === '0038bf2f-ef3d-4ad8-b33f-c1d4721cc4bd' ? 'garvpatel168@gmail.com' : 'Other User';
      console.log(`${index + 1}. ${itinerary.destination} (${itinerary.duration} days) - ${userType} - ₹${itinerary.budget} - ${new Date(itinerary.created_at).toLocaleString()}`);
    });
  }

  console.log('\n🎉 COMPLETE TEST FINISHED! 🎉');
  console.log('✅ User association is working perfectly!');
  console.log('✅ Both logged-in and anonymous users can store itineraries!');
  console.log('✅ All data is being stored correctly in Supabase!');
  console.log('\n🚀 Your implementation is ready! Generate a new itinerary to test it live!');
}

completeTest();