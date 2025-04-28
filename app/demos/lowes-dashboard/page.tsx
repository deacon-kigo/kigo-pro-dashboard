"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoActions } from "@/lib/redux/hooks";
import { LowesView } from "@/components/features/dashboard/views";

// Create a client component that uses useSearchParams
function LowesDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();
  const [newOfferAdded, setNewOfferAdded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);

  // Store params in refs to avoid dependency on searchParams
  const fromParamRef = useRef(searchParams.get("from"));
  const viewParamRef = useRef(searchParams.get("view"));

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("LowesDashboard: Skipping repeated initialization");
      return;
    }

    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;

    console.log("LowesDashboard: Initializing once with clientId=lowes");

    // Set client ID for the demo only once
    setClientId("lowes");
  }, [setClientId]);

  // Separate effect for handling URL parameters
  useEffect(() => {
    // Get current parameters each time URL changes
    const fromOfferCreation = searchParams.get("from") === "offer-creation";
    const viewAnalytics = searchParams.get("view") === "analytics";

    if (fromOfferCreation) {
      setNewOfferAdded(true);

      // Clear the flag after 5 seconds
      const timer = setTimeout(() => {
        setNewOfferAdded(false);
      }, 5000);

      // Clean up timer to prevent memory leaks
      return () => clearTimeout(timer);
    }

    if (viewAnalytics) {
      setShowAnalytics(true);
    } else {
      setShowAnalytics(false);
    }
  }, [searchParams]);

  // Define the callbacks for the buttons in the dashboard
  const handleCreateOffer = () => {
    router.push("/demos/ai-campaign-creation?client=lowes&type=offer");
  };

  const handleCreateCampaign = () => {
    router.push("/demos/ai-campaign-creation?client=lowes&type=campaign");
  };

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/demos/campaigns/${campaignId}?client=lowes`);
  };

  return (
    <LowesView
      newOfferAdded={newOfferAdded}
      onCreateCampaign={handleCreateCampaign}
      onCreateOffer={handleCreateOffer}
      onViewCampaign={handleViewCampaign}
      showAnalytics={showAnalytics}
    />
  );
}

function LowesLoading() {
  return <div className="p-6 text-center">Loading dashboard...</div>;
}

export default function LowesDashboard() {
  return (
    <Suspense fallback={<LowesLoading />}>
      <LowesDashboardContent />
    </Suspense>
  );
}
