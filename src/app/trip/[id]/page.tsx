'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id;
  
  // Mock data for a trip - would be fetched from API based on tripId in a real application
  const trip = {
    id: tripId,
    title: 'Weekend in Paris',
    date: '2023-06-15 - 2023-06-18',
    description: 'A wonderful weekend exploring the city of lights, visiting iconic landmarks and enjoying French cuisine.',
    destinations: ['Paris, France'],
    activities: [
      { day: 1, title: 'Eiffel Tower', time: '10:00 AM', description: 'Visit the iconic Eiffel Tower' },
      { day: 1, title: 'Louvre Museum', time: '2:00 PM', description: 'Explore the world-famous Louvre Museum' },
      { day: 2, title: 'Notre Dame', time: '11:00 AM', description: 'Visit the historic Notre Dame Cathedral' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-16 py-24">
      <div className="mb-16">
        <Link href="/trips" className="text-accent hover:underline mb-8 inline-block">
          &larr; Back to Trips
        </Link>
        <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>
        <p className="text-muted">{trip.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        {/* Trip details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 mb-16">
            <h2 className="text-xl font-semibold mb-8">Trip Overview</h2>
            <p className="mb-12">{trip.description}</p>
            
            <h3 className="font-medium mb-4">Destinations</h3>
            <ul className="mb-12">
              {trip.destinations.map((destination, index) => (
                <li key={index} className="mb-2">{destination}</li>
              ))}
            </ul>
            
            {/* Integration point: Map */}
            <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center mb-12">
              <p className="text-muted text-center">
                Map will be displayed here
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16">
            <h2 className="text-xl font-semibold mb-12">Itinerary</h2>
            
            {/* Group activities by day */}
            {[...new Set(trip.activities.map(a => a.day))].map(day => (
              <div key={day} className="mb-16 last:mb-0">
                <h3 className="font-medium mb-8 pb-4 border-b">Day {day}</h3>
                
                <div className="space-y-12">
                  {trip.activities
                    .filter(activity => activity.day === day)
                    .map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="w-24 flex-shrink-0 text-muted">{activity.time}</div>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-muted">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 mb-16">
            <h2 className="text-xl font-semibold mb-8">Trip Actions</h2>
            <div className="space-y-8">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors">
                Edit Trip
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-primary border border-primary font-medium py-8 px-16 rounded-2xl transition-colors">
                Share Trip
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-muted border border-gray-200 font-medium py-8 px-16 rounded-2xl transition-colors">
                Export Itinerary
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16">
            <h2 className="text-xl font-semibold mb-8">Weather</h2>
            {/* Integration point: Weather API */}
            <div className="text-center py-12">
              <p className="text-muted">
                Weather information will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}