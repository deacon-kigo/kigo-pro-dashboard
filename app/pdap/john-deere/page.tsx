"use client";

import React, { Suspense } from "react";
import {
  DealerShell,
  PerksAdminPortalView,
} from "@/components/features/jd-perks";

export default function JohnDeerePerksAdminPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <DealerShell>
        <PerksAdminPortalView />
      </DealerShell>
    </Suspense>
  );
}
