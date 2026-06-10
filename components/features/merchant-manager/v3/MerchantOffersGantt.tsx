"use client";

import React, { useMemo } from "react";
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
} from "@/components/kibo-ui/gantt";
import type { Merchant, Offer, OfferStatus } from "./types";

// Status fills aligned with the AIA Design System color foundations
// (uOtplb1iYDdJZQ7wdz7S9n, node 5:11). kibo-ui takes inline hex strings,
// not classes, so the tokens are inlined here with their DS provenance noted.
// Two semantic axes: lifecycle severity (success/warning/error) and lifecycle
// stage (active vs. completed) — the latter handled by tinted neutrals.
const STATUS_COLOR: Record<OfferStatus, string> = {
  published: "#2d9b6f", // color/system/success/default — live in marketplace
  draft: "#d4d4d8", // color/neutral/300 (proposed) — placeholder, not yet active
  pending_approval: "#e9a12a", // color/system/warning/default — needs operator review
  paused: "#fcd34d", // color/amber-300 (proposed) — warning tint, distinguishable from In Review
  expired: "#a1a1aa", // color/neutral/400 (proposed) — completed, attention via the red callout above the Gantt
  archived: "#d4d4d8", // color/neutral/300 (proposed) — terminal, fully faded
};

const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  published: "Active",
  draft: "Draft",
  pending_approval: "In Review",
  paused: "Paused",
  expired: "Expired",
  archived: "Archived",
};

function offerToFeature(offer: Offer): GanttFeature {
  return {
    id: offer.id,
    name: offer.name,
    startAt: new Date(Date.parse(offer.start)),
    endAt: new Date(Date.parse(offer.end)),
    status: {
      id: offer.status,
      name: OFFER_STATUS_LABEL[offer.status],
      color: STATUS_COLOR[offer.status],
    },
  };
}

interface MerchantOffersGanttProps {
  merchant: Merchant;
}

export function MerchantOffersGantt({ merchant }: MerchantOffersGanttProps) {
  const features = useMemo(
    () => merchant.offers.map(offerToFeature),
    [merchant.offers]
  );

  return (
    // Read-only timeline per Jose's feedback (2026-06-10): no navigation
    // out to the offer editor from inside the merchant detail page, since
    // there's no symmetric path back to the in-progress merchant edit.
    <GanttProvider
      range="monthly"
      zoom={100}
      // Override kibo-ui's bg-secondary so the timeline backdrop reads as
      // white. Bars + sidebar can carry the visual hierarchy from there.
      className="h-[520px] rounded-md border border-gray-200 bg-white"
    >
      <GanttSidebar className="bg-white">
        <GanttSidebarGroup name="Offers">
          {features.map((feature) => (
            <GanttSidebarItem key={feature.id} feature={feature} />
          ))}
        </GanttSidebarGroup>
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          <GanttFeatureListGroup>
            {features.map((feature) => (
              <GanttFeatureRow key={feature.id} features={[feature]}>
                {(f) => (
                  <div
                    // Negative margins escape kibo-ui's Card padding so the
                    // colored bar fills the entire card.
                    className="-m-2 flex h-[calc(100%+1rem)] w-[calc(100%+1rem)] items-center rounded-md px-3"
                    style={{ backgroundColor: f.status.color }}
                    aria-label={`${f.name} (${f.status.name})`}
                  >
                    <span className="truncate text-xs font-semibold text-gray-900">
                      {f.name}
                    </span>
                  </div>
                )}
              </GanttFeatureRow>
            ))}
          </GanttFeatureListGroup>
        </GanttFeatureList>
        {/* Today line — Kigo coral so it stays distinct from the bars */}
        <GanttToday className="bg-coral text-white" />
      </GanttTimeline>
    </GanttProvider>
  );
}
