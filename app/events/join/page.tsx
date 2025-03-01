'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TicketIcon } from '@heroicons/react/24/outline';

export default function JoinEventPage() {
  const [eventCode, setEventCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventCode) {
      setError('Please enter an event code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Check if event exists
      const response = await fetch(`/api/events/code/${eventCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Event not found. Please check the code and try again.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to find the event');
        }
      }
      
      // Redirect to the event page
      router.push(`/events/code/${eventCode}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error joining event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary-600">
                  EventMaker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="flex justify-center mb-6">
                <TicketIcon className="h-16 w-16 text-primary-600" aria-hidden="true" />
              </div>
              <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">Join an Event</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter the event code to join
              </p>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700">
                    Event Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="eventCode"
                      name="eventCode"
                      type="text"
                      required
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="ABC123"
                      autoCapitalize="characters"
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Finding Event...' : 'Join Event'}
                  </button>
                </div>
              </form>

              <div className="mt-6 flex justify-center">
                <div className="text-sm">
                  <Link href="/" className="font-medium text-primary-600 hover:text-primary-500">
                    Return to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 