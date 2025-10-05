import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createJob, updateJobStatus } from '../../../lib/jobs';

interface Itinerary {
  destination: string;
  duration: string;
  totalBudget: number;
  dailyItinerary: Array<{
    day: number;
    date: string;
    activities: Array<{
      time: string;
      activity: string;
      location: string;
      cost: number;
      description: string;
      category: string;
    }>;
    dailyBudget: number;
  }>;
  accommodations: Array<{
    name: string;
    type: string;
    pricePerNight: number;
    rating: number;
    location: string;
    amenities: string[];
    description: string;
  }>;
  transportation: Array<{
    type: string;
    from: string;
    to: string;
    cost: number;
    duration: string;
    description: string;
  }>;
  budgetBreakdown: {
    accommodation: number;
    transportation: number;
    activities: number;
    food: number;
    miscellaneous: number;
  };
  tips: string[];
}

async function handleWebhook(jobId: string, formData: any) {
  try {
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
      throw new Error(`Webhook request failed with status ${webhookResponse.status}: ${errorBody}`);
    }

    const responseText = await webhookResponse.text();
    if (!responseText) {
      throw new Error('Webhook responded with empty body');
    }

    let rawData;
    try {
      rawData = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Failed to parse webhook response as JSON.');
    }

    const sourceData = rawData.itinerary || rawData;

    const mappedItinerary: Itinerary = {
        destination: sourceData.destination || 'Not provided',
        duration: sourceData.duration ? `${sourceData.duration} days` : 'Not specified',
        totalBudget: parseFloat(sourceData.totalBudget || sourceData.budget) || 0,
        dailyItinerary: (sourceData.dailyItinerary || sourceData.itinerary || []).map((day: any) => ({
          day: day.day,
          date: day.date || 'Not specified',
          activities: (day.activities || []).map((activity: any) => ({
            time: activity.time,
            activity: activity.activity || activity.description || 'Unnamed Activity',
            location: activity.location || 'Not specified',
            cost: parseFloat(activity.cost) || 0,
            description: activity.description || '',
            category: activity.category || 'General',
          })),
          dailyBudget: parseFloat(day.dailyBudget) || 0,
        })),
        accommodations: (sourceData.accommodations || sourceData.accommodationOptions || []).map((acc: any) => ({
          name: acc.name,
          type: acc.type,
          pricePerNight: parseFloat(acc.pricePerNight || acc.price) || 0,
          rating: parseFloat(acc.rating) || 0,
          location: acc.location,
          amenities: acc.amenities || [],
          description: acc.description || '',
        })),
        transportation: (sourceData.transportation || []).map((trans: any) => ({
          type: trans.type,
          from: trans.from || 'Not specified',
          to: trans.to || 'Not specified',
          cost: parseFloat(trans.cost) || 0,
          duration: trans.duration || 'Not specified',
          description: trans.description || '',
        })),
        budgetBreakdown: {
          accommodation: parseFloat(sourceData.budgetBreakdown?.accommodation) || 0,
          transportation: parseFloat(sourceData.budgetBreakdown?.transportation || sourceData.budgetBreakdown?.travel) || 0,
          activities: parseFloat(sourceData.budgetBreakdown?.activities) || 0,
          food: parseFloat(sourceData.budgetBreakdown?.food) || 0,
          miscellaneous: parseFloat(sourceData.budgetBreakdown?.miscellaneous || sourceData.budgetBreakdown?.misc) || 0,
        },
        tips: sourceData.tips || sourceData.travelTips || [],
      };

    updateJobStatus(jobId, 'completed', mappedItinerary);
  } catch (error) {
    console.error('Error handling webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    updateJobStatus(jobId, 'failed', undefined, errorMessage);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const jobId = uuidv4();

    createJob(jobId);

    handleWebhook(jobId, formData);

    return NextResponse.json({ jobId });
  } catch (error) {
    console.error('Error in generate-itinerary route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to process itinerary request: ${errorMessage}` }, { status: 500 });
  }
}
