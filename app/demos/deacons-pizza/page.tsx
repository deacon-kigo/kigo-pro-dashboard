'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemoActions } from '@/lib/redux/hooks';
import { DeaconsPizzaView } from '@/components/features/dashboard/views';

// Create a client component that uses useSearchParams
function DeaconsPizzaDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();
  const [newCampaignAdded, setNewCampaignAdded] = useState(false);
  
  // Add initialization ref to ensure the effect only runs exactly once
  const isInitializedRef = useRef(false);
  
  // Store fromParam in a ref to avoid dependency on searchParams
  const fromParamRef = useRef(searchParams.get('from'));

  // Improved useEffect with strict one-time execution
  useEffect(() => {
    // Check if we've already initialized to prevent any possibility of re-execution
    if (isInitializedRef.current) {
      console.log("DeaconsPizzaDashboard: Skipping repeated initialization");
      return;
    }
    
    // Mark as initialized immediately to prevent any potential race conditions
    isInitializedRef.current = true;
    
    console.log("DeaconsPizzaDashboard: Initializing once with clientId=deacons");
    
    // Set client ID for the demo only once
    setClientId('deacons');

    // Get the parameter only once
    const fromCampaignLaunch = fromParamRef.current === 'campaign-launch';
    
    if (fromCampaignLaunch) {
      setNewCampaignAdded(true);
      
      // Clear the flag after 5 seconds
      const timer = setTimeout(() => {
        setNewCampaignAdded(false);
      }, 5000);
      
      // Clean up timer to prevent memory leaks
      return () => clearTimeout(timer);
    }
    
    // Empty dependency array with initialization guard ensures this runs exactly once
  }, []);

  return <DeaconsPizzaView newCampaignAdded={newCampaignAdded} />;
}

function DeaconsPizzaLoading() {
  return <div className="p-6 text-center">Loading dashboard...</div>;
}

export default function DeaconsPizzaDashboard() {
  return (
    <Suspense fallback={<DeaconsPizzaLoading />}>
      <DeaconsPizzaDashboardContent />
    </Suspense>
  );
} 