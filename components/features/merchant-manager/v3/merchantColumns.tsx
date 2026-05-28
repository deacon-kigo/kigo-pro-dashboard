"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { MerchantLogo } from "./MerchantLogo";
import type { Merchant } from "./types";

const MAX_BADGES = 3;
// Em-dash empty-state marker — spec §4 calls for "—" not a "None" badge.
const EM_DASH = "—";

// Sort icon — mirrors v2 campaigns / TMT pattern
const SortIcon = ({ sorted }: { sorted?: "asc" | "desc" | false }) => {
  if (sorted === "asc")
    return <ChevronUpIcon className="ml-1.5 h-3.5 w-3.5 text-primary" />;
  if (sorted === "desc")
    return <ChevronDownIcon className="ml-1.5 h-3.5 w-3.5 text-primary" />;
  return (
    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-40" />
  );
};

function EmptyDash() {
  return <span className="text-sm text-gray-400">{EM_DASH}</span>;
}

/**
 * Spec §4: wrap of info-soft Badges, max 3 visible + "+N" overflow chip,
 * em-dash when empty.
 */
function BadgeWrap({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <EmptyDash />;
  }
  const visible = items.slice(0, MAX_BADGES);
  const overflow = items.length - visible.length;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((label, idx) => (
        <Badge
          key={`${label}-${idx}`}
          variant="info"
          size="sm"
          rounded="md"
          className="font-medium"
        >
          {label}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="neutral" size="sm" rounded="md" className="font-medium">
          +{overflow}
        </Badge>
      )}
    </div>
  );
}

interface MerchantListColumnsOptions {
  onView: (merchant: Merchant) => void;
  onEdit: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
}

export function getMerchantListColumns({
  onView,
}: MerchantListColumnsOptions): ColumnDef<Merchant>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Merchant
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-3">
            <MerchantLogo merchant={m} size={40} />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{m.name}</span>
              <span className="text-xs text-gray-500">
                {m.source} · {m.category}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Merchant ID
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      size: 140,
      cell: ({ row }) => (
        <Badge variant="neutral" rounded="md" className="font-mono">
          {row.original.id}
        </Badge>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Category
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      size: 160,
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.category}</span>
      ),
    },
    {
      id: "offers",
      accessorFn: (row) =>
        row.offers.filter((o) => o.status === "Active").length,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Offers
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      size: 180,
      cell: ({ row }) => {
        const offers = row.original.offers;
        const activeCount = offers.filter((o) => o.status === "Active").length;
        const expiredCount = offers.filter(
          (o) => o.status === "Expired"
        ).length;
        if (offers.length === 0) {
          return <EmptyDash />;
        }
        return (
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant={activeCount > 0 ? "success" : "neutral"}
              size="sm"
              rounded="md"
              className="font-medium"
            >
              {activeCount} active
            </Badge>
            {expiredCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                rounded="md"
                className="font-medium"
              >
                {expiredCount} expired
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "campaigns",
      accessorFn: (row) => row.campaigns.length,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Campaigns
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      size: 240,
      cell: ({ row }) => {
        const names = row.original.campaigns.map((c) => c.name);
        return <BadgeWrap items={names} />;
      },
    },
    {
      id: "publishers",
      accessorFn: (row) => {
        const set = new Set<string>();
        for (const o of row.offers) {
          if (o.publisher) set.add(o.publisher);
        }
        return set.size;
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Publishers
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      size: 240,
      cell: ({ row }) => {
        const set = new Set<string>();
        for (const o of row.original.offers) {
          if (o.publisher) set.add(o.publisher);
        }
        return <BadgeWrap items={Array.from(set)} />;
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="font-medium text-foreground">Actions</span>
      ),
      cell: ({ row }) => (
        <div className="flex">
          <Button
            variant="secondary"
            size="sm"
            className="font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            View Details
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
}

// Backwards-compatible export — built with no-op handlers in case any other
// module still imports the old constant. Prefer `getMerchantListColumns`.
export const merchantColumns: ColumnDef<Merchant>[] = getMerchantListColumns({
  onView: () => undefined,
  onEdit: () => undefined,
  onDelete: () => undefined,
});
