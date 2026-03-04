import React, { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { springs } from "../../lib/brand";

interface NumberTickerProps {
  value: number;
  startFrame?: number;
  /** Duration of the count-up in frames (used with spring damping) */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to display */
  decimals?: number;
  style?: CSSProperties;
}

/**
 * NumberTicker — Odometer-style counting animation from 0 to `value`.
 *
 * Uses Remotion `spring()` for a natural ease-out curve.
 * The displayed number at any given frame is simply `spring * value`,
 * formatted with the requested decimal precision.
 */
export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  startFrame = 0,
  duration = 60,
  prefix = "",
  suffix = "",
  decimals = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // spring() returns 0 → 1, shaped by the spring config
  const progress = spring({
    frame: relativeFrame,
    fps,
    config: {
      ...springs.smooth,
      // Override stiffness based on desired duration — lower stiffness = slower
      stiffness: Math.max(20, 180 / (duration / fps)),
    },
    durationInFrames: duration,
  });

  const displayed = (progress * value).toFixed(decimals);

  // Add thousand-separator commas
  const formatted = Number(displayed).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        fontWeight: 700,
        ...style,
      }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
