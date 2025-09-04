'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration point: Authentication API
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="max-w-md mx-auto px-16 py-24">
      <h1 className="text-3xl font-bold text-center mb-16">Log In</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-24">
        <form onSubmit={handleSubmit} className="space-y-16">
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-12 px-16 rounded-2xl transition-colors"
          >
            Log In
          </button>
        </form>
        
        <div className="mt-16 text-center">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}