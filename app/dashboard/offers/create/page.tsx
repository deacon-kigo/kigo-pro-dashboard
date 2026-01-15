"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import { getOfferCreationVersion } from "@/config/featureFlags";
import OfferManagerViewV1 from "@/components/features/offer-manager/v1/OfferManagerView";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { useState, useEffect } from "react";

function OfferCreationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const version = getOfferCreationVersion();
  const [isCreating, setIsCreating] = useState(false);

  // Check if we should auto-start creation mode from URL parameter
  const autoStart = searchParams.get("start") === "true";

  // If version is v2 or higher, redirect to the new offer creation route
  useEffect(() => {
    if (version !== "v1") {
      router.push(`/dashboard/offers/create-v${version.slice(1)}`);
    }
  }, [version, router]);

  if (version !== "v1") {
    return null;
  }

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href="/dashboard/offers">Offers</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Offer Manager</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isCreating && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Offer</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <OfferManagerViewV1
          onCreatingChange={setIsCreating}
          autoStart={autoStart}
        />
      </div>
    </AppLayout>
  );
}

export default function OfferCreationPage() {
  return <OfferCreationPageContent />;
}
