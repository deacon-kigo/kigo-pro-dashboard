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
import OfferManagerViewV1 from "@/components/features/offer-manager/v1/OfferManagerView";
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
  const version = searchParams.get("version") || "v1";
  const [isCreating, setIsCreating] = useState(false);

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href="/offer-manager">Offer Manager</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>
              Offer Manager {version === "future" && "(Future Version)"}
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
        {version === "future" ? (
          <OfferManagerViewFuture onCreatingChange={setIsCreating} />
        ) : (
          <OfferManagerViewV1 onCreatingChange={setIsCreating} />
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
