import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    const webhookUrl = 'http://localhost:5678/webhook/53faf401-4eed-49d5-b594-02caf601a09a';

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!webhookResponse.ok) {
      const errorBody = await webhookResponse.text();
      console.error(`Webhook request failed with status ${webhookResponse.status}:`, errorBody);
      throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
    }

    const responseText = await webhookResponse.text();
    if (!responseText) {
      throw new Error('Webhook responded with empty body');
    }

    let rawItineraryData;
    try {
      rawItineraryData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse webhook response as JSON:', responseText);
      throw new Error('Failed to parse itinerary data from webhook.');
    }

    // Map the webhook data to the structure expected by the frontend component.
    const mappedItinerary = {
      destination: rawItineraryData.destination,
      budget: rawItineraryData.totalBudget, // The component expects 'budget'
      duration: parseInt(rawItineraryData.duration, 10) || 0, // The component expects a number
      itinerary: rawItineraryData.dailyItinerary?.map((day: any) => ({
        day: day.day,
        activities: day.activities?.map((activity: any) => ({
          time: activity.time,
          activity: activity.activity || activity.description, // The component expects 'activity'
          cost: activity.cost,
        })),
      })),
      accommodationOptions: rawItineraryData.accommodations?.map((acc: any) => ({
        name: acc.name,
        type: acc.type,
        pricePerNight: acc.price, // The component expects 'pricePerNight'
        location: acc.location,
        amenities: acc.amenities,
      })),
      transportation: {
        toDestination: rawItineraryData.transportation?.find((t: any) => t.type === 'Flight')?.details || 'Not available',
        localTransport: rawItineraryData.transportation?.find((t: any) => t.type === 'Metro')?.details || 'Not available',
      },
      budgetBreakdown: {
        travel: rawItineraryData.budgetBreakdown?.transportation, // The component expects 'travel'
        accommodation: rawItineraryData.budgetBreakdown?.accommodation,
        food: rawItineraryData.budgetBreakdown?.food,
        activities: rawItineraryData.budgetBreakdown?.activities,
        misc: rawItineraryData.budgetBreakdown?.miscellaneous, // The component expects 'misc'
      },
      travelTips: rawItineraryData.tips, // The component expects 'travelTips'
    };

    return NextResponse.json({ itinerary: mappedItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
