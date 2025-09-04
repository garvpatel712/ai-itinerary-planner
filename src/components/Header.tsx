'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Paper plane icon component
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

// Hamburger menu icon
const HamburgerIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Close icon
const CloseIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Search icon
const SearchIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2} 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

interface HeaderProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

export default function Header({ isDrawerOpen, toggleDrawer, closeDrawer }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Integration point: Search functionality
  };

  const navItems = [
    { id: 'planner', href: '/planner', label: 'Planner' },
    { id: 'trips', href: '/trips', label: 'My Trips' },
    { id: 'about', href: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-xl font-bold text-primary hover:text-accent transition-colors"
                aria-label="Travel Link - Home"
              >
                <PaperPlaneIcon className="h-6 w-6" />
                <span className="hidden sm:block">Travel Link</span>
              </Link>
            </div>

            {/* Center: Search Bar (hidden on mobile) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destinations, trips..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    aria-label="Search destinations and trips"
                  />
                </div>
              </form>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      href="/trips" 
                      className="text-muted hover:text-accent font-medium transition-colors"
                    >
                      My Trips
                    </Link>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                      aria-label="User profile"
                    >
                      JD
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/auth/login" 
                      className="text-muted hover:text-accent font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleDrawer}
                className="md:hidden p-2 text-muted hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
                aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isDrawerOpen}
                aria-controls="mobile-menu"
              >
                {isDrawerOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <HamburgerIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-80 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-lg font-bold text-primary"
              onClick={closeDrawer}
              aria-label="Travel Link - Home"
            >
              <PaperPlaneIcon className="h-5 w-5" />
              Travel Link
            </Link>
            <button
              onClick={closeDrawer}
              className="p-2 text-muted hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar (mobile) */}
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, trips..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                aria-label="Search destinations and trips"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={closeDrawer}
                    className="block px-3 py-3 text-base font-medium text-muted hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Section */}
          <div className="p-4 border-t border-gray-100">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium">
                    JD
                  </div>
                  <span className="font-medium text-gray-900">John Doe</span>
                </div>
                <Link
                  href="/profile"
                  onClick={closeDrawer}
                  className="block px-3 py-2 text-base font-medium text-muted hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    closeDrawer();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-muted hover:text-accent hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  onClick={closeDrawer}
                  className="block w-full text-center px-4 py-2 text-base font-medium text-muted hover:text-accent border border-gray-200 hover:border-accent rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={closeDrawer}
                  className="block w-full text-center px-4 py-2 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
