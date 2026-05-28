"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { Merchant } from "./types";

interface MerchantLogoProps {
  merchant: Pick<Merchant, "name" | "website" | "color">;
  /** Pixel size of the square avatar. */
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getDomain(website: string | undefined): string | null {
  if (!website) return null;
  const stripped = website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return stripped || null;
}

// Hi-res request size for the logo CDN. Display size is still controlled by
// the rendered width/height — this is the backing asset resolution for
// retina sharpness.
const LOGO_FETCH_SIZE = 256;
const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

function logoUrl(domain: string, stage: number): string | null {
  if (stage === 0 && LOGO_DEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${LOGO_FETCH_SIZE}&format=png`;
  }
  if (stage <= 1) {
    return `https://logo.clearbit.com/${domain}?size=${LOGO_FETCH_SIZE}`;
  }
  return null;
}

/**
 * Renders a merchant's brand logo with a layered free fallback:
 *   1. Logo.dev    — primary when NEXT_PUBLIC_LOGO_DEV_TOKEN is set (best res)
 *   2. Clearbit    — no-key fallback
 *   3. Initials    — colored tile, final fallback (never fails)
 * Replaces the legacy emoji avatar.
 */
export function MerchantLogo({
  merchant,
  size = 40,
  className,
}: MerchantLogoProps) {
  const domain = getDomain(merchant.website);
  // Stage progresses on each <img> onError until we reach the initials tile.
  const [stage, setStage] = useState(LOGO_DEV_TOKEN ? 0 : 1);

  const px = `${size}px`;
  const fontSize = Math.max(11, Math.round(size * 0.4));
  const src = domain ? logoUrl(domain, stage) : null;

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md font-semibold text-gray-700 select-none",
          className
        )}
        style={{
          width: px,
          height: px,
          backgroundColor: merchant.color || "#f3f4f6",
          fontSize: `${fontSize}px`,
        }}
        aria-label={merchant.name}
      >
        {getInitials(merchant.name)}
      </div>
    );
  }

  return (
    <img
      key={stage}
      src={src}
      alt={`${merchant.name} logo`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setStage((s) => s + 1)}
      className={cn(
        "rounded-md object-contain bg-white border border-gray-100",
        className
      )}
      style={{ width: px, height: px }}
    />
  );
}
