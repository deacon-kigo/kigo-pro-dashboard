"use client";

import React, { forwardRef } from "react";
import type { PremadeCampaign } from "./types";
import { discountLabel } from "./utils";

interface CampaignCreativeProps {
  campaign: PremadeCampaign;
  /** Render width in px; the SVG scales to a 1200x630 marketing canvas. */
  width?: number;
  className?: string;
}

const CANVAS_W = 1200;
const CANVAS_H = 630;

/**
 * The "static image" marketing creative for a pre-made campaign. Rendered as an
 * inline SVG so it can be shown in the catalog, on the detail hero, and exported
 * as a downloadable PNG for the dealer to drop into their CMS / call to action.
 *
 * Brand hex values are intentional artwork (not UI chrome), consistent with how
 * client brand colors are defined elsewhere in the prototype.
 */
export const CampaignCreative = forwardRef<
  SVGSVGElement,
  CampaignCreativeProps
>(function CampaignCreative({ campaign, width = 600, className }, ref) {
  const height = (width * CANVAS_H) / CANVAS_W;
  const green = "#367C2B";
  const yellow = "#FFDE00";
  const headline = discountLabel(campaign).toUpperCase();

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width={width}
      height={height}
      role="img"
      aria-label={`${campaign.name} marketing creative`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bg-${campaign.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={green} />
          <stop offset="100%" stopColor="#234d1c" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect
        width={CANVAS_W}
        height={CANVAS_H}
        fill={`url(#bg-${campaign.id})`}
      />

      {/* Yellow accent bar */}
      <rect x="0" y="0" width="18" height={CANVAS_H} fill={yellow} />

      {/* Brand row */}
      <text
        x="80"
        y="110"
        fill={yellow}
        fontFamily="Inter, Arial, sans-serif"
        fontSize="34"
        fontWeight="800"
        letterSpacing="2"
      >
        JOHN DEERE
      </text>
      <text
        x="80"
        y="150"
        fill="#ffffff"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="22"
        fontWeight="500"
        opacity="0.85"
      >
        Everglades Equipment · Perks
      </text>

      {/* Headline discount */}
      <text
        x="80"
        y="320"
        fill={yellow}
        fontFamily="Inter, Arial, sans-serif"
        fontSize="150"
        fontWeight="900"
      >
        {headline}
      </text>

      {/* Campaign name */}
      <text
        x="80"
        y="400"
        fill="#ffffff"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="50"
        fontWeight="700"
      >
        {campaign.name}
      </text>

      {/* Tagline */}
      <text
        x="80"
        y="455"
        fill="#ffffff"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="30"
        fontWeight="400"
        opacity="0.9"
      >
        {campaign.tagline}
      </text>

      {/* CTA pill */}
      <g>
        <rect x="80" y="510" width="360" height="74" rx="37" fill={yellow} />
        <text
          x="260"
          y="557"
          fill={green}
          fontFamily="Inter, Arial, sans-serif"
          fontSize="30"
          fontWeight="800"
          textAnchor="middle"
        >
          Shop the deal →
        </text>
      </g>

      {/* Fine print */}
      <text
        x="1120"
        y="600"
        fill="#ffffff"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="20"
        fontWeight="400"
        opacity="0.7"
        textAnchor="end"
      >
        {campaign.constraints.minSpend != null
          ? `Min spend $${campaign.constraints.minSpend.toLocaleString()}`
          : "See dealer for details"}
        {campaign.constraints.maxDiscount != null
          ? ` · Max $${campaign.constraints.maxDiscount.toLocaleString()}`
          : ""}
      </text>
    </svg>
  );
});

/**
 * Serialize a rendered creative SVG element to a PNG and trigger a download.
 * Used by the CMS asset section so the dealer can grab a ready-to-post image.
 */
export async function downloadCreativePng(
  svg: SVGSVGElement,
  filename: string
): Promise<void> {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to render PNG"));
          return;
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        resolve();
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG for export"));
    };
    img.src = url;
  });
}

export default CampaignCreative;
