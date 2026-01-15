"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import OfferManagerViewCompact from "@/components/features/offer-manager/v1-express/OfferManagerViewCompact";

/**
 * Offer Creation V1 Express - Compact Layout
 * Route: /dashboard/offers/create-v1-compact
 *
 * Two-column grid layout for more compact presentation
 * - Same functionality as V1 Express
 * - Better space utilization with responsive grid
 * - Optimized for desktop and tablet screens
 */
export default function OfferCreationV1CompactPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href="/dashboard/offers">Offers</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Offer Manager - Express (Compact)</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isCreating && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Offer (Express Compact)</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <OfferManagerViewCompact
          onCreatingChange={setIsCreating}
          autoStart={true}
          onBackToDashboard={() => router.push("/dashboard/offers")}
        />
      </div>
    </AppLayout>
  );
}
