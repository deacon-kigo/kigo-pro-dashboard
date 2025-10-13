"use client";

import React, { Suspense } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";
import OfferManagerView from "@/components/features/offer-manager/OfferManagerView";

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

export default function OfferManagerPage() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Offer Manager</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout customBreadcrumb={breadcrumb}>
        <div className="pt-0 mt-0">
          <OfferManagerView />
        </div>
      </AppLayout>
    </Suspense>
  );
}
