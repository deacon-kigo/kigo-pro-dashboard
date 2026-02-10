"use client";

import React, { Suspense } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import OfferListView from "@/components/features/offer-manager/offer-list/OfferListView";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brand"></div>
        <p className="text-text-muted">Loading Offer List...</p>
      </div>
    </div>
  );
}

export default function OfferListPage() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/offers">Offer Manager</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Offer List</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppLayout customBreadcrumb={breadcrumb}>
        <div className="pt-0 mt-0">
          <OfferListView />
        </div>
      </AppLayout>
    </Suspense>
  );
}
