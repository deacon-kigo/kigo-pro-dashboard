"use client";

import React, { Suspense } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import { CampaignManagementDashboard } from "@/components/features/campaign-management/CampaignManagementDashboard";
import { useRouter } from "next/navigation";

function CampaignManagementContent() {
  const router = useRouter();

  const handleCreateCampaign = () => {
    router.push("/campaign-management/create");
  };

  return (
    <CampaignManagementDashboard onCreateCampaign={handleCreateCampaign} />
  );
}

export default function CampaignManagementPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Campaign Management", href: "/campaign-management" },
      ]}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CampaignManagementContent />
      </Suspense>
    </AppLayout>
  );
}
