import Link from 'next/link';

export default function TripsPage() {
  // Mock data for trips - would be fetched from API in a real application
  const trips = [
    { id: '1', title: 'Weekend in Paris', date: '2023-06-15', image: '/paris.jpg' },
    { id: '2', title: 'Tokyo Adventure', date: '2023-07-22', image: '/tokyo.jpg' },
    { id: '3', title: 'New York City', date: '2023-08-10', image: '/nyc.jpg' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-16 py-24">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold">Your Trips</h1>
        <Link 
          href="/trip/new" 
          className="bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors"
        >
          Create New Trip
        </Link>
      </div>

      {/* Trip list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {trips.map((trip) => (
          <Link key={trip.id} href={`/trip/${trip.id}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Trip image placeholder */}
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <p className="text-muted text-center">
                  {/* Integration point: Trip image */}
                  Trip image will go here
                </p>
              </div>
              <div className="p-16">
                <h3 className="text-xl font-semibold mb-4">{trip.title}</h3>
                <p className="text-muted">{trip.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {trips.length === 0 && (
        <div className="text-center py-24">
          <h3 className="text-xl font-semibold mb-8">No trips yet</h3>
          <p className="text-muted mb-16">Create your first trip to get started</p>
          <Link 
            href="/trip/new" 
            className="bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors"
          >
            Create New Trip
          </Link>
        </div>
      )}
    </div>
  );
}