"use client";

import { memo } from "react";
import {
  TrashIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { FloatingToolbar } from "@/components/shared/FloatingToolbar";
import { OfferListItem } from "./offerListMockData";

interface OfferBulkActionsProps {
  selectedCount: number;
  selectedOffers: OfferListItem[];
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkClone: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

function ToolbarButton({
  onClick,
  disabled,
  variant = "default",
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap";
  const variants = {
    default: disabled
      ? "text-gray-300 cursor-not-allowed"
      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 active:scale-[0.97]",
    destructive: disabled
      ? "text-gray-300 cursor-not-allowed"
      : "text-red-500 hover:text-red-700 hover:bg-red-50/60 active:scale-[0.97]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export const OfferBulkActions = memo(function OfferBulkActions({
  selectedCount,
  selectedOffers,
  onBulkPublish,
  onBulkUnpublish,
  onBulkClone,
  onBulkDelete,
  onClearSelection,
}: OfferBulkActionsProps) {
  const hasDraftOffers = selectedOffers.some((o) => o.offerStatus === "draft");
  const hasPublishedOffers = selectedOffers.some(
    (o) => o.offerStatus === "published"
  );

  return (
    <FloatingToolbar visible={selectedCount > 0}>
      {/* Selection count pill */}
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
        {selectedCount} {selectedCount === 1 ? "offer" : "offers"}
      </span>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-200/70" />

      {/* Actions */}
      <ToolbarButton onClick={onBulkPublish} disabled={!hasDraftOffers}>
        <ArrowUpTrayIcon className="h-3.5 w-3.5" />
        Publish
      </ToolbarButton>

      <ToolbarButton onClick={onBulkUnpublish} disabled={!hasPublishedOffers}>
        <ArrowDownTrayIcon className="h-3.5 w-3.5" />
        Unpublish
      </ToolbarButton>

      <ToolbarButton onClick={onBulkClone}>
        <DocumentDuplicateIcon className="h-3.5 w-3.5" />
        Clone
      </ToolbarButton>

      <div className="w-px h-4 bg-gray-200/70" />

      <ToolbarButton onClick={onBulkDelete} variant="destructive">
        <TrashIcon className="h-3.5 w-3.5" />
        Delete
      </ToolbarButton>

      <div className="w-px h-4 bg-gray-200/70" />

      {/* Dismiss */}
      <button
        onClick={onClearSelection}
        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100/50 transition-all duration-150 active:scale-95"
        aria-label="Clear selection"
      >
        <XMarkIcon className="h-3.5 w-3.5" />
      </button>
    </FloatingToolbar>
  );
});
