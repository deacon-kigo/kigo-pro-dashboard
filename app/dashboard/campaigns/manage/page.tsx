"use client";

import { useRouter } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import CampaignManagementView from "@/components/features/dashboard/views/CampaignManagementView";

export default function CampaignManagementPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <CampaignManagementView onBack={() => router.push("/dashboard")} />
    </AppLayout>
  );
}
