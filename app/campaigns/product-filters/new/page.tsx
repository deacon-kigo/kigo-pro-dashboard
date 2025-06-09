"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";

// Client-side only wrapper component
const ClientOnlyView = () => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );

  useEffect(() => {
    // Import the component only on the client side after mounting
    import(
      "@/components/features/campaigns/product-filters/ProductFilterCreationView"
    )
      .then((module) => {
        setComponent(() => module.default);
      })
      .catch((err) => console.error("Failed to load component:", err));
  }, []);

  if (!Component) {
    return <div className="p-4">Loading...</div>;
  }

  return <Component />;
};

export default function NewProductFilterPage() {
  // Navigation breadcrumb
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns/product-filters">
            Catalog Filters
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Create New Filter</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <ClientOnlyView />
    </AppLayout>
  );
}
