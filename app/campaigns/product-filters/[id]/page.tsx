"use client";

import React from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { ProductFilterCreationView } from "@/components/features/campaigns/product-filters";

export default function ProductFilterDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Using a safer approach that works with both Promise and non-Promise params
  const filterId = String(params.id || "");

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
          <BreadcrumbPage>View Filter</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <ProductFilterCreationView filterId={filterId} mode="view" />
    </AppLayout>
  );
}
