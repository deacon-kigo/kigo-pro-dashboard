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

// Dynamically import the real component with SSR disabled
const AICampaignCreationWithNoSSR = dynamic(
  () =>
    import(
      "../../../components/features/campaigns/creation/AICampaignCreationPage"
    ),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

// Export a simple component that renders the dynamic import
export default function AICampaignCreationPage() {
  return <AICampaignCreationWithNoSSR />;
}
