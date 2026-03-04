import React, { ReactNode } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface GlassMorphCardProps {
  children: ReactNode;
  startFrame?: number;
  opacity?: number;
}

/**
 * GlassMorphCard — Frosted-glass card with backdrop blur and a
 * semi-transparent background.
 *
 * Entrance animation: simultaneous fade-in + slight upward slide
 * driven by `interpolate()`.
 */
export const GlassMorphCard: React.FC<GlassMorphCardProps> = ({
  children,
  startFrame = 0,
  opacity: bgOpacity = 0.12,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  const fadeIn = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(relativeFrame, [0, 20], [24, 0], {
    extrapolateRight: "clamp",
  });

  // Convert the hex bgOpacity to a rgba white value
  const bgAlpha = Math.round(bgOpacity * 255)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      style={{
        opacity: fadeIn,
        transform: `translateY(${translateY}px)`,
        borderRadius: 20,
        padding: 32,
        background: `${colors.white}${bgAlpha}`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${colors.white}22`,
        boxShadow: `0 8px 32px ${colors.black}1a`,
      }}
    >
      {children}
    </div>
  );
};
