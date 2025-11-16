import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('API route: Received request to generate itinerary');
    const formData = await req.json();
    console.log('API route: Form data received:', formData);

    // The webhook URL that will receive the form data and return the itinerary
    const webhookUrl = 'http://localhost:5678/webhook/53faf401-4eed-49d5-b594-02caf601a09a';
    console.log('API route: Sending request to webhook:', webhookUrl);

    // Send the form data to the webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the form data directly as the request body
      body: JSON.stringify(formData),
    });

    // Check if the webhook responded successfully
    if (!webhookResponse.ok) {
      const errorBody = await webhookResponse.text();
      console.error(`API route: Webhook request failed with status ${webhookResponse.status}:`, errorBody);
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    console.log('API route: Webhook response status:', webhookResponse.status);
    const responseText = await webhookResponse.text();
    console.log('API route: Webhook response text length:', responseText.length);

    if (!responseText) {
      console.error('API route: Webhook responded with empty body');
      throw new Error('Webhook responded with empty body');
    }

    let itineraryData;
    try {
      const responseData = JSON.parse(responseText);
      console.log('API route: Successfully parsed webhook response as JSON');
      console.log('API route: Full webhook response data:', JSON.stringify(responseData, null, 2));
      
      // The webhook response is an array with a nested structure
      // Extract the actual itinerary data from the response
      if (Array.isArray(responseData) && responseData.length > 0) {
        if (responseData[0].output) {
          // Format: [{ output: { itinerary: [...] } }]
          itineraryData = responseData[0].output;
          console.log('API route: Found itinerary data in responseData[0].output');
          console.log('API route: Extracted itinerary data:', JSON.stringify(itineraryData, null, 2));
        } else {
          // Format: [{ itinerary: [...] }]
          itineraryData = responseData[0];
          console.log('API route: Found itinerary data in responseData[0]');
          console.log('API route: Extracted itinerary data:', JSON.stringify(itineraryData, null, 2));
        }
      } else {
        // Direct format: { itinerary: [...] }
        itineraryData = responseData;
        console.log('API route: Using direct response data');
        console.log('API route: Direct response data:', JSON.stringify(itineraryData, null, 2));
      }
    } catch (e) {
      console.error('API route: Failed to parse webhook response as JSON:', responseText);
      throw new Error('Failed to parse itinerary data from webhook.');
    }

    // itineraryData already contains the full itinerary object with all properties
    const itinerarySource = itineraryData;
    console.log('API route: Itinerary source keys:', Object.keys(itinerarySource));
    console.log('API route: Using itinerary source:', itinerarySource ? 'Found valid data' : 'No valid data structure');

    // Validate and structure the itinerary data
  const validatedItinerary = {
    destination: itinerarySource.destination || formData.destination,
    duration: itinerarySource.duration || formData.duration,
    budget: itinerarySource.budget || formData.budget,
    summary: itinerarySource.summary || "",
    dailyItinerary: [],
    accommodations: [],
    transportation: [],
    budgetBreakdown: itinerarySource.budgetBreakdown || {
      accommodation: 0,
      transportation: 0,
      food: 0,
      activities: 0,
      miscellaneous: 0,
    },
    tips: [],
  };

  // Handle the itinerary array format from the webhook response
  console.log('API route: Checking for itinerary array...');
  console.log('API route: itinerarySource.itinerary exists?', !!itinerarySource.itinerary);
  console.log('API route: itinerarySource.itinerary is array?', Array.isArray(itinerarySource.itinerary));
  
  if (Array.isArray(itinerarySource.itinerary)) {
    console.log('API route: Found itinerary array with length:', itinerarySource.itinerary.length);
    validatedItinerary.dailyItinerary = itinerarySource.itinerary.map((day: any) => ({
      day: day.day,
      activities: Array.isArray(day.activities) ? day.activities : []
    }));
  } else {
    console.log('API route: WARNING - itinerary is not an array. Type:', typeof itinerarySource.itinerary);
    console.log('API route: WARNING - itinerary value:', itinerarySource.itinerary);
  }

  // Handle accommodations
  console.log('API route: Checking for accommodations...');
  console.log('API route: itinerarySource.accommodationOptions exists?', !!itinerarySource.accommodationOptions);
  console.log('API route: itinerarySource.accommodationOptions is array?', Array.isArray(itinerarySource.accommodationOptions));
  
  if (Array.isArray(itinerarySource.accommodationOptions)) {
    console.log('API route: Found accommodations array with length:', itinerarySource.accommodationOptions.length);
    validatedItinerary.accommodations = itinerarySource.accommodationOptions.map((acc: any) => ({
      name: acc.name || '',
      type: acc.type || '',
      pricePerNight: acc.pricePerNight || 0,
      location: acc.location || '',
      amenities: Array.isArray(acc.amenities) ? acc.amenities : []
    }));
  } else {
    console.log('API route: WARNING - accommodationOptions is not an array. Type:', typeof itinerarySource.accommodationOptions);
  }

  // Handle transportation
  console.log('API route: Checking for transportation...');
  console.log('API route: itinerarySource.transportation exists?', !!itinerarySource.transportation);
  console.log('API route: itinerarySource.transportation value:', JSON.stringify(itinerarySource.transportation));
  
  if (itinerarySource.transportation) {
    (validatedItinerary.transportation as any) = [{
      type: 'To Destination',
      details: itinerarySource.transportation.toDestination || ''
    }, {
      type: 'Local Transport',
      details: itinerarySource.transportation.localTransport || ''
    }];
  }

  // Handle tips
  console.log('API route: Checking for tips...');
  console.log('API route: itinerarySource.travelTips exists?', !!itinerarySource.travelTips);
  console.log('API route: itinerarySource.travelTips is array?', Array.isArray(itinerarySource.travelTips));
  
  if (Array.isArray(itinerarySource.travelTips)) {
    console.log('API route: Found tips array with length:', itinerarySource.travelTips.length);
    validatedItinerary.tips = itinerarySource.travelTips;
  }

  console.log('API route: Validated itinerary data structure:', Object.keys(validatedItinerary));
  console.log('API route: Daily itinerary count:', validatedItinerary.dailyItinerary.length);
  console.log('API route: Accommodations count:', validatedItinerary.accommodations.length);
  console.log('API route: Transportation entries:', validatedItinerary.transportation.length);
  console.log('API route: Tips count:', validatedItinerary.tips.length);

  // Transform to match component's expected structure
  const responseItinerary = {
    destination: validatedItinerary.destination,
    duration: validatedItinerary.duration,
    budget: validatedItinerary.budget,
    summary: validatedItinerary.summary,
    itinerary: validatedItinerary.dailyItinerary,
    accommodationOptions: validatedItinerary.accommodations,
    transportation: validatedItinerary.transportation,
    budgetBreakdown: validatedItinerary.budgetBreakdown,
    travelTips: validatedItinerary.tips,
  };

  console.log('API route: Final response itinerary:', JSON.stringify(responseItinerary, null, 2));

  // Send the validated and structured itinerary data back to the frontend
    console.log('API route: Sending response back to client');
    return NextResponse.json({ itinerary: responseItinerary });

  } catch (error) {
    console.error('API route: Error in generate-itinerary route:', error);
    // Return a more informative error message to the frontend
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
