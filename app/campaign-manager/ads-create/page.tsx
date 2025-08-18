"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { useSearchParams } from "next/navigation";

// Loading component
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Loading Ads Creation...</p>
      </div>
    </div>
  );
}

// Dynamically load the client components with no SSR
const AdvertisementCampaignContent = dynamic(
  () =>
    import(
      "../../../components/features/campaigns/AdvertisementCampaignCreationContent"
    ),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

const AdvertisementWizard = dynamic(
  () => import("@/components/features/campaigns/wizard/AdvertisementWizard"),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

export default function AdvertisementCampaignCreatePage() {
  const searchParams = useSearchParams();
  // Make wizard the default mode, only use accordion mode if explicitly set to false
  const useWizard = searchParams.get("wizard") !== "false";
  // Check if we're creating an ad group
  const tabParam = searchParams.get("tab");
  const isAdGroupMode = tabParam === "adgroup";

  // Preserve wizard parameter if needed
  useEffect(() => {
    if (!useWizard) {
      const url = new URL(window.location.href);
      url.searchParams.set("wizard", "false");
      window.history.replaceState({}, "", url);
    }
  }, [useWizard]);

  // Custom breadcrumb showing navigation path
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Ad Manager</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {isAdGroupMode ? "Ad Group Creation" : "Ad Creation"}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout customBreadcrumb={breadcrumb}>
        <div className="pt-0 mt-0">
          {useWizard ? (
            <AdvertisementWizard isAdGroupMode={isAdGroupMode} />
          ) : (
            <AdvertisementCampaignContent isAdGroupMode={isAdGroupMode} />
          )}
        </div>
      </AppLayout>
    </Suspense>
  );
}
