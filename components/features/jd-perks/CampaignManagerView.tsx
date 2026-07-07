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
} from "@heroicons/react/24/solid";
import { useAppSelector } from "@/lib/redux/hooks";
import { PREMADE_CAMPAIGNS } from "./mockData";
import type { PremadeCampaign } from "./types";
import { CampaignCreative } from "./CampaignCreative";
import { discountLabel, constraintsSummary } from "./utils";

const CATEGORIES = [
  "All categories",
  "Parts",
  "Oil & Fluids",
  "Service",
  "Merchandise",
  "Equipment",
];
const BUILDERS = ["All sources", "John Deere", "Kigo"];

function CampaignCard({
  campaign,
  isActive,
  onView,
}: {
  campaign: PremadeCampaign;
  isActive: boolean;
  onView: (c: PremadeCampaign) => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border-light bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <CampaignCreative campaign={campaign} width={600} className="w-full" />
        <div className="absolute right-3 top-3">
          {isActive ? (
            <Badge variant="success" className="gap-1 shadow-sm">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              Active
            </Badge>
          ) : (
            <Badge variant="neutral" className="shadow-sm">
              Available
            </Badge>
          )}
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

        <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3">
          <span className="text-xs text-text-muted">
            {isActive ? "Live for your locations" : "Ready to activate"}
          </span>
          <Button variant="primary" size="sm" onClick={() => onView(campaign)}>
            {isActive ? "View campaign" : "View & activate"}
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

  const filtered = useMemo(() => {
    return PREMADE_CAMPAIGNS.filter((c) => {
      if (category !== "All categories" && c.category !== category)
        return false;
      if (builtBy !== "All sources" && c.builtBy !== builtBy) return false;
      if (search.trim()) {
        const hay = `${c.name} ${c.tagline} ${c.description}`.toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [search, category, builtBy]);

  const activeCount = Object.keys(activations).length;

  const handleView = (c: PremadeCampaign) => {
    router.push(`/campaign-manager/john-deere/${c.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaign Manager"
        description={`${PREMADE_CAMPAIGNS.length} ready-to-run campaigns · ${activeCount} active for Everglades Equipment`}
        emoji="🚜"
        variant="aurora"
      />

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
            <CampaignCard
              key={c.id}
              campaign={c}
              isActive={Boolean(activations[c.id])}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
