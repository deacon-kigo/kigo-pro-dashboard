"use client";

import React, { memo, useState, useRef, useEffect, useCallback } from "react";
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
  Clock,
  CalendarClock,
  FileText,
  Zap,
  Star,
  Trophy,
  Gamepad2,
  Expand,
  Layers,
  type LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { V2Campaign, CHANNEL_COLORS } from "./types";

// ---------------------------------------------------------------------------
// Sort Icon — identical to TMT campaignListColumns pattern
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
// Delivery Status Badge — matches TMT StatusBadge pattern
// ---------------------------------------------------------------------------
const DELIVERY_STYLE: Record<
  string,
  { icon: LucideIcon; text: string; bg: string; border: string; label: string }
> = {
  live: {
    icon: Globe,
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Live",
  },
  scheduled: {
    icon: CalendarClock,
    text: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Scheduled",
  },
  planned: {
    icon: Clock,
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    label: "Planned",
  },
};

function DeliveryStatusBadge({ status }: { status: string }) {
  const style = DELIVERY_STYLE[status] || DELIVERY_STYLE.planned;
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
// Approval Badge
// ---------------------------------------------------------------------------
const APPROVAL_STYLE: Record<
  string,
  { text: string; bg: string; border: string; label: string }
> = {
  approved: {
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "\u2713 Approved",
  },
  pending: {
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "\u23F3 Pending",
  },
  planning: {
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    label: "\u23F3 Planning",
  },
};

function ApprovalBadge({ status }: { status: string }) {
  const style = APPROVAL_STYLE[status] || APPROVAL_STYLE.planning;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Campaign Type Badge — icon + color coded, matches TMT pattern
// ---------------------------------------------------------------------------
const TYPE_CONFIG: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  Spotlight: {
    icon: Star,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Event: {
    icon: CalendarClock,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  Program: {
    icon: Layers,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  Campaign: {
    icon: FileText,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Collection: {
    icon: Layers,
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  Expansion: {
    icon: Expand,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Sports: {
    icon: Trophy,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Gaming: {
    icon: Gamepad2,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
};

function CampaignTypeBadge({ type }: { type: string }) {
  const config = TYPE_CONFIG[type] || {
    icon: FileText,
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {type}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Hover Preview — campaign snapshot on name hover
// ---------------------------------------------------------------------------
function CampaignRowPreview({ campaign }: { campaign: V2Campaign }) {
  return (
    <div className="w-[300px] overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-4">
        <DeliveryStatusBadge status={campaign.deliveryStatus} />
        <h4 className="font-bold text-base text-white leading-snug line-clamp-2 mt-2">
          {campaign.name}
        </h4>
        <span className="text-sm font-mono text-white/60 mt-1 block">
          {campaign.id}
        </span>
      </div>
      <div className="px-5 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Publisher</span>
          <span className="text-xs font-semibold text-gray-800">
            {campaign.publisher}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Type</span>
          <CampaignTypeBadge type={campaign.campaignType} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Timeline</span>
          <span className="text-xs font-medium text-gray-700">
            {campaign.timeline}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Channels</span>
          <div className="flex gap-1">
            {campaign.channels.map((ch) => {
              const colors = CHANNEL_COLORS[ch] || {
                bg: "bg-gray-100",
                text: "text-gray-700",
              };
              return (
                <span
                  key={ch}
                  className={`text-[10px] font-medium ${colors.bg} ${colors.text} px-1.5 py-0.5 rounded`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
        {campaign.ctr !== "\u2014" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Impressions</span>
              <span className="text-xs font-semibold tabular-nums text-gray-800">
                {campaign.impressions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">CTR</span>
              <span className="text-xs font-semibold tabular-nums text-emerald-700">
                {campaign.ctr}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Redemptions</span>
              <span className="text-xs font-semibold tabular-nums text-gray-800">
                {campaign.redemptions}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <ApprovalBadge status={campaign.approvalStatus} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown — matches TMT CampaignActionDropdown pattern
// ---------------------------------------------------------------------------
interface ActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
}

const CampaignActionDropdown = memo(function CampaignActionDropdown({
  campaign,
  onEdit,
  onView,
  onDelete,
}: {
  campaign: V2Campaign;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const actions: ActionItem[] = [
    { label: "Edit Campaign", icon: PencilIcon, onClick: onEdit },
    { label: "View Details", icon: EyeIcon, onClick: onView },
    {
      label: "Delete Campaign",
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
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
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
interface V2CampaignColumnsOptions {
  onEdit: (campaign: V2Campaign) => void;
  onView: (campaign: V2Campaign) => void;
  onDelete: (campaign: V2Campaign) => void;
}

export function createV2CampaignColumns({
  onEdit,
  onView,
  onDelete,
}: V2CampaignColumnsOptions): ColumnDef<V2Campaign>[] {
  return [
    // Delivery status
    {
      id: "deliveryStatus",
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
      accessorFn: (row) => row.deliveryStatus,
      cell: ({ row }) => (
        <DeliveryStatusBadge status={row.original.deliveryStatus} />
      ),
    },
    // Campaign name — hover preview
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 w-full text-left justify-start"
        >
          Campaign Name
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <HoverCard openDelay={350} closeDelay={150}>
            <HoverCardTrigger asChild>
              <div className="cursor-default">
                <span className="font-medium text-gray-900 hover:text-primary transition-colors">
                  {campaign.name}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {campaign.publisherSubtitle}
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="start"
              sideOffset={16}
              className="p-0 w-auto"
            >
              <CampaignRowPreview campaign={campaign} />
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    // Campaign ID — monospace
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Campaign ID
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {row.original.id}
        </span>
      ),
    },
    // Publisher chip
    {
      accessorKey: "publisher",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Publisher
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
          {row.original.publisher}
        </span>
      ),
    },
    // Campaign type
    {
      accessorKey: "campaignType",
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
      cell: ({ row }) => <CampaignTypeBadge type={row.original.campaignType} />,
    },
    // Channels
    {
      accessorKey: "channels",
      header: () => <span className="font-medium text-gray-500">Channels</span>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.channels.map((channel) => {
            const colors = CHANNEL_COLORS[channel] || {
              bg: "bg-gray-100",
              text: "text-gray-700",
            };
            return (
              <span
                key={channel}
                className={`text-[10px] font-medium ${colors.bg} ${colors.text} px-1.5 py-0.5 rounded`}
              >
                {channel}
              </span>
            );
          })}
        </div>
      ),
      enableSorting: false,
    },
    // Timeline
    {
      accessorKey: "timeline",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Timeline
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.timeline}</span>
      ),
    },
    // Approval
    {
      accessorKey: "approvalStatus",
      header: () => <span className="font-medium text-gray-500">Approval</span>,
      cell: ({ row }) => <ApprovalBadge status={row.original.approvalStatus} />,
      enableSorting: false,
    },
    // Impressions
    {
      accessorKey: "impressions",
      header: () => (
        <span className="font-medium text-gray-500 block text-right">
          Impressions
        </span>
      ),
      cell: ({ row }) => (
        <div
          className={`text-right text-sm tabular-nums ${row.original.impressions !== "\u2014" ? "font-medium text-gray-700" : "text-gray-400"}`}
        >
          {row.original.impressions}
        </div>
      ),
      enableSorting: false,
    },
    // CTR
    {
      accessorKey: "ctr",
      header: () => (
        <span className="font-medium text-gray-500 block text-right">CTR</span>
      ),
      cell: ({ row }) => {
        const ctr = row.original.ctr;
        const isActive = ctr !== "\u2014";
        return (
          <div
            className={`text-right text-sm font-semibold tabular-nums ${isActive ? "text-emerald-700" : "text-gray-400"}`}
          >
            {ctr}
          </div>
        );
      },
      enableSorting: false,
    },
    // Redemptions
    {
      accessorKey: "redemptions",
      header: () => (
        <span className="font-medium text-gray-500 block text-right">
          Redemptions
        </span>
      ),
      cell: ({ row }) => {
        const val = row.original.redemptions;
        return (
          <div
            className={`text-right text-sm font-semibold tabular-nums ${val !== "\u2014" ? "text-gray-800" : "text-gray-400"}`}
          >
            {val}
          </div>
        );
      },
      enableSorting: false,
    },
    // Actions dropdown
    {
      id: "actions",
      header: () => <span className="font-medium text-gray-500">Actions</span>,
      cell: ({ row }) => (
        <CampaignActionDropdown
          campaign={row.original}
          onEdit={() => onEdit(row.original)}
          onView={() => onView(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
      enableSorting: false,
    },
  ];
}

// ---------------------------------------------------------------------------
// Row class helper
// ---------------------------------------------------------------------------
export function getV2RowClassName(row: unknown): string {
  const campaign = row as V2Campaign;
  if (campaign.deliveryStatus === "planned") return "opacity-70";
  return "";
}
