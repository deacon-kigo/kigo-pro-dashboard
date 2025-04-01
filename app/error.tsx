'use client';

import { useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <div className="p-2 rounded-full bg-red-100 mr-3">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
        </div>
        
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-sm text-red-800">{error.message || 'An unknown error occurred'}</p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-600">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
} 