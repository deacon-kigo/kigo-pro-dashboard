"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/atoms/Button";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpDown,
  Gift,
  Percent,
  DollarSign,
  Wallet,
  Tag,
  MousePointerClick,
  Star,
  ShoppingBag,
  BadgePercent,
  Globe,
  FileEdit,
  Clock,
  Archive,
  CalendarDays,
  BarChart3,
  Store,
  type LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { OfferListItem, OFFER_TYPE_LABELS } from "./offerListMockData";
import { OfferStatus, OfferType } from "@/types/offers";

// ---------------------------------------------------------------------------
// Sort Icon
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
// Date helper
// ---------------------------------------------------------------------------
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const formattedMonth = month.endsWith(".") ? month : `${month}.`;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${formattedMonth} ${day}, ${year}`;
};

// ---------------------------------------------------------------------------
// Status Badge — WCAG AA accessible colors
// ---------------------------------------------------------------------------
const STATUS_STYLE: Record<
  OfferStatus,
  { icon: LucideIcon; text: string; bg: string; border: string; label: string }
> = {
  published: {
    icon: Globe,
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Published",
  },
  draft: {
    icon: FileEdit,
    text: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Draft",
  },
  expired: {
    icon: Clock,
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Expired",
  },
  archived: {
    icon: Archive,
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    label: "Archived",
  },
};

function StatusBadge({ status }: { status: OfferStatus }) {
  const style = STATUS_STYLE[status];
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
// Offer Type Badge — icons matching the search bar experience
// ---------------------------------------------------------------------------
const TYPE_CONFIG: Record<
  OfferType,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  bogo: {
    icon: Gift,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  percentage_savings: {
    icon: Percent,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  dollars_off: {
    icon: DollarSign,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  cashback: {
    icon: Wallet,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  free_with_purchase: {
    icon: BadgePercent,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  price_point: {
    icon: Tag,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  clickthrough: {
    icon: MousePointerClick,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  loyalty_points: {
    icon: Star,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  spend_and_get: {
    icon: ShoppingBag,
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
};

function OfferTypeBadge({ type }: { type: OfferType }) {
  const label = OFFER_TYPE_LABELS[type] || type;
  const config = TYPE_CONFIG[type];
  if (!config) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
        {label}
      </span>
    );
  }
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Row Hover Preview — progressive disclosure on row hover
// ---------------------------------------------------------------------------
function OfferRowPreview({ offer }: { offer: OfferListItem }) {
  const statusStyle = STATUS_STYLE[offer.offerStatus];
  const typeConfig = TYPE_CONFIG[offer.offerType];
  const typeLabel = OFFER_TYPE_LABELS[offer.offerType] || offer.offerType;
  const TypeIcon = typeConfig?.icon;

  // Check if offer is expiring within 7 days
  const daysUntilEnd = Math.ceil(
    (new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilEnd > 0 && daysUntilEnd <= 7;
  const isExpired = daysUntilEnd <= 0;

  return (
    <div className="w-80 p-0">
      {/* Header: Status + ID */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={offer.offerStatus} />
          <span className="text-[10px] text-gray-400 font-mono tracking-wide">
            {offer.id}
          </span>
        </div>
        <h4 className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2">
          {offer.offerName}
        </h4>
      </div>

      {/* Key metrics */}
      <div className="border-t border-gray-100" />
      <div className="grid grid-cols-3 gap-1 px-4 py-3">
        {/* Merchant */}
        <div className="col-span-3 flex items-center gap-2 mb-1">
          <Store className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">
            {offer.merchantName}
          </span>
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            Type
          </span>
          <span className="text-xs text-gray-700 font-medium flex items-center gap-1">
            {TypeIcon && (
              <TypeIcon
                className={`h-3 w-3 flex-shrink-0 ${typeConfig?.color || "text-gray-500"}`}
              />
            )}
            <span className="truncate">{typeLabel}</span>
          </span>
        </div>

        {/* Redemptions */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            Redeemed
          </span>
          <span className="text-xs text-gray-700 font-medium tabular-nums flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-gray-400 flex-shrink-0" />
            {offer.redemptions.toLocaleString()}
          </span>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
            Ends
          </span>
          <span
            className={`text-xs font-medium tabular-nums flex items-center gap-1 ${
              isExpiringSoon
                ? "text-amber-600"
                : isExpired
                  ? "text-red-600"
                  : "text-gray-700"
            }`}
          >
            <CalendarDays
              className={`h-3 w-3 flex-shrink-0 ${
                isExpiringSoon
                  ? "text-amber-500"
                  : isExpired
                    ? "text-red-500"
                    : "text-gray-400"
              }`}
            />
            {formatDate(offer.endDate)}
          </span>
        </div>
      </div>

      {/* Expiring soon warning */}
      {isExpiringSoon && (
        <>
          <div className="border-t border-amber-100" />
          <div className="px-4 py-2 bg-amber-50">
            <p className="text-[11px] text-amber-700 font-medium">
              Expires in {daysUntilEnd} day{daysUntilEnd !== 1 ? "s" : ""}
            </p>
          </div>
        </>
      )}

      {/* Footer hint */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 rounded-b-md">
        <p className="text-[10px] text-gray-400 text-center">
          Click to view details
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown
// ---------------------------------------------------------------------------
const OfferActionDropdown = memo(function OfferActionDropdown({
  offer,
  onEdit,
  onDelete,
}: {
  offer: OfferListItem;
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
      const dropdownHeight = 120;
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
  }, [isOpen]);

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
        Actions
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
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={handleEditClick}
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit Offer
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
                Delete Offer
              </button>
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
interface OfferListColumnsOptions {
  onEdit: (offerId: string) => void;
  onDelete: (offer: OfferListItem) => void;
}

export function getOfferListColumns({
  onEdit,
  onDelete,
}: OfferListColumnsOptions): ColumnDef<OfferListItem>[] {
  return [
    // Status badge
    {
      accessorKey: "offerStatus",
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
      cell: ({ row }) => (
        <StatusBadge status={row.getValue("offerStatus") as OfferStatus} />
      ),
    },
    // Offer name — row hover shows preview
    {
      accessorKey: "offerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Offer Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <HoverCard openDelay={350} closeDelay={150}>
          <HoverCardTrigger asChild>
            <span className="font-medium text-gray-900 hover:text-primary transition-colors cursor-default">
              {row.getValue("offerName")}
            </span>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            sideOffset={16}
            className="p-0 w-auto"
          >
            <OfferRowPreview offer={row.original} />
          </HoverCardContent>
        </HoverCard>
      ),
    },
    // Offer type with icon
    {
      accessorKey: "offerType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Type
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <OfferTypeBadge type={row.getValue("offerType") as OfferType} />
      ),
    },
    // Merchant name
    {
      accessorKey: "merchantName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Merchant
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-gray-600">{row.getValue("merchantName")}</span>
      ),
    },
    // Redemptions
    {
      accessorKey: "redemptions",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Redemptions
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue("redemptions") as number;
        return (
          <span className="tabular-nums text-gray-700">
            {value.toLocaleString()}
          </span>
        );
      },
    },
    // End date
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          End Date
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("endDate") as string;
        const daysUntilEnd = Math.ceil(
          (new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const isExpiringSoon = daysUntilEnd > 0 && daysUntilEnd <= 7;
        const isExpired = daysUntilEnd <= 0;

        return (
          <span
            className={`text-sm ${
              isExpiringSoon
                ? "text-amber-600 font-medium"
                : isExpired
                  ? "text-red-500"
                  : "text-gray-600"
            }`}
          >
            {formatDate(dateString)}
            {isExpiringSoon && (
              <span className="ml-1.5 text-[10px] text-amber-500 font-normal">
                ({daysUntilEnd}d)
              </span>
            )}
          </span>
        );
      },
    },
    // Actions
    {
      id: "actions",
      header: () => <span className="font-medium text-gray-500">Actions</span>,
      cell: ({ row }) => (
        <OfferActionDropdown
          offer={row.original}
          onEdit={() => onEdit(row.original.id)}
          onDelete={() => onDelete(row.original)}
        />
      ),
      enableSorting: false,
    },
  ];
}
