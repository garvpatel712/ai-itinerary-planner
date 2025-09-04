'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data - would be fetched from API in a real application
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar.jpg',
    bio: 'Travel enthusiast and photographer. Love exploring new places and cultures.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration point: User API
    setUser(prev => ({ ...prev, ...formData }));
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-16 py-24">
      <h1 className="text-3xl font-bold mb-16">Your Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-24">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Profile avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              {/* Integration point: User avatar */}
              <span className="text-2xl font-bold text-muted">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Profile details */}
          <div className="flex-grow">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-16">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted mb-4">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted mb-4">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-muted mb-4">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-8">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white hover:bg-gray-50 text-muted border border-gray-200 font-medium py-8 px-16 rounded-2xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-12">
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted">{user.email}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Bio</h3>
                  <p>{user.bio}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-8 px-16 rounded-2xl transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trip history section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-16">Your Trips</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-24">
          <div className="space-y-12">
            <div className="flex justify-between items-center pb-8 border-b">
              <div>
                <h3 className="font-semibold">Weekend in Paris</h3>
                <p className="text-muted">June 15-18, 2023</p>
              </div>
              <Link 
                href="/trip/1" 
                className="text-accent hover:underline"
              >
                View Details
              </Link>
            </div>
            
            <div className="flex justify-between items-center pb-8 border-b">
              <div>
                <h3 className="font-semibold">Tokyo Adventure</h3>
                <p className="text-muted">July 22-30, 2023</p>
              </div>
              <Link 
                href="/trip/2" 
                className="text-accent hover:underline"
              >
                View Details
              </Link>
            </div>
            
            <Link 
              href="/trips" 
              className="inline-block text-accent hover:underline"
            >
              View All Trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}