'use client';

import { useState } from 'react';
import { TravelForm } from '@/components/travel-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { LoadingState } from '@/components/loading-state';
import { Plane, MapPin, Calendar } from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';

// Defines the data structure for travel preferences from the form
interface TravelPreferences {
  destination: string;
  budget: number;
  duration: number;
  startLocation: string;
  interests: string[];
  travelStyle: string;
}

// This interface now correctly matches the structure of the data returned from the API
interface Itinerary {
  destination: string;
  budget: number;
  duration: number;
  itinerary: any[]; 
  accommodationOptions: any[];
  transportation: any;
  budgetBreakdown: any;
  travelTips: string[];
}

export default function Home() {
  // State management for the component
  const [itinerary, setItinerary] = useState<Itinerary | null>(null); // Holds the generated itinerary
  const [isLoading, setIsLoading] = useState(false); // Manages the loading state
  const [error, setError] = useState<string | null>(null); // Holds error messages

  // Handles the form submission to generate an itinerary
  const handleGenerateItinerary = async (preferences: TravelPreferences) => {
    // 1. Set loading state and clear previous data/errors
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      // 2. Make the API call to the backend
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      // 3. Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary. Please try again.');
      }

      // 4. Parse the successful response and update state
      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary); // On success, display the itinerary
      } else {
        throw new Error('Received invalid data from the server.');
      }

    } catch (err) {
      // 5. Catch any errors (network, server-side, etc.) and display them
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);

    } finally {
      // 6. Ensure loading is always turned off after the process completes
      setIsLoading(false);
    }
  };

  // Resets the UI to its initial state
  const handleReset = () => {
    setItinerary(null);
    setError(null);
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
                  <p className="text-sm text-muted-foreground">AI-powered recommendations based on your preferences and budget</p>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Custom Itineraries</h3>
                  <p className="text-sm text-muted-foreground">Day-by-day plans with activities, dining, and transportation</p>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaRupeeSign className="text-primary-foreground h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">Budget Optimization</h3>
                  <p className="text-sm text-muted-foreground">Stay within budget with detailed cost breakdowns and alternatives</p>
              </div>
          </div>
        </div>
      </div>

      {/* Main Content: Conditionally renders Form, Loading, Error, or Itinerary */}
      <div className="container mx-auto px-4 py-8">
        {!itinerary && !isLoading && !error && (
          <div className="max-w-2xl mx-auto">
            <TravelForm onSubmit={handleGenerateItinerary} />
          </div>
        )}

        {isLoading && <LoadingState />}

        {error && (
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                    <p className="text-destructive font-semibold text-lg">Something went wrong!</p>
                    <p className="text-destructive/80 mt-2">Error: {error}</p>
                    <button 
                        onClick={handleReset} 
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        )}

        {itinerary && <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />}
      </div>
    </main>
  );
}
