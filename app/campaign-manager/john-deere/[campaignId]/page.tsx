"use client";

import React, { Suspense, use } from "react";
import {
  DealerShell,
  CampaignDetailView,
} from "@/components/features/jd-perks";

export default function JohnDeereCampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <DealerShell>
        <CampaignDetailView campaignId={campaignId} />
      </DealerShell>
    </Suspense>
  );
}
