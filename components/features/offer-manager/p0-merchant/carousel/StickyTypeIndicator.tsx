"use client";

import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
} from "@/lib/constants/offer-templates";
import { cn } from "@/lib/utils";

interface StickyTypeIndicatorProps {
  selectedType: OfferTypeKey;
  onChangeClick: () => void;
  locked?: boolean;
}

export default function StickyTypeIndicator({
  selectedType,
  onChangeClick,
  locked = false,
}: StickyTypeIndicatorProps) {
  const config = OFFER_TYPE_CONFIG[selectedType];
  if (!config) return null;

  return (
    <div className="sticky top-0 z-10">
      <div className="bg-white px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 rounded-md border border-primary/20 bg-primary/[0.02] px-3 py-2.5">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={config.illustration}
              alt={config.label}
              fill
              className={cn("object-contain", config.illustrationClass)}
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-primary truncate">
              {config.label}
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight truncate">
              {config.description}
            </span>
          </div>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: "#16a34a", color: "#ffffff" }}
          >
            Complete
          </span>
          {locked ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <LockClosedIcon className="h-3 w-3" />
              Locked
            </span>
          ) : (
            <button
              type="button"
              onClick={onChangeClick}
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors flex-shrink-0"
            >
              Change
              <ChevronDownIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      <div className="h-3 bg-gradient-to-b from-white to-transparent pointer-events-none" />
    </div>
  );
}
