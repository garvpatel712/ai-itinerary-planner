
import { NextRequest, NextResponse } from 'next/server';

// This interface matches the data structure required by the ItineraryDisplay component.
interface Itinerary {
  destination: string;
  budget: number;
  duration: number;
  itinerary: Array<{ day: number; activities: Array<{ time: string; activity: string; cost: number }> }>;
  accommodationOptions: Array<{ name: string; type: string; pricePerNight: number; location: string; amenities: string[] }>;
  transportation: { toDestination: string; localTransport: string };
  budgetBreakdown: { travel: number; accommodation: number; food: number; activities: number; misc: number };
  travelTips: string[];
}

export async function POST(req: NextRequest) {
  console.log('Generate itinerary request started.');

  try {
    const formData = await req.json();
    const webhookUrl = 'http://localhost:5678/webhook/53faf401-4eed-49d5-b594-02caf601a09a';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    console.log('Sending request to webhook...');
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    const itineraryData = Array.isArray(rawData) && rawData.length > 0 && rawData[0].output
      ? rawData[0].output
      : rawData.output || rawData;

    if (!itineraryData || typeof itineraryData !== 'object') {
      console.error('Parsed webhook data is not in the expected format:', itineraryData);
      throw new Error('Unexpected data structure from webhook.');
    }

    console.log('Parsing and validating itinerary data...');
    // Transform the incoming data to match the ItineraryDisplay component's expected structure.
    const finalItinerary: Itinerary = {
      destination: itineraryData.destination,
      budget: itineraryData.budget,
      duration: itineraryData.duration,
      itinerary: itineraryData.itinerary,
      accommodationOptions: itineraryData.accommodationOptions,
      transportation: itineraryData.transportation,
      budgetBreakdown: itineraryData.budgetBreakdown,
      travelTips: itineraryData.travelTips,
    };
    
    console.log('Successfully processed itinerary. Sending response to client.');
    return NextResponse.json({ itinerary: finalItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    
    const errorMessage = error instanceof Error 
      ? (error.name === 'AbortError' ? 'Webhook request timed out after 60 seconds.' : error.message)
      : 'An unknown error occurred';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
