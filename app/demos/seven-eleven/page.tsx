"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoActions } from "@/lib/redux/hooks";
import { SevenElevenView } from "@/components/features/dashboard/views";

// Create a client component that uses useSearchParams
function SevenElevenDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();
  const [newCampaignAdded, setNewCampaignAdded] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);

  // Store params in refs to avoid dependency on searchParams
  const fromParamRef = useRef(searchParams.get("from"));
  const viewParamRef = useRef(searchParams.get("view"));

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("SevenElevenDashboard: Skipping repeated initialization");
      return;
    }

    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;

    console.log(
      "SevenElevenDashboard: Initializing once with clientId=seven-eleven"
    );

    // Set client ID for the demo only once
    setClientId("seven-eleven");
  }, [setClientId]);

  // Separate effect for handling URL parameters
  useEffect(() => {
    // Get current parameters each time URL changes
    const fromCampaignLaunch = searchParams.get("from") === "campaign-launch";
    const viewPerformance = searchParams.get("view") === "performance";

    if (fromCampaignLaunch) {
      setNewCampaignAdded(true);

      // Clear the flag after 5 seconds
      const timer = setTimeout(() => {
        setNewCampaignAdded(false);
      }, 5000);

      // Clean up timer to prevent memory leaks
      return () => clearTimeout(timer);
    }

    if (viewPerformance) {
      setShowPerformance(true);
    } else {
      setShowPerformance(false);
    }
  }, [searchParams]);

  // Define the callbacks for the buttons in the dashboard
  const handleCreateCampaign = () => {
    router.push("/demos/ai-campaign-creation?client=seven-eleven");
  };

  const handleCreateOffer = () => {
    router.push("/demos/ai-campaign-creation?client=seven-eleven&type=offer");
  };

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/demos/campaigns/${campaignId}?client=seven-eleven`);
  };

  return (
    <SevenElevenView
      newCampaignAdded={newCampaignAdded}
      onCreateCampaign={handleCreateCampaign}
      onCreateOffer={handleCreateOffer}
      onViewCampaign={handleViewCampaign}
      showCampaignPerformance={showPerformance}
    />
  );
}

function SevenElevenLoading() {
  return <div className="p-6 text-center">Loading dashboard...</div>;
}

export default function SevenElevenDashboard() {
  return (
    <Suspense fallback={<SevenElevenLoading />}>
      <SevenElevenDashboardContent />
    </Suspense>
  );
}
