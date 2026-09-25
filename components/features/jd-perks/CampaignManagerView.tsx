"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import { useAppSelector } from "@/lib/redux/hooks";
import { PREMADE_CAMPAIGNS } from "./mockData";
import type { PremadeCampaign } from "./types";
import { CampaignCreative } from "./CampaignCreative";
import {
  discountLabel,
  constraintsSummary,
  activationStatus,
  STATUS_LABEL,
  formatDate,
} from "./utils";
import type { ActivationStatus } from "./utils";
import type { Activation } from "./types";

const STATUS_BADGE: Record<
  ActivationStatus,
  "success" | "warning" | "neutral"
> = {
  active: "success",
  queued: "warning",
  ended: "neutral",
  available: "neutral",
};

const STATUS_FOOTER: Record<ActivationStatus, string> = {
  active: "Live for your locations",
  queued: "Scheduled — not running yet",
  ended: "Window closed",
  available: "Ready to activate",
};

const CATEGORIES = [
  "All categories",
  "Parts",
  "Oil & Fluids",
  "Service",
  "Merchandise",
  "Equipment",
];
const BUILDERS = ["All sources", "John Deere"];

function CampaignCard({
  campaign,
  activation,
  onView,
}: {
  campaign: PremadeCampaign;
  activation?: Activation;
  onView: (c: PremadeCampaign) => void;
}) {
  const status = activationStatus(activation);
  const isActivated = status !== "available";

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <CampaignCreative campaign={campaign} width={600} className="w-full" />
        <div className="absolute right-3 top-3">
          <Badge variant={STATUS_BADGE[status]} className="gap-1 shadow-sm">
            {status === "active" && <CheckCircleIcon className="h-3.5 w-3.5" />}
            {status === "queued" && <ClockIcon className="h-3.5 w-3.5" />}
            {STATUS_LABEL[status]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <Badge
            variant={campaign.builtBy === "John Deere" ? "success" : "info"}
            size="sm"
          >
            Built by {campaign.builtBy}
          </Badge>
          <Badge variant="outline" size="sm">
            {campaign.category}
          </Badge>
        </div>

        <h3 className="text-base font-semibold text-text-dark">
          {campaign.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-primary">
          {discountLabel(campaign)}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">
          {campaign.description}
        </p>

        <div className="mt-3 text-xs text-text-muted">
          {constraintsSummary(campaign)}
        </div>

        {isActivated && activation && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-text-dark">
            <CalendarDaysIcon className="h-4 w-4 text-text-muted" />
            {formatDate(activation.startDate)} –{" "}
            {formatDate(activation.endDate)}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3">
          <span className="text-xs text-text-muted">
            {STATUS_FOOTER[status]}
          </span>
          <Button variant="primary" size="sm" onClick={() => onView(campaign)}>
            {isActivated ? "View campaign" : "View & activate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignManagerView() {
  const router = useRouter();
  const activations = useAppSelector((s) => s.jdPerks.activations);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [builtBy, setBuiltBy] = useState("All sources");

  // Campaigns the dealer has already committed to, newest activation first.
  // Some may be "queued" — activated, but the window hasn't opened yet, so
  // they have no performance data to show.
  const activated = useMemo(() => {
    return PREMADE_CAMPAIGNS.filter((c) => activations[c.id]).sort(
      (a, b) =>
        Date.parse(activations[b.id].activatedAt) -
        Date.parse(activations[a.id].activatedAt)
    );
  }, [activations]);

  const statusCounts = useMemo(() => {
    return activated.reduce(
      (acc, c) => {
        const s = activationStatus(activations[c.id]);
        acc[s] = (acc[s] ?? 0) + 1;
        return acc;
      },
      {} as Record<ActivationStatus, number>
    );
  }, [activated, activations]);

  // The browse grid shows only what hasn't been activated yet — anything
  // already committed lives in the section above it.
  const filtered = useMemo(() => {
    return PREMADE_CAMPAIGNS.filter((c) => {
      if (activations[c.id]) return false;
      if (category !== "All categories" && c.category !== category)
        return false;
      if (builtBy !== "All sources" && c.builtBy !== builtBy) return false;
      if (search.trim()) {
        const hay = `${c.name} ${c.tagline} ${c.description}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, category, builtBy, activations]);

  const activeCount = Object.keys(activations).length;

  const handleView = (c: PremadeCampaign) => {
    router.push(`/campaign-manager/john-deere/${c.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaign Manager"
        description={`${PREMADE_CAMPAIGNS.length} ready-to-run campaigns · ${activeCount} activated for Everglades Equipment`}
        emoji="🚜"
        variant="aurora"
      />

      {/* Your campaigns — already activated */}
      {activated.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text-dark">
              Your campaigns
            </h2>
            <span className="text-sm text-text-muted">
              {[
                statusCounts.active && `${statusCounts.active} active`,
                statusCounts.queued && `${statusCounts.queued} queued`,
                statusCounts.ended && `${statusCounts.ended} ended`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {activated.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                activation={activations[c.id]}
                onView={handleView}
              />
            ))}
          </div>
        </section>
      )}

      <h2 className="text-lg font-semibold text-text-dark">Browse campaigns</h2>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue>{category}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={builtBy} onValueChange={setBuiltBy}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue>{builtBy}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BUILDERS.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-light bg-white p-12 text-center text-text-muted">
          No campaigns match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} onView={handleView} />
          ))}
        </div>
      )}
    </div>
  );
}
