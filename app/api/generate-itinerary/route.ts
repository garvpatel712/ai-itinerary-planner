import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    console.log('API route: Received request to generate itinerary');
    const formData = await req.json();
    console.log('API route: Form data received:', formData);

    // Get the authorization header to check for user session
    const authHeader = req.headers.get('authorization');
    let user = null;
    let userEmail = null;

    if (authHeader) {
      // Create a temporary Supabase client with the user's JWT
      const tempSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: authHeader,
            },
          },
        }
      );

      // Get the current user
      const { data: { user: currentUser }, error: userError } = await tempSupabase.auth.getUser();
      if (currentUser && !userError) {
        user = currentUser;
        userEmail = currentUser.email;
        console.log('API route: Found authenticated user:', userEmail);
      }
    } else {
      console.log('API route: No authorization header found - user not logged in');
    }

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

  // Store the itinerary in Supabase with user association
  try {
    console.log('API route: Attempting to store itinerary in Supabase');
    
    // Prepare the data for storage (matching the ACTUAL table structure)
    // Convert budget to number if it's a string, or use 0 as default
    const budgetValue = responseItinerary.budget;
    const budgetNumber = typeof budgetValue === 'string' ? 
      (budgetValue.includes('₹') ? parseInt(budgetValue.replace(/[^0-9]/g, '')) : 0) : 
      (typeof budgetValue === 'number' ? budgetValue : 0);

    // Use actual user ID if logged in, otherwise use a special anonymous UUID
    const userId = user?.id || '00000000-0000-0000-0000-000000000000'; // Anonymous user UUID

    const itineraryRecord = {
      user_id: userId,
      destination: responseItinerary.destination,
      duration: responseItinerary.duration,
      budget: budgetNumber, // Convert to number for the numeric column
      summary: responseItinerary.summary || '',
      startlocation: formData.startLocation || '', // Get from original form data
      interests: formData.interests || [], // Store interests from the original request
      travelstyle: formData.travelStyle || '', // Store travel style from original request
      status: 'draft',
      itinerary: responseItinerary.itinerary || [],
      accommodationoptions: responseItinerary.accommodationOptions || [], // Note: lowercase
      transportation: responseItinerary.transportation || [],
      budgetbreakdown: responseItinerary.budgetBreakdown || {}, // Note: lowercase
      traveltips: responseItinerary.travelTips || [], // Note: lowercase
    };

    console.log('API route: Storing itinerary with user info:', {
      user_id: itineraryRecord.user_id,
      destination: itineraryRecord.destination,
      duration: itineraryRecord.duration,
      budget: itineraryRecord.budget
    });

    // Insert into Supabase - this will work once the table has the right columns
    const { data: insertedItinerary, error: insertError } = await supabase
      .from('itineraries')
      .insert([itineraryRecord])
      .select()
      .single();

    if (insertError) {
      console.error('API route: Error storing itinerary in Supabase:', insertError);
      console.error('API route: Error details - Code:', insertError.code, 'Message:', insertError.message);
      
      // Provide specific guidance based on error type
      if (insertError.message.includes('column')) {
        console.error('API route: COLUMN ERROR - The table structure is wrong!');
        console.error('API route: Please run the SQL script in supabase/final_fix_itineraries_table.sql');
      } else if (insertError.message.includes('policy')) {
        console.error('API route: POLICY ERROR - RLS policies are blocking the insert!');
        console.error('API route: Please check RLS policies in Supabase dashboard');
      }
      
      // Continue even if storage fails - we still want to return the itinerary
    } else {
      console.log('API route: Successfully stored itinerary with ID:', insertedItinerary?.id);
      console.log('API route: Storage confirmed - itinerary saved to database');
    }
  } catch (storageError) {
    console.error('API route: Exception while storing itinerary:', storageError);
    console.error('API route: Storage failed but continuing to return itinerary');
    // Continue even if storage fails - we still want to return the itinerary
  }

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
