"use client";

import React from "react";
import { InactivityProvider } from "@/components/features/auth/inactivity";
import CampaignManagerView from "@/components/features/dashboard/views/CampaignManagerView";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";

export default function AutoSignOutDemoPage() {
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
    <InactivityProvider
      timeoutInMinutes={1} // Short 1-minute timeout for demo purposes
      warningBeforeTimeoutInMinutes={0.5} // 30-second warning
    >
      <AppLayout customBreadcrumb={dashboardBreadcrumb}>
        <div className="pt-0 mt-0">
          <CampaignManagerView />
        </div>
      </AppLayout>
    </InactivityProvider>
  );
}
