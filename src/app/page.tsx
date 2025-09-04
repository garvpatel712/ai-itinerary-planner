import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-24">
        <div className="max-w-7xl mx-auto px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-8">
                Plan Your Next Adventure
              </h1>
              <p className="text-lg mb-12">
                Discover amazing destinations and create unforgettable memories with our
                easy-to-use travel planning tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-8">
                <Link
                  href="/trips"
                  className="bg-accent hover:bg-accent/90 text-white font-medium py-12 px-24 rounded-2xl text-center transition-colors"
                >
                  Explore Trips
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white hover:bg-gray-100 text-primary font-medium py-12 px-24 rounded-2xl text-center transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for hero image */}
              <div className="bg-white/20 rounded-2xl h-80 w-full flex items-center justify-center">
                {/* Replace with actual image when available */}
                <p className="text-white/70 text-center">
                  {/* Integration point: Hero image */}
                  Travel illustration or map visualization will go here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-16">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose TravelPlanner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-8">Interactive Maps</h3>
              <p className="text-muted">
                Visualize your journey with our interactive maps and plan the perfect route.
                {/* Integration point: Map API */}
              </p>
            </div>
            
            <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-8">Smart Itineraries</h3>
              <p className="text-muted">
                Create detailed day-by-day itineraries with activities, accommodations, and transportation.
                {/* Integration point: Calendar API */}
              </p>
            </div>
            
            <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-8">Collaboration</h3>
              <p className="text-muted">
                Plan trips with friends and family by sharing and collaborating on itineraries.
                {/* Integration point: Sharing API */}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
