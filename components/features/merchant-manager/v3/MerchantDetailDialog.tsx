"use client";

import React, { useMemo, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { MerchantLogo } from "./MerchantLogo";
import type {
  Merchant,
  MerchantStatus,
  Offer,
  OfferStatus,
  SubGroup,
} from "./types";

interface MerchantDetailDialogProps {
  merchant: Merchant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Internal roles see Rev Share and Performance data; external roles see a
   * restriction notice. Defaults to true — wire to a real role selector when
   * the surrounding screen has one (mirrors prototype #role-select).
   */
  isInternal?: boolean;
  onEditProfile?: (merchant: Merchant) => void;
  onOfferClick?: (offer: Offer) => void;
}

const statusBadgeVariant = (status: MerchantStatus | undefined) => {
  switch (status) {
    case "Active":
      return "success" as const;
    case "Attention":
      return "warning" as const;
    case "Review":
      return "error" as const;
    default:
      return "neutral" as const;
  }
};

const offerStatusVariant = (status: OfferStatus) => {
  switch (status) {
    case "Active":
      return "success" as const;
    case "Planned":
      return "info" as const;
    case "Expired":
      return "error" as const;
    case "Review":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
};

const campaignStatusVariant = (status: string) => {
  if (status === "Active" || status === "Live") return "success" as const;
  if (status === "Review") return "warning" as const;
  if (status === "Draft" || status === "Planned") return "info" as const;
  return "neutral" as const;
};

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function MerchantDetailDialog({
  merchant,
  open,
  onOpenChange,
  isInternal = true,
  onEditProfile,
  onOfferClick,
}: MerchantDetailDialogProps) {
  // Reset to Profile tab whenever a new merchant opens.
  const [tab, setTab] = useState("profile");
  React.useEffect(() => {
    if (open) setTab("profile");
  }, [open, merchant?.key]);

  const publisherChannels = useMemo(() => {
    if (!merchant) return [];
    return Array.from(new Set(merchant.offers.map((o) => o.channel)));
  }, [merchant]);

  const expiredOffers = useMemo(
    () =>
      merchant ? merchant.offers.filter((o) => o.status === "Expired") : [],
    [merchant]
  );

  const perfTotals = useMemo(() => {
    if (!merchant?.perf) return null;
    const sum = (key: "clicks" | "saves" | "redemptions") =>
      merchant.perf!.reduce((acc, p) => acc + p[key], 0);
    const revenue = merchant.perf.reduce((acc, p) => {
      const n = parseInt(p.revenue.replace(/[^0-9]/g, ""), 10);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
    return {
      clicks: sum("clicks"),
      saves: sum("saves"),
      redemptions: sum("redemptions"),
      revenue,
    };
  }, [merchant]);

  if (!merchant) return null;

  const showSubGroups = Boolean(
    merchant.isParent && merchant.subGroups?.length
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white border border-gray-200 shadow-lg p-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-gray-200 space-y-0">
          <div className="flex items-center gap-3">
            <MerchantLogo merchant={merchant} size={44} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {merchant.name}
                </DialogTitle>
                <Badge variant="neutral" rounded="md" className="font-mono">
                  {merchant.id}
                </Badge>
                {merchant.status && (
                  <Badge
                    variant={statusBadgeVariant(merchant.status)}
                    className="font-medium"
                  >
                    {merchant.status}
                  </Badge>
                )}
                {showSubGroups && (
                  <Badge variant="info" className="font-medium">
                    Parent · {merchant.subGroups!.length} sub-group
                    {merchant.subGroups!.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {merchant.category} · {merchant.source}
                {merchant.website ? ` · ${merchant.website}` : ""}
                {merchant.supportedOfferTypes?.length ? (
                  <>
                    {" · "}
                    <span className="text-blue-700">
                      {merchant.supportedOfferTypes.length} offer type
                      {merchant.supportedOfferTypes.length !== 1 ? "s" : ""}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="px-6 border-b border-gray-200">
            <TabsList className="h-auto bg-transparent p-0 gap-4">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Profile
              </TabsTrigger>
              {showSubGroups && (
                <TabsTrigger
                  value="subgroups"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Sub-Groups
                </TabsTrigger>
              )}
              <TabsTrigger
                value="offers"
                className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Offers &amp; Timeline
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Campaigns
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ===== PROFILE ===== */}
            <TabsContent value="profile" className="mt-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 text-sm font-semibold text-gray-700">
                    Merchant Details
                  </div>
                  <div className="space-y-0">
                    <FieldRow label="Merchant Name" value={merchant.name} />
                    <FieldRow
                      label="Merchant ID"
                      value={
                        <Badge
                          variant="neutral"
                          rounded="md"
                          className="font-mono"
                        >
                          {merchant.id}
                        </Badge>
                      }
                    />
                    <FieldRow label="Category" value={merchant.category} />
                    {merchant.status && (
                      <FieldRow
                        label="Status"
                        value={
                          <Badge
                            variant={statusBadgeVariant(merchant.status)}
                            className="font-medium"
                          >
                            {merchant.status}
                          </Badge>
                        }
                      />
                    )}
                    <FieldRow label="Source" value={merchant.source} />
                    {merchant.website && (
                      <FieldRow
                        label="Website"
                        value={
                          <a
                            href={`https://${merchant.website}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-primary hover:underline"
                          >
                            {merchant.website}
                          </a>
                        }
                      />
                    )}
                    <FieldRow
                      label="Commission Offers"
                      value={
                        merchant.commissionOffers ? (
                          <span className="font-semibold text-green-600">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )
                      }
                    />
                  </div>

                  {merchant.supportedOfferTypes?.length ? (
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">
                        Supported Offer Types
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {merchant.supportedOfferTypes.map((t) => (
                          <Badge
                            key={t}
                            variant="info"
                            rounded="md"
                            className="font-medium"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {merchant.merchantDetail ? (
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">
                        Merchant Detail
                      </div>
                      <p className="rounded-md border border-gray-100 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
                        {merchant.merchantDetail}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div>
                  <div className="mb-3 text-sm font-semibold text-gray-700">
                    Contact &amp; Billing
                  </div>
                  <div className="space-y-0">
                    {merchant.contact && (
                      <FieldRow
                        label="Account Contact"
                        value={merchant.contact}
                      />
                    )}
                    {isInternal && merchant.revShare && (
                      <FieldRow
                        label="Rev Share %"
                        value={
                          <span className="font-bold text-gray-900">
                            {merchant.revShare}
                          </span>
                        }
                      />
                    )}
                    {!isInternal && (
                      <div className="mt-2 rounded-md bg-yellow-100 p-3 text-xs text-yellow-800">
                        Revenue and billing data is restricted to internal Kigo
                        team members.
                      </div>
                    )}
                  </div>

                  {publisherChannels.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">
                        Publisher Channels
                      </div>
                      <div className="flex flex-wrap gap-1.5">
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
                    </div>
                  )}
                </div>
              </div>

              {merchant.restrictions && merchant.restrictions.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-red-500"
                      aria-hidden="true"
                    />
                    Competitive Restrictions
                  </div>
                  <p className="mb-2 text-xs text-gray-500">
                    This merchant should not appear alongside the following
                    merchants in bundles or carousels.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {merchant.restrictions.map((r) => (
                      <span
                        key={r.id}
                        className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                      >
                        {r.name}
                        <span className="font-mono text-[10px] text-red-500">
                          {r.id}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ===== SUB-GROUPS ===== */}
            {showSubGroups && (
              <TabsContent value="subgroups" className="mt-0">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {merchant.subGroups!.length} Sub-Group
                    {merchant.subGroups!.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    Franchise locations and regional divisions under{" "}
                    {merchant.name}
                  </div>
                </div>
                <div className="space-y-2.5">
                  {merchant.subGroups!.map((sg: SubGroup, i: number) => (
                    <div
                      key={sg.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-100 text-sm font-bold text-violet-700">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {sg.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sg.id} · {sg.contact}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-gray-500">
                          {sg.locations
                            ? `${sg.locations} location${sg.locations !== 1 ? "s" : ""} · `
                            : ""}
                          {sg.activeOffers} active offer
                          {sg.activeOffers !== 1 ? "s" : ""}
                        </span>
                        <Badge
                          variant={sg.status === "Active" ? "success" : "error"}
                          className="font-medium"
                        >
                          {sg.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* ===== OFFERS & TIMELINE ===== */}
            <TabsContent value="offers" className="mt-0">
              {expiredOffers.length > 0 && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <span
                    className="inline-block h-2 w-2 rounded-full bg-red-600"
                    aria-hidden="true"
                  />
                  {expiredOffers.length} expired offer
                  {expiredOffers.length > 1 ? "s" : ""} — cannot be set active
                  without operator action.
                </div>
              )}
              {merchant.supportedOfferTypes?.length ? (
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-4 py-2.5">
                  <span className="whitespace-nowrap text-xs font-semibold text-blue-700">
                    Supported Offer Types:
                  </span>
                  {merchant.supportedOfferTypes.map((t) => (
                    <Badge
                      key={t}
                      variant="info"
                      rounded="md"
                      className="font-medium"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Offer Name
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Offer ID
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Offer Type
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Status
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Publisher Channel
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Delivery
                      </th>
                      <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                        Dates
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchant.offers.map((o) => {
                      const expired = o.status === "Expired";
                      const clickable = Boolean(onOfferClick);
                      return (
                        <tr
                          key={o.id}
                          onClick={
                            clickable ? () => onOfferClick!(o) : undefined
                          }
                          className={[
                            "border-b border-gray-100 last:border-0",
                            expired ? "bg-red-50/40" : "",
                            clickable ? "cursor-pointer hover:bg-gray-50" : "",
                          ].join(" ")}
                        >
                          <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                            {o.name}
                            {expired && (
                              <Badge
                                variant="error"
                                rounded="md"
                                className="ml-2 font-semibold"
                              >
                                EXPIRED — ACTION REQUIRED
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="neutral"
                              rounded="md"
                              className="font-mono"
                            >
                              {o.id}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-xs font-medium text-gray-700">
                            {o.offerType || "—"}
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant={offerStatusVariant(o.status)}
                              className="font-medium"
                            >
                              {o.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge
                              variant="neutral"
                              rounded="md"
                              className="font-medium"
                            >
                              {o.channel}
                            </Badge>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-gray-700">
                            {o.type}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-gray-500">
                            {o.start} – {o.end}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {onOfferClick && (
                <div className="mt-3 text-xs text-gray-500">
                  Click any offer to view details
                </div>
              )}
            </TabsContent>

            {/* ===== PERFORMANCE ===== */}
            <TabsContent value="performance" className="mt-0">
              {isInternal && merchant.perf?.length ? (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <PerfStat
                      label="Total Clicks"
                      value={perfTotals!.clicks.toLocaleString()}
                      tone="blue"
                    />
                    <PerfStat
                      label="Total Saves"
                      value={perfTotals!.saves.toLocaleString()}
                      tone="green"
                    />
                    <PerfStat
                      label="Total Redemptions"
                      value={perfTotals!.redemptions.toLocaleString()}
                      tone="violet"
                    />
                    <PerfStat
                      label="Est. Revenue"
                      value={perfTotals!.revenue.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                      })}
                      tone="amber"
                    />
                  </div>

                  <div className="mb-2 text-sm font-semibold text-gray-700">
                    Performance by Offer &amp; Channel
                  </div>
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200 text-left">
                          <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                            Offer
                          </th>
                          <th className="px-3 py-2.5 text-xs font-semibold text-gray-500">
                            Publisher Channel
                          </th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500">
                            Clicks
                          </th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500">
                            Saves
                          </th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500">
                            Redemptions
                          </th>
                          <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500">
                            Est. Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {merchant.perf.map((p, idx) => (
                          <tr
                            key={`${p.offer}-${idx}`}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                              {p.offer}
                            </td>
                            <td className="px-3 py-2.5">
                              <Badge
                                variant="neutral"
                                rounded="md"
                                className="font-medium"
                              >
                                {p.channel}
                              </Badge>
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm text-gray-700">
                              {p.clicks.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm text-gray-700">
                              {p.saves.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm text-gray-700">
                              {p.redemptions.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-right text-sm font-semibold text-green-600">
                              {p.revenue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : !isInternal ? (
                <div className="rounded-md bg-yellow-100 p-6 text-center">
                  <div className="mb-1 text-sm font-semibold text-yellow-800">
                    Revenue data restricted
                  </div>
                  <div className="text-xs text-yellow-700">
                    Performance and revenue data is only visible to internal
                    Kigo team members (Ad Sales, Campaign Ops, Finance).
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No performance data available yet for this merchant.
                </div>
              )}
            </TabsContent>

            {/* ===== CAMPAIGNS ===== */}
            <TabsContent value="campaigns" className="mt-0">
              <div className="space-y-2.5">
                {merchant.campaigns.map((c, idx) => (
                  <div
                    key={`${c.id}-${idx}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-semibold text-primary">
                        {c.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Badge
                          variant="neutral"
                          rounded="md"
                          className="font-mono"
                        >
                          {c.id}
                        </Badge>
                        <Badge
                          variant="neutral"
                          rounded="md"
                          className="font-medium"
                        >
                          {c.publisher}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant={campaignStatusVariant(c.status)}
                      className="font-medium"
                    >
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {merchant.campaigns.length > 0 && (
                <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
                  <strong>Module relationships:</strong> This merchant&apos;s
                  offers appear in{" "}
                  {Array.from(
                    new Set(merchant.campaigns.map((c) => c.publisher))
                  ).join(", ")}{" "}
                  publisher channel
                  {new Set(merchant.campaigns.map((c) => c.publisher)).size !==
                  1
                    ? "s"
                    : ""}
                  , across {merchant.campaigns.length} active campaign
                  {merchant.campaigns.length !== 1 ? "s" : ""}.
                </div>
              )}
              {merchant.supportedOfferTypes?.length ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <span className="whitespace-nowrap text-xs font-semibold text-gray-700">
                    Supported Offer Types:
                  </span>
                  {merchant.supportedOfferTypes.map((t) => (
                    <Badge
                      key={t}
                      variant="info"
                      rounded="md"
                      className="font-medium"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-200 px-6 py-3">
          <div className="text-xs text-gray-500">
            Changes are synced in real time across all Kigo modules
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={<PencilIcon className="h-4 w-4" />}
              onClick={() => onEditProfile?.(merchant)}
            >
              Edit Merchant Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PerfStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "green" | "violet" | "amber";
}) {
  const toneClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
  }[tone];
  return (
    <div className={`rounded-md p-3 text-center ${toneClasses}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] font-medium">{label}</div>
    </div>
  );
}
