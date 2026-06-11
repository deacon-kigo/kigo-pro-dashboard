"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { MerchantLogo } from "./MerchantLogo";
import type { Merchant } from "./types";

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

// Offer status pill tokens — mirror kigo-admin-tools
// OFFER_STATUS_ATTRIBUTES (src/app/(protected)/offer-manager/components/
// constants.ts) so the aggregate counts on a merchant row read with the
// same color + icon language as the production offer manager table.
const OFFER_STATUS_PILL = {
  active: {
    icon: GlobeAltIcon,
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    label: "Active",
  },
  unpublished: {
    icon: EyeSlashIcon,
    className: "bg-amber-50 text-amber-800 border-amber-200",
    label: "Unpublished",
  },
  expired: {
    icon: XCircleIcon,
    className: "bg-red-50 text-red-800 border-red-200",
    label: "Expired",
  },
} as const;

function OfferStatusPill({
  status,
  count,
}: {
  status: keyof typeof OFFER_STATUS_PILL;
  count: number;
}) {
  const { icon: Icon, className, label } = OFFER_STATUS_PILL[status];
  return (
    <Badge
      useClassName
      size="sm"
      rounded="md"
      icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      className={`${className} font-medium`}
    >
      {count} {label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown — mirrors OfferActionDropdown in offerListColumns.tsx
// ---------------------------------------------------------------------------
interface ActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
}

const MerchantActionDropdown = memo(function MerchantActionDropdown({
  actions,
}: {
  actions: ActionItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 192;
      const dropdownHeight = actions.length * 40 + 8;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const padding = 16;

      let left = rect.left - 48;
      if (left + dropdownWidth > viewport.width - padding) {
        left = rect.right - dropdownWidth;
      }
      if (left < padding) left = padding;

      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding) {
        top = rect.top - dropdownHeight - 8;
      }
      if (top < padding) top = padding;

      setDropdownPosition({ top, left });
    }
  }, [isOpen, actions.length]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="secondary"
        className="h-8 px-3 py-1.5 font-medium"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        Actions
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            className="fixed w-48 bg-white rounded-md shadow-lg border z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                      action.destructive
                        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <Icon
                      className={`mr-2 h-4 w-4 ${action.destructive ? "text-red-600" : ""}`}
                    />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
});

interface MerchantListColumnsOptions {
  onView: (merchant: Merchant) => void;
  onEdit: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
}

export function getMerchantListColumns({
  onView,
  onEdit,
  onDelete,
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
            <span className="font-semibold text-gray-900">{m.name}</span>
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
      // Sorting disabled per Jose's feedback (2026-06-10): merchants can
      // belong to multiple categories, and lexical sort on a list of
      // labels isn't meaningful to an operator.
      enableSorting: false,
      header: () => (
        <span className="font-medium text-foreground">Categories</span>
      ),
      size: 200,
      cell: ({ row }) => {
        const value = row.original.category ?? "";
        const categories = value
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
        if (categories.length === 0) return <EmptyDash />;
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <Badge
                key={c}
                variant="neutral"
                size="sm"
                rounded="md"
                className="font-medium"
              >
                {c}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "catalogs",
      // Like Categories, this is many-to-many — sorting on a list of names
      // isn't a meaningful operator action.
      enableSorting: false,
      header: () => (
        <span className="font-medium text-foreground">Catalogs</span>
      ),
      size: 220,
      cell: ({ row }) => {
        const catalogs = row.original.catalogs ?? [];
        if (catalogs.length === 0) return <EmptyDash />;
        return (
          <div className="flex flex-wrap gap-1">
            {catalogs.map((c) => (
              <Badge
                key={c}
                useClassName
                size="sm"
                rounded="md"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
              >
                {c}
              </Badge>
            ))}
          </div>
        );
      },
    },
    // Status column removed per Slack addendum (John K, 2026-06-03):
    // "not to include the Merchant Status column. Include that info in
    // the Profile view, with Unpublish capability in the edit form."
    // The status is still visible in the merchant detail page (header
    // badge + Profile Details row).
    {
      id: "offers",
      // Sorting disabled per Jose's feedback (2026-06-10): each row carries
      // several status counts and no single lexical/numeric axis matches
      // what an operator would expect from a sort.
      enableSorting: false,
      header: () => <span className="font-medium text-foreground">Offers</span>,
      size: 280,
      cell: ({ row }) => {
        const offers = row.original.offers;
        if (offers.length === 0) {
          return <EmptyDash />;
        }
        const activeCount = offers.filter(
          (o) => o.status === "published"
        ).length;
        // "Unpublished" = deliberate human-driven off states. Mirrors the
        // merchant-level unpublished concept ("offers hidden from
        // marketplace") at the offer granularity.
        const unpublishedCount = offers.filter(
          (o) => o.status === "paused" || o.status === "archived"
        ).length;
        const expiredCount = offers.filter(
          (o) => o.status === "expired"
        ).length;
        return (
          <div className="flex flex-wrap items-center gap-1">
            <OfferStatusPill status="active" count={activeCount} />
            {unpublishedCount > 0 && (
              <OfferStatusPill status="unpublished" count={unpublishedCount} />
            )}
            {expiredCount > 0 && (
              <OfferStatusPill status="expired" count={expiredCount} />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="font-medium text-foreground">Actions</span>
      ),
      cell: ({ row }) => {
        const m = row.original;
        const actions: ActionItem[] = [
          {
            label: "View Details",
            icon: EyeIcon,
            onClick: () => onView(m),
          },
          {
            label: "Edit Merchant",
            icon: PencilIcon,
            onClick: () => onEdit(m),
          },
          {
            label: "Delete Merchant",
            icon: TrashIcon,
            onClick: () => onDelete(m),
            destructive: true,
          },
        ];
        return (
          <div className="flex">
            <MerchantActionDropdown actions={actions} />
          </div>
        );
      },
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
