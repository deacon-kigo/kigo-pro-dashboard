"use client";

import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
  XCircle,
  Archive,
  PauseCircle,
  ShieldCheck,
  CalendarDays,
  BarChart3,
  Store,
  PlayCircle,
  Send,
  QrCode,
  Zap,
  CreditCard,
  Package,
  MessageSquare,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  MousePointer,
  Clock,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  OfferListItem,
  OFFER_TYPE_LABELS,
  REDEMPTION_TYPE_LABELS,
} from "./offerListMockData";
import { OfferStatus, OfferType, RedemptionType } from "@/types/offers";

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
    text: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Draft",
  },
  expired: {
    icon: XCircle,
    text: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Expired",
  },
  archived: {
    icon: Archive,
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    label: "Archived",
  },
  paused: {
    icon: PauseCircle,
    text: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Paused",
  },
  pending_approval: {
    icon: ShieldCheck,
    text: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "Pending Approval",
  },
};

function StatusBadge({
  status,
  endDate,
}: {
  status: OfferStatus;
  endDate?: string;
}) {
  const style = STATUS_STYLE[status];
  if (!style) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
        <FileEdit className="h-3.5 w-3.5" />
        {status ?? "Unknown"}
      </span>
    );
  }
  const Icon = style.icon;
  const displayLabel =
    status === "expired" && endDate
      ? `Expired ${formatDate(endDate)}`
      : style.label;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {displayLabel}
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
  const label =
    OFFER_TYPE_LABELS[type] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const config = TYPE_CONFIG[type];
  if (!config) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap max-w-[160px] truncate">
              {label}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            This offer type was created outside the wizard
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap max-w-[160px] ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Redemption Type Badge
// ---------------------------------------------------------------------------
const REDEMPTION_CONFIG: Record<
  RedemptionType,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  online_code: {
    icon: QrCode,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  airdrop: {
    icon: Zap,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  gift_card: {
    icon: Gift,
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  card_linked: {
    icon: CreditCard,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  stripe_checkout: {
    icon: ShoppingBag,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  augeo_fulfillment: {
    icon: Package,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  sms_notification: {
    icon: MessageSquare,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
};

function RedemptionTypeBadge({ type }: { type: RedemptionType }) {
  const label =
    REDEMPTION_TYPE_LABELS[type] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const config = REDEMPTION_CONFIG[type];
  if (!config) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap max-w-[160px] truncate">
              {label}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            This redemption type was created outside the wizard
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap max-w-[160px] ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Row Hover Preview — rich offer snapshot with progressive disclosure
// ---------------------------------------------------------------------------

/** Returns a gradient + accent based on offer type */
function getTypeGradient(type: OfferType): {
  gradient: string;
  accent: string;
} {
  const map: Partial<Record<OfferType, { gradient: string; accent: string }>> =
    {
      percentage_savings: {
        gradient: "from-blue-600 to-blue-400",
        accent: "bg-blue-500",
      },
      dollars_off: {
        gradient: "from-emerald-600 to-emerald-400",
        accent: "bg-emerald-500",
      },
      bogo: {
        gradient: "from-purple-600 to-purple-400",
        accent: "bg-purple-500",
      },
      cashback: {
        gradient: "from-teal-600 to-teal-400",
        accent: "bg-teal-500",
      },
      free_with_purchase: {
        gradient: "from-rose-600 to-rose-400",
        accent: "bg-rose-500",
      },
      price_point: {
        gradient: "from-orange-600 to-orange-400",
        accent: "bg-orange-500",
      },
      clickthrough: {
        gradient: "from-indigo-600 to-indigo-400",
        accent: "bg-indigo-500",
      },
      loyalty_points: {
        gradient: "from-amber-600 to-amber-400",
        accent: "bg-amber-500",
      },
      spend_and_get: {
        gradient: "from-cyan-600 to-cyan-400",
        accent: "bg-cyan-500",
      },
    };
  return (
    map[type] || {
      gradient: "from-gray-600 to-gray-400",
      accent: "bg-gray-500",
    }
  );
}

/** Converts redemption count to performance tier */
function getPerformanceTier(redemptions: number): {
  label: string;
  color: string;
  barColor: string;
  percent: number;
} {
  if (redemptions >= 100)
    return {
      label: "High",
      color: "text-emerald-700",
      barColor: "bg-emerald-500",
      percent: Math.min(100, (redemptions / 500) * 100),
    };
  if (redemptions >= 10)
    return {
      label: "Medium",
      color: "text-amber-700",
      barColor: "bg-amber-400",
      percent: (redemptions / 100) * 100,
    };
  return {
    label: "Low",
    color: "text-gray-500",
    barColor: "bg-gray-300",
    percent: Math.max(5, (redemptions / 10) * 100),
  };
}

function OfferRowPreview({
  offer,
  onEdit,
}: {
  offer: OfferListItem;
  onEdit?: (id: string) => void;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const typeGradient = getTypeGradient(offer.offerType);
  const typeConfig = TYPE_CONFIG[offer.offerType];
  const typeLabel = OFFER_TYPE_LABELS[offer.offerType] || offer.offerType;
  const TypeIcon = typeConfig?.icon;
  const redemptionConfig = REDEMPTION_CONFIG[offer.redemptionType];
  const redemptionLabel =
    REDEMPTION_TYPE_LABELS[offer.redemptionType] || offer.redemptionType;
  const RedemptionIcon = redemptionConfig?.icon;
  const perf = getPerformanceTier(offer.redemptions);
  const statusStyle = STATUS_STYLE[offer.offerStatus];

  const daysUntilEnd = Math.ceil(
    (new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilEnd > 0 && daysUntilEnd <= 7;
  const isExpired = daysUntilEnd <= 0;

  const handleCopyId = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(offer.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1500);
    },
    [offer.id]
  );

  return (
    <div className="w-[340px] overflow-hidden">
      {/* Gradient header with offer value + status */}
      <div className={`bg-gradient-to-r ${typeGradient.gradient} px-5 py-4`}>
        <div className="flex items-start justify-between mb-2">
          <StatusBadge status={offer.offerStatus} />
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-[11px] font-mono"
            title="Copy offer ID"
          >
            {copiedId ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {offer.id}
          </button>
        </div>
        <h4 className="font-bold text-base text-white leading-snug line-clamp-2 mt-1">
          {offer.offerName}
        </h4>
        <div className="flex items-center gap-1.5 mt-2 text-white/80">
          <Store className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {offer.merchantName}
          </span>
        </div>
      </div>

      {/* Classification badges */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Offer type */}
          {TypeIcon && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
            >
              <TypeIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {typeLabel}
            </span>
          )}
          {/* Redemption type */}
          {RedemptionIcon && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${redemptionConfig.bg} ${redemptionConfig.color} ${redemptionConfig.border}`}
            >
              <RedemptionIcon className="h-3.5 w-3.5 flex-shrink-0" />
              {redemptionLabel}
            </span>
          )}
        </div>
      </div>

      {/* Performance metrics */}
      <div className="px-5 py-3 space-y-3">
        {/* Redemption performance bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
              Redemptions
            </span>
            <span className={`text-xs font-bold tabular-nums ${perf.color}`}>
              {offer.redemptions.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${perf.barColor}`}
              style={{ width: `${perf.percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[11px] font-medium ${perf.color}`}>
              {perf.label} performance
            </span>
            <span className="text-[11px] text-gray-400">
              {perf.percent >= 100
                ? "500+"
                : `of ${offer.redemptions >= 100 ? "500" : offer.redemptions >= 10 ? "100" : "10"}`}
            </span>
          </div>
        </div>

        {/* Date info */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-600">
              {isExpired ? "Ended" : isExpiringSoon ? "Ending soon" : "Ends"}
            </span>
          </div>
          <span
            className={`text-xs font-semibold tabular-nums ${
              isExpiringSoon
                ? "text-amber-600"
                : isExpired
                  ? "text-red-600"
                  : "text-gray-700"
            }`}
          >
            {formatDate(offer.endDate)}
            {isExpiringSoon && (
              <span className="ml-1 text-amber-500 font-normal">
                ({daysUntilEnd}d left)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Interactive footer actions */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(offer.id);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors"
        >
          {offer.offerStatus === "draft" ? (
            <>
              <PlayCircle className="h-3.5 w-3.5" />
              Resume Editing
            </>
          ) : offer.offerStatus === "expired" ||
            offer.offerStatus === "pending_approval" ? (
            <>
              <EyeIcon className="h-3.5 w-3.5" />
              View Details
            </>
          ) : (
            <>
              <ExternalLink className="h-3.5 w-3.5" />
              Open Offer
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Performance Sparkline — pure CSS mini bar chart for 8-week trend
// ---------------------------------------------------------------------------
function MiniSparkline({
  data,
  color = "bg-emerald-400",
  height = 24,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-t-sm ${color}`}
          style={{ height: `${Math.max(2, (value / max) * height)}px` }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Performance Metric Row — used inside hover card
// ---------------------------------------------------------------------------
function MetricRow({
  icon: Icon,
  label,
  value,
  wow,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  wow: number;
  color: string;
}) {
  const TrendIcon = wow > 5 ? TrendingUp : wow < -5 ? TrendingDown : Minus;
  const trendColor =
    wow > 5 ? "text-emerald-600" : wow < -5 ? "text-red-500" : "text-gray-400";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tabular-nums text-gray-800">
          {value.toLocaleString()}
        </span>
        <span
          className={`text-[10px] font-medium flex items-center gap-0.5 ${trendColor}`}
        >
          <TrendIcon className="h-3 w-3" />
          {Math.abs(wow).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Performance Hover Card — rich metrics disclosure with sparkline + funnel
// ---------------------------------------------------------------------------
function PerformanceHoverDetail({ offer }: { offer: OfferListItem }) {
  const { performance } = offer;
  const { impressions, clicks, redemptions, weeklyTrend } = performance;

  // Derived metrics
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (redemptions / clicks) * 100 : 0;

  // WoW changes
  const lastWeek = weeklyTrend[weeklyTrend.length - 1];
  const prevWeek = weeklyTrend[weeklyTrend.length - 2];
  const impressionsWow = prevWeek?.impressions
    ? ((lastWeek.impressions - prevWeek.impressions) / prevWeek.impressions) *
      100
    : 0;
  const clicksWow = prevWeek?.clicks
    ? ((lastWeek.clicks - prevWeek.clicks) / prevWeek.clicks) * 100
    : 0;
  const redemptionsWow = prevWeek?.redemptions
    ? ((lastWeek.redemptions - prevWeek.redemptions) / prevWeek.redemptions) *
      100
    : 0;

  // Funnel bar widths (impressions = 100%, others proportional)
  const maxFunnel = Math.max(impressions, 1);
  const clicksWidth = (clicks / maxFunnel) * 100;
  const redemptionsWidth = (redemptions / maxFunnel) * 100;

  return (
    <div className="w-[300px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Performance Overview
        </h4>
        <p className="text-[11px] text-gray-500 mt-0.5">Last 8 weeks</p>
      </div>

      {/* Sparkline chart section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-gray-500">
            Weekly Trend
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Redemptions
            </span>
            <span className="flex items-center gap-1 text-[10px] text-blue-500">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              Clicks
            </span>
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-10">
          {weeklyTrend.map((week, i) => {
            const maxR = Math.max(...weeklyTrend.map((w) => w.redemptions), 1);
            const maxC = Math.max(...weeklyTrend.map((w) => w.clicks), 1);
            return (
              <div key={i} className="flex-1 flex items-end gap-[1px]">
                <div
                  className="flex-1 bg-blue-200 rounded-t-sm"
                  style={{
                    height: `${Math.max(2, (week.clicks / maxC) * 40)}px`,
                  }}
                />
                <div
                  className="flex-1 bg-emerald-400 rounded-t-sm"
                  style={{
                    height: `${Math.max(2, (week.redemptions / maxR) * 40)}px`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-1.5">
        <span className="text-[11px] font-medium text-gray-500">
          Conversion Funnel
        </span>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-gray-500 w-8 text-right shrink-0">
              {impressions >= 1000
                ? `${(impressions / 1000).toFixed(1)}k`
                : impressions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${Math.max(2, clicksWidth)}%` }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-gray-500 w-8 text-right shrink-0">
              {clicks >= 1000 ? `${(clicks / 1000).toFixed(1)}k` : clicks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.max(1, redemptionsWidth)}%` }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-gray-500 w-8 text-right shrink-0">
              {redemptions >= 1000
                ? `${(redemptions / 1000).toFixed(1)}k`
                : redemptions}
            </span>
          </div>
        </div>
      </div>

      {/* Metric rows with WoW trends */}
      <div className="px-4 py-3 space-y-2.5">
        <MetricRow
          icon={Eye}
          label="Impressions"
          value={impressions}
          wow={impressionsWow}
          color="text-gray-500"
        />
        <MetricRow
          icon={MousePointer}
          label="Clicks"
          value={clicks}
          wow={clicksWow}
          color="text-blue-500"
        />
        <MetricRow
          icon={BarChart3}
          label="Redemptions"
          value={redemptions}
          wow={redemptionsWow}
          color="text-emerald-600"
        />
      </div>

      {/* Derived insights */}
      <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-4">
        <div className="flex-1 text-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
            CTR
          </span>
          <span className="text-sm font-bold tabular-nums text-gray-800">
            {ctr.toFixed(1)}%
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex-1 text-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
            Conversion
          </span>
          <span className="text-sm font-bold tabular-nums text-gray-800">
            {conversionRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Performance Cell — compact inline display with sparkline + trend
// ---------------------------------------------------------------------------
function PerformanceCell({ offer }: { offer: OfferListItem }) {
  const { performance } = offer;
  const isDormant =
    offer.offerStatus === "draft" || offer.offerStatus === "pending_approval";

  if (isDormant) {
    return <span className="text-xs text-gray-400 italic">No data yet</span>;
  }

  // WoW trend for redemptions
  const trend = performance.weeklyTrend;
  const lastWeek = trend[trend.length - 1]?.redemptions ?? 0;
  const prevWeek = trend[trend.length - 2]?.redemptions ?? 0;
  const wowChange = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;

  const TrendIcon =
    wowChange > 5 ? TrendingUp : wowChange < -5 ? TrendingDown : Minus;
  const trendColor =
    wowChange > 5
      ? "text-emerald-600"
      : wowChange < -5
        ? "text-red-500"
        : "text-gray-400";

  const sparkColor =
    offer.offerStatus === "expired"
      ? "bg-gray-300"
      : offer.offerStatus === "paused"
        ? "bg-blue-300"
        : "bg-emerald-400";

  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2.5 cursor-default">
          <MiniSparkline
            data={trend.map((w) => w.redemptions)}
            color={sparkColor}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tabular-nums text-gray-800 leading-tight">
              {performance.redemptions.toLocaleString()}
            </span>
            <span
              className={`text-[10px] font-medium flex items-center gap-0.5 ${trendColor}`}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(wowChange).toFixed(0)}%
            </span>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side="left"
        align="start"
        sideOffset={12}
        className="p-0 w-auto"
      >
        <PerformanceHoverDetail offer={offer} />
      </HoverCardContent>
    </HoverCard>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown
// ---------------------------------------------------------------------------
interface ActionItem {
  label: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  onClick: () => void;
  destructive?: boolean;
}

function getActionsForStatus(
  status: OfferStatus,
  onEdit: () => void,
  onDelete: () => void,
  onStatusChange?: (newStatus: OfferStatus) => void
): ActionItem[] {
  switch (status) {
    case "draft":
      return [
        {
          label: "Publish Offer",
          icon: Globe,
          onClick: () => onStatusChange?.("published"),
        },
        { label: "Resume Editing", icon: PencilIcon, onClick: onEdit },
        {
          label: "Submit for Review",
          icon: Send,
          onClick: () => onStatusChange?.("pending_approval"),
        },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    case "pending_approval":
      return [
        {
          label: "Approve & Publish",
          icon: ShieldCheck,
          onClick: () => onStatusChange?.("published"),
        },
        { label: "View Details", icon: EyeIcon, onClick: onEdit },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    case "published":
      return [
        {
          label: "Pause Offer",
          icon: PauseCircle,
          onClick: () => onStatusChange?.("paused"),
        },
        { label: "Edit Offer", icon: PencilIcon, onClick: onEdit },
        {
          label: "Archive Offer",
          icon: Archive,
          onClick: () => onStatusChange?.("archived"),
        },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    case "paused":
      return [
        {
          label: "Resume Offer",
          icon: PlayCircle,
          onClick: () => onStatusChange?.("published"),
        },
        { label: "Edit Offer", icon: PencilIcon, onClick: onEdit },
        {
          label: "Archive Offer",
          icon: Archive,
          onClick: () => onStatusChange?.("archived"),
        },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    case "archived":
      return [
        {
          label: "Republish Offer",
          icon: Globe,
          onClick: () => onStatusChange?.("published"),
        },
        { label: "View Details", icon: EyeIcon, onClick: onEdit },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    case "expired":
      return [
        { label: "View Details", icon: EyeIcon, onClick: onEdit },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
    default:
      return [
        { label: "Edit Offer", icon: PencilIcon, onClick: onEdit },
        {
          label: "Delete Offer",
          icon: TrashIcon,
          onClick: onDelete,
          destructive: true,
        },
      ];
  }
}

const OfferActionDropdown = memo(function OfferActionDropdown({
  offer,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  offer: OfferListItem;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (newStatus: OfferStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const actions = getActionsForStatus(
    offer.offerStatus,
    onEdit,
    onDelete,
    onStatusChange
  );

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
interface OfferListColumnsOptions {
  onEdit: (offerId: string) => void;
  onDelete: (offer: OfferListItem) => void;
  onStatusChange?: (offerId: string, newStatus: OfferStatus) => void;
}

export function getOfferListColumns({
  onEdit,
  onDelete,
  onStatusChange,
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
        <StatusBadge
          status={row.getValue("offerStatus") as OfferStatus}
          endDate={row.original.endDate}
        />
      ),
    },
    // Offer name — row hover shows preview, draft shows resume pill, expired shows strikethrough
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
      cell: ({ row }) => {
        const status = row.original.offerStatus;
        const isExpired = status === "expired";
        const isDraft = status === "draft";
        return (
          <HoverCard openDelay={350} closeDelay={150}>
            <HoverCardTrigger asChild>
              <span
                className={`font-medium hover:text-primary transition-colors cursor-default inline-flex items-center gap-2 ${isExpired ? "line-through text-gray-500" : "text-gray-900"}`}
              >
                {row.getValue("offerName")}
                {isDraft && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    <PlayCircle className="h-3 w-3" />
                    Resume
                  </span>
                )}
              </span>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="start"
              sideOffset={16}
              className="p-0 w-auto"
            >
              <OfferRowPreview offer={row.original} onEdit={onEdit} />
            </HoverCardContent>
          </HoverCard>
        );
      },
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
    // Performance — sparkline + hover disclosure with full funnel metrics
    {
      accessorKey: "redemptions",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Performance
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => <PerformanceCell offer={row.original} />,
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
          onStatusChange={
            onStatusChange
              ? (newStatus) => onStatusChange(row.original.id, newStatus)
              : undefined
          }
        />
      ),
      enableSorting: false,
    },
  ];
}
