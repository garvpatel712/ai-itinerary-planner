
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    const webhookUrl = 'http://localhost:5678/webhook-test/1f3c415d-a7ec-47ac-a2ce-1cabfe2fdd2d';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: formData }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    // Since we are not generating an itinerary anymore, we can return a simple success message.
    // Also, the original code returned an object with an `itinerary` property,
    // which the frontend might be expecting. Returning an empty object for now.
    return NextResponse.json({ itinerary: {} });
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return NextResponse.json({ error: 'Failed to trigger webhook' }, { status: 500 });
  }
}
