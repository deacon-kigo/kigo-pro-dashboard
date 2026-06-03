"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/atoms/Badge";
import {
  IdentificationIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/lib/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MerchantLogo } from "./MerchantLogo";
import MerchantForm, { type MerchantFormData } from "./MerchantForm";
import { MerchantOffersGantt } from "./MerchantOffersGantt";
import {
  OFFER_TYPE_CONFIG,
  type OfferTypeKey,
} from "@/lib/constants/offer-templates";
import type { Merchant, MerchantStatus, Offer, OfferStatus } from "./types";

// Maps a merchant.supportedOfferTypes label (free-text string) to its
// OFFER_TYPE_CONFIG key so we can render the same illustration card the offer
// creation flow uses.
const OFFER_TYPE_LABEL_TO_KEY: Record<string, OfferTypeKey> = {
  "Buy One Get One": "bogo",
  BOGO: "bogo",
  "Cash Back": "cashback",
  ClickThru: "clickthrough",
  Clickthrough: "clickthrough",
  "Digital Gift Card": "digital_gift_card",
  "Free Product": "free_with_purchase",
  "Free With Purchase": "free_with_purchase",
  Merchandise: "merchandise",
  "Money Off": "dollar_off",
  "Dollar Off": "dollar_off",
  "Percentage Off": "percent_off",
  "Percent Off": "percent_off",
  "Physical Gift Card": "physical_gift_card",
  "Special Price": "fixed_price",
  "Fixed Price": "fixed_price",
  "Spend and Get": "cpg_spend_and_get",
  "Spend & Get": "cpg_spend_and_get",
};

const EDIT_FORM_ID = "merchant-edit-form";

type DetailTab = "profile" | "offers" | "edit";

const TABS: {
  id: DetailTab;
  label: string;
  icon: typeof IdentificationIcon;
}[] = [
  { id: "profile", label: "Profile", icon: IdentificationIcon },
  { id: "offers", label: "Offers Timeline", icon: ListBulletIcon },
  { id: "edit", label: "Edit", icon: PencilSquareIcon },
];

// Display labels for the production merchant lifecycle states.
const MERCHANT_STATUS_LABEL: Record<MerchantStatus, string> = {
  published: "Active",
  unpublished: "Unpublished",
  closed: "Closed",
};

const statusBadgeVariant = (status: MerchantStatus | undefined) => {
  switch (status) {
    case "published":
      return "success" as const;
    case "unpublished":
      return "warning" as const;
    case "closed":
      return "error" as const;
    default:
      return "neutral" as const;
  }
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
  // Per Slack thread (Diane/Koua): merchants default to "published" on
  // create. Local state here is just for the prototype — production reads
  // from the merchant record and writes via API on change.
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
    () => merchant.offers.filter((o) => o.status === "expired"),
    [merchant]
  );

  const handleBackToList = () => router.push("/merchants");

  const handleEditSubmit = (data: MerchantFormData) => {
    toast({
      title: "Merchant updated",
      description: `${data.dbaName} (${merchant.id}) was updated.`,
    });
    setActiveTab("profile");
  };

  const handleStatusChange = (next: string) => {
    if (next === merchantStatus) return;
    const status = next as MerchantStatus;
    setMerchantStatus(status);
    toast({
      title: `Merchant set to ${MERCHANT_STATUS_LABEL[status]}`,
      description:
        status === "unpublished"
          ? "Offers from this merchant will no longer appear in marketplace."
          : status === "closed"
            ? "Merchant marked as closed. Re-enable by creating a new record."
            : `${merchant.name} is now visible in marketplace.`,
    });
  };

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
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBackToList}>
          Back to Merchants
        </Button>
        {/* Actions menu — neutral trigger so it can host other merchant-level
            actions (duplicate, audit, etc.) alongside status changes without
            re-skinning. The current status is already visible in the
            identity Badge above; this button is purely "open the menu". */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              Actions
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={merchantStatus}
              onValueChange={handleStatusChange}
            >
              <DropdownMenuRadioItem value="published">
                Active — visible in marketplace
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="unpublished">
                Unpublish — hide offers from marketplace
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="closed">
                Close — out of business
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
            {/* Header bar — merchant identity + contextual actions */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <MerchantLogo merchant={merchant} size={36} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{merchant.name}</h3>
                    <Badge variant="neutral" rounded="md" className="font-mono">
                      {merchant.id}
                    </Badge>
                    <Badge
                      variant={statusBadgeVariant(merchantStatus)}
                      className="font-medium"
                    >
                      {MERCHANT_STATUS_LABEL[merchantStatus]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {merchant.category} · {merchant.source}
                  </p>
                </div>
              </div>
              {headerActions}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "profile" && (
                <ProfileContent merchant={merchant} status={merchantStatus} />
              )}

              {activeTab === "offers" && (
                <OffersContent
                  merchant={merchant}
                  expiredCount={expiredOffers.length}
                />
              )}

              {activeTab === "edit" && (
                <MerchantForm
                  formId={EDIT_FORM_ID}
                  initialMerchant={merchant}
                  onSubmit={handleEditSubmit}
                  onValidityChange={setIsFormValid}
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
// Profile content
// ---------------------------------------------------------------------------
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
      {children}
    </h4>
  );
}

function DefinitionRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="flex-shrink-0 text-sm font-medium text-gray-600">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-gray-900">
        {value}
      </dd>
    </div>
  );
}

function OfferTypeCard({
  label,
  config,
}: {
  label: string;
  config: (typeof OFFER_TYPE_CONFIG)[OfferTypeKey] | undefined;
}) {
  // Falls back to a generic Tag illustration if the merchant's label doesn't
  // map to a known OFFER_TYPE_CONFIG key.
  if (!config) {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-md border border-gray-200 bg-white p-2 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-50">
          <TagIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </div>
        <div className="text-xs font-semibold text-gray-900">{label}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md border border-gray-200 bg-white p-2 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-12 w-12">
        <Image
          src={config.illustration}
          alt={config.label}
          fill
          className="object-contain"
        />
      </div>
      <div className="text-xs font-semibold text-gray-900">{config.label}</div>
    </div>
  );
}

function ProfileContent({
  merchant,
  status,
}: {
  merchant: Merchant;
  status: MerchantStatus;
}) {
  const publisherChannels = useMemo(
    () => Array.from(new Set(merchant.offers.map((o) => o.channel))),
    [merchant]
  );

  const activeOfferCount = useMemo(
    () => merchant.offers.filter((o) => o.status === "published").length,
    [merchant]
  );

  return (
    <div className="p-6 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-3">
      {/* Main column — narrative + capabilities */}
      <div className="space-y-6 lg:col-span-2">
        {/* About — leads with the merchant story */}
        <section>
          <SectionLabel>About</SectionLabel>
          {merchant.merchantDetail ? (
            <p className="text-base leading-relaxed text-gray-700">
              {merchant.merchantDetail}
            </p>
          ) : (
            <p className="text-sm font-medium italic text-gray-500">
              No description on file yet.
            </p>
          )}
        </section>

        {/* Capabilities — supported offer types via illustration cards */}
        {merchant.supportedOfferTypes?.length ? (
          <section>
            <SectionLabel>Capabilities</SectionLabel>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {merchant.supportedOfferTypes.map((label) => {
                const key = OFFER_TYPE_LABEL_TO_KEY[label];
                const config = key ? OFFER_TYPE_CONFIG[key] : undefined;
                return (
                  <OfferTypeCard key={label} label={label} config={config} />
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      {/* Sidebar — structured attributes + channels */}
      <aside className="space-y-6 lg:col-span-1">
        <section>
          <SectionLabel>Details</SectionLabel>
          <dl className="divide-y divide-gray-100">
            <DefinitionRow label="Category" value={merchant.category} />
            <DefinitionRow label="Source" value={merchant.source} />
            <DefinitionRow
              label="Status"
              value={
                <Badge
                  variant={statusBadgeVariant(status)}
                  className="font-medium"
                >
                  {MERCHANT_STATUS_LABEL[status]}
                </Badge>
              }
            />
            <DefinitionRow label="Active Offers" value={activeOfferCount} />
            <DefinitionRow
              label="Website"
              value={
                merchant.website ? (
                  <a
                    href={`https://${merchant.website}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary hover:underline"
                  >
                    {merchant.website}
                  </a>
                ) : (
                  <span className="text-gray-500">—</span>
                )
              }
            />
            <DefinitionRow
              label="Contact"
              value={
                merchant.contact ? (
                  <span>{merchant.contact}</span>
                ) : (
                  <span className="text-gray-500">—</span>
                )
              }
            />
          </dl>
        </section>

        {publisherChannels.length > 0 && (
          <section>
            <SectionLabel>Distribution Channels</SectionLabel>
            <div className="flex flex-wrap gap-1">
              {publisherChannels.map((c) => (
                <Badge
                  key={c}
                  variant="neutral"
                  rounded="md"
                  className="font-medium"
                >
                  {c}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </aside>
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
