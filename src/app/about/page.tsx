import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-16 py-24">
      <h1 className="text-3xl font-bold mb-16">About TravelPlanner</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-16">
          TravelPlanner is a comprehensive travel planning platform designed to help you create, organize, and share your travel experiences.
          Whether you're planning a weekend getaway or a month-long adventure, our tools make it easy to build the perfect itinerary.
        </p>
        
        <h2 className="text-2xl font-semibold mb-8">Our Mission</h2>
        <p className="mb-16">
          We believe that travel should be accessible, enjoyable, and stress-free. Our mission is to provide travelers with the tools they need to
          plan their perfect trip, discover new destinations, and create lasting memories without the hassle of complicated planning.
        </p>
        
        <h2 className="text-2xl font-semibold mb-8">Our Features</h2>
        <ul className="list-disc pl-16 mb-16 space-y-4">
          <li>Interactive maps to visualize your journey</li>
          <li>Detailed day-by-day itinerary planning</li>
          <li>Collaborative trip planning with friends and family</li>
          <li>Weather forecasts for your destinations</li>
          <li>Local recommendations for activities, restaurants, and attractions</li>
          <li>Budget tracking and expense management</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-8">Our Team</h2>
        <p className="mb-16">
          TravelPlanner was founded by a group of passionate travelers who were frustrated with the complexity of planning trips across multiple
          platforms and tools. Our team combines expertise in travel, technology, and design to create the most user-friendly travel planning
          experience possible.
        </p>
        
        <h2 className="text-2xl font-semibold mb-8">Get Started</h2>
        <p className="mb-8">
          Ready to plan your next adventure? Sign up for a free account today and start exploring the possibilities!
        </p>
        
        <div className="flex gap-8">
          <Link
            href="/auth/register"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors inline-block"
          >
            Sign Up Free
          </Link>
          <Link
            href="/trips"
            className="bg-white hover:bg-gray-50 text-primary border border-primary font-medium py-8 px-16 rounded-2xl transition-colors inline-block"
          >
            Explore Trips
          </Link>
        </div>
      </div>
    </div>
  );
}