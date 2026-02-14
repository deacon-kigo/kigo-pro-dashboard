"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  SparklesIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  OFFER_TYPE_CONFIG,
  OFFER_CATEGORIES,
  OfferTypeKey,
  OfferCategory,
} from "@/lib/constants/offer-templates";

/**
 * Step 1: Offer Type Selection
 *
 * Scalable template selection with:
 * - Category filtering (collapsible for future growth)
 * - Search capability
 * - Clean card design with illustrations
 * - Progressive disclosure
 */

interface StepOfferTypeProps {
  selectedType: OfferTypeKey | null;
  onSelect: (type: OfferTypeKey) => void;
  locked?: boolean;
}

const POPULAR_TYPES: OfferTypeKey[] = ["percent_off", "dollar_off"];

export default function StepOfferType({
  selectedType,
  onSelect,
  locked = false,
}: StepOfferTypeProps) {
  const [activeCategory, setActiveCategory] = useState<OfferCategory | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const allTypes = Object.values(OFFER_TYPE_CONFIG);
  const categories = Object.entries(OFFER_CATEGORIES) as [
    OfferCategory,
    { label: string; description: string },
  ][];

  // Filter types based on category and search
  const filteredTypes = allTypes.filter((type) => {
    const matchesCategory =
      activeCategory === "all" || type.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      type.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Locked view for published offers being edited
  if (locked && selectedType) {
    const lockedConfig = OFFER_TYPE_CONFIG[selectedType];
    return (
      <div className="space-y-5">
        <div className="rounded-xl border-2 border-gray-200 bg-gray-50/50 p-6">
          <div className="flex items-start gap-5">
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={lockedConfig.illustration}
                alt={lockedConfig.label}
                fill
                className={cn(
                  "object-contain opacity-60",
                  lockedConfig.illustrationClass
                )}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {lockedConfig.label}
                </h3>
                <LockClosedIcon className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                {lockedConfig.description}
              </p>
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <LockClosedIcon className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Offer type cannot be changed after publishing. Create a new
                  offer to use a different type.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar: Categories + Search */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
        {/* Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
              activeCategory === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            All
          </button>
          {categories.map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                activeCategory === key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-52">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Type Grid */}
      {filteredTypes.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active offer types */}
          {filteredTypes.map((type) => {
            const isSelected = selectedType === type.key;
            const isPopular = POPULAR_TYPES.includes(type.key);

            return (
              <button
                key={type.key}
                type="button"
                onClick={() => onSelect(type.key as OfferTypeKey)}
                className={cn(
                  "group relative flex flex-col rounded-xl border-2 bg-white p-4 text-left transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isSelected
                    ? "border-primary ring-1 ring-primary/20 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {/* Popular Badge */}
                {isPopular && !isSelected && (
                  <Badge className="absolute -top-2 left-3 bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-0.5">
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}

                {/* Selection Indicator */}
                <div
                  className={cn(
                    "absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full transition-all",
                    isSelected
                      ? "bg-primary"
                      : "border-2 border-gray-200 group-hover:border-gray-300"
                  )}
                >
                  {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                </div>

                {/* Illustration */}
                <div className="relative mx-auto h-20 w-20 mb-3 mt-1 overflow-hidden rounded-lg">
                  <Image
                    src={type.illustration}
                    alt={type.label}
                    fill
                    className={cn(
                      "object-contain transition-transform duration-200",
                      "group-hover:scale-105",
                      isSelected && "scale-105",
                      type.illustrationClass
                    )}
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isSelected ? "text-primary" : "text-gray-900"
                    )}
                  >
                    {type.label}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {type.description}
                  </p>
                </div>

                {/* Best For - on hover or selected */}
                <div
                  className={cn(
                    "mt-3 pt-3 border-t border-gray-100 transition-opacity duration-200",
                    "opacity-0 group-hover:opacity-100",
                    isSelected && "opacity-100"
                  )}
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Best for
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {type.bestFor.slice(0, 2).join(" · ")}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Coming Soon placeholders (Gap 8) */}
          {activeCategory === "all" && !searchQuery && (
            <>
              {[
                {
                  label: "Subscription Offers",
                  description: "Recurring offers with subscription mechanics",
                  badge: "Coming Q2",
                },
                {
                  label: "Merchant Direct / ampliFI",
                  description: "Direct merchant-funded redemption",
                  badge: "Coming Q2",
                },
              ].map((placeholder) => (
                <div
                  key={placeholder.label}
                  className="relative flex flex-col rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 text-left opacity-60 cursor-not-allowed"
                >
                  <Badge className="absolute -top-2 left-3 bg-gray-100 text-gray-500 border-gray-300 text-xs px-2 py-0.5">
                    {placeholder.badge}
                  </Badge>
                  <div className="relative mx-auto h-20 w-20 mb-3 mt-1 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-500">
                      {placeholder.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                      {placeholder.description}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600 font-medium">No templates found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-3 text-sm text-primary font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Selected Type Detail Panel - Fixed height to prevent layout shift */}
      <div
        className={cn(
          "rounded-lg p-4 border transition-all duration-300",
          selectedType
            ? "bg-primary/5 border-primary/10 opacity-100"
            : "bg-gray-50 border-gray-100 opacity-60"
        )}
      >
        {selectedType ? (
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={OFFER_TYPE_CONFIG[selectedType].illustration}
                alt=""
                fill
                className={cn(
                  "object-contain",
                  OFFER_TYPE_CONFIG[selectedType].illustrationClass
                )}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {OFFER_TYPE_CONFIG[selectedType].label}
              </p>
              <p className="text-sm text-gray-600 italic">
                Example: "{OFFER_TYPE_CONFIG[selectedType].example}"
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 h-12">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
            <p className="text-sm text-gray-500">
              Select a template above to see an example
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { StepOfferType };
