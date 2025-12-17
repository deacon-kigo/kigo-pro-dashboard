"use client";

import React, { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoActions } from "@/lib/redux/hooks";
import { SchwabDashboardView } from "@/components/features/dashboard/views";

// Create a client component that uses useSearchParams
function SchwabDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();

  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("SchwabDashboard: Skipping repeated initialization");
      return;
    }

    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;

    console.log("SchwabDashboard: Initializing once with clientId=schwab");

    // Set client ID for the demo only once
    setClientId("schwab");
  }, [setClientId]);

  // Define the callbacks for the buttons in the dashboard
  const handleCreateAsset = () => {
    router.push("/demos/schwab-create-pass");
  };

  const handleViewAsset = (assetId: string) => {
    // Navigate to client hub view showing the digital pass
    router.push("/demos/schwab-client-hub");
  };

  return (
    <SchwabDashboardView
      onCreateAsset={handleCreateAsset}
      onViewAsset={handleViewAsset}
    />
  );
}

function SchwabLoading() {
  return <div className="p-6 text-center">Loading dashboard...</div>;
}

export default function SchwabDashboard() {
  return (
    <Suspense fallback={<SchwabLoading />}>
      <SchwabDashboardContent />
    </Suspense>
  );
}
