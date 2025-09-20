import { NextRequest, NextResponse } from 'next/server';

// This interface defines the exact data structure the frontend component expects.
interface Itinerary {
  destination: string;
  budget: number;
  duration: number;
  itinerary: Array<{
    day: number;
    activities: Array<{
      time: string;
      activity: string;
      cost: number;
    }>;
  }>;
  accommodationOptions: Array<{
    name: string;
    type: string;
    pricePerNight: number;
    location: string;
    amenities: string[];
  }>;
  transportation: {
    toDestination: string;
    localTransport: string;
  };
  budgetBreakdown: {
    travel: number;
    accommodation: number;
    food: number;
    activities: number;
    misc: number;
  };
  travelTips: string[];
}

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

    let rawData;
    try {
      rawData = JSON.parse(responseText);
      console.log(rawData);
    } catch (e) {
      console.error('Failed to parse webhook response as JSON:', responseText);
      throw new Error('Failed to parse itinerary data from webhook.');
    }

    // The webhook data might be nested. We'll safely access it.
    const sourceData = rawData.itinerary || rawData;
    console.log('Extracted source data:', sourceData);

    // This is the "translator" that maps the webhook data to the frontend's required structure.
    const mappedItinerary: Itinerary = {
      destination: sourceData.destination || 'Not provided',
      budget: parseFloat(sourceData.totalBudget || sourceData.budget) || 0,
      duration: parseInt(sourceData.duration, 10) || 0,
      itinerary: (sourceData.dailyItinerary || sourceData.itinerary || []).map((day: any) => ({
        day: day.day,
        activities: (day.activities || []).map((activity: any) => ({
          time: activity.time,
          activity: activity.activity || activity.description || 'Unnamed Activity',
          cost: parseFloat(activity.cost) || 0,
        })),
      })),
      accommodationOptions: (sourceData.accommodations || sourceData.accommodationOptions || []).map((acc: any) => ({
        name: acc.name,
        type: acc.type,
        pricePerNight: parseFloat(acc.pricePerNight || acc.price) || 0,
        location: acc.location,
        amenities: acc.amenities || [],
      })),
      transportation: {
        toDestination: sourceData.transportation?.toDestination || 'Not specified',
        localTransport: sourceData.transportation?.localTransport || 'Not specified',
      },
      budgetBreakdown: {
        travel: parseFloat(sourceData.budgetBreakdown?.travel || sourceData.budgetBreakdown?.transportation) || 0,
        accommodation: parseFloat(sourceData.budgetBreakdown?.accommodation) || 0,
        food: parseFloat(sourceData.budgetBreakdown?.food) || 0,
        activities: parseFloat(sourceData.budgetBreakdown?.activities) || 0,
        misc: parseFloat(sourceData.budgetBreakdown?.misc || sourceData.budgetBreakdown?.miscellaneous) || 0,
      },
      travelTips: sourceData.travelTips || sourceData.tips || [],
    };

    // We send the perfectly structured data to the frontend.
    return NextResponse.json({ itinerary: mappedItinerary });

  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
