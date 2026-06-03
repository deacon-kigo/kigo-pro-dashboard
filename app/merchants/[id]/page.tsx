"use client";

import React, { Suspense, use } from "react";
import { notFound } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import MerchantDetailView from "@/components/features/merchant-manager/v3/MerchantDetailView";
import { merchants as merchantSeed } from "@/components/features/merchant-manager/v3/mockData";

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-brand"></div>
        <p className="text-text-muted">Loading Merchant...</p>
      </div>
    </div>
  );
}

function MerchantDetailPageContent({ id }: { id: string }) {
  const merchant = merchantSeed.find((m) => m.id === id);
  if (!merchant) {
    notFound();
  }

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/merchants">Merchants</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{merchant.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <MerchantDetailView merchant={merchant} />
      </div>
    </AppLayout>
  );
}

export default function MerchantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MerchantDetailPageContent id={decodeURIComponent(id)} />
    </Suspense>
  );
}
