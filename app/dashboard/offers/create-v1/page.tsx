"use client";

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
import { useState } from "react";
import OfferManagerViewExpress from "@/components/features/offer-manager/v1-express/OfferManagerViewExpress";

export default function OfferCreationV1Page() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isCreating ? (
            <BreadcrumbLink href="/dashboard/offers">Offers</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Offer Manager - Express</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isCreating && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Offer (Express)</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="pt-0 mt-0">
        <OfferManagerViewExpress
          onCreatingChange={setIsCreating}
          autoStart={true}
          onBackToDashboard={() => router.push("/dashboard/offers")}
        />
      </div>
    </AppLayout>
  );
}
