"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoActions } from "@/lib/redux/hooks";
import { JohnDeereView } from "@/components/features/dashboard/views";

// Create a client component that uses useSearchParams
function JohnDeereDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();

  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("JohnDeereDashboard: Skipping repeated initialization");
      return;
    }

    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;

    console.log(
      "JohnDeereDashboard: Initializing once with clientId=johndeere"
    );

    // Set client ID for the demo only once
    setClientId("johndeere");
  }, [setClientId]);

  // Define the callback for the back button
  const handleBack = () => {
    router.push("/demos");
  };

  return <JohnDeereView onBack={handleBack} />;
}

function JohnDeereLoading() {
  return <div className="p-6 text-center">Loading John Deere dashboard...</div>;
}

export default function JohnDeereDashboard() {
  return (
    <Suspense fallback={<JohnDeereLoading />}>
      <JohnDeereDashboardContent />
    </Suspense>
  );
}
