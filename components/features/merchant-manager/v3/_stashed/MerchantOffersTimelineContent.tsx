"use client";

// STASHED — Offers Timeline body for the merchant detail page.
// Parked from DES-747 v1 (timeline not in the next release). See README.md.
// Imports the stashed Gantt next to it; both files come back together when
// the timeline is re-introduced.

import React, { useMemo } from "react";
import type { Merchant, OfferStatus } from "../types";
import { MerchantOffersGantt } from "./MerchantOffersGantt";

const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  published: "Active",
  draft: "Draft",
  pending_approval: "In Review",
  paused: "Paused",
  expired: "Expired",
  archived: "Archived",
};

const OFFER_STATUS_DOT: Record<OfferStatus, string> = {
  published: "bg-green",
  draft: "bg-blue",
  pending_approval: "bg-orange",
  paused: "bg-orange",
  expired: "bg-gray-200",
  archived: "bg-gray-200",
};

function OfferStatusStat({
  count,
  status,
}: {
  count: number;
  status: OfferStatus;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${OFFER_STATUS_DOT[status]}`}
        aria-hidden="true"
      />
      <strong className="tabular-nums text-gray-900">{count}</strong>{" "}
      {OFFER_STATUS_LABEL[status].toLowerCase()}
    </span>
  );
}

export function OffersTimelineContent({
  merchant,
  expiredCount,
}: {
  merchant: Merchant;
  expiredCount: number;
}) {
  const counts = useMemo(() => {
    const c: Record<OfferStatus, number> = {
      published: 0,
      draft: 0,
      pending_approval: 0,
      paused: 0,
      expired: 0,
      archived: 0,
    };
    for (const o of merchant.offers) c[o.status]++;
    return c;
  }, [merchant.offers]);

  if (merchant.offers.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No offers yet for this merchant.
          </p>
          <p className="mt-1 text-sm font-medium text-gray-600">
            Offers will appear here once published.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-600">
        <span>
          <strong className="tabular-nums text-gray-900">
            {merchant.offers.length}
          </strong>{" "}
          total {merchant.offers.length === 1 ? "offer" : "offers"}
        </span>
        {(Object.keys(counts) as OfferStatus[]).map((status) =>
          counts[status] > 0 ? (
            <OfferStatusStat
              key={status}
              count={counts[status]}
              status={status}
            />
          ) : null
        )}
      </div>

      {expiredCount > 0 && (
        <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800">
          <span
            className="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-red-600"
            aria-hidden="true"
          />
          <span>
            {expiredCount} expired offer
            {expiredCount > 1 ? "s" : ""} requires operator action before they
            can be reactivated.
          </span>
        </div>
      )}

      <MerchantOffersGantt merchant={merchant} />
    </div>
  );
}
