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
 * - Soft mesh gradient background (sky blue + brand blue)
 * - Subtle 3D tilt effect on cursor movement
 * - Accessible text contrast
 * - Animated border glow for playfulness
 */

// Brand colors - sky blue + brand blue + pastel accent palette
const BRAND = {
  // Sky blue family (cyan tones)
  skyBlue: "#ccfffe",
  skyBlueLight: "#e6ffff",
  skyBlueMuted: "#f0fffe",
  // Brand blue family
  blue: "#2563eb", // blue-600
  blueDark: "#1d4ed8", // blue-700
  blueLight: "#3b82f6", // blue-500
  blueMuted: "#dbeafe", // blue-100
  // Pastel accent (periwinkle/lavender tones for contrast)
  pastelBlue: "#a5b4fc", // indigo-300 - soft purple-blue
  pastelLight: "#c7d2fe", // indigo-200 - lighter lavender
  pastelMuted: "#e0e7ff", // indigo-100 - very soft
  // Combined accent
  primary: "#0ea5e9", // sky-500 (bridge between sky and blue)
  primaryDark: "#0284c7", // sky-600
};

interface StepReviewProps {
  formData: {
    offerType?: OfferTypeKey;
    discountValue?: string;
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
  };
  onUpdate: (field: string, value: string) => void;
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

export default function StepReview({ formData }: StepReviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const offerType = formData.offerType || "dollar_off";
  const typeConfig = OFFER_TYPE_CONFIG[offerType];
  const discountValue = parseFloat(formData.discountValue || "0") || 0;

  // Check completion for required fields
  const checks = {
    offerType: !!formData.offerType,
    merchant: !!formData.merchantData,
    headline: !!formData.offerName?.trim(),
    discount: !!formData.discountValue && discountValue > 0,
    startDate: !!formData.startDate,
    redemptionUrl: !!formData.externalUrl?.trim(),
    promoCode: !!formData.promoCode?.trim(),
  };

  const allPassed = Object.values(checks).every(Boolean);

  // Semantic group completion
  const identityComplete =
    checks.headline && checks.merchant && checks.discount;
  const timingComplete = checks.startDate;
  const redemptionComplete = checks.redemptionUrl && checks.promoCode;

  // Handle mouse move for 3D tilt effect (very subtle - 1.5 deg max)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on cursor position (max 1.5 degrees for subtle effect)
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
            background: `linear-gradient(135deg, ${BRAND.skyBlue}80, ${BRAND.pastelLight}60, ${BRAND.skyBlue}80)`,
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
            background: `radial-gradient(ellipse at 50% 50%, ${BRAND.skyBlue}50 0%, ${BRAND.pastelMuted}30 40%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Card container */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white"
          style={{
            boxShadow: isHovered
              ? `0 25px 50px -12px rgba(165, 180, 252, 0.25), 0 0 0 1px rgba(199, 210, 254, 0.5)`
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
            {/* Single unified gradient mesh */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-90"
              )}
              style={{
                background: `
                  radial-gradient(ellipse 120% 80% at 100% 0%, ${BRAND.skyBlue}35 0%, transparent 50%),
                  radial-gradient(ellipse 100% 60% at 0% 100%, ${BRAND.pastelLight}25 0%, transparent 45%),
                  radial-gradient(ellipse 80% 50% at 50% 50%, ${BRAND.pastelMuted}15 0%, transparent 50%),
                  linear-gradient(145deg, ${BRAND.skyBlueMuted}80 0%, white 40%, ${BRAND.pastelMuted}30 80%, white 100%)
                `,
              }}
            />

            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `linear-gradient(to right, ${BRAND.blue} 1px, transparent 1px),
                                  linear-gradient(to bottom, ${BRAND.blue} 1px, transparent 1px)`,
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
                  backgroundColor: BRAND.blue,
                  boxShadow: `0 4px 20px ${BRAND.blue}40`,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <span className="text-sm font-semibold text-white">
                  Ready to Publish
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 rounded-full backdrop-blur-sm px-4 py-2 shadow-sm"
                style={{
                  backgroundColor: `${BRAND.blueMuted}cc`,
                  border: `1px solid ${BRAND.blueLight}40`,
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: BRAND.blueDark }}
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
                    style={{ border: `1px solid ${BRAND.skyBlue}` }}
                  >
                    <Image
                      src={typeConfig.illustration}
                      alt={typeConfig.label}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  {/* Discount badge */}
                  {checks.discount && (
                    <div
                      className="absolute -bottom-2 -right-2 rounded-xl px-3 py-1.5 shadow-lg"
                      style={{
                        backgroundColor: allPassed ? BRAND.blue : "#64748b",
                        boxShadow: allPassed
                          ? `0 4px 12px ${BRAND.blue}50`
                          : undefined,
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        {formatDiscountBadge(offerType, discountValue)}
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
                        backgroundColor: BRAND.blueMuted,
                        color: BRAND.blueDark,
                      }}
                    >
                      {typeConfig.label}
                    </span>
                    {identityComplete && (
                      <CheckIcon
                        className="h-5 w-5"
                        style={{ color: BRAND.blue }}
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
                        style={{ border: `1px solid ${BRAND.skyBlue}` }}
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
                        style={{ border: `1px solid ${BRAND.skyBlue}` }}
                      >
                        <BuildingStorefrontIcon
                          className="h-4 w-4"
                          style={{ color: BRAND.blueLight }}
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
                </div>
              </div>
            </div>

            {/* ===== DETAILS SECTIONS ===== */}
            <div className="border-t border-gray-100/80">
              {/* Availability Section */}
              <ReviewSection
                icon={<CalendarDaysIcon className="h-5 w-5" />}
                title="When customers can use it"
                complete={timingComplete}
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
                  />
                  <ReviewField
                    label="End Date"
                    value={
                      formData.endDate
                        ? formatDateRange(formData.endDate)
                        : null
                    }
                    placeholder="No end date (ongoing)"
                  />
                </div>
              </ReviewSection>

              {/* Redemption Section */}
              <ReviewSection
                icon={<CursorArrowRaysIcon className="h-5 w-5" />}
                title="How customers claim the offer"
                complete={redemptionComplete}
              >
                <div className="space-y-5">
                  <ReviewField
                    label="Redemption URL"
                    value={formData.externalUrl || null}
                    placeholder="Not set"
                    icon={<GlobeAltIcon className="h-5 w-5" />}
                    truncate
                  />
                  <ReviewField
                    label="Promo Code"
                    value={formData.promoCode || null}
                    placeholder="Not set"
                    icon={<TicketIcon className="h-5 w-5" />}
                    mono
                  />
                </div>
              </ReviewSection>

              {/* Rules Section */}
              <ReviewSection
                icon={<ShieldCheckIcon className="h-5 w-5" />}
                title="Usage rules & constraints"
                complete={true}
                subtle
              >
                <div className="flex flex-wrap gap-3">
                  <RulePill
                    label="Usage Limit"
                    value={
                      formData.usageLimitPerCustomer === "unlimited"
                        ? "Unlimited"
                        : `${formData.usageLimitPerCustomer || "1"}× per customer`
                    }
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
                  />
                  {formData.termsConditions && (
                    <RulePill label="Terms" value="Custom" />
                  )}
                </div>
              </ReviewSection>
            </div>

            {/* ===== FOOTER CTA ===== */}
            <div
              className="px-10 py-8"
              style={{
                background: allPassed
                  ? `linear-gradient(to right, ${BRAND.skyBlue}40, ${BRAND.pastelMuted}25, ${BRAND.skyBlue}30)`
                  : `linear-gradient(to right, ${BRAND.skyBlueMuted}50, ${BRAND.pastelMuted}20)`,
              }}
            >
              <div className="flex items-center gap-5">
                {allPassed ? (
                  <>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.blueDark})`,
                        boxShadow: `0 8px 24px ${BRAND.blue}40`,
                      }}
                    >
                      <RocketLaunchIcon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-lg font-bold flex items-center gap-2"
                        style={{ color: BRAND.blueDark }}
                      >
                        Ready for launch
                        <SparklesIcon
                          className="h-5 w-5"
                          style={{ color: BRAND.blueLight }}
                        />
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: BRAND.blue }}
                      >
                        All required fields are complete. Click Publish to make
                        this offer live.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: BRAND.blueMuted,
                        border: `1px solid ${BRAND.blueLight}30`,
                      }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{ color: BRAND.blue }}
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
}: {
  icon: React.ReactNode;
  title: string;
  complete: boolean;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("border-b last:border-b-0", subtle ? "bg-gray-50/30" : "")}
      style={{ borderColor: `${BRAND.pastelLight}50` }}
    >
      <div className="px-10 py-7">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
            style={{
              backgroundColor: complete ? BRAND.blueMuted : "#f3f4f6",
              color: complete ? BRAND.blue : "#9ca3af",
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
              style={{ color: BRAND.blue }}
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
}: {
  label: string;
  value: string | null;
  placeholder: string;
  icon?: React.ReactNode;
  mono?: boolean;
  truncate?: boolean;
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
          <span style={{ color: hasValue ? BRAND.blueLight : "#d1d5db" }}>
            {icon}
          </span>
        )}
        {hasValue ? (
          mono ? (
            <code
              className="text-base font-semibold text-gray-900 px-3 py-1.5 rounded-lg font-mono"
              style={{ backgroundColor: BRAND.blueMuted }}
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
function RulePill({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm"
      style={{ border: `1px solid ${BRAND.pastelLight}60` }}
    >
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}

export { StepReview };
