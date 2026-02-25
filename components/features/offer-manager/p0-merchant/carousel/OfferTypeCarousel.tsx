"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Badge } from "@/components/ui/badge";
import {
  OFFER_TYPE_CONFIG,
  P0_ACTIVE_TYPES,
  OfferTypeKey,
  OfferTypeConfig,
} from "@/lib/constants/offer-templates";

interface OfferTypeCarouselProps {
  selectedType: OfferTypeKey | null;
  onSelect: (type: OfferTypeKey) => void;
}

const ALL_TYPES = Object.values(OFFER_TYPE_CONFIG);

// Sort: active types first, then inactive — keeps clear visual grouping
const ACTIVE_TYPES = ALL_TYPES.filter((t) => P0_ACTIVE_TYPES.includes(t.key));
const INACTIVE_TYPES = ALL_TYPES.filter(
  (t) => !P0_ACTIVE_TYPES.includes(t.key)
);

const CARD_W = 140;

// Simple spring for card transitions
const cardSpring = { type: "spring" as const, stiffness: 400, damping: 30 };

export default function OfferTypeCarousel({
  selectedType,
  onSelect,
}: OfferTypeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = (CARD_W + 12) * 2;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  // Scroll selected card into view
  useEffect(() => {
    if (!selectedType || !scrollRef.current) return;
    const idx = ACTIVE_TYPES.findIndex((t) => t.key === selectedType);
    if (idx === -1) return;

    const el = scrollRef.current;
    const cardCenter = idx * (CARD_W + 12) + CARD_W / 2;
    const containerCenter = el.clientWidth / 2;
    el.scrollTo({
      left: Math.max(0, cardCenter - containerCenter),
      behavior: "smooth",
    });
  }, [selectedType]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  return (
    <div className="relative overflow-hidden">
      {/* Fade overlays */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-14 z-10 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-r from-white to-transparent",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-14 z-10 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-l from-white to-transparent",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Chevrons */}
      <button
        onClick={() => handleScroll("left")}
        className={cn(
          "absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          canScrollLeft
            ? "bg-white text-gray-600 shadow-md hover:shadow-lg"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeftIcon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => handleScroll("right")}
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
          canScrollRight
            ? "bg-white text-gray-600 shadow-md hover:shadow-lg"
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRightIcon className="w-3.5 h-3.5" />
      </button>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto px-7 py-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ── Active types ── */}
        {ACTIVE_TYPES.map((config) => (
          <ActiveCard
            key={config.key}
            config={config}
            isSelected={selectedType === config.key}
            hasSelection={!!selectedType}
            onSelect={onSelect}
          />
        ))}

        {/* ── Divider ── */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center self-stretch px-1">
          <div className="w-px flex-1 bg-gray-200" />
          <span className="text-[9px] text-gray-400 font-medium py-1.5 whitespace-nowrap">
            COMING SOON
          </span>
          <div className="w-px flex-1 bg-gray-200" />
        </div>

        {/* ── Inactive types ── */}
        {INACTIVE_TYPES.map((config) => (
          <InactiveCard key={config.key} config={config} />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
 * Active Card — selectable with motion
 * ──────────────────────────────────────────────────────────── */
function ActiveCard({
  config,
  isSelected,
  hasSelection,
  onSelect,
}: {
  config: OfferTypeConfig;
  isSelected: boolean;
  hasSelection: boolean;
  onSelect: (type: OfferTypeKey) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(config.key)}
      animate={{
        scale: isSelected ? 1.06 : 1,
        y: isSelected ? -2 : 0,
      }}
      whileHover={{ scale: isSelected ? 1.06 : 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={cardSpring}
      className={cn(
        "group relative flex-shrink-0 flex flex-col rounded-xl border-2 bg-white text-left transition-shadow duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isSelected
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300",
        hasSelection && !isSelected && "opacity-70 hover:opacity-100"
      )}
      style={{ width: CARD_W, minWidth: CARD_W }}
    >
      <div className="p-3">
        {/* Selection indicator */}
        <div
          className={cn(
            "absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200",
            isSelected
              ? "bg-primary scale-100"
              : "border-2 border-gray-200 group-hover:border-gray-300 scale-100"
          )}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <CheckIcon className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto h-14 w-14 mb-2 mt-1 overflow-hidden rounded-lg">
          <Image
            src={config.illustration}
            alt={config.label}
            fill
            className={cn("object-contain", config.illustrationClass)}
          />
        </div>

        {/* Label + description */}
        <div className="text-center">
          <h3
            className={cn(
              "text-xs font-semibold leading-tight transition-colors duration-200",
              isSelected ? "text-primary" : "text-gray-900"
            )}
          >
            {config.label}
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-500 leading-tight line-clamp-2">
            {config.description}
          </p>
        </div>

        {/* Best For — always rendered for uniform height, visibility via opacity */}
        <div
          className={cn(
            "mt-2 pt-2 border-t transition-all duration-200",
            isSelected
              ? "opacity-100 border-primary/10"
              : "opacity-0 border-transparent"
          )}
        >
          <p className="text-[9px] font-semibold text-primary/50 uppercase tracking-wider">
            Best for
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">
            {config.bestFor.slice(0, 2).join(" · ")}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

/* ────────────────────────────────────────────────────────────
 * Inactive Card — coming soon, no motion needed
 * ──────────────────────────────────────────────────────────── */
function InactiveCard({ config }: { config: OfferTypeConfig }) {
  return (
    <div
      className="relative flex-shrink-0 flex flex-col rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-3 text-left cursor-not-allowed opacity-50"
      style={{ width: CARD_W, minWidth: CARD_W }}
    >
      {/* Illustration — dimmed */}
      <div className="relative mx-auto h-14 w-14 mb-2 mt-1 overflow-hidden rounded-lg opacity-40">
        <Image
          src={config.illustration}
          alt={config.label}
          fill
          className={cn("object-contain grayscale", config.illustrationClass)}
        />
      </div>
      <div className="text-center">
        <h3 className="text-xs font-semibold text-gray-400 leading-tight">
          {config.label}
        </h3>
        <p className="mt-0.5 text-[10px] text-gray-400 leading-tight line-clamp-2">
          {config.description}
        </p>
      </div>
    </div>
  );
}
