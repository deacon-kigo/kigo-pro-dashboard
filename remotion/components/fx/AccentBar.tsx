import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors, springs } from "../../lib/brand";

interface AccentBarProps {
  color?: string;
  width?: number;
  startFrame?: number;
  /** CSS height value — number (px) or string (e.g. "100%") */
  height?: number | string;
}

/**
 * AccentBar — Vertical colored bar that slides in from the left.
 *
 * Designed to sit beside headings or section titles.
 * Uses Remotion `spring()` for a satisfying entrance with slight overshoot.
 */
export const AccentBar: React.FC<AccentBarProps> = ({
  color = colors.coral,
  width = 6,
  startFrame = 0,
  height = 48,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Spring-based slide-in: starts off-screen to the left, lands at 0
  const slideProgress = spring({
    frame: relativeFrame,
    fps,
    config: springs.snappy,
  });

  // Start 40px to the left, settle at 0
  const translateX = (1 - slideProgress) * -40;
  const opacity = slideProgress;

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      style={{
        width,
        height: resolvedHeight,
        borderRadius: width / 2,
        backgroundColor: color,
        opacity,
        transform: `translateX(${translateX}px)`,
        flexShrink: 0,
      }}
    />
  );
};
