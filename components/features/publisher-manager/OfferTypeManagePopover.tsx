"use client";

/**
 * @file Publisher Manager (DES-876) — Manage offer types popover
 * @description The supported-offer-type configuration for a publisher, surfaced
 * as a header action ("N/11 offer types"). Toggling a type edits the supported
 * set, which in turn drives the Offer Type facet in each tab's filter bar.
 */

import React, { useMemo } from "react";
import { CheckCircle2, Circle, Sliders } from "lucide-react";

import { Button } from "@/components/atoms/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { OfferType } from "./types";

interface OfferTypeManagePopoverProps {
  allOfferTypes: OfferType[];
  supportedIds: string[];
  onSupportedChange: (ids: string[]) => void;
}

export function OfferTypeManagePopover({
  allOfferTypes,
  supportedIds,
  onSupportedChange,
}: OfferTypeManagePopoverProps) {
  const supportedSet = useMemo(() => new Set(supportedIds), [supportedIds]);

  const toggle = (id: string) => {
    const next = new Set(supportedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSupportedChange(
      allOfferTypes.map((t) => t.id).filter((x) => next.has(x))
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          icon={<Sliders className="h-4 w-4" />}
        >
          {supportedIds.length}/{allOfferTypes.length} offer types
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">
              Supported offer types
            </p>
            {/* Live enabled counter per the DES-876 spec. */}
            <p className="text-sm font-medium text-gray-600">
              {supportedIds.length}/{allOfferTypes.length} enabled
            </p>
          </div>
          <p className="text-sm font-medium text-gray-600">
            Enable the offer types this publisher supports.
          </p>
        </div>
        <div className="max-h-72 space-y-0.5 overflow-auto">
          {allOfferTypes.map((t) => {
            const Icon = t.icon;
            const on = supportedSet.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(t.id)}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    on ? "text-primary" : "text-gray-400"
                  )}
                />
                <span className="flex-1 truncate">{t.label}</span>
                {on ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-gray-300" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default OfferTypeManagePopover;
