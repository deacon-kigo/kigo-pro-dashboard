"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
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
import type { Merchant } from "./types";

const MAX_BADGES = 3;

// Sort icon — mirrors offerListColumns
const SortIcon = ({ sorted }: { sorted?: "asc" | "desc" | false }) => {
  if (sorted === "asc")
    return <ChevronUpIcon className="ml-2 h-4 w-4 text-primary" />;
  if (sorted === "desc")
    return <ChevronDownIcon className="ml-2 h-4 w-4 text-primary" />;
  return (
    <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground opacity-50" />
  );
};

function BadgeWrap({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="text-gray-400">—</span>;
  }
  const visible = items.slice(0, MAX_BADGES);
  const overflow = items.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((label, idx) => (
        <Badge
          key={`${label}-${idx}`}
          variant="info"
          rounded="md"
          className="font-medium"
        >
          {label}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="neutral" rounded="md" className="font-medium">
          +{overflow}
        </Badge>
      )}
    </div>
  );
}

// MerchantActionDropdown — mirrors OfferActionDropdown structure
const MerchantActionDropdown = memo(function MerchantActionDropdown({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
      const dropdownHeight = 200;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const padding = 16;

      let left = rect.left - 48;
      if (left + dropdownWidth > viewport.width - padding) {
        left = rect.right - dropdownWidth;
      }
      if (left < padding) {
        left = padding;
      }

      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding) {
        top = rect.top - dropdownHeight - 8;
      }
      if (top < padding) {
        top = padding;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  const handleViewClick = useCallback(() => {
    onView();
    setIsOpen(false);
  }, [onView]);

  const handleEditClick = useCallback(() => {
    onEdit();
    setIsOpen(false);
  }, [onEdit]);

  const handleDeleteClick = useCallback(() => {
    onDelete();
    setIsOpen(false);
  }, [onDelete]);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="secondary"
        className="h-8 px-3 py-1.5 font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        View Details
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-48 bg-white rounded-md shadow-lg border z-[9999]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                Actions
              </div>

              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleViewClick}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View Merchant
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleEditClick}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Merchant
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                onClick={handleDeleteClick}
                style={{ color: "#dc2626" }}
              >
                <TrashIcon
                  className="mr-2 h-4 w-4"
                  style={{ color: "#dc2626" }}
                />
                Delete Merchant
              </button>
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
            <div
              className="flex h-10 w-10 items-center justify-center rounded-md text-lg"
              style={{ backgroundColor: m.color }}
              aria-hidden="true"
            >
              <span>{m.emoji}</span>
            </div>
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
          return <span className="text-gray-400">—</span>;
        }
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-900">{activeCount} active</span>
            {expiredCount > 0 && (
              <Badge variant="error" rounded="md" className="font-medium">
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
      header: () => <div className="text-left font-medium">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex">
            <MerchantActionDropdown
              onView={() => onView(row.original)}
              onEdit={() => onEdit(row.original)}
              onDelete={() => onDelete(row.original)}
            />
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
