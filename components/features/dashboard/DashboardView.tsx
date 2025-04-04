'use client';

import React, { useMemo, Suspense, useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { dashboardRegistry } from './registry/dashboardRegistry';

/**
 * Main Dashboard component that renders the correct dashboard view based on the current context.
 * Uses a registry pattern for scalable extensibility - new dashboard views can be registered
 * in the registry without modifying this component.
 */
export default function DashboardView() {
  const { userProfile, clientId, scenario, role, version } = useDemo();
  
  // Add more detailed logging to help debug the context and routing
  useEffect(() => {
    console.log('DashboardView rendered with context:', {
      userProfile: userProfile ? `${userProfile.firstName} ${userProfile.lastName} (${userProfile.role})` : 'none',
      role,
      clientId,
      scenario,
      version
    });
  }, [userProfile, role, clientId, scenario, version]);
  
  // Get the appropriate dashboard component from the registry
  const DashboardComponent = useMemo(() => {
    return dashboardRegistry.getView(clientId, scenario);
  }, [clientId, scenario]);
  
  return (
    <div className="dashboard-container">
      <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
        <DashboardComponent />
      </Suspense>
    </div>
  );
} 