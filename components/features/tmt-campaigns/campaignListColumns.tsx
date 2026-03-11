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
  XCircle,
  PauseCircle,
  CalendarDays,
  Clock,
  Timer,
  Link as LinkIcon,
  MonitorSmartphone,
  CreditCard,
  FileText,
  QrCode,
  FormInput,
  ClipboardCopy,
  ExternalLink,
  Image as ImageIcon,
  Type as TypeIcon,
  AppWindow,
  type LucideIcon,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LandingPageConfig } from "@/types/tmt-campaign";
import { isCampaignExpired } from "@/lib/tmt/timezone";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CampaignStatus = "active" | "expired" | "inactive";

// ---------------------------------------------------------------------------
// Sort Icon — identical to offerListColumns.tsx
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
// Date helper — identical to offerListColumns.tsx
// ---------------------------------------------------------------------------
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const month = date.toLocaleString("en-US", { month: "short" });
    const formattedMonth = month.endsWith(".") ? month : `${month}.`;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${formattedMonth} ${day}, ${year}`;
  } catch {
    return dateString;
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getCampaignStatus(c: LandingPageConfig): CampaignStatus {
  if (!c.isActive) return "inactive";
  if (c.endCampaignDate && isCampaignExpired(c.endCampaignDate))
    return "expired";
  return "active";
}

export function getRowClassName(row: unknown): string {
  const campaign = row as LandingPageConfig;
  const status = getCampaignStatus(campaign);
  if (status === "expired" || status === "inactive") return "opacity-60";
  return "";
}

// ---------------------------------------------------------------------------
// Status Badge — WCAG AA accessible, matches offer list pattern
// ---------------------------------------------------------------------------
const STATUS_STYLE: Record<
  CampaignStatus,
  {
    icon: LucideIcon;
    text: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  active: {
    icon: Globe,
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Active",
  },
  expired: {
    icon: XCircle,
    text: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Expired",
  },
  inactive: {
    icon: PauseCircle,
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    label: "Inactive",
  },
};

function StatusBadge({
  status,
  endDate,
}: {
  status: CampaignStatus;
  endDate?: string;
}) {
  const style = STATUS_STYLE[status];
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
// Campaign Type Badge — icon + color coding
// ---------------------------------------------------------------------------
const TYPE_CONFIG: Record<
  string,
  {
    icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  "": {
    icon: FileText,
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Standard",
  },
  pos: {
    icon: CreditCard,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    label: "POS",
  },
  "with-timer": {
    icon: Timer,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "With Timer",
  },
  online: {
    icon: MonitorSmartphone,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Online",
  },
  "direct-link": {
    icon: LinkIcon,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    label: "Direct Link",
  },
};

function CampaignTypeBadge({ type }: { type: string }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG[""];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${config.bg} ${config.color} ${config.border}`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {config.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Type-specific gradient map
// ---------------------------------------------------------------------------
const TYPE_GRADIENT: Record<string, string> = {
  "": "from-gray-600 to-gray-400",
  pos: "from-purple-600 to-purple-400",
  "with-timer": "from-orange-600 to-amber-400",
  online: "from-blue-600 to-blue-400",
  "direct-link": "from-teal-600 to-teal-400",
};

// ---------------------------------------------------------------------------
// Row Hover Preview — comprehensive campaign snapshot (Kigo Pro style)
// ---------------------------------------------------------------------------
function CampaignRowPreview({
  campaign,
  onEdit,
  onPreview,
}: {
  campaign: LandingPageConfig;
  onEdit?: () => void;
  onPreview?: () => void;
}) {
  const [copiedSlug, setCopiedSlug] = useState(false);
  const status = getCampaignStatus(campaign);
  const gradient = TYPE_GRADIENT[campaign.getCode] || TYPE_GRADIENT[""];
  const typeConfig = TYPE_CONFIG[campaign.getCode] || TYPE_CONFIG[""];
  const TypeIcon = typeConfig.icon;

  const daysUntilEnd = campaign.endCampaignDate
    ? Math.ceil(
        (new Date(campaign.endCampaignDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;
  const isExpiringSoon =
    daysUntilEnd !== null && daysUntilEnd > 0 && daysUntilEnd <= 7;
  const isExpired = daysUntilEnd !== null && daysUntilEnd <= 0;

  // Count page elements for the configuration inventory
  const formFieldCount = campaign.showForm
    ? campaign.formFields?.length || 0
    : 0;
  const linkButtonCount = campaign.linkButtons?.length || 0;
  const hasAppStoreLinks =
    campaign.appStoreLink?.enabled || campaign.googlePlayLink?.enabled;
  const hasLegalText = !!campaign.legalText?.trim();
  const hasCopyCode = campaign.copyCode?.enabled;
  const hasLogo = !!campaign.logo?.url;
  const hasHeroImage = !!campaign.image?.url;

  const handleCopySlug = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`/p/${campaign.affiliateSlug}`);
      setCopiedSlug(true);
      setTimeout(() => setCopiedSlug(false), 1500);
    },
    [campaign.affiliateSlug]
  );

  return (
    <div className="w-[340px] overflow-hidden">
      {/* ── Gradient Header ── */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-4`}>
        <div className="flex items-start justify-between mb-2">
          <StatusBadge status={status} endDate={campaign.endCampaignDate} />
          {campaign.id && (
            <span className="text-[10px] font-mono text-white/50 tabular-nums">
              #{campaign.id.slice(-6)}
            </span>
          )}
        </div>
        <h4 className="font-bold text-base text-white leading-snug line-clamp-2 mt-1">
          {campaign.campaignName}
        </h4>
        <button
          onClick={handleCopySlug}
          className="flex items-center gap-1.5 mt-2 text-white/70 hover:text-white transition-colors group"
        >
          <QrCode className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-sm font-mono truncate">
            /p/{campaign.affiliateSlug}
          </span>
          {copiedSlug ? (
            <span className="text-[10px] text-emerald-300 font-medium">
              Copied!
            </span>
          ) : (
            <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
              Copy
            </span>
          )}
        </button>
      </div>

      {/* ── Classification Badges ── */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
          >
            <TypeIcon className="h-3.5 w-3.5 flex-shrink-0" />
            {typeConfig.label}
          </span>
          {campaign.showForm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-sky-50 text-sky-700 border-sky-200">
              <FormInput className="h-3.5 w-3.5" />
              Form
            </span>
          )}
          {hasCopyCode && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-violet-50 text-violet-700 border-violet-200">
              <ClipboardCopy className="h-3.5 w-3.5" />
              Code
            </span>
          )}
          {hasAppStoreLinks && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-pink-50 text-pink-700 border-pink-200">
              App Store
            </span>
          )}
        </div>
      </div>

      {/* ── Page Content Snapshot ── */}
      <div className="px-5 py-3 space-y-2.5">
        {/* Title preview */}
        {campaign.title && (
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Landing Title
            </span>
            <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 mt-0.5">
              {campaign.title}
            </p>
          </div>
        )}

        {/* Visual assets row */}
        <div className="flex items-center gap-3 py-1">
          {hasLogo && campaign.logo.url && (
            <div className="flex items-center gap-2">
              <img
                src={campaign.logo.url}
                alt={campaign.logo.alt}
                className="h-7 w-auto max-w-[60px] object-contain rounded border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[10px] text-gray-400">Logo</span>
            </div>
          )}
          {hasHeroImage && campaign.image.url && (
            <div className="flex items-center gap-2">
              <img
                src={campaign.image.url}
                alt={campaign.image.alt}
                className="h-7 w-auto max-w-[60px] object-contain rounded border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[10px] text-gray-400">Hero</span>
            </div>
          )}
          {!hasLogo && !hasHeroImage && (
            <span className="text-[10px] text-gray-400 italic">
              No images configured
            </span>
          )}
        </div>
      </div>

      {/* ── Configuration Inventory ── */}
      <div className="px-5 py-3 border-t border-gray-100 space-y-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Page Elements
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <ConfigItem
            icon={FormInput}
            label="Form Fields"
            value={formFieldCount > 0 ? String(formFieldCount) : "—"}
            active={formFieldCount > 0}
          />
          <ConfigItem
            icon={ClipboardCopy}
            label="Copy Code"
            value={hasCopyCode ? campaign.copyCode.code || "Set" : "—"}
            active={!!hasCopyCode}
            mono
          />
          <ConfigItem
            icon={ExternalLink}
            label="Link Buttons"
            value={linkButtonCount > 0 ? String(linkButtonCount) : "—"}
            active={linkButtonCount > 0}
          />
          <ConfigItem
            icon={ImageIcon}
            label="Images"
            value={String((hasLogo ? 1 : 0) + (hasHeroImage ? 1 : 0))}
            active={hasLogo || hasHeroImage}
          />
        </div>

        {/* Submit button preview */}
        {campaign.showForm && campaign.submitButton?.text && (
          <div className="flex items-center gap-2 pt-1">
            <div
              className="px-3 py-1 rounded text-[10px] font-semibold"
              style={{
                backgroundColor:
                  campaign.submitButton.backgroundColor || "#000",
                color: campaign.submitButton.textColor || "#fff",
                borderRadius: campaign.submitButton.borderRadius || 6,
              }}
            >
              {campaign.submitButton.text}
            </div>
            {campaign.submitButton.redirectUrl && (
              <span className="text-[10px] text-gray-400 truncate max-w-[140px] font-mono">
                →{" "}
                {campaign.submitButton.redirectUrl.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Dates ── */}
      <div className="px-5 py-2.5 border-t border-gray-100 space-y-1.5">
        <div className="flex items-center justify-between">
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
            {campaign.endCampaignDate
              ? formatDate(campaign.endCampaignDate)
              : "No end date"}
            {isExpiringSoon && daysUntilEnd !== null && (
              <span className="ml-1 text-amber-500 font-normal">
                ({daysUntilEnd}d left)
              </span>
            )}
          </span>
        </div>
        {campaign.createdAt && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-600">Created</span>
            </div>
            <span className="text-xs font-medium tabular-nums text-gray-700">
              {formatDate(campaign.createdAt)}
            </span>
          </div>
        )}
        {campaign.updatedAt && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs text-gray-600">Updated</span>
            </div>
            <span className="text-xs font-medium tabular-nums text-gray-700">
              {formatDate(campaign.updatedAt)}
            </span>
          </div>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors"
        >
          {status === "inactive" ? (
            <>
              <PencilIcon className="h-3.5 w-3.5" />
              Edit Campaign
            </>
          ) : status === "expired" ? (
            <>
              <EyeIcon className="h-3.5 w-3.5" />
              View Details
            </>
          ) : (
            <>
              <PencilIcon className="h-3.5 w-3.5" />
              Edit Campaign
            </>
          )}
        </button>
        {campaign.affiliateSlug && status === "active" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview?.();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config inventory row — tiny key-value for page elements grid
// ---------------------------------------------------------------------------
function ConfigItem({
  icon: Icon,
  label,
  value,
  active,
  mono,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  active: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon
        className={`h-3 w-3 flex-shrink-0 ${active ? "text-gray-500" : "text-gray-300"}`}
      />
      <span
        className={`text-[11px] ${active ? "text-gray-600" : "text-gray-400"}`}
      >
        {label}
      </span>
      <span
        className={`text-[11px] font-semibold ml-auto tabular-nums ${
          active ? "text-gray-800" : "text-gray-300"
        } ${mono ? "font-mono text-[10px]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Landing Page Visual Preview — mini rendering of page layout
// ---------------------------------------------------------------------------
function LandingPageMiniPreview({ campaign }: { campaign: LandingPageConfig }) {
  const bgColor = campaign.backgroundColor || "#ffffff";
  const btnBg = campaign.submitButton?.backgroundColor || "#000";
  const btnText = campaign.submitButton?.textColor || "#fff";
  const typeConfig = TYPE_CONFIG[campaign.getCode] || TYPE_CONFIG[""];

  return (
    <div className="w-[280px] overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppWindow className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-500 font-mono">
            /p/{campaign.affiliateSlug}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
        >
          {typeConfig.label}
        </span>
      </div>

      {/* Mini page preview */}
      <div className="px-5 py-4 space-y-3" style={{ backgroundColor: bgColor }}>
        {/* Logo */}
        {campaign.logo?.url ? (
          <div className="flex justify-center">
            <img
              src={campaign.logo.url}
              alt={campaign.logo.alt}
              className="h-8 w-auto object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        )}

        {/* Title */}
        {campaign.title && (
          <p
            className="text-center text-sm font-bold leading-tight line-clamp-2"
            style={{
              color:
                bgColor === "#ffffff" || bgColor === "#fff" ? "#111" : "#fff",
            }}
          >
            {campaign.title}
          </p>
        )}

        {/* Hero image */}
        {campaign.image?.url ? (
          <div className="flex justify-center">
            <img
              src={campaign.image.url}
              alt={campaign.image.alt}
              className="max-h-20 w-auto object-contain rounded"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-14 w-24 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-gray-300" />
            </div>
          </div>
        )}

        {/* Form fields indicator */}
        {campaign.showForm && campaign.formFields?.length > 0 && (
          <div className="space-y-1.5">
            {campaign.formFields.slice(0, 2).map((field) => (
              <div
                key={field.id}
                className="h-6 rounded border border-gray-200 bg-white/80 flex items-center px-2"
              >
                <span className="text-[10px] text-gray-400 truncate">
                  {field.placeholder || field.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Submit button */}
        {campaign.showForm && (
          <div className="flex justify-center">
            <div
              className="px-4 py-1.5 rounded text-[11px] font-semibold text-center"
              style={{
                backgroundColor: btnBg,
                color: btnText,
                borderRadius: campaign.submitButton?.borderRadius || 6,
              }}
            >
              {campaign.submitButton?.text || "Submit"}
            </div>
          </div>
        )}

        {/* Copy code */}
        {campaign.copyCode?.enabled && (
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-6 px-3 rounded border border-dashed border-gray-300 bg-white/80 flex items-center">
              <span className="text-[10px] font-mono text-gray-500">
                {campaign.copyCode.code || "PROMO-CODE"}
              </span>
            </div>
            <div
              className="h-6 w-6 rounded flex items-center justify-center"
              style={{
                backgroundColor: campaign.copyCode.copyButtonColor || "#3b82f6",
              }}
            >
              <ClipboardCopy className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Link buttons */}
        {campaign.linkButtons?.length > 0 && (
          <div className="space-y-1">
            {campaign.linkButtons.slice(0, 2).map((btn) => (
              <div
                key={btn.id}
                className="text-center py-1 rounded text-[10px] font-medium border"
                style={{
                  backgroundColor:
                    btn.style === "contained"
                      ? btn.backgroundColor
                      : "transparent",
                  color:
                    btn.style === "contained"
                      ? btn.textColor
                      : btn.backgroundColor,
                  borderColor: btn.backgroundColor,
                  borderRadius: btn.borderRadius,
                }}
              >
                {btn.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page elements summary */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          {campaign.showForm && (
            <span className="inline-flex items-center gap-1 text-[10px] text-sky-600">
              <FormInput className="h-3 w-3" />
              {campaign.formFields?.length || 0} field
              {(campaign.formFields?.length || 0) !== 1 ? "s" : ""}
            </span>
          )}
          {campaign.copyCode?.enabled && (
            <span className="inline-flex items-center gap-1 text-[10px] text-violet-600">
              <ClipboardCopy className="h-3 w-3" />
              Code
            </span>
          )}
          {(campaign.linkButtons?.length || 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600">
              <ExternalLink className="h-3 w-3" />
              {campaign.linkButtons.length} link
              {campaign.linkButtons.length !== 1 ? "s" : ""}
            </span>
          )}
          {campaign.appStoreLink?.enabled && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
              App Store
            </span>
          )}
          {campaign.googlePlayLink?.enabled && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
              Google Play
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action Dropdown — same pattern as offerListColumns.tsx OfferActionDropdown
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

const CampaignActionDropdown = memo(function CampaignActionDropdown({
  campaign,
  onEdit,
  onCodes,
  onPreview,
  onDelete,
}: {
  campaign: LandingPageConfig;
  onEdit: () => void;
  onCodes: () => void;
  onPreview: () => void;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const actions: ActionItem[] = [
    { label: "Edit Campaign", icon: PencilIcon, onClick: onEdit },
    { label: "Manage Codes", icon: QrCode, onClick: onCodes },
    ...(campaign.affiliateSlug
      ? [
          {
            label: "Preview Landing Page",
            icon: EyeIcon as ActionItem["icon"],
            onClick: onPreview,
          },
        ]
      : []),
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
interface CampaignListColumnsOptions {
  onEdit: (campaign: LandingPageConfig) => void;
  onCodes: (campaign: LandingPageConfig) => void;
  onPreview: (campaign: LandingPageConfig) => void;
  onDelete: (campaign: LandingPageConfig) => void;
}

export function getCampaignListColumns({
  onEdit,
  onCodes,
  onPreview,
  onDelete,
}: CampaignListColumnsOptions): ColumnDef<LandingPageConfig>[] {
  return [
    // Status badge
    {
      id: "status",
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
      accessorFn: (row) => getCampaignStatus(row),
      cell: ({ row }) => (
        <StatusBadge
          status={getCampaignStatus(row.original)}
          endDate={row.original.endCampaignDate}
        />
      ),
    },
    // Campaign name — hover preview
    {
      accessorKey: "campaignName",
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
        const status = getCampaignStatus(row.original);
        const isExpired = status === "expired";
        return (
          <HoverCard openDelay={350} closeDelay={150}>
            <HoverCardTrigger asChild>
              <span
                className={`font-medium hover:text-primary transition-colors cursor-default ${
                  isExpired ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {row.original.campaignName}
              </span>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="start"
              sideOffset={16}
              className="p-0 w-auto"
            >
              <CampaignRowPreview
                campaign={row.original}
                onEdit={() => onEdit(row.original)}
                onPreview={() => onPreview(row.original)}
              />
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    // Campaign type with icon
    {
      accessorKey: "getCode",
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
      cell: ({ row }) => <CampaignTypeBadge type={row.original.getCode} />,
    },
    // Slug — hover shows visual landing page preview
    {
      accessorKey: "affiliateSlug",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Slug
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => (
        <HoverCard openDelay={400} closeDelay={150}>
          <HoverCardTrigger asChild>
            <span className="font-mono text-xs text-gray-700 hover:text-primary transition-colors cursor-default">
              /{row.original.affiliateSlug}
            </span>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            sideOffset={16}
            className="p-0 w-auto"
          >
            <LandingPageMiniPreview campaign={row.original} />
          </HoverCardContent>
        </HoverCard>
      ),
    },
    // End date with expiring-soon warning — accessible colors
    {
      accessorKey: "endCampaignDate",
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
        const dateString = row.original.endCampaignDate;
        if (!dateString) {
          return <span className="text-sm text-gray-500 italic">No date</span>;
        }
        const daysUntilEnd = Math.ceil(
          (new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const isExpiringSoon = daysUntilEnd > 0 && daysUntilEnd <= 7;
        const isExpired = daysUntilEnd <= 0;

        return (
          <span
            className={`text-sm ${
              isExpiringSoon
                ? "text-amber-700 font-medium"
                : isExpired
                  ? "text-red-600"
                  : "text-gray-700"
            }`}
          >
            {formatDate(dateString)}
            {isExpiringSoon && (
              <span className="ml-1.5 text-[10px] text-amber-600 font-normal">
                ({daysUntilEnd}d)
              </span>
            )}
          </span>
        );
      },
    },
    // Updated date
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent font-medium px-0 text-left justify-start"
        >
          Last Updated
          <SortIcon sorted={column.getIsSorted()} />
        </Button>
      ),
      cell: ({ row }) => {
        const dateString = row.original.updatedAt;
        if (!dateString) {
          return <span className="text-sm text-gray-500">&mdash;</span>;
        }
        return (
          <span className="text-sm text-gray-700">
            {formatDate(dateString)}
          </span>
        );
      },
    },
    // Actions dropdown
    {
      id: "actions",
      header: () => <span className="font-medium text-gray-500">Actions</span>,
      cell: ({ row }) => (
        <CampaignActionDropdown
          campaign={row.original}
          onEdit={() => onEdit(row.original)}
          onCodes={() => onCodes(row.original)}
          onPreview={() => onPreview(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
      enableSorting: false,
    },
  ];
}
