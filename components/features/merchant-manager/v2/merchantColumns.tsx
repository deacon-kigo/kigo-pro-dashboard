"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpDown,
  Globe,
  AlertTriangle,
  SearchCheck,
  type LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { V2Merchant } from "./types";

// ---------------------------------------------------------------------------
// Sort Icon — matches TMT pattern
// ---------------------------------------------------------------------------
const SortIcon = ({ sorted }: { sorted?: "asc" | "desc" | false }) => {
  if (sorted === "asc")
    return <ChevronUpIcon className="ml-1.5 h-3.5 w-3.5 text-primary" />;
  if (sorted === "desc")
    return <ChevronDownIcon className="ml-1.5 h-3.5 w-3.5 text-primary" />;
  return (
    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-40" />
  );
};

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------
const STATUS_STYLE: Record<
  string,
  { icon: LucideIcon; text: string; bg: string; border: string; label: string }
> = {
  active: {
    icon: Globe,
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Active",
  },
  attention: {
    icon: AlertTriangle,
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Attention",
  },
  review: {
    icon: SearchCheck,
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Review",
  },
};

function MerchantStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.active;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Hover Preview
// ---------------------------------------------------------------------------
function MerchantRowPreview({ merchant }: { merchant: V2Merchant }) {
  return (
    <div className="w-[300px] overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-500 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${merchant.emojiBg} rounded-lg flex items-center justify-center text-xl`}
          >
            {merchant.emoji}
          </div>
          <div>
            <h4 className="font-bold text-base text-white leading-snug">
              {merchant.name}
            </h4>
            <span className="text-sm text-white/60">
              {merchant.source} &middot; {merchant.subcategory}
            </span>
          </div>
        </div>
        <span className="text-xs font-mono text-white/50 mt-2 block">
          {merchant.id}
        </span>
      </div>
      <div className="px-5 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Category</span>
          <span className="text-xs font-semibold text-gray-800">
            {merchant.category}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Active Offers</span>
          <span className="text-xs font-semibold text-gray-800">
            {merchant.activeOffers}
          </span>
        </div>
        {merchant.expiredOffers > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Expired Offers</span>
            <span className="text-xs font-semibold text-red-600">
              {merchant.expiredOffers}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Rev Share</span>
          <span className="text-xs font-semibold tabular-nums text-gray-800">
            {merchant.revShare}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Publishers</span>
          <div className="flex gap-1">
            {merchant.publishers.map((pub) => (
              <span
                key={pub}
                className="text-[10px] font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <MerchantStatusBadge status={merchant.status} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown — matches TMT pattern
// ---------------------------------------------------------------------------
interface ActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
}

const MerchantActionDropdown = memo(function MerchantActionDropdown({
  onEdit,
  onView,
  onDelete,
}: {
  merchant: V2Merchant;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const actions: ActionItem[] = [
    { label: "Edit Merchant", icon: PencilIcon, onClick: onEdit },
    { label: "View Details", icon: EyeIcon, onClick: onView },
    {
      label: "Delete Merchant",
      icon: TrashIcon,
      onClick: onDelete,
      destructive: true,
    },
  ];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 208;
      const dropdownHeight = actions.length * 40 + 8;
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const padding = 16;

      let left = rect.left - 48;
      if (left + dropdownWidth > viewport.width - padding)
        left = rect.right - dropdownWidth;
      if (left < padding) left = padding;

      let top = rect.bottom + 8;
      if (top + dropdownHeight > viewport.height - padding)
        top = rect.top - dropdownHeight - 8;
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
        onClick={() => setIsOpen(!isOpen)}
      >
        Actions
      </Button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-52 bg-white rounded-md shadow-lg border z-[9999]"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
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

// ---------------------------------------------------------------------------
// Column Definitions
// ---------------------------------------------------------------------------
interface V2MerchantColumnsOptions {
  onEdit: (merchant: V2Merchant) => void;
  onView: (merchant: V2Merchant) => void;
  onDelete: (merchant: V2Merchant) => void;
}

export function createV2MerchantColumns({
  onEdit,
  onView,
  onDelete,
}: V2MerchantColumnsOptions): ColumnDef<V2Merchant>[] {
  return [
    // Merchant name with emoji + source/subcategory + duplicate flag
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
          <HoverCard openDelay={350} closeDelay={150}>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-3 cursor-default">
                <div
                  className={`w-9 h-9 ${m.emojiBg} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}
                >
                  {m.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {m.name}
                    </span>
                    {m.isDuplicate && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold px-1.5 py-0.5">
                        DUPLICATE
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {m.source} &middot; {m.subcategory}
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="start"
              sideOffset={16}
              className="p-0 w-auto"
            >
              <MerchantRowPreview merchant={m} />
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    // Merchant ID — monospace
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Merchant ID
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const m = row.original;
        const idStyle = m.isDuplicate
          ? "bg-amber-100 text-amber-800"
          : "bg-gray-100 text-gray-700";
        return (
          <span className={`font-mono text-xs ${idStyle} px-2 py-0.5 rounded`}>
            {m.id}
          </span>
        );
      },
    },
    // Category
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Category
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.category}</span>
      ),
    },
    // Offers
    {
      id: "offers",
      header: () => <span className="font-medium text-gray-500">Offers</span>,
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900">
              {m.activeOffers}
            </span>
            <span className="text-xs text-gray-500">active</span>
            {m.expiredOffers > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-red-50 text-red-700 border-red-200 ml-1">
                {m.expiredOffers} expired
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    // Publishers
    {
      accessorKey: "publishers",
      header: () => (
        <span className="font-medium text-gray-500">Publishers</span>
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.publishers.map((pub) => (
            <span
              key={pub}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700"
            >
              {pub}
            </span>
          ))}
        </div>
      ),
      enableSorting: false,
    },
    // Status
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Status
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => <MerchantStatusBadge status={row.original.status} />,
    },
    // Rev Share
    {
      accessorKey: "revShare",
      header: () => (
        <span className="font-medium text-gray-500 block text-right">
          Rev Share
        </span>
      ),
      cell: ({ row }) => (
        <div className="text-right text-sm font-semibold tabular-nums text-gray-800">
          {row.original.revShare}
        </div>
      ),
      enableSorting: false,
    },
    // Actions
    {
      id: "actions",
      header: () => <span className="font-medium text-gray-500">Actions</span>,
      cell: ({ row }) => (
        <MerchantActionDropdown
          merchant={row.original}
          onEdit={() => onEdit(row.original)}
          onView={() => onView(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
      enableSorting: false,
    },
  ];
}

export function getV2MerchantRowClassName(row: unknown): string {
  const merchant = row as V2Merchant;
  if (merchant.status === "review") return "bg-amber-50/30";
  return "";
}
