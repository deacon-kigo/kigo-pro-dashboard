"use client";

import React from "react";
import MerchantPortalView from "@/components/features/dashboard/views/MerchantPortalView";
import { AppLayout } from "@/components/templates/AppLayout/AppLayout";

export default function MerchantDashboardPage() {
  return (
    <AppLayout>
      <MerchantPortalView />
    </AppLayout>
  );
}
