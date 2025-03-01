'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';

// Event validation schema
const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().refine(val => new Date(val) > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  isPublic: z.boolean().default(false),
});

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '12:00',
    endDate: '',
    endTime: '13:00',
    capacity: '',
    isPublic: false,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Combine date and time
      const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
      const endDateTime = formData.endDate ? `${formData.endDate}T${formData.endTime}:00` : undefined;

      // Validate form data
      const validatedData = eventSchema.parse({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startDate: startDateTime,
        endDate: endDateTime,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : undefined,
        isPublic: formData.isPublic,
      });

      // Submit the form data
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      const eventData = await response.json();
      
      // Redirect to the event details page
      router.push(`/events/${eventData.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a simpler format
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: 'An unexpected error occurred' });
      }
      console.error('Event creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                  EventMaker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Create New Event</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {errors.form && (
                    <div className="rounded-md bg-red-50 p-4 mb-6">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {errors.form}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      {/* Event Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Event Title *
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                              errors.title ? 'border-red-300' : ''
                            }`}
                            placeholder="Summer Party"
                          />
                          {errors.title && (
                            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                          )}
                        </div>
                      </div>

                      {/* Event Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            rows={3}
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Tell people what this event is about"
                          />
                        </div>
                      </div>

                      {/* Event Location */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="123 Main St, City, Country or Online"
                          />
                        </div>
                      </div>

                      {/* Event Date and Time */}
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="date"
                              name="startDate"
                              id="startDate"
                              required
                              value={formData.startDate}
                              onChange={handleChange}
                              className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                                errors.startDate ? 'border-red-300' : ''
                              }`}
                            />
                          </div>
                          {errors.startDate && (
                            <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
                          )}
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                            Start Time *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="time"
                              name="startTime"
                              id="startTime"
                              required
                              value={formData.startTime}
                              onChange={handleChange}
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="date"
                              name="endDate"
                              id="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                              type="time"
                              name="endTime"
                              id="endTime"
                              value={formData.endTime}
                              onChange={handleChange}
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event Capacity */}
                      <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                          Capacity (leave empty for unlimited)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="capacity"
                            id="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min="1"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="100"
                          />
                        </div>
                      </div>

                      {/* Public/Private Event */}
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isPublic"
                            name="isPublic"
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={handleChange}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="isPublic" className="font-medium text-gray-700">
                            Public Event
                          </label>
                          <p className="text-gray-500">
                            If enabled, anyone can find and join this event. Otherwise, it's only accessible via the event link.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <Link
                          href="/dashboard"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Creating...' : 'Create Event'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 