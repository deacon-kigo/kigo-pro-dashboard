"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { buildOfferEditPayload, stashOfferForEdit } from "./offerEditPayload";

// Status colors → raw hex (kibo-ui takes inline color strings, not classes).
// Bright fills for active states, distinct grays for completed states so the
// bars read against a white timeline backdrop. Tuned for contrast with the
// dark text we overlay on them.
const STATUS_COLOR: Record<OfferStatus, string> = {
  published: "#77D898", // Kigo green — active
  draft: "#328FE5", // Kigo blue — scheduled
  pending_approval: "#FF8717", // Kigo orange — in review
  paused: "#FBBF24", // amber — temporarily off
  expired: "#9CA3AF", // gray-400 — completed
  archived: "#D1D5DB", // gray-300 — terminal
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
  const router = useRouter();

  const features = useMemo(
    () => merchant.offers.map(offerToFeature),
    [merchant.offers]
  );

  const handleOpenOffer = (offerId: string) => {
    const offer = merchant.offers.find((o) => o.id === offerId);
    if (!offer) return;
    stashOfferForEdit(buildOfferEditPayload(offer, merchant));
    router.push(
      `/offer-manager?version=p1.1&edit=${encodeURIComponent(offer.id)}`
    );
  };

  return (
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
            <GanttSidebarItem
              key={feature.id}
              feature={feature}
              onSelectItem={handleOpenOffer}
              className="cursor-pointer"
            />
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
                  <button
                    type="button"
                    onClick={() => handleOpenOffer(f.id)}
                    // Negative margins escape kibo-ui's Card padding so the
                    // colored bar fills the entire card. Card stays as the
                    // hit target (drag + shadow) underneath.
                    className="-m-2 flex h-[calc(100%+1rem)] w-[calc(100%+1rem)] items-center rounded-md px-3 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    style={{ backgroundColor: f.status.color }}
                    aria-label={`Open ${f.name}`}
                  >
                    <span className="truncate text-xs font-semibold text-gray-900">
                      {f.name}
                    </span>
                  </button>
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
