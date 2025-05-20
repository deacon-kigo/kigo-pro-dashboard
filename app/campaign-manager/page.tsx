"use client";

import React, { Suspense } from "react";
import CampaignManagerView from "@/components/features/dashboard/views/CampaignManagerView";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";

export default function CampaignManagerPage() {
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
      <AppLayout customBreadcrumb={dashboardBreadcrumb}>
        <div className="pt-0 mt-0">
          <CampaignManagerView />
        </div>
      </AppLayout>
    </Suspense>
  );
}
