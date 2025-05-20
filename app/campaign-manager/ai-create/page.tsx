"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";
import { useDemoState, useDemoActions } from "@/lib/redux/hooks";
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
        <p className="text-gray-700 text-lg">Loading AI Campaign Creation...</p>
      </div>
    </div>
  );
}

// Dynamically load the client component with no SSR
const AICampaignContent = dynamic(
  () =>
    import(
      "../../../components/features/campaigns/ai-create/AICampaignCreationContent"
    ),
  {
    ssr: false,
    loading: () => <LoadingFallback />,
  }
);

export default function AICampaignCreatePage() {
  // Custom breadcrumb showing navigation path
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>AI Campaign Creation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout customBreadcrumb={breadcrumb}>
        <div className="pt-0 mt-0">
          <AICampaignContent />
        </div>
      </AppLayout>
    </Suspense>
  );
}
