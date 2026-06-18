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
    // The Kigo Tailwind config (tailwind.config.mjs) overrides `red` with a
    // single value, stripping the default red.50–red.900 scale. We use the
    // Kigo brand red tokens (`red-light-50`, `red-dark-10`) instead of the
    // shadcn `destructive` token — `destructive` is hsl(0 84.2% 60.2%) ≈
    // #ef4444 which only carries 3.76:1 contrast on white (fails WCAG AA),
    // while `red-dark-10` (#AB0C1A) lands at 7.5:1 (AAA).
    className: "bg-red-light-50 text-red-dark-10 border-red",
    label: "Expired",
  },
} as const;

type OfferStatusKey = keyof typeof OFFER_STATUS_PILL;

function OfferStatusPill({
  status,
  count,
  onClick,
  isActiveFilter,
}: {
  status: OfferStatusKey;
  count: number;
  /** When provided, the pill renders as a button that toggles the filter for `status`. */
  onClick?: (status: OfferStatusKey) => void;
  /** Show the pill in its "filter applied" treatment (ring outline). */
  isActiveFilter?: boolean;
}) {
  const { icon: Icon, className, label } = OFFER_STATUS_PILL[status];
  const badge = (
    <Badge
      useClassName
      size="sm"
      rounded="md"
      icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      className={`${className} font-medium ${
        isActiveFilter ? "ring-2 ring-current ring-offset-1" : ""
      }`}
    >
      {count} {label}
    </Badge>
  );

  if (!onClick) return badge;

  return (
    <button
      type="button"
      onClick={(e) => {
        // Row has an onRowClick that navigates to detail — keep the
        // pill click local to the filter toggle.
        e.stopPropagation();
        onClick(status);
      }}
      aria-pressed={isActiveFilter ? true : false}
      aria-label={`${isActiveFilter ? "Remove" : "Add"} "${label}" filter`}
      className="rounded-md cursor-pointer transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1"
    >
      {badge}
    </button>
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
              {actions.map((action, index) => {
                const Icon = action.icon;
                // Separator before the first destructive item — matches the
                // kigo-admin-tools DropdownMenuSeparator convention that
                // visually segregates the dangerous action from neutral ones.
                const prevDestructive = actions[index - 1]?.destructive;
                const showSeparator = action.destructive && !prevDestructive;
                return (
                  <React.Fragment key={action.label}>
                    {showSeparator && (
                      <div
                        className="my-1 h-px bg-gray-100"
                        aria-hidden="true"
                      />
                    )}
                    <button
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center ${
                        action.destructive
                          ? // Kigo's Tailwind config replaces the default
                            // `red` scale with a single token, so the
                            // `text-red-600 / hover:bg-red-50` convention used
                            // elsewhere silently produces no CSS. We also
                            // can't lean on `text-destructive` — it's
                            // hsl(0 84.2% 60.2%) ≈ #ef4444, only 3.76:1 on
                            // white (fails WCAG AA). `red-dark-10` (#AB0C1A)
                            // gives 7.5:1 contrast (AAA) and is a Kigo brand
                            // token.
                            "text-red-dark-10 hover:bg-red-light-50 hover:text-red-dark-20 focus-visible:bg-red-light-50"
                          : "text-gray-700 font-normal hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        action.onClick();
                        setIsOpen(false);
                      }}
                    >
                      <Icon
                        className={`mr-2 h-4 w-4 ${action.destructive ? "text-red-dark-10" : ""}`}
                        aria-hidden="true"
                      />
                      {action.label}
                    </button>
                  </React.Fragment>
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
  /** Click on an Offer-status pill in the cell toggles this filter. */
  onOfferStatusToggle?: (status: OfferStatusKey) => void;
  /** Set of active offer-status filters — controls the pill's ring outline. */
  activeOfferStatuses?: Set<OfferStatusKey>;
}

export function getMerchantListColumns({
  onView,
  onEdit,
  onDelete,
  onOfferStatusToggle,
  activeOfferStatuses,
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
          // max-w caps the flex container so `flex-wrap` actually triggers
          // when several chips would otherwise lay out on one long row. The
          // underlying TanStack table is `table-layout: auto` and doesn't
          // enforce the `size: 200` field — without the cap, the column
          // grows to fit and chips never wrap.
          <div className="flex flex-wrap gap-1 max-w-[200px]">
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
          <div className="flex flex-wrap gap-1 max-w-[220px]">
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
          <div className="flex flex-wrap items-center gap-1 max-w-[280px]">
            <OfferStatusPill
              status="active"
              count={activeCount}
              onClick={onOfferStatusToggle}
              isActiveFilter={activeOfferStatuses?.has("active")}
            />
            {unpublishedCount > 0 && (
              <OfferStatusPill
                status="unpublished"
                count={unpublishedCount}
                onClick={onOfferStatusToggle}
                isActiveFilter={activeOfferStatuses?.has("unpublished")}
              />
            )}
            {expiredCount > 0 && (
              <OfferStatusPill
                status="expired"
                count={expiredCount}
                onClick={onOfferStatusToggle}
                isActiveFilter={activeOfferStatuses?.has("expired")}
              />
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
