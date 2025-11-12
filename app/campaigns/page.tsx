"use client";

import React, { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
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
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Handle success messages from ad group creation
  useEffect(() => {
    const success = searchParams.get("success");
    const newAdGroupParam = searchParams.get("newAdGroup");

    if (success && newAdGroupParam) {
      try {
        const newAdGroup = JSON.parse(decodeURIComponent(newAdGroupParam));

        if (success === "published") {
          toast({
            title: "🚀 Ad Group Published Successfully!",
            description: `"${newAdGroup.name}" is now active and delivering ads. Check it out at the top of your Ad Groups list.`,
            variant: "success",
            duration: 5000,
          });
        } else if (success === "created") {
          toast({
            title: "📝 Ad Group Created Successfully!",
            description: `"${newAdGroup.name}" has been saved as inactive. You can find it at the top of your Ad Groups list.`,
            className: "!bg-blue-100 !border-blue-300 !text-blue-900",
            duration: 5000,
          });
        }

        // Store the new ad group data for the AdManagerListView to pick up
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "newAdGroup",
            JSON.stringify({
              ...newAdGroup,
              isNew: true,
              createdAt: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Error parsing new ad group data:", error);
      }
    }
  }, [searchParams, toast]);

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
