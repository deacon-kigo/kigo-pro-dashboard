"use client";

import React, { useEffect, Suspense } from "react";
import CampaignManagerView from "@/components/features/dashboard/views/CampaignManagerView";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import { InactivityProvider } from "@/components/features/auth/inactivity";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";

export default function CampaignManagerPage() {
  // Fix sidebar active state
  useEffect(() => {
    // Add view=campaign-manager parameter to mark Dashboard as active in sidebar
    const url = new URL(window.location.href);
    url.searchParams.set("view", "campaign-manager");
    window.history.replaceState({}, "", url);
  }, []);

  // Custom breadcrumb showing just "Dashboard"
  const dashboardBreadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      {/* For demonstration purposes, we're using much shorter timeouts */}
      <InactivityProvider
        timeoutInMinutes={1}
        warningBeforeTimeoutInMinutes={0.5}
      >
        <AppLayout customBreadcrumb={dashboardBreadcrumb}>
          <div className="pt-0 mt-0">
            <CampaignManagerView />
          </div>
        </AppLayout>
      </InactivityProvider>
    </Suspense>
  );
}
