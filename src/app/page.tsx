import Link from "next/link";
import TripForm from "@/components/TripForm";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Hero Content */}
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Plan a trip in{' '}
                <span className="bg-white text-primary px-4 py-2 rounded-xl inline-block transform -rotate-1">
                  seconds
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
                Skip the endless research. Get personalized itineraries powered by AI that match your style, budget, and time.
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>10M+ trips planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>95% satisfaction rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Free to use</span>
                </div>
              </div>
            </div>

            {/* Right: Trip Form */}
            <div className="flex justify-center lg:justify-end">
              <TripForm />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Travel Link Works
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              From idea to itinerary in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                  Step 1
                </span>
                <h3 className="text-xl font-semibold text-gray-900">Tell us your preferences</h3>
              </div>
              <p className="text-muted">
                Share your destination, dates, budget, and travel style. Our AI learns what kind of trip you want.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-accent/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-accent text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                  Step 2
                </span>
                <h3 className="text-xl font-semibold text-gray-900">AI generates your itinerary</h3>
              </div>
              <p className="text-muted">
                Get a personalized day-by-day plan with activities, restaurants, and hidden gems tailored to your style.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="mb-4">
                <span className="inline-block bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                  Step 3
                </span>
                <h3 className="text-xl font-semibold text-gray-900">Book and enjoy your trip</h3>
              </div>
              <p className="text-muted">
                Customize your itinerary, book accommodations and activities, then enjoy your perfectly planned adventure.
              </p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Start Planning Your Trip
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
