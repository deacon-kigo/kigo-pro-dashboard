"use client";

import React, { useEffect, Suspense } from "react";
import { BoADashboardView } from "@/components/features/dashboard/views";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

export default function BoADashboardPage() {
  // Set URL parameters to maintain proper context
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("userType", "publisher");
    window.history.replaceState({}, "", url);

    // Update document title
    document.title = "Publisher Program Analytics - Bank of America";
  }, []);

  // Custom breadcrumb showing BoA dashboard path
  const dashboardBreadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager/publisher-dashboard">
            Publisher Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Bank of America</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <AppLayout customBreadcrumb={dashboardBreadcrumb}>
        <div className="pt-0 mt-0">
          <BoADashboardView />
        </div>
      </AppLayout>
    </Suspense>
  );
}
