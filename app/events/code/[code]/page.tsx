'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserIcon, 
  UserGroupIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isPublic: boolean;
  code: string;
  capacity: number | null;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    attendances: number;
  };
}

export default function EventPage({ params }: { params: { code: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { code } = params;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/code/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found. Please check the code and try again.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load the event');
          }
        }
        
        const eventData = await response.json();
        setEvent(eventData);
        
        // Check if the user has already joined if they're logged in
        if (status === 'authenticated' && session?.user?.email) {
          const attendanceResponse = await fetch(`/api/events/${eventData.id}/attendance`);
          if (attendanceResponse.ok) {
            setHasJoined(true);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Error fetching event:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [code, session, status]);

  const handleJoinEvent = async () => {
    // Redirect to login if not authenticated
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/events/code/${code}`)}`);
      return;
    }
    
    try {
      setIsJoining(true);
      
      // Join the event
      const response = await fetch(`/api/events/${event?.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join the event');
      }
      
      // Update UI to reflect that the user has joined
      setHasJoined(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error joining event:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold mt-4">{error}</h2>
          </div>
          <Link href="/" className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-500">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mt-4">Event Not Found</h2>
            <p className="mt-2">The event you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link href="/" className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-500">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <div className="flex items-center">
              {status === 'authenticated' ? (
                <div className="ml-4 flex items-center md:ml-6">
                  <span className="text-sm text-gray-500 mr-4">
                    {session?.user?.email}
                  </span>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events/join"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Join Event
          </Link>
          
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-3xl font-bold leading-6 text-gray-900">{event.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Event code: {event.code}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate && (
                      <> to {formatDate(event.endDate)}</>
                    )}
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatTime(event.startDate)}
                    {event.endDate && (
                      <> to {formatTime(event.endDate)}</>
                    )}
                  </dd>
                </div>
                
                {event.location && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {event.location}
                    </dd>
                  </div>
                )}
                
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Organizer
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {event.creator.name || event.creator.email}
                  </dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Attendees
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {event._count.attendances} {event.capacity && `/ ${event.capacity}`}
                  </dd>
                </div>
                
                {event.description && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {event.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            
            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
              {hasJoined ? (
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You're attending this event
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinEvent}
                  disabled={isJoining}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    isJoining ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isJoining ? 'Joining...' : 'Join This Event'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 