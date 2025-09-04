'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration point: Registration API
    console.log('Registration attempt with:', { name, email, password });
  };

  return (
    <div className="max-w-md mx-auto px-16 py-24">
      <h1 className="text-3xl font-bold text-center mb-16">Create an Account</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-24">
        <form onSubmit={handleSubmit} className="space-y-16">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted mb-4">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted mb-4">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted mb-4">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-muted mb-4">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-12 py-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-muted">
              I agree to the{' '}
              <Link href="/terms" className="text-accent hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-12 px-16 rounded-2xl transition-colors"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-16 text-center">
          <p className="text-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}