"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import OfferManagerViewP0 from "@/components/features/offer-manager/v1-express/OfferManagerViewCompactWithDashboard";
import OfferManagerViewFuture from "@/components/features/offer-manager/future/OfferManagerView";
import {
  OfferManagerViewP0Merchant,
  OfferManagerViewP0_4Preview,
  OfferManagerViewP0_5Wizard,
} from "@/components/features/offer-manager/p0-merchant";
import OfferListView from "@/components/features/offer-manager/offer-list/OfferListView";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brand"></div>
        <p className="text-text-muted">Loading Offer Manager...</p>
      </div>
    </div>
  );
}

function OfferManagerContent() {
  const searchParams = useSearchParams();
  const version = searchParams.get("version") || "p0";
  const autoStart = searchParams.get("create") === "true";
  const [isCreating, setIsCreating] = useState(autoStart);

  // Version label mapping for breadcrumb
  const versionLabels: Record<string, string> = {
    p0: "",
    "p0.2": " (P0.2 - Merchant Creation)",
    "p0.4": " (P0.4 - Offer Preview)",
    "p0.5": " (P0.5 - Wizard Flow)",
    p1: " (P1)",
    p2: " (P2)",
    p3: " (P3)",
    p4: " (P4)",
    p5: " (P5)",
  };

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href={`/offer-manager?version=${version}`}>
              Offer Manager{versionLabels[version] || ""}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>
              Offer Manager{versionLabels[version] || ""}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isCreating && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Offer</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  // Render the appropriate view based on version
  const renderView = () => {
    switch (version) {
      case "p0.2":
        // P0.2: Merchant Creation during Offer Creation
        return (
          <OfferManagerViewP0Merchant
            onCreatingChange={setIsCreating}
            autoStart={autoStart}
          />
        );
      case "p0.4":
        // P0.4: Offer Preview Panel
        return (
          <OfferManagerViewP0_4Preview
            onCreatingChange={setIsCreating}
            autoStart={autoStart}
          />
        );
      case "p0.5":
        // P0.5: Wizard Flow
        return <OfferManagerViewP0_5Wizard />;
      case "p1":
        // P1: Offer List Grid
        return <OfferListView />;
      case "p5":
      case "future":
        return <OfferManagerViewFuture onCreatingChange={setIsCreating} />;
      case "p0":
      default:
        return <OfferListView />;
    }
  };

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">{renderView()}</div>
    </AppLayout>
  );
}

export default function OfferManagerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OfferManagerContent />
    </Suspense>
  );
}
