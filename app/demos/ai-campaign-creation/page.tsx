"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Create a loading component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading AI Campaign Creation...</p>
      </div>
    </div>
  );
}

// The entire content component wrapped with NoSSR
const NoSSR = dynamic(
  () =>
    Promise.resolve(
      // Import local components statically to avoid import path issues
      require("./client-component").default
    ),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

// Simple component that only renders the NoSSR wrapper with Suspense boundary
export default function AICampaignCreationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NoSSR />
    </Suspense>
  );
}
