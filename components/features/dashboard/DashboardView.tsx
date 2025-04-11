"use client";

import React, { useMemo, Suspense, useEffect } from "react";
import { useDemoState } from "@/lib/redux/hooks";
import CVSTokenManagementView from "./views/CVSTokenManagementView";
import DeaconsPizzaView from "./views/DeaconsPizzaView";
import GenericDashboardView from "./views/GenericDashboardView";
import CampaignManagerView from "./views/CampaignManagerView";
import { useSearchParams } from "next/navigation";

/**
 * Main Dashboard component that renders the correct dashboard view based on the current context.
 * This allows for conditional rendering without duplicating page structures.
 */
export default function DashboardView() {
  const { userProfile, clientId, scenario, role, version } = useDemoState();
  const searchParams = useSearchParams();
  const isCampaignManager = searchParams.get("view") === "campaign-manager";

  // Add more detailed logging to help debug the context and routing
  useEffect(() => {
    console.log("DashboardView rendered with context:", {
      userProfile: userProfile
        ? `${userProfile.firstName} ${userProfile.lastName} (${userProfile.role})`
        : "none",
      role,
      clientId,
      scenario,
      version,
      isCampaignManager,
    });
  }, [userProfile, role, clientId, scenario, version, isCampaignManager]);

  const DashboardComponent = useMemo(() => {
    // Check if we should show campaign manager view based on query parameter
    if (isCampaignManager) {
      console.log("Using CampaignManagerView based on query parameter");
      return CampaignManagerView;
    }

    // If we have a specific demo scenario and client, try to find a matching view
    if (clientId && scenario) {
      console.log(
        `Determining view component for clientId: ${clientId}, scenario: ${scenario}`
      );

      // Client-specific dashboard views
      if (clientId === "cvs" && scenario === "support-flow") {
        console.log("Using CVSTokenManagementView");
        return CVSTokenManagementView;
      }

      // Use DeaconsPizzaView for both dashboard and campaign-creation scenarios
      if (
        clientId === "deacons" &&
        (scenario === "campaign-creation" ||
          scenario === "dashboard" ||
          scenario === "pizza")
      ) {
        console.log("Using DeaconsPizzaView");
        return DeaconsPizzaView;
      }

      // Campaign Manager scenario
      if (scenario === "campaign-manager") {
        console.log("Using CampaignManagerView");
        return CampaignManagerView;
      }
    }

    // Fall back to the generic dashboard
    console.log("Using GenericDashboardView");
    return GenericDashboardView;
  }, [clientId, scenario, isCampaignManager]);

  return (
    <div className="dashboard-container">
      <Suspense
        fallback={<div className="p-8 text-center">Loading dashboard...</div>}
      >
        <DashboardComponent />
      </Suspense>
    </div>
  );
}
