'use client';

import { useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600 text-sm">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md mb-6">
              <div className="text-sm text-red-800">
                <p>Error: {error.message || 'An unknown error occurred'}</p>
                {error.digest && <p className="mt-1 text-xs">Error ID: {error.digest}</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 