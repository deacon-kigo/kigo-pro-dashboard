"use client";

import React, { Suspense } from "react";
import {
  DealerShell,
  DealerDashboardView,
} from "@/components/features/jd-perks";

export default function JohnDeereDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <DealerShell>
        <DealerDashboardView />
      </DealerShell>
    </Suspense>
  );
}
