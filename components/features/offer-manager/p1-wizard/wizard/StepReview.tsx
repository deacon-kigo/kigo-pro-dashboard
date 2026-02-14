"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  RocketLaunchIcon,
  SparklesIcon,
  CalendarDaysIcon,
  CursorArrowRaysIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  TicketIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  OFFER_TYPE_CONFIG,
  OfferTypeKey,
  formatDiscountBadge,
} from "@/lib/constants/offer-templates";
import { MerchantData } from "../MerchantHybridSearch";

/**
 * Step 4: Review & Publish
 *
 * A polished review card with:
 * - Category-aware Kigo brand color themes (blue/green/purple/amber)
 * - Soft mesh gradient background using Kigo design tokens
 * - Subtle 3D tilt effect on cursor movement
 * - Accessible text contrast
 * - Animated border glow for playfulness
 */

// ============================================================================
// KIGO BRAND COLOR THEMES
// ============================================================================
// Each theme maps to an offer category using actual Kigo design token hex values.
// The same soft gradient structure is applied, just with different colorways.
//
// Kigo Brand Colors (from tailwind.config.mjs):
//   Blue: #328FE5  |  Sky Blue: #CCFFFE  |  Pastel Blue: #E1F0FF
//   Green: #77D898 |  Light Green: #D1F7DF | Pastel Green: #DCFCE7
//   Purple: #8941EB | Light Purple: #E5D7FA | Pastel Purple: #F3E8FF
//   Orange: #FF8717 | Pastel Orange: #FFEDD5
// ============================================================================

interface ReviewTheme {
  // Soft background wash
  skyBlue: string;
  skyBlueLight: string;
  skyBlueMuted: string;
  // Primary accent
  blue: string;
  blueDark: string;
  blueLight: string;
  blueMuted: string;
  // Pastel accent
  pastelLight: string;
  pastelMuted: string;
  // Bridge accent
  primary: string;
}

const REVIEW_THEMES: Record<string, ReviewTheme> = {
  // Discount types — Kigo Blue (#328FE5) + Sky Blue (#CCFFFE)
  blue: {
    skyBlue: "#CCFFFE", // Kigo sky-blue
    skyBlueLight: "#e6ffff",
    skyBlueMuted: "#f0fffe",
    blue: "#328FE5", // Kigo blue
    blueDark: "#1d6fbf",
    blueLight: "#5aabf0",
    blueMuted: "#E1F0FF", // Kigo pastel-blue
    pastelLight: "#c7dffe",
    pastelMuted: "#E1F0FF", // Kigo pastel-blue
    primary: "#25BDFE", // Kigo dark-sky-blue
  },
  // Bundle types (BOGO) — Kigo Green (#77D898) + Light Green (#D1F7DF)
  green: {
    skyBlue: "#D1F7DF", // Kigo light-green
    skyBlueLight: "#e8fbef",
    skyBlueMuted: "#f0fdf4",
    blue: "#3da86a",
    blueDark: "#2d8a54",
    blueLight: "#77D898", // Kigo green
    blueMuted: "#DCFCE7", // Kigo pastel-green
    pastelLight: "#a7f3c0",
    pastelMuted: "#DCFCE7", // Kigo pastel-green
    primary: "#6ADFA0", // Kigo green-100
  },
  // Loyalty types (Cash Back) — Kigo Purple (#8941EB) + Light Purple (#E5D7FA)
  purple: {
    skyBlue: "#E5D7FA", // Kigo light-purple
    skyBlueLight: "#f0e8fd",
    skyBlueMuted: "#f8f4fe",
    blue: "#8941EB", // Kigo purple
    blueDark: "#6d28d9",
    blueLight: "#a366f0",
    blueMuted: "#F3E8FF", // Kigo pastel-purple
    pastelLight: "#ddd6fe",
    pastelMuted: "#F3E8FF", // Kigo pastel-purple
    primary: "#a366f0",
  },
  // Promotional types (Fixed Price) — Kigo Orange (#FF8717) + Pastel Orange (#FFEDD5)
  amber: {
    skyBlue: "#FFEDD5", // Kigo pastel-orange
    skyBlueLight: "#fff5e8",
    skyBlueMuted: "#fffaf2",
    blue: "#d97706",
    blueDark: "#b45309",
    blueLight: "#FF8717", // Kigo orange
    blueMuted: "#FFEDD5", // Kigo pastel-orange
    pastelLight: "#fde68a",
    pastelMuted: "#FFEDD5", // Kigo pastel-orange
    primary: "#f59e0b",
  },
};

/**
 * Get the review theme based on the offer type's category.
 * Maps: discount → blue, bundle → green, loyalty → purple, promotional → amber
 */
function getReviewTheme(offerType?: OfferTypeKey): ReviewTheme {
  if (!offerType) return REVIEW_THEMES.blue;
  const config = OFFER_TYPE_CONFIG[offerType];
  switch (config?.category) {
    case "bundle":
      return REVIEW_THEMES.green;
    case "loyalty":
      return REVIEW_THEMES.purple;
    case "promotional":
      return REVIEW_THEMES.amber;
    case "discount":
    default:
      return REVIEW_THEMES.blue;
  }
}

// ============================================================================
// STEP REVIEW COMPONENT
// ============================================================================

interface DiscountTier {
  minSpend: string;
  discount: string;
}

interface StepReviewProps {
  formData: {
    offerType?: OfferTypeKey;
    discountValue?: string;
    minimumSpend?: string;
    cashbackCap?: string;
    tiers?: DiscountTier[];
    merchantData?: MerchantData | null;
    offerName?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    externalUrl?: string;
    promoCode?: string;
    termsConditions?: string;
    usageLimitPerCustomer?: string;
    redemptionRollingPeriod?: string;
    // Offer Image
    offerImagePreview?: string;
    offerImageSource?: "none" | "merchant" | "custom";
    // Offer Banner
    offerBannerPreview?: string;
    offerBannerSource?: "none" | "merchant" | "custom";
    // New type fields
    freeItem?: string;
    purchaseRequirement?: string;
    clickthroughUrl?: string;
    spendAmount?: string;
    rewardValue?: string;
    qualifyingProducts?: string;
    // Markets
    markets?: string[];
    // Code type
    codeType?: string;
    codePrefix?: string;
    barcodeData?: string;
    qrData?: string;
    // Redemption method
    redemptionMethod?: string;
    redemptionInstructions?: string;
    phoneNumber?: string;
    barcodeValue?: string;
    cardNetwork?: string;
    activationInstructions?: string;
  };
  onUpdate: (field: string, value: string) => void;
  requiresApproval?: boolean;
}

function formatDateRange(start: string, end?: string): string {
  if (!start) return "";
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (!end) return `Starting ${startStr}`;

  const endDate = new Date(end);
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startStr} – ${endStr}`;
}

export default function StepReview({
  formData,
  requiresApproval = false,
}: StepReviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const offerType = formData.offerType || "dollar_off";
  const typeConfig = OFFER_TYPE_CONFIG[offerType];
  const discountValue = parseFloat(formData.discountValue || "0") || 0;
  const minimumSpend = formData.minimumSpend
    ? parseFloat(formData.minimumSpend)
    : undefined;

  // Get category-aware Kigo brand theme
  const theme = getReviewTheme(formData.offerType);

  // Check completion for required fields
  const hasTierData =
    offerType === "tiered_discount"
      ? (formData.tiers || []).some(
          (t: DiscountTier) =>
            parseFloat(t.minSpend) > 0 && parseFloat(t.discount) > 0
        )
      : true;
  const hasMinSpend =
    offerType === "dollar_off_with_min"
      ? !!formData.minimumSpend && parseFloat(formData.minimumSpend) > 0
      : true;

  // Redemption method-aware validation
  const method = formData.redemptionMethod || "online_code";
  const redemptionMethodComplete = (() => {
    switch (method) {
      case "online_code":
        return !!formData.externalUrl?.trim() && !!formData.promoCode?.trim();
      case "in_store":
        return !!formData.redemptionInstructions?.trim();
      case "phone":
        return (
          !!formData.phoneNumber?.trim() &&
          !!formData.redemptionInstructions?.trim()
        );
      case "card_linked":
        return (
          !!formData.cardNetwork && !!formData.activationInstructions?.trim()
        );
      default:
        return true;
    }
  })();

  const checks = {
    offerType: !!formData.offerType,
    merchant: !!formData.merchantData,
    headline: !!formData.offerName?.trim(),
    discount:
      offerType === "tiered_discount"
        ? hasTierData
        : !!formData.discountValue && discountValue > 0 && hasMinSpend,
    startDate: !!formData.startDate,
    redemption: redemptionMethodComplete,
  };

  const allPassed = Object.values(checks).every(Boolean);

  // Semantic group completion
  const identityComplete =
    checks.headline && checks.merchant && checks.discount;
  const timingComplete = checks.startDate;
  const redemptionComplete = checks.redemption;

  // Handle mouse move for 3D tilt effect (very subtle - 1.5 deg max)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 1.5;
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * 1.5;

    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className="flex items-start justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Main Review Card */}
      <div
        ref={cardRef}
        className="group/card relative w-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            : "rotateX(0) rotateY(0)",
          transition: isHovered
            ? "transform 0.15s ease-out"
            : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Subtle animated border glow */}
        <div
          className={cn(
            "absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-500",
            isHovered && "opacity-60"
          )}
          style={{
            background: `linear-gradient(135deg, ${theme.skyBlue}80, ${theme.pastelLight}60, ${theme.skyBlue}80)`,
            backgroundSize: "200% 200%",
            animation: isHovered ? "borderGlow 6s ease infinite" : "none",
          }}
        />

        {/* Soft outer glow */}
        <div
          className={cn(
            "absolute -inset-3 rounded-3xl transition-all duration-500",
            isHovered ? "opacity-50" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${theme.skyBlue}50 0%, ${theme.pastelMuted}30 40%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Card container */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white"
          style={{
            boxShadow: isHovered
              ? `0 25px 50px -12px ${theme.pastelLight}60, 0 0 0 1px ${theme.pastelLight}80`
              : `0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)`,
            transition: "box-shadow 0.4s ease",
          }}
        >
          {/* CSS for animated border */}
          <style jsx>{`
            @keyframes borderGlow {
              0%,
              100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
          `}</style>

          {/* ===== COHESIVE GRADIENT BACKGROUND ===== */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Single unified gradient mesh — themed to offer category */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-90"
              )}
              style={{
                background: `
                  radial-gradient(ellipse 120% 80% at 100% 0%, ${theme.skyBlue}35 0%, transparent 50%),
                  radial-gradient(ellipse 100% 60% at 0% 100%, ${theme.pastelLight}25 0%, transparent 45%),
                  radial-gradient(ellipse 80% 50% at 50% 50%, ${theme.pastelMuted}15 0%, transparent 50%),
                  linear-gradient(145deg, ${theme.skyBlueMuted}80 0%, white 40%, ${theme.pastelMuted}30 80%, white 100%)
                `,
              }}
            />

            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.blue} 1px, transparent 1px),
                                  linear-gradient(to bottom, ${theme.blue} 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse at center, black 20%, transparent 70%)",
              }}
            />
          </div>

          {/* Status indicator - top corner */}
          <div className="absolute right-6 top-6 z-10">
            {allPassed ? (
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: requiresApproval ? "#8941EB" : theme.blue,
                  boxShadow: `0 4px 20px ${requiresApproval ? "#8941EB" : theme.blue}40`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-sm font-semibold text-white">
                  {requiresApproval ? "Ready for Review" : "Ready to Publish"}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 rounded-full backdrop-blur-sm px-4 py-2 shadow-sm"
                style={{
                  backgroundColor: `${theme.blueMuted}cc`,
                  border: `1px solid ${theme.blueLight}40`,
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.blueDark }}
                >
                  {Object.values(checks).filter(Boolean).length} of{" "}
                  {Object.values(checks).length} complete
                </span>
              </div>
            )}
          </div>

          {/* ===== CARD CONTENT ===== */}
          <div className="relative z-[1]">
            {/* ===== HERO SECTION ===== */}
            <div className="px-10 pt-10 pb-8">
              <div className="flex items-start gap-8">
                {/* Offer type illustration */}
                <div
                  className={cn(
                    "relative flex-shrink-0 transition-transform duration-300",
                    isHovered && "scale-[1.02] -translate-y-0.5"
                  )}
                  style={{
                    transform: isHovered ? `translateZ(20px)` : undefined,
                  }}
                >
                  <div
                    className="relative h-32 w-32 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-lg"
                    style={{ border: `1px solid ${theme.skyBlue}` }}
                  >
                    <Image
                      src={typeConfig.illustration}
                      alt={typeConfig.label}
                      fill
                      className={cn(
                        "object-contain p-3",
                        typeConfig.illustrationClass
                      )}
                    />
                  </div>
                  {/* Discount badge */}
                  {checks.discount && (
                    <div
                      className="absolute -bottom-2 -right-2 rounded-xl px-3 py-1.5 shadow-lg"
                      style={{
                        backgroundColor: allPassed ? theme.blue : "#64748b",
                        boxShadow: allPassed
                          ? `0 4px 12px ${theme.blue}50`
                          : undefined,
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        {formatDiscountBadge(
                          offerType,
                          discountValue,
                          minimumSpend
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Offer identity */}
                <div className="flex-1 min-w-0 pt-2">
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: theme.blueMuted,
                        color: theme.blueDark,
                      }}
                    >
                      {typeConfig.label}
                    </span>
                    {identityComplete && (
                      <CheckIcon
                        className="h-5 w-5"
                        style={{ color: theme.blue }}
                      />
                    )}
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                    {formData.offerName || (
                      <span className="text-gray-400 font-normal italic">
                        Enter your offer headline...
                      </span>
                    )}
                  </h2>

                  {/* Merchant */}
                  <div className="flex items-center gap-3">
                    {formData.merchantData?.logoPreview ? (
                      <div
                        className="h-8 w-8 rounded-lg overflow-hidden bg-white flex-shrink-0"
                        style={{ border: `1px solid ${theme.skyBlue}` }}
                      >
                        <Image
                          src={formData.merchantData.logoPreview}
                          alt={formData.merchantData.dbaName || "Merchant"}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-8 w-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0"
                        style={{ border: `1px solid ${theme.skyBlue}` }}
                      >
                        <BuildingStorefrontIcon
                          className="h-4 w-4"
                          style={{ color: theme.blueLight }}
                        />
                      </div>
                    )}
                    <span className="text-base font-medium text-gray-700">
                      {formData.merchantData?.dbaName || (
                        <span className="text-gray-400 font-normal">
                          No merchant selected
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Type-specific details */}
                  {offerType === "dollar_off_with_min" &&
                    formData.minimumSpend && (
                      <div
                        className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
                        style={{
                          backgroundColor: theme.pastelMuted,
                          color: theme.blueDark,
                        }}
                      >
                        <span className="font-medium">
                          Min. spend: ${formData.minimumSpend}
                        </span>
                      </div>
                    )}
                  {offerType === "cashback" && formData.cashbackCap && (
                    <div
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
                      style={{
                        backgroundColor: theme.pastelMuted,
                        color: theme.blueDark,
                      }}
                    >
                      <span className="font-medium">
                        Max cash back: ${formData.cashbackCap}
                      </span>
                    </div>
                  )}
                  {offerType === "tiered_discount" &&
                    formData.tiers &&
                    formData.tiers.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {formData.tiers
                          .filter((t: DiscountTier) => t.minSpend && t.discount)
                          .map((tier: DiscountTier, i: number) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm mr-2"
                              style={{
                                backgroundColor: theme.pastelMuted,
                                color: theme.blueDark,
                              }}
                            >
                              <span className="font-medium">
                                Spend ${tier.minSpend} → Save ${tier.discount}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* ===== DETAILS SECTIONS ===== */}
            <div className="border-t border-gray-100/80">
              {/* Discount Details Section — for types with extra config */}
              {(offerType === "dollar_off_with_min" ||
                offerType === "cashback" ||
                offerType === "tiered_discount" ||
                offerType === "free_with_purchase" ||
                offerType === "cpg_spend_and_get") && (
                <ReviewSection
                  icon={<BanknotesIcon className="h-5 w-5" />}
                  title="Discount details"
                  complete={checks.discount}
                  theme={theme}
                >
                  <div className="space-y-4">
                    {offerType === "dollar_off_with_min" && (
                      <div className="grid grid-cols-2 gap-8">
                        <ReviewField
                          label="Discount"
                          value={
                            formData.discountValue
                              ? `$${formData.discountValue} off`
                              : null
                          }
                          placeholder="Not set"
                          theme={theme}
                        />
                        <ReviewField
                          label="Minimum Spend"
                          value={
                            formData.minimumSpend
                              ? `$${formData.minimumSpend}`
                              : null
                          }
                          placeholder="Not set"
                          theme={theme}
                        />
                      </div>
                    )}
                    {offerType === "cashback" && (
                      <div className="grid grid-cols-2 gap-8">
                        <ReviewField
                          label="Cash Back Rate"
                          value={
                            formData.discountValue
                              ? `${formData.discountValue}%`
                              : null
                          }
                          placeholder="Not set"
                          theme={theme}
                        />
                        <ReviewField
                          label="Maximum Cap"
                          value={
                            formData.cashbackCap
                              ? `$${formData.cashbackCap}`
                              : null
                          }
                          placeholder="No cap (unlimited)"
                          theme={theme}
                        />
                      </div>
                    )}
                    {offerType === "tiered_discount" && formData.tiers && (
                      <div className="space-y-2">
                        {formData.tiers
                          .filter((t: DiscountTier) => t.minSpend && t.discount)
                          .map((tier: DiscountTier, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 py-2"
                            >
                              <span
                                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                                style={{
                                  backgroundColor: theme.blueMuted,
                                  color: theme.blueDark,
                                }}
                              >
                                {i + 1}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                Spend ${tier.minSpend}
                              </span>
                              <span className="text-sm text-gray-400">→</span>
                              <span className="text-sm font-semibold text-gray-900">
                                Save ${tier.discount}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                    {offerType === "free_with_purchase" && (
                      <div className="grid grid-cols-2 gap-8">
                        <ReviewField
                          label="Free Item"
                          value={formData.discountValue || null}
                          placeholder="Not set"
                          theme={theme}
                        />
                        <ReviewField
                          label="Purchase Requirement"
                          value={formData.purchaseRequirement || null}
                          placeholder="Not set"
                          theme={theme}
                        />
                      </div>
                    )}
                    {offerType === "cpg_spend_and_get" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-8">
                          <ReviewField
                            label="Spend Amount"
                            value={
                              formData.spendAmount
                                ? `$${formData.spendAmount}`
                                : null
                            }
                            placeholder="Not set"
                            theme={theme}
                          />
                          <ReviewField
                            label="Reward"
                            value={
                              formData.discountValue
                                ? `$${formData.discountValue} back`
                                : null
                            }
                            placeholder="Not set"
                            theme={theme}
                          />
                        </div>
                        <ReviewField
                          label="Qualifying Products"
                          value={formData.qualifyingProducts || null}
                          placeholder="Not specified"
                          theme={theme}
                        />
                      </div>
                    )}
                  </div>
                </ReviewSection>
              )}

              {/* Availability Section */}
              <ReviewSection
                icon={<CalendarDaysIcon className="h-5 w-5" />}
                title="When customers can use it"
                complete={timingComplete}
                theme={theme}
              >
                <div className="grid grid-cols-2 gap-8">
                  <ReviewField
                    label="Start Date"
                    value={
                      formData.startDate
                        ? formatDateRange(formData.startDate)
                        : null
                    }
                    placeholder="Not set"
                    theme={theme}
                  />
                  <ReviewField
                    label="End Date"
                    value={
                      formData.endDate
                        ? formatDateRange(formData.endDate)
                        : null
                    }
                    placeholder="No end date (ongoing)"
                    theme={theme}
                  />
                </div>
              </ReviewSection>

              {/* Markets Section */}
              <ReviewSection
                icon={<GlobeAltIcon className="h-5 w-5" />}
                title="Where this offer is available"
                complete={true}
                theme={theme}
              >
                <div className="flex flex-wrap gap-3">
                  {(formData.markets || ["usa"]).map((m: string) => (
                    <RulePill
                      key={m}
                      label={
                        m === "usa" ? "USA" : m === "canada" ? "Canada" : m
                      }
                      value={m === "usa" ? "USD" : m === "canada" ? "CAD" : ""}
                      theme={theme}
                    />
                  ))}
                </div>
              </ReviewSection>

              {/* Redemption Section */}
              <ReviewSection
                icon={<CursorArrowRaysIcon className="h-5 w-5" />}
                title="How customers claim the offer"
                complete={redemptionComplete}
                theme={theme}
              >
                <div className="space-y-5">
                  <ReviewField
                    label="Redemption Method"
                    value={
                      method === "online_code"
                        ? "Online (Promo Code)"
                        : method === "in_store"
                          ? "In-Store (Show & Save)"
                          : method === "phone"
                            ? "Phone / Call-In"
                            : method === "card_linked"
                              ? "Card-Linked (Automatic)"
                              : "Online (Promo Code)"
                    }
                    placeholder="Not set"
                    theme={theme}
                  />

                  {/* Method-specific fields */}
                  {method === "online_code" && (
                    <>
                      <ReviewField
                        label="Redemption URL"
                        value={formData.externalUrl || null}
                        placeholder="Not set"
                        icon={<GlobeAltIcon className="h-5 w-5" />}
                        truncate
                        theme={theme}
                      />
                      <ReviewField
                        label="Promo Code"
                        value={formData.promoCode || null}
                        placeholder="Not set"
                        icon={<TicketIcon className="h-5 w-5" />}
                        mono
                        theme={theme}
                      />
                    </>
                  )}

                  {method === "in_store" && (
                    <>
                      <ReviewField
                        label="Redemption Instructions"
                        value={formData.redemptionInstructions || null}
                        placeholder="Not set"
                        theme={theme}
                      />
                      {formData.barcodeValue && (
                        <ReviewField
                          label="Barcode"
                          value={formData.barcodeValue}
                          placeholder="None"
                          mono
                          theme={theme}
                        />
                      )}
                    </>
                  )}

                  {method === "phone" && (
                    <>
                      <ReviewField
                        label="Phone Number"
                        value={formData.phoneNumber || null}
                        placeholder="Not set"
                        theme={theme}
                      />
                      <ReviewField
                        label="Redemption Instructions"
                        value={formData.redemptionInstructions || null}
                        placeholder="Not set"
                        theme={theme}
                      />
                    </>
                  )}

                  {method === "card_linked" && (
                    <>
                      <ReviewField
                        label="Card Network"
                        value={
                          formData.cardNetwork
                            ? formData.cardNetwork.charAt(0).toUpperCase() +
                              formData.cardNetwork.slice(1)
                            : null
                        }
                        placeholder="Not set"
                        theme={theme}
                      />
                      <ReviewField
                        label="Activation Instructions"
                        value={formData.activationInstructions || null}
                        placeholder="Not set"
                        theme={theme}
                      />
                    </>
                  )}
                </div>
              </ReviewSection>

              {/* Rules Section */}
              <ReviewSection
                icon={<ShieldCheckIcon className="h-5 w-5" />}
                title="Usage rules & constraints"
                complete={true}
                subtle
                theme={theme}
              >
                <div className="flex flex-wrap gap-3">
                  <RulePill
                    label="Usage Limit"
                    value={
                      formData.usageLimitPerCustomer === "unlimited"
                        ? "Unlimited"
                        : `${formData.usageLimitPerCustomer || "1"}× per customer`
                    }
                    theme={theme}
                  />
                  <RulePill
                    label="Reset Period"
                    value={
                      formData.redemptionRollingPeriod === "monthly"
                        ? "Monthly"
                        : formData.redemptionRollingPeriod === "yearly"
                          ? "Yearly"
                          : "Never"
                    }
                    theme={theme}
                  />
                  {formData.termsConditions && (
                    <RulePill label="Terms" value="Custom" theme={theme} />
                  )}
                </div>
              </ReviewSection>
            </div>

            {/* ===== FOOTER CTA ===== */}
            <div
              className="px-10 py-8"
              style={{
                background: allPassed
                  ? `linear-gradient(to right, ${theme.skyBlue}40, ${theme.pastelMuted}25, ${theme.skyBlue}30)`
                  : `linear-gradient(to right, ${theme.skyBlueMuted}50, ${theme.pastelMuted}20)`,
              }}
            >
              <div className="flex items-center gap-5">
                {allPassed ? (
                  <>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
                      style={{
                        background: requiresApproval
                          ? "linear-gradient(135deg, #8941EB, #6d28d9)"
                          : `linear-gradient(135deg, ${theme.blue}, ${theme.blueDark})`,
                        boxShadow: `0 8px 24px ${requiresApproval ? "#8941EB" : theme.blue}40`,
                      }}
                    >
                      {requiresApproval ? (
                        <ClipboardDocumentCheckIcon className="h-7 w-7 text-white" />
                      ) : (
                        <RocketLaunchIcon className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-lg font-bold flex items-center gap-2"
                        style={{
                          color: requiresApproval ? "#6d28d9" : theme.blueDark,
                        }}
                      >
                        {requiresApproval
                          ? "Ready for review"
                          : "Ready for launch"}
                        <SparklesIcon
                          className="h-5 w-5"
                          style={{
                            color: requiresApproval
                              ? "#a366f0"
                              : theme.blueLight,
                          }}
                        />
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{
                          color: requiresApproval ? "#8941EB" : theme.blue,
                        }}
                      >
                        {requiresApproval
                          ? "All required fields are complete. Click Submit for Review to send this offer for approval."
                          : "All required fields are complete. Click Publish to make this offer live."}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: theme.blueMuted,
                        border: `1px solid ${theme.blueLight}30`,
                      }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: theme.blue }}
                      >
                        {Object.values(checks).filter(Boolean).length}/
                        {Object.values(checks).length}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900">
                        Almost there
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Complete the missing fields to publish your offer.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Review Section Component
 * Groups related fields with a semantic title and completion indicator
 */
function ReviewSection({
  icon,
  title,
  complete,
  subtle,
  children,
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  complete: boolean;
  subtle?: boolean;
  children: React.ReactNode;
  theme: ReviewTheme;
}) {
  return (
    <div
      className={cn("border-b last:border-b-0", subtle ? "bg-gray-50/30" : "")}
      style={{ borderColor: `${theme.pastelLight}50` }}
    >
      <div className="px-10 py-7">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
            style={{
              backgroundColor: complete ? theme.blueMuted : "#f3f4f6",
              color: complete ? theme.blue : "#9ca3af",
            }}
          >
            {icon}
          </div>
          {/* Accessible label - darker gray for better contrast */}
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </span>
          {complete && (
            <CheckIcon
              className="h-5 w-5 ml-auto"
              style={{ color: theme.blue }}
            />
          )}
        </div>

        {/* Section content */}
        <div className="pl-[52px]">{children}</div>
      </div>
    </div>
  );
}

/**
 * Review Field Component
 * Displays a label/value pair with consistent styling
 */
function ReviewField({
  label,
  value,
  placeholder,
  icon,
  mono,
  truncate,
  theme,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  icon?: React.ReactNode;
  mono?: boolean;
  truncate?: boolean;
  theme: ReviewTheme;
}) {
  const hasValue = value !== null && value !== "";

  return (
    <div>
      {/* Accessible label - gray-500 for good contrast */}
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </dt>
      <dd className="flex items-center gap-2">
        {icon && (
          <span style={{ color: hasValue ? theme.blueLight : "#d1d5db" }}>
            {icon}
          </span>
        )}
        {hasValue ? (
          mono ? (
            <code
              className="text-base font-semibold text-gray-900 px-3 py-1.5 rounded-lg font-mono"
              style={{ backgroundColor: theme.blueMuted }}
            >
              {value}
            </code>
          ) : (
            <span
              className={cn(
                "text-base font-semibold text-gray-900",
                truncate && "truncate max-w-md"
              )}
            >
              {value}
            </span>
          )
        ) : (
          <span className="text-base text-gray-400 italic">{placeholder}</span>
        )}
      </dd>
    </div>
  );
}

/**
 * Rule Pill Component
 * Compact label/value for usage constraints
 */
function RulePill({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReviewTheme;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm"
      style={{ border: `1px solid ${theme.pastelLight}60` }}
    >
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

export { StepReview };
