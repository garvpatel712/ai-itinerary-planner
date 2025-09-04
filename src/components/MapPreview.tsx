'use client';

import { useState } from 'react';

interface MapPreviewProps {
  destinations: string[];
  center?: [number, number];
  zoom?: number;
  isLoading?: boolean;
}

// Skeleton component for loading state
const MapPreviewSkeleton = () => (
  <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export default function MapPreview({ destinations, center = [0, 0], zoom = 10, isLoading }: MapPreviewProps) {
  const [mapError, setMapError] = useState(false);

  if (isLoading) {
    return <MapPreviewSkeleton />;
  }

  return (
    <div className="relative">
      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border border-gray-200">
        {/* Mapbox Integration Point */}
        <div className="w-full h-full relative">
          {/* Placeholder Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Grid Pattern */}
            <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6b7280" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock Map Markers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {destinations.slice(0, 3).map((destination, index) => (
                <div 
                  key={destination}
                  className="absolute bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transform transition-transform hover:scale-110"
                  style={{
                    left: `${(index * 60) - 30}px`,
                    top: `${(index * 40) - 20}px`,
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="truncate max-w-20">{destination.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Line (Mock) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path 
              d="M 80 120 Q 150 100 220 140" 
              stroke="#0ea5a3" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="5,5"
              className="opacity-60"
            />
          </svg>

          {/* Integration Point Comment */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Mapbox Integration
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="w-8 h-8 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-gray-700">Destinations</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary border-dashed"></div>
          <span className="text-gray-700">Route</span>
        </div>
      </div>
    </div>
  );
}
