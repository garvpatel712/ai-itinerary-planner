'use client';

interface Activity {
  id: string;
  title: string;
  time: string;
  cost: number;
  category: 'transport' | 'accommodation' | 'food' | 'activities';
  location?: string;
}

interface DayCardProps {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
  isLoading?: boolean;
}

// Activity category icons
const ActivityIcon = ({ category, className }: { category: string; className?: string }) => {
  const icons = {
    transport: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m4.5 4.5v-3.75m0 3.75h-4.5m0-3.75a2.25 2.25 0 013.375-1.96m-1.875 3.96h4.5a2.25 2.25 0 003.375-1.96m-3.375 1.96V9.75m0 4.5V12a2.25 2.25 0 00-2.25-2.25M9 12.75h3.375a2.25 2.25 0 012.25 2.25M9 12.75l-.879-.879a.75.75 0 01.879-1.05l6.253 3.126a.75.75 0 010 1.348L9 19.19a.75.75 0 01-.879-1.05l.879-.879z" />
      </svg>
    ),
    accommodation: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18h-13.5L4.5 3z" />
      </svg>
    ),
    food: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    ),
    activities: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
  };

  return icons[category as keyof typeof icons] || null;
};

// Category colors
const getCategoryColor = (category: string) => {
  const colors = {
    transport: 'bg-blue-100 text-blue-600',
    accommodation: 'bg-purple-100 text-purple-600',
    food: 'bg-orange-100 text-orange-600',
    activities: 'bg-green-100 text-green-600',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
};

// Skeleton component for loading state
const DayCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-5 w-16 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
    </div>
    
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DayCard({ day, date, activities, totalCost, isLoading }: DayCardProps) {
  if (isLoading) {
    return <DayCardSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Day {day}
          </h3>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            ${totalCost.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {activities.length} activities
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {activities.slice(0, 3).map((activity, index) => (
          <div key={activity.id} className="flex items-center gap-3">
            {/* Activity Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryColor(activity.category)}`}>
              <ActivityIcon category={activity.category} className="w-4 h-4" />
            </div>
            
            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </span>
                {activity.location && (
                  <span className="text-xs text-gray-500 truncate">
                    • {activity.location}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">
                {activity.time}
              </div>
            </div>
            
            {/* Activity Cost */}
            <div className="text-sm font-semibold text-gray-900 flex-shrink-0">
              ${activity.cost}
            </div>
          </div>
        ))}
        
        {/* Show more indicator */}
        {activities.length > 3 && (
          <div className="flex items-center justify-center pt-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-gray-200 transition-colors">
              +{activities.length - 3} more activities
            </span>
          </div>
        )}
      </div>

      {/* Expand indicator */}
      <div className="flex items-center justify-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}
