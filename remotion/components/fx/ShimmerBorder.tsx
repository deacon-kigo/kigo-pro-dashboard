import React, { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface ShimmerBorderProps {
  children: ReactNode;
  borderWidth?: number;
  borderRadius?: number;
  startFrame?: number;
}

/**
 * ShimmerBorder — Card with a continuously rotating conic-gradient border.
 *
 * An outer container carries a spinning conic-gradient background.
 * An inner container, inset by `borderWidth`, shows the card content,
 * producing the illusion of a glowing, animated border.
 */
export const ShimmerBorder: React.FC<ShimmerBorderProps> = ({
  children,
  borderWidth = 2,
  borderRadius = 16,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Fade-in
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Full rotation every 2 seconds
  const cycleDuration = fps * 2;
  const angle = interpolate(
    relativeFrame % cycleDuration,
    [0, cycleDuration],
    [0, 360],
    { extrapolateRight: "clamp" }
  );

  const gradient = `conic-gradient(from ${angle}deg, ${colors.blue}, ${colors.purple}, ${colors.coral}, ${colors.orange}, ${colors.blue})`;

  return (
    <div
      style={{
        position: "relative",
        borderRadius,
        background: gradient,
        padding: borderWidth,
        opacity,
      }}
    >
      <div
        style={{
          borderRadius: borderRadius - borderWidth,
          background: colors.black,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
