"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import TMTCampaignEditor from "@/components/features/tmt-campaigns/TMTCampaignEditor";
import TMTAuthGate from "@/components/features/tmt-campaigns/TMTAuthGate";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brand"></div>
        <p className="text-text-muted">Loading Campaign Editor...</p>
      </div>
    </div>
  );
}

function PromoCampaignEditContent() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/promo-campaigns">
            Promo Campaigns
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {isNew ? "New Campaign" : "Edit Campaign"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <TMTAuthGate>
          <TMTCampaignEditor campaignId={id} />
        </TMTAuthGate>
      </div>
    </AppLayout>
  );
}

export default function PromoCampaignEditPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PromoCampaignEditContent />
    </Suspense>
  );
}
