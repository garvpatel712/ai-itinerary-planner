'use client';

import { useState, useEffect } from 'react';
import { TravelForm } from '@/components/travel-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { LoadingState } from '@/components/loading-state';
import { Plane, MapPin, Calendar } from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';

// These interfaces define the exact data structure the frontend component expects.
interface TravelPreferences {
  destination: string;
  budget: number;
  duration: number;
  startLocation: string;
  interests: string[];
  travelStyle: string;
}

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


export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const pollJobStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/itinerary-status/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job status');
      }
      const data = await response.json();

      if (data.status === 'completed') {
        // Ensure all arrays are initialized
        const validatedItinerary = {
          ...data.data,
          dailyItinerary: data.data.dailyItinerary || [],
          accommodations: data.data.accommodations || [],
          transportation: data.data.transportation || [],
          tips: data.data.tips || [],
        };

        validatedItinerary.dailyItinerary = validatedItinerary.dailyItinerary.map((day: any) => ({
          ...day,
          activities: day.activities || [],
        }));

        setItinerary(validatedItinerary);
        setIsLoading(false);
        setJobId(null);
      } else if (data.status === 'failed') {
        setError(data.error || 'An unknown error occurred during itinerary generation.');
        setIsLoading(false);
        setJobId(null);
      } else {
        // If still pending, poll again after a delay
        setTimeout(() => pollJobStatus(id), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while polling for job status.');
      setIsLoading(false);
      setJobId(null);
    }
  };

  useEffect(() => {
    if (jobId) {
      pollJobStatus(jobId);
    }
  }, [jobId]);

  const handleGenerateItinerary = async (preferences: TravelPreferences) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setJobId(data.jobId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
    setJobId(null);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold text-balance">AI Travel Planner</h1>
            </div>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Create personalized travel itineraries with AI. Get custom recommendations for accommodations, activities,
              and transportation that fit your budget and style.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smart Destinations</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations based on your preferences and budget
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Custom Itineraries</h3>
              <p className="text-sm text-muted-foreground">
                Day-by-day plans with activities, dining, and transportation
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <FaRupeeSign className="text-primary-foreground h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">Budget Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Stay within budget with detailed cost breakdowns and alternatives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!itinerary && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <TravelForm onSubmit={handleGenerateItinerary} />
          </div>
        )}

        {isLoading && <LoadingState />}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <p className="text-destructive font-medium">Error: {error}</p>
              <button onClick={handleReset} className="mt-2 text-sm text-primary hover:underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {itinerary && <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />}
      </div>
    </main>
  );
}
