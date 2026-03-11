"use client";

import React, { Suspense } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";
import TMTCampaignDashboard from "@/components/features/tmt-campaigns/TMTCampaignDashboard";
import TMTAuthGate from "@/components/features/tmt-campaigns/TMTAuthGate";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brand"></div>
        <p className="text-text-muted">Loading Promo Campaigns...</p>
      </div>
    </div>
  );
}

function PromoCampaignsContent() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Promo Campaigns</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <TMTAuthGate>
          <TMTCampaignDashboard />
        </TMTAuthGate>
      </div>
    </AppLayout>
  );
}

export default function PromoCampaignsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PromoCampaignsContent />
    </Suspense>
  );
}
