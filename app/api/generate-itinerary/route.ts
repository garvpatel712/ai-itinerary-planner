
import { NextRequest, NextResponse } from 'next/server';

// Define the structure for the final, validated itinerary object
interface ValidatedItinerary {
  destination: string;
  duration: number;
  totalBudget: number; // Renamed from 'budget' for clarity
  startLocation: string;
  travelStyle: string;
  interests: string[];
  itinerary: any[]; // Keeping this flexible as the structure can vary
  accommodationOptions: any[];
  transportation: any;
  budgetBreakdown: any;
  travelTips: string[];
}

// Main function to handle POST requests
export async function POST(req: NextRequest) {
  console.log('Generate itinerary request started.');

  try {
    const formData = await req.json();

    // The webhook URL - should ideally be in environment variables
    const webhookUrl = 'http://localhost:5678/webhook/53faf401-4eed-49d5-b594-02caf601a09a';
    
    // Abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

    console.log('Sending request to webhook...');
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!webhookResponse.ok) {
      const errorBody = await webhookResponse.text();
      console.error(`Webhook request failed with status ${webhookResponse.status}: ${errorBody}`);
      throw new Error(`Webhook request failed. Status: ${webhookResponse.status}`);
    }

    const responseText = await webhookResponse.text();
    console.log('Received response from webhook.');

    if (!responseText) {
      console.error('Webhook responded with an empty body.');
      throw new Error('Webhook responded with empty body');
    }

    let rawData;
    try {
      rawData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse webhook response as JSON:', responseText);
      throw new Error('Invalid JSON from webhook.');
    }

    // Safely access the nested payload.
    // The webhook might return an array `[ { output: { ... } } ]` or a plain object.
    const itineraryData = Array.isArray(rawData) && rawData.length > 0 && rawData[0].output
      ? rawData[0].output
      : rawData.output || rawData;

    if (!itineraryData || typeof itineraryData !== 'object') {
        console.error('Parsed webhook data is not in the expected format:', itineraryData);
        throw new Error('Unexpected data structure from webhook.');
    }

    console.log('Parsing and validating itinerary data...');
    // Create the clean, validated itinerary object as per requirements
    const validatedItinerary: ValidatedItinerary = {
      destination: itineraryData.destination,
      duration: itineraryData.duration,
      totalBudget: itineraryData.budget, // mapping 'budget' to 'totalBudget'
      startLocation: itineraryData.startLocation,
      travelStyle: itineraryData.travelStyle,
      interests: itineraryData.interests,
      itinerary: itineraryData.itinerary,
      accommodationOptions: itineraryData.accommodationOptions,
      transportation: itineraryData.transportation,
      budgetBreakdown: itineraryData.budgetBreakdown,
      travelTips: itineraryData.travelTips,
    };
    
    console.log('Successfully processed itinerary. Sending response to client.');
    // Return the final object nested under an 'itinerary' key
    return NextResponse.json({ itinerary: validatedItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    
    const errorMessage = error instanceof Error 
      ? (error.name === 'AbortError' ? 'Webhook request timed out after 60 seconds.' : error.message)
      : 'An unknown error occurred';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
