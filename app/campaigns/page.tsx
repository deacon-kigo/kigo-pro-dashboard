"use client";

import React, { useMemo } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import AdManagerListView from "@/components/features/ads/AdManagerListView";

/**
 * Campaigns Page (Ad Manager)
 *
 * Top-level page component for the ads manager section
 */
export default function CampaignsPage() {
  // Memoize the breadcrumb to prevent unnecessary recreations
  const adManagerBreadcrumb = useMemo(
    () => (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Ad Manager</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    []
  );

  return (
    <AppLayout customBreadcrumb={adManagerBreadcrumb}>
      <AdManagerListView />
    </AppLayout>
  );
}
