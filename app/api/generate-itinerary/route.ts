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

    // Handle cases where the itinerary data is nested inside an 'itinerary' property.
    const sourceData = rawItineraryData.itinerary || rawItineraryData;

    // Map the webhook data to the structure expected by the frontend component.
    const mappedItinerary = {
      destination: sourceData.destination,
      budget: parseFloat(sourceData.totalBudget) || 0, // Ensure budget is a number
      duration: parseInt(sourceData.duration, 10) || 0, // Ensure duration is a number
      itinerary: sourceData.dailyItinerary?.map((day: any) => ({
        day: day.day,
        activities: day.activities?.map((activity: any) => ({
          time: activity.time,
          activity: activity.activity || activity.description,
          cost: activity.cost,
        })),
      })),
      accommodationOptions: sourceData.accommodations?.map((acc: any) => ({
        name: acc.name,
        type: acc.type,
        pricePerNight: acc.price,
        location: acc.location,
        amenities: acc.amenities,
      })),
      transportation: {
        toDestination: sourceData.transportation?.find((t: any) => t.type === 'Flight')?.details || 'Not available',
        localTransport: sourceData.transportation?.find((t: any) => t.type === 'Metro')?.details || 'Not available',
      },
      budgetBreakdown: {
        travel: sourceData.budgetBreakdown?.transportation,
        accommodation: sourceData.budgetBreakdown?.accommodation,
        food: sourceData.budgetBreakdown?.food,
        activities: sourceData.budgetBreakdown?.activities,
        misc: sourceData.budgetBreakdown?.miscellaneous,
      },
      travelTips: sourceData.tips,
    };

    return NextResponse.json({ itinerary: mappedItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
