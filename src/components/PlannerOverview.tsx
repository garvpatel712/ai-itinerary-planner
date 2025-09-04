'use client';

import { useState, useEffect } from 'react';
import BudgetDonut from './BudgetDonut';
import BudgetBar from './BudgetBar';
import DayCard from './DayCardNew';
import MapPreview from './MapPreview';

// Types
interface TripVariant {
  id: 'balanced' | 'cheapest' | 'fastest';
  label: string;
  description: string;
  totalCost: number;
  duration: string;
}

interface Activity {
  id: string;
  title: string;
  time: string;
  cost: number;
  category: 'transport' | 'accommodation' | 'food' | 'activities';
  location?: string;
}

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
}

interface TripData {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalBudget: number;
  variants: TripVariant[];
  days: DayPlan[];
  budgetBreakdown: {
    category: string;
    amount: number;
    color: string;
    icon: string;
  }[];
}

interface PlannerOverviewProps {
  tripData?: TripData;
  isLoading?: boolean;
}

// Sample data for demo
const SAMPLE_TRIP_DATA: TripData = {
  title: "Paris Adventure",
  destination: "Paris, France",
  startDate: "2024-10-15",
  endDate: "2024-10-20",
  travelers: 2,
  totalBudget: 3500,
  variants: [
    { id: 'balanced', label: 'Balanced', description: 'Best mix of quality and price', totalCost: 3200, duration: '5 days' },
    { id: 'cheapest', label: 'Cheapest', description: 'Budget-friendly options', totalCost: 2800, duration: '5 days' },
    { id: 'fastest', label: 'Fastest', description: 'Quick and efficient travel', totalCost: 3800, duration: '4 days' },
  ],
  days: [
    {
      day: 1,
      date: "Oct 15, 2024",
      activities: [
        { id: '1', title: 'Flight to Paris', time: '8:00 AM', cost: 420, category: 'transport' },
        { id: '2', title: 'Hotel Check-in', time: '2:00 PM', cost: 0, category: 'accommodation', location: 'Le Marais' },
        { id: '3', title: 'Lunch at Café de Flore', time: '1:00 PM', cost: 45, category: 'food', location: 'Saint-Germain' },
        { id: '4', title: 'Eiffel Tower Visit', time: '4:00 PM', cost: 25, category: 'activities', location: 'Champ de Mars' },
      ],
      totalCost: 490
    },
    {
      day: 2,
      date: "Oct 16, 2024",
      activities: [
        { id: '5', title: 'Breakfast at Hotel', time: '8:00 AM', cost: 20, category: 'food' },
        { id: '6', title: 'Louvre Museum', time: '10:00 AM', cost: 35, category: 'activities', location: '1st Arrondissement' },
        { id: '7', title: 'Seine River Cruise', time: '3:00 PM', cost: 15, category: 'activities', location: 'Seine River' },
        { id: '8', title: 'Dinner at Bistro', time: '7:00 PM', cost: 65, category: 'food', location: 'Latin Quarter' },
      ],
      totalCost: 135
    },
  ],
  budgetBreakdown: [
    { category: 'transport', amount: 850, color: '#3b82f6', icon: 'transport' },
    { category: 'accommodation', amount: 1200, color: '#8b5cf6', icon: 'accommodation' },
    { category: 'food', amount: 650, color: '#f97316', icon: 'food' },
    { category: 'activities', amount: 500, color: '#10b981', icon: 'activities' },
  ]
};

// Icons
const SaveIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-4.5B4.875 6.75 1.5 10.125 1.5 14.25v2.625m2.25-10.125h15A2.25 2.25 0 0121 9v.75m-18 0A2.25 2.25 0 003 9v.75m0 7.5V21a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0h18" />
  </svg>
);

// Loading skeleton for the entire page
const PlannerOverviewSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="h-7 w-48 bg-gray-300 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-20 bg-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Variant toggles skeleton */}
          <div className="bg-gray-300 h-12 rounded-lg animate-pulse"></div>
          
          {/* Budget donut skeleton */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Day cards skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-20 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="h-64 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="h-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function PlannerOverview({ tripData = SAMPLE_TRIP_DATA, isLoading = false }: PlannerOverviewProps) {
  const [selectedVariant, setSelectedVariant] = useState<'balanced' | 'cheapest' | 'fastest'>('balanced');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate stats
  const totalSpent = tripData.budgetBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = tripData.totalBudget - totalSpent;
  
  const budgetBarData = tripData.budgetBreakdown.map(item => ({
    ...item,
    percentage: (item.amount / totalSpent) * 100
  }));

  // Action handlers
  const handleSave = async () => {
    setIsSaving(true);
    // Integration point: Save trip
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleShare = () => {
    // Integration point: Share functionality
    console.log('Share trip');
  };

  const handleExportPDF = () => {
    // Integration point: PDF export
    console.log('Export PDF');
  };

  if (isLoading) {
    return <PlannerOverviewSkeleton />;
  }

  const selectedVariantData = tripData.variants.find(v => v.id === selectedVariant)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Trip Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{tripData.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>{tripData.startDate} - {tripData.endDate}</span>
                <span>•</span>
                <span>{tripData.travelers} travelers</span>
                <span>•</span>
                <span>{tripData.destination}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <SaveIcon className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Variant Toggles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {tripData.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors text-center ${
                      selectedVariant === variant.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="font-semibold">{variant.label}</div>
                    <div className="text-xs opacity-75">${variant.totalCost.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <BudgetDonut 
                  data={tripData.budgetBreakdown}
                  totalBudget={tripData.totalBudget}
                  isLoading={false}
                />
                <BudgetBar 
                  data={budgetBarData}
                  isLoading={false}
                />
              </div>
            </div>

            {/* Day Cards */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Itinerary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {tripData.days.map((day) => (
                  <DayCard
                    key={day.day}
                    day={day.day}
                    date={day.date}
                    activities={day.activities}
                    totalCost={day.totalCost}
                    isLoading={false}
                  />
                ))}
                
                {/* Load more indicator */}
                <div className="flex items-center justify-center py-4">
                  <span className="text-sm text-gray-500">Scroll to see more days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <div className="space-y-6">
            {/* Map Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h3>
              <MapPreview 
                destinations={[tripData.destination]}
                isLoading={false}
              />
            </div>

            {/* Trip Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Cost</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${selectedVariantData.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Budget</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${tripData.totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className={`text-sm font-medium ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(remainingBudget).toLocaleString()}
                    {remainingBudget < 0 ? ' over' : ' left'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedVariantData.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Per Person</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${Math.round(selectedVariantData.totalCost / tripData.travelers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
