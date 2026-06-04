"use client";

import React, { Suspense } from "react";
import {
  DealerShell,
  CampaignManagerView,
} from "@/components/features/jd-perks";

export default function JohnDeereCampaignManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <DealerShell>
        <CampaignManagerView />
      </DealerShell>
    </Suspense>
  );
}
