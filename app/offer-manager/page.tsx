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
  OfferManagerViewP0_5Carousel,
} from "@/components/features/offer-manager/p0-merchant";
import OfferListView from "@/components/features/offer-manager/offer-list/OfferListView";
import { OfferListViewP1 } from "@/components/features/offer-manager/offer-list-p1";
import { OfferManagerViewP1Wizard } from "@/components/features/offer-manager/p1-wizard";

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
    "p0.6": " (P0.6 - Carousel + Accordion)",
    p1: " (P1)",
    "p1.1": " (P1.1 - Offer Management)",
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
      case "p0.5": {
        // P0.5: Wizard Flow
        const editParam = searchParams.get("edit");
        const cloneParam = searchParams.get("clone");
        const wizardMode = editParam ? "edit" : cloneParam ? "clone" : "create";
        return <OfferManagerViewP0_5Wizard mode={wizardMode} />;
      }
      case "p0.6": {
        // P0.6: Carousel + Accordion (E2E single-page)
        const p06EditParam = searchParams.get("edit");
        const p06CloneParam = searchParams.get("clone");
        const p06Mode = p06EditParam
          ? "edit"
          : p06CloneParam
            ? "clone"
            : "create";
        return <OfferManagerViewP0_5Carousel mode={p06Mode} />;
      }
      case "p1":
        // P1: Offer List Grid (legacy alias)
        return <OfferListViewP1 />;
      case "p1.1": {
        // P1.1: Offer Management — list + P0.6 carousel form for create/edit
        const p1EditParam = searchParams.get("edit");
        const p1CloneParam = searchParams.get("clone");
        const p1CreateParam = searchParams.get("create");
        if (p1CreateParam === "true" || p1EditParam || p1CloneParam) {
          const p1Mode = p1EditParam
            ? "edit"
            : p1CloneParam
              ? "clone"
              : "create";
          return <OfferManagerViewP0_5Carousel mode={p1Mode} />;
        }
        return <OfferListViewP1 />;
      }
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
