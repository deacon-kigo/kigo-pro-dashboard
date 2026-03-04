import React, { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, springs } from "../../lib/brand";

interface CalloutBoxProps {
  children: ReactNode;
  accentColor?: string;
  startFrame?: number;
  backgroundColor?: string;
}

/**
 * CalloutBox — Bordered callout card with a rounded left-edge accent.
 *
 * Entrance: the left accent bar springs in first, then the card body
 * fades in with a slight rightward slide.
 */
export const CalloutBox: React.FC<CalloutBoxProps> = ({
  children,
  accentColor = colors.blue,
  startFrame = 0,
  backgroundColor = `${colors.white}0D`, // ~5% opacity
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Accent bar springs in
  const accentProgress = spring({
    frame: relativeFrame,
    fps,
    config: springs.snappy,
  });

  // Body fades in slightly after the bar
  const bodyOpacity = interpolate(relativeFrame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyTranslateX = interpolate(relativeFrame, [6, 22], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent bar scale (height grows from 0 to full)
  const accentScaleY = accentProgress;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor,
        border: `1px solid ${colors.white}15`,
      }}
    >
      {/* Left accent */}
      <div
        style={{
          width: 6,
          flexShrink: 0,
          backgroundColor: accentColor,
          borderRadius: "6px 0 0 6px",
          transform: `scaleY(${accentScaleY})`,
          transformOrigin: "top",
        }}
      />
      {/* Body */}
      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          opacity: bodyOpacity,
          transform: `translateX(${bodyTranslateX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
