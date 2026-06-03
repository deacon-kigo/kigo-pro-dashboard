"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
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
      id: "status",
      // Sort: published first, then unpublished, then closed.
      accessorFn: (row) => {
        switch (row.status) {
          case "published":
            return 0;
          case "unpublished":
            return 1;
          case "closed":
            return 2;
          default:
            return 3;
        }
      },
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex w-full items-center justify-start text-left font-medium hover:bg-transparent"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </button>
      ),
      size: 140,
      // Read-only badge — activation lives on the merchant detail page's
      // Actions menu, per Slack thread design decision.
      cell: ({ row }) => {
        const status = row.original.status ?? "published";
        const variant: "success" | "warning" | "error" =
          status === "published"
            ? "success"
            : status === "unpublished"
              ? "warning"
              : "error";
        const label =
          status === "published"
            ? "Active"
            : status === "unpublished"
              ? "Unpublished"
              : "Closed";
        return (
          <Badge variant={variant} rounded="md" className="font-medium">
            {label}
          </Badge>
        );
      },
    },
    {
      id: "offers",
      accessorFn: (row) =>
        row.offers.filter((o) => o.status === "published").length,
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
        const activeCount = offers.filter(
          (o) => o.status === "published"
        ).length;
        const expiredCount = offers.filter(
          (o) => o.status === "expired"
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
