"use client";

import React, { useEffect, Suspense } from "react";
import { PublisherDashboardView } from "@/components/features/dashboard/views";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

export default function PublisherDashboardPage() {
  // Set URL parameters to maintain proper context
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "campaign-manager");
    url.searchParams.set("userType", "publisher");
    window.history.replaceState({}, "", url);

    // Update document title
    document.title = "Publisher Program Analytics - Bread Financial";
  }, []);

  // Custom breadcrumb showing publisher dashboard path
  const dashboardBreadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaign-manager">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Publisher Dashboard</BreadcrumbPage>
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
          <PublisherDashboardView />
        </div>
      </AppLayout>
    </Suspense>
  );
}
