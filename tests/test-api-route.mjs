// Simple test to verify the API route works with user association
// This test simulates what happens when a user generates an itinerary

async function testAPIRoute() {
  console.log('🧪 Testing API route with user association...\n');

  try {
    // Test the actual API endpoint
    const testData = {
      destination: "Test Destination",
      budget: 50000,
      duration: 5,
      startLocation: "Mumbai",
      interests: ["culture", "nature"],
      travelStyle: "mid-range"
    };

    console.log('1️⃣ Testing API route without authentication...');
    const response1 = await fetch('http://localhost:3000/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response1.ok) {
      const data = await response1.json();
      console.log('✅ API route responded successfully');
      console.log('📋 Response structure:', Object.keys(data));
      if (data.itinerary) {
        console.log('✅ Itinerary data received');
        console.log('📍 Destination:', data.itinerary.destination);
        console.log('⏱️  Duration:', data.itinerary.duration);
      }
    } else {
      console.log('❌ API route failed:', response1.status, response1.statusText);
    }

    console.log('\n🎉 Test completed!');
    console.log('\n💡 Next steps:');
    console.log('1. Check the server logs to see if the itinerary was stored in Supabase');
    console.log('2. Test with a logged-in user to verify user association works');
    console.log('3. Verify in Supabase dashboard that itineraries are being saved');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('- The Next.js development server is running (npm run dev)');
    console.log('- The webhook server is running for itinerary generation');
  }
}

// Run the test
testAPIRoute();