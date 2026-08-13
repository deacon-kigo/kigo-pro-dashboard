"use client";

/**
 * @file Publisher Manager (DES-876) — Campaigns tab
 * @description Live & past campaigns for the selected publisher, shown as a
 * faceted DataTable. A PublisherFilterBar accepts offer-type and free-text
 * facets; a row of status count-pills (All / Live / Scheduled / Past) acts as
 * a quick-filter that is additive with the bar. Counts are computed against the
 * base list (offer-type + search only) so they stay stable while toggling status.
 */

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Mail, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";

import { PublisherFilterBar, type FacetOption } from "./PublisherFilterBar";
import { parseFilters, statusTag, type FilterTag } from "./filterLogic";
import type { Campaign, CampaignStatus, CommsChannel } from "./types";

/** lucide icon + label per comms channel. */
const COMMS_META: Record<CommsChannel, { icon: LucideIcon; label: string }> = {
  email: { icon: Mail, label: "Email" },
  sms: { icon: MessageSquare, label: "SMS" },
  push: { icon: Bell, label: "Push" },
};

/** Badge variant per campaign status. */
const STATUS_VARIANT: Record<CampaignStatus, "success" | "info" | "neutral"> = {
  Live: "success",
  Scheduled: "info",
  Past: "neutral",
};

const STATUS_PILLS: CampaignStatus[] = ["Live", "Scheduled", "Past"];

const columns: ColumnDef<Campaign>[] = [
  {
    id: "campaign",
    header: () => <span className="font-medium text-foreground">Campaign</span>,
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-900">{row.original.name}</div>
        <div className="text-xs text-gray-500">{row.original.id}</div>
      </div>
    ),
  },
  {
    id: "distribution",
    header: () => (
      <span className="font-medium text-foreground">Distribution</span>
    ),
    cell: ({ row }) => (
      <Badge variant="neutral">{row.original.distribution}</Badge>
    ),
  },
  {
    id: "comms",
    header: () => <span className="font-medium text-foreground">Comms</span>,
    cell: ({ row }) => (
      <div className="flex gap-1.5">
        {row.original.comms.map((channel) => {
          const { icon: Icon, label } = COMMS_META[channel];
          return (
            <span key={channel} title={label}>
              <Icon className="h-4 w-4 text-gray-500" aria-label={label} />
            </span>
          );
        })}
      </div>
    ),
  },
  {
    id: "dates",
    header: () => <span className="font-medium text-foreground">Dates</span>,
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.startDate} – {row.original.endDate}
      </span>
    ),
  },
  {
    id: "status",
    header: () => <span className="font-medium text-foreground">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={STATUS_VARIANT[status]}>
          {status === "Live" && (
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "ctr",
    header: () => <span className="font-medium text-foreground">CTR</span>,
    cell: ({ row }) => {
      const { ctr } = row.original;
      if (ctr == null) return <span className="text-gray-400">—</span>;
      return <span className="text-gray-900">{(ctr * 100).toFixed(1)}%</span>;
    },
  },
  {
    id: "redemptions",
    header: () => (
      <span className="font-medium text-foreground">Redemptions</span>
    ),
    cell: ({ row }) => {
      const { redemptions } = row.original;
      if (redemptions == null) return <span className="text-gray-400">—</span>;
      return (
        <span className="text-gray-900">{redemptions.toLocaleString()}</span>
      );
    },
  },
];

export function CampaignsTab({
  campaigns,
  offerTypeOptions,
}: {
  campaigns: Campaign[];
  offerTypeOptions: FacetOption[];
}) {
  const [selectedFilters, setSelectedFilters] = useState<FilterTag[]>([]);

  const statusOptions: FacetOption[] = [
    { label: "Live", value: "Live" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Past", value: "Past" },
  ];

  const { offerTypeIds, statuses, searchTerms } = useMemo(
    () => parseFilters(selectedFilters),
    [selectedFilters]
  );

  /**
   * Base list: campaigns filtered by offer-type + search ONLY (not status).
   * Used for computing pill counts so they remain stable while toggling status.
   */
  const baseFiltered = useMemo(() => {
    return campaigns.filter((c) => {
      if (
        offerTypeIds.size > 0 &&
        !c.offerTypeIds.some((id) => offerTypeIds.has(id))
      ) {
        return false;
      }
      if (
        searchTerms.length > 0 &&
        !searchTerms.every(
          (term) =>
            c.name.toLowerCase().includes(term) ||
            c.id.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [campaigns, offerTypeIds, searchTerms]);

  /** Fully filtered list — all facets including status. */
  const filtered = useMemo(() => {
    if (statuses.size === 0) return baseFiltered;
    return baseFiltered.filter((c) => statuses.has(c.status));
  }, [baseFiltered, statuses]);

  /** Toggle a single status tag in selectedFilters. */
  function toggleStatus(status: CampaignStatus) {
    const tag = statusTag(status);
    const exists = selectedFilters.some((f) => f.value === tag.value);
    if (exists) {
      setSelectedFilters(selectedFilters.filter((f) => f.value !== tag.value));
    } else {
      setSelectedFilters([...selectedFilters, tag]);
    }
  }

  /** Clear all status tags from selectedFilters. */
  function clearStatuses() {
    setSelectedFilters(selectedFilters.filter((f) => f.category !== "status"));
  }

  const noStatusSelected = statuses.size === 0;

  return (
    <div>
      {/* A) Toolbar — filter bar + status count-pills, flush under the tab header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border-light px-4 py-3">
        <div className="min-w-[260px] flex-1">
          <PublisherFilterBar
            offerTypeOptions={offerTypeOptions}
            statusOptions={statusOptions}
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
            placeholder="Filter campaigns by offer type, status, or search…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={noStatusSelected}
            onClick={clearStatuses}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              noStatusSelected
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All
            <span
              className={cn(
                "text-xs",
                noStatusSelected ? "text-white/80" : "text-gray-400"
              )}
            >
              {baseFiltered.length}
            </span>
          </button>

          {STATUS_PILLS.map((status) => {
            const isActive = statuses.has(status);
            const count = baseFiltered.filter(
              (c) => c.status === status
            ).length;
            return (
              <button
                key={status}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleStatus(status)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {status}
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "text-white/80" : "text-gray-400"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* B) Table (flush) */}
      <DataTable
        flush
        columns={columns as unknown as ColumnDef<unknown, unknown>[]}
        data={filtered}
        disablePagination
        tableClassName="min-w-[900px]"
      />
    </div>
  );
}

export default CampaignsTab;
