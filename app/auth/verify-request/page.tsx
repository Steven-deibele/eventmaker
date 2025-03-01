import React from 'react';
import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <EnvelopeIcon className="h-16 w-16 text-primary-600" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Check your email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent you a magic link to sign in. Check your inbox and click the link to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
              <ul className="mt-4 list-disc list-inside text-sm text-gray-600 space-y-2">
                <li>Check your email inbox</li>
                <li>Click the magic link we sent you</li>
                <li>You'll be automatically signed in</li>
                <li>The link is valid for 10 minutes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Didn't receive an email?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Check your spam folder, or{' '}
                <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
                  try signing in again
                </Link>
                .
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Return to home page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 