// Test script for itinerary storage functionality
import { createClient } from '@supabase/supabase-js';

// Create Supabase client (using the same configuration as the app)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testItineraryStorage() {
  console.log('🧪 Testing itinerary storage functionality...\n');

  try {
    // Test 1: Check if itineraries table exists
    console.log('1️⃣ Testing if itineraries table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('itineraries')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('❌ Itineraries table does not exist or is not accessible:', tableError.message);
      console.log('💡 You may need to create the table manually in Supabase dashboard');
    } else {
      console.log('✅ Itineraries table exists and is accessible');
    }

    // Test 2: Test with a mock itinerary (no user - should store with 'no-user')
    console.log('\n2️⃣ Testing itinerary storage without user...');
    const mockItinerary = {
      destination: 'Test Destination',
      duration: '5 days',
      budget: 'Medium',
      summary: 'Test itinerary summary',
      itinerary_data: {
        destination: 'Test Destination',
        duration: '5 days',
        budget: 'Medium',
        dailyItinerary: [
          {
            day: 1,
            activities: [{ time: '9:00 AM', activity: 'Arrival and check-in' }]
          }
        ]
      }
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('itineraries')
      .insert([{
        user_id: null,
        user_email: 'no-user',
        destination: mockItinerary.destination,
        title: `${mockItinerary.destination} - Test`,
        duration: 5,
        budget: mockItinerary.budget,
        summary: mockItinerary.summary,
        itinerary: mockItinerary.itinerary_data.dailyItinerary || [],
        accommodationOptions: [],
        transportation: [],
        budgetBreakdown: {},
        travelTips: [],
        payload: mockItinerary.itinerary_data,
        status: 'draft',
        source: 'test-script'
      }])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Failed to insert test itinerary:', insertError.message);
    } else {
      console.log('✅ Successfully stored itinerary with ID:', insertedData.id);
      console.log('📋 Stored data:', {
        id: insertedData.id,
        destination: insertedData.destination,
        user_email: insertedData.user_email,
        created_at: insertedData.created_at
      });
    }

    // Test 3: Test retrieval
    console.log('\n3️⃣ Testing itinerary retrieval...');
    const { data: retrievedData, error: retrieveError } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (retrieveError) {
      console.log('❌ Failed to retrieve itineraries:', retrieveError.message);
    } else {
      console.log('✅ Successfully retrieved', retrievedData.length, 'itineraries');
      if (retrievedData.length > 0) {
        console.log('📊 Latest itinerary:', {
          id: retrievedData[0].id,
          destination: retrievedData[0].destination,
          user_email: retrievedData[0].user_email,
          created_at: retrievedData[0].created_at
        });
      }
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testItineraryStorage();