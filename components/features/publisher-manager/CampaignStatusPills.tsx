"use client";

/**
 * @file Publisher Manager (DES-876) — campaign status quick-filter pills
 * @description All / Live / Scheduled / Past count-pills that toggle status tags
 * on the shared filter bar. Counts are computed against the *base* list (offer
 * type + search, no status) so they stay stable while toggling status. Lives in
 * the unified toolbar row alongside the tabs and the filter bar.
 */

import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { parseFilters, statusTag, type FilterTag } from "./filterLogic";
import type { Campaign, CampaignStatus } from "./types";

const STATUS_PILLS: CampaignStatus[] = ["Live", "Scheduled", "Past"];

const pillClass = (active: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
    active
      ? "bg-primary text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  );

// gray-600 on gray-100 is 6.9:1; the previous gray-400 was 2.3:1 and failed AA.
const countClass = (active: boolean) =>
  cn("text-xs", active ? "text-white/90" : "text-gray-600");

interface CampaignStatusPillsProps {
  /** Base list: offer-type + search applied, status NOT applied. */
  campaigns: Campaign[];
  selectedFilters: FilterTag[];
  onFiltersChange: (filters: FilterTag[]) => void;
}

export function CampaignStatusPills({
  campaigns,
  selectedFilters,
  onFiltersChange,
}: CampaignStatusPillsProps) {
  const { statuses } = useMemo(
    () => parseFilters(selectedFilters),
    [selectedFilters]
  );
  const noStatusSelected = statuses.size === 0;

  function toggleStatus(status: CampaignStatus) {
    const tag = statusTag(status);
    const exists = selectedFilters.some((f) => f.value === tag.value);
    onFiltersChange(
      exists
        ? selectedFilters.filter((f) => f.value !== tag.value)
        : [...selectedFilters, tag]
    );
  }

  function clearStatuses() {
    onFiltersChange(selectedFilters.filter((f) => f.category !== "status"));
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={noStatusSelected}
        onClick={clearStatuses}
        className={pillClass(noStatusSelected)}
      >
        All
        <span className={countClass(noStatusSelected)}>{campaigns.length}</span>
      </button>

      {STATUS_PILLS.map((status) => {
        const isActive = statuses.has(status);
        const count = campaigns.filter((c) => c.status === status).length;
        return (
          <button
            key={status}
            type="button"
            aria-pressed={isActive}
            onClick={() => toggleStatus(status)}
            className={pillClass(isActive)}
          >
            {status}
            <span className={countClass(isActive)}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CampaignStatusPills;
