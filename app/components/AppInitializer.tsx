'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '../../config/ConfigProvider';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { config } = useConfig();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Check app initialization status
    if (config.isInitialized) {
      // If app is ready, show content
      if (config.isReady) {
        setIsLoading(false);
        setError('');
      } else {
        // App is initialized but not ready (missing config or DB)
        setIsLoading(false);
        setError('The application is not properly configured. Please check server logs.');
      }
    } else {
      // App is still initializing
      setIsLoading(true);
      setError('');
      
      // Check initialization status from the API
      fetch('/api/system/init')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.data.ready) {
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setError('Application initialization failed. Please check server configuration.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          setError('Failed to connect to the server. Please try again later.');
          console.error('Initialization error:', err);
        });
    }
  }, [config.isInitialized, config.isReady]);
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            {config.appName}
          </h1>
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600">Initializing application, please wait...</p>
        </div>
      </div>
    );
  }
  
  // Error screen
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Initialization Error
          </h1>
          <div className="mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // If everything is good, render the children
  return <>{children}</>;
} 