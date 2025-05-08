"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

// Loading component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading Campaign Creation...</p>
      </div>
    </div>
  );
}

// Dynamically load the campaign wizard with no SSR
const CampaignWizard = dynamic(
  () => import("@/components/features/campaigns/wizard/CampaignWizard"),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

export default function CampaignCreatePage() {
  // Fix sidebar active state
  useEffect(() => {
    // Add view=campaign-manager parameter to mark Dashboard as active in sidebar
    const url = new URL(window.location.href);
    url.searchParams.set("view", "campaign-manager");
    window.history.replaceState({}, "", url);
  }, []);

  // Custom breadcrumb showing navigation path
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Campaign Creation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout customBreadcrumb={breadcrumb}>
        <div className="pt-0 mt-0">
          <CampaignWizard />
        </div>
      </AppLayout>
    </Suspense>
  );
}
