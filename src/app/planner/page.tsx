import Link from 'next/link';

export default function PlannerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Trip Planner</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          Create your perfect trip with our easy-to-use planning tools. 
          Start from scratch or browse popular destinations for inspiration.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>
            <p className="text-muted mb-6">
              Start planning your next adventure from scratch. Add destinations, activities, and build your perfect itinerary.
            </p>
            <Link 
              href="/trip/new"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start Planning
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Browse Templates</h2>
            <p className="text-muted mb-6">
              Get inspired by popular trip templates. Choose from weekend getaways, city breaks, or adventure tours.
            </p>
            <Link 
              href="/templates"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Continue Planning</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Recent Planning Activity</h3>
            <p className="text-muted mb-6">
              Your recent trips and planning activity will appear here
            </p>
            <Link 
              href="/trips"
              className="text-accent hover:underline font-medium"
            >
              View All Trips
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Paris, France', image: '/paris.jpg', trips: '2.1k trips' },
            { name: 'Tokyo, Japan', image: '/tokyo.jpg', trips: '1.8k trips' },
            { name: 'New York, USA', image: '/nyc.jpg', trips: '1.5k trips' },
            { name: 'London, UK', image: '/london.jpg', trips: '1.3k trips' },
            { name: 'Barcelona, Spain', image: '/barcelona.jpg', trips: '1.1k trips' },
            { name: 'Rome, Italy', image: '/rome.jpg', trips: '950 trips' },
          ].map((destination, index) => (
            <div key={destination.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                <p className="text-muted text-center text-sm">
                  {destination.name}<br/>
                  Image placeholder
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{destination.name}</h3>
                <p className="text-sm text-muted">{destination.trips}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
