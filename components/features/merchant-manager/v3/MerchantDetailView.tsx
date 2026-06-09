"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IdentificationIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/lib/hooks/use-toast";
import MerchantProfileDisplay from "./MerchantProfileDisplay";
import MerchantForm, { type MerchantFormData } from "./MerchantForm";
import { MerchantOffersGantt } from "./MerchantOffersGantt";
import type { Merchant, MerchantStatus, OfferStatus } from "./types";

type DetailTab = "profile" | "offers" | "edit";

const EDIT_FORM_ID = "merchant-edit-form";

// Sidebar tabs — Profile + Offers Timeline only. Edit mode is entered via
// the "Edit Merchant" header button (or ?tab=edit deep-link), not the sidebar.
const TABS: {
  id: DetailTab;
  label: string;
  icon: typeof IdentificationIcon;
}[] = [
  { id: "profile", label: "Profile", icon: IdentificationIcon },
  { id: "offers", label: "Offers Timeline", icon: ListBulletIcon },
];

// Display labels for the production merchant lifecycle states.
const MERCHANT_STATUS_LABEL: Record<MerchantStatus, string> = {
  published: "Active",
  unpublished: "Unpublished",
  closed: "Closed",
};

const offerStatusVariant = (status: OfferStatus) => {
  switch (status) {
    case "published":
      return "success" as const;
    case "draft":
      return "info" as const;
    case "pending_approval":
      return "warning" as const;
    case "paused":
      return "warning" as const;
    case "expired":
    case "archived":
      return "error" as const;
    default:
      return "neutral" as const;
  }
};

// Human-readable label per API status — never display the raw enum.
const OFFER_STATUS_LABEL: Record<OfferStatus, string> = {
  published: "Active",
  draft: "Draft",
  pending_approval: "In Review",
  paused: "Paused",
  expired: "Expired",
  archived: "Archived",
};

interface MerchantDetailViewProps {
  merchant: Merchant;
}

export default function MerchantDetailView({
  merchant,
}: MerchantDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Tab state is driven by ?tab= URL param so deep-links work.
  const tabParam = searchParams.get("tab");
  const initialTab: DetailTab =
    tabParam === "offers" || tabParam === "edit" ? tabParam : "profile";
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const [isFormValid, setIsFormValid] = useState(false);
  // Edit form writes back into this so the page header + Profile view reflect
  // the most recent save without a global round-trip.
  const [merchantState, setMerchantState] = useState<Merchant>(merchant);
  const [merchantStatus, setMerchantStatus] = useState<MerchantStatus>(
    merchant.status ?? "published"
  );

  // Keep URL in sync with active tab (without scroll jump).
  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (activeTab === "profile") {
      next.delete("tab");
    } else {
      next.set("tab", activeTab);
    }
    const qs = next.toString();
    const url = qs ? `?${qs}` : "";
    router.replace(`/merchants/${encodeURIComponent(merchant.id)}${url}`, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, merchant.id]);

  const expiredOffers = useMemo(
    () => merchantState.offers.filter((o) => o.status === "expired"),
    [merchantState]
  );

  const handleEditSubmit = (data: MerchantFormData) => {
    // Mirror form values back into the merchant record so the Profile view
    // and page header reflect the save. Locations / logo / banner / corpName
    // are prototype-local form fields and aren't part of the Merchant type.
    const sourceLabel =
      data.source.charAt(0).toUpperCase() + data.source.slice(1);
    const categoryLabel = data.categories
      .map((v) => v.charAt(0).toUpperCase() + v.slice(1).replace(/-/g, " "))
      .join(", ");
    setMerchantState((prev) => ({
      ...prev,
      name: data.dbaName.trim(),
      source: sourceLabel,
      category: categoryLabel || prev.category,
      website: data.url.trim(),
      merchantDetail: data.highlights,
    }));
    toast({
      title: "Merchant updated",
      description: `${data.dbaName} (${merchant.id}) was updated.`,
    });
    setActiveTab("profile");
  };

  const handleStatusChange = (next: MerchantStatus) => {
    if (next === merchantStatus) return;
    setMerchantStatus(next);
    toast({
      title: `Merchant set to ${MERCHANT_STATUS_LABEL[next]}`,
      description:
        next === "unpublished"
          ? "Offers from this merchant will no longer appear in marketplace."
          : next === "closed"
            ? "Merchant marked as closed. Re-enable by creating a new record."
            : `${merchantState.name} is now visible in marketplace.`,
    });
  };

  // Header actions — Profile / Offers show a primary "Edit Merchant" entry
  // point that swaps the main content for the merchant form. Edit mode owns
  // Cancel + Save Changes targeting the merchant form's submit. The status
  // control lives inside the edit form per Slack addendum from John K.
  // Navigation back to the list lives in the breadcrumb above the card.
  const headerActions =
    activeTab === "edit" ? (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("profile")}
        >
          Cancel
        </Button>
        <Button
          form={EDIT_FORM_ID}
          type="submit"
          size="sm"
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </div>
    ) : (
      <Button size="sm" onClick={() => setActiveTab("edit")}>
        <PencilSquareIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
        Edit Merchant
      </Button>
    );

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex">
        {/* Vertical sidebar — mirrors ad group wizard pattern */}
        <div className="w-16 flex-shrink-0">
          <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm">
            <nav className="p-2 space-y-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-pastel-blue text-primary font-medium"
                        : "text-gray-600 hover:bg-pastel-blue hover:text-primary"
                    }`}
                    title={tab.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {/* Tooltip on hover */}
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none border-l-0">
            {/* Page header — title + description carry the page's
                  purpose; merchant identity lives in the breadcrumb above
                  and the Profile Overview rows below. Actions sit on the
                  right (Edit Merchant / Cancel + Save Changes). */}
            <div className="flex items-center justify-between gap-4 p-4 border-b flex-shrink-0">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-gray-900">
                  Merchant Profile
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  View and edit merchant details, branding, locations, and
                  offers.
                </p>
              </div>
              {headerActions}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "profile" && (
                <div className="p-6">
                  <MerchantProfileDisplay
                    merchant={merchantState}
                    status={merchantStatus}
                  />
                </div>
              )}

              {activeTab === "offers" && (
                <OffersContent
                  merchant={merchantState}
                  expiredCount={expiredOffers.length}
                />
              )}

              {activeTab === "edit" && (
                <MerchantForm
                  formId={EDIT_FORM_ID}
                  initialMerchant={merchantState}
                  onSubmit={handleEditSubmit}
                  onValidityChange={setIsFormValid}
                  status={merchantStatus}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offers Timeline content
// ---------------------------------------------------------------------------

// Inline status dot color (used in the count-strip above the Gantt).
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

function OffersContent({
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
      {/* Summary line — merchant-specific status counts */}
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

      {/* Gantt — kibo-ui composable. Sidebar lists offers, timeline renders
          duration bars colored by status, today marker is built-in.
          The wrapper handles status→color mapping, the click hand-off to
          the offer carousel, and the read-only configuration. */}
      <MerchantOffersGantt merchant={merchant} />
    </div>
  );
}
