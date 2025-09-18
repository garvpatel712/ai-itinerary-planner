import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // The webhook URL that will receive the form data and return the itinerary
    const webhookUrl = 'http://localhost:5678/webhook-test/1f3c415d-a7ec-47ac-a2ce-1cabfe2fdd2d';
    
    if (webhookUrl.includes('localhost:5678/webhook-test')) {
      console.warn('Using a default test webhook URL. Please replace with your actual webhook URL.');
    }

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
      console.error(`Webhook request failed with status ${webhookResponse.status}:`, errorBody);
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    const responseText = await webhookResponse.text();

    if (!responseText) {
      throw new Error('Webhook responded with empty body');
    }

    let itineraryData;
    try {
      itineraryData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse webhook response as JSON:', responseText);
      throw new Error('Failed to parse itinerary data from webhook.');
    }

    // Validate and structure the itinerary data
    const validatedItinerary = {
      destination: itineraryData.destination || 'Unknown Destination',
      duration: itineraryData.duration || 'N/A',
      totalBudget: itineraryData.totalBudget || 0,
      dailyItinerary: (itineraryData.dailyItinerary || []).map((day: any) => ({
        ...(day || {}),
        activities: (day?.activities || []).map((activity: any) => ({
          ...(activity || {}),
        })),
      })),
      accommodations: (itineraryData.accommodations || []).map((acc: any) => ({
        ...(acc || {}),
        amenities: acc?.amenities || [],
      })),
      transportation: itineraryData.transportation || [],
      budgetBreakdown: itineraryData.budgetBreakdown || {
        accommodation: 0,
        transportation: 0,
        activities: 0,
        food: 0,
        miscellaneous: 0,
      },
      tips: itineraryData.tips || [],
    };

    // Send the validated and structured itinerary data back to the frontend
    return NextResponse.json({ itinerary: validatedItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    // Return a more informative error message to the frontend
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
