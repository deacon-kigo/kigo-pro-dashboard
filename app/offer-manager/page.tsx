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

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href="/offer-manager">Offer Manager</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>
              Offer Manager
              {version === "p1" && " (P1)"}
              {version === "p2" && " (P2)"}
              {version === "p3" && " (P3)"}
              {version === "p4" && " (P4)"}
              {version === "p5" && " (P5)"}
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

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        {version === "p5" ? (
          <OfferManagerViewFuture onCreatingChange={setIsCreating} />
        ) : (
          <OfferManagerViewP0
            onCreatingChange={setIsCreating}
            autoStart={autoStart}
          />
        )}
      </div>
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
