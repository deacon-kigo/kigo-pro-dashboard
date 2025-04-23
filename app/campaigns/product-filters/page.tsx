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
import { ProductFiltersListView } from "@/components/features/campaigns/product-filters";

/**
 * Product Filters Page
 * 
 * Top-level page component for the product filters section
 */
export default function ProductFiltersPage() {
  // Memoize the breadcrumb to prevent unnecessary recreations
  const productFilterBreadcrumb = useMemo(() => (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Product Filters</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ), []);

  return (
    <AppLayout customBreadcrumb={productFilterBreadcrumb}>
      <ProductFiltersListView />
    </AppLayout>
  );
}
