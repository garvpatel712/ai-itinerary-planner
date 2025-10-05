import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '../../../../lib/jobs';

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const jobId = params.jobId;
    const job = getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ status: job.status, data: job.data, error: job.error });

  } catch (error) {
    console.error('Error in itinerary-status route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `Failed to get job status: ${errorMessage}` }, { status: 500 });
  }
}
