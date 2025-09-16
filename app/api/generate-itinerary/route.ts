import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // The webhook URL that will receive the form data and return the itinerary
    const webhookUrl = 'http://localhost:5678/webhook-test/1f3c415d-a7ec-47ac-a2ce-1cabfe2fdd2d';

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

    // Parse the JSON response from the webhook, which should contain the itinerary
    const itineraryData = await webhookResponse.json();

    // Send the itinerary data back to the frontend
    return NextResponse.json({ itinerary: itineraryData });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    // Return a more informative error message to the frontend
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
