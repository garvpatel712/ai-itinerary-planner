import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // The webhook URL that will receive the form data and return the itinerary
    const webhookUrl = 'http://localhost:5678/webhook/53faf401-4eed-49d5-b594-02caf601a09a';

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

    // Parse the JSON response from the webhook
    const itineraryData = await webhookResponse.json();

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