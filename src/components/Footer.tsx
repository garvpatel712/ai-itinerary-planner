'use client';

import Link from 'next/link';
import { useState } from 'react';

// Email icon
const EmailIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

// Paper plane icon
const PaperPlaneIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Integration point: Newsletter API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Newsletter signup:', email);
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerSections = {
    company: {
      title: 'About',
      links: [
        { href: '/about', label: 'Our Story' },
        { href: '/careers', label: 'Careers' },
        { href: '/press', label: 'Press' },
        { href: '/contact', label: 'Contact Us' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { href: '/help', label: 'FAQ' },
        { href: '/help/guides', label: 'Travel Guides' },
        { href: '/support', label: 'Help Center' },
        { href: '/community', label: 'Community' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/cookies', label: 'Cookie Policy' },
        { href: '/security', label: 'Security' },
      ],
    },
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <PaperPlaneIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Travel Link</span>
            </div>
            <p className="text-muted text-sm mb-6 max-w-sm">
              Plan your next adventure with ease. Discover new destinations, create detailed itineraries, and make unforgettable memories.
            </p>
            
            {/* Newsletter signup */}
            <div className="">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Stay Updated
              </h4>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <EmailIcon className="h-4 w-4" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
              <p className="text-xs text-muted mt-2">
                Get travel tips and destination updates
              </p>
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted">
              <p>&copy; {new Date().getFullYear()} Travel Link. All rights reserved.</p>
            </div>
            
            {/* Quick links */}
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-muted hover:text-accent transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-muted hover:text-accent transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/cookies" 
                className="text-muted hover:text-accent transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
