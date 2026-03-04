import React, { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface SpotlightCardProps {
  children: ReactNode;
  startFrame?: number;
  spotlightColor?: string;
}

/**
 * SpotlightCard — Card with an animated radial spotlight tracing an
 * elliptical path across the surface.
 *
 * A radial-gradient overlay moves in a smooth figure-8-ish ellipse
 * driven entirely by `interpolate()` + trigonometry on the current frame.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  startFrame = 0,
  spotlightColor = colors.blue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Fade-in
  const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Spotlight follows an elliptical path — one full loop every 3 seconds.
  const cycleDuration = fps * 3;
  const progress = interpolate(
    relativeFrame % cycleDuration,
    [0, cycleDuration],
    [0, Math.PI * 2],
    { extrapolateRight: "clamp" }
  );

  // X oscillates 20–80%, Y oscillates 30–70%
  const spotX = 50 + 30 * Math.cos(progress);
  const spotY = 50 + 20 * Math.sin(progress);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        background: colors.black,
        overflow: "hidden",
        opacity,
      }}
    >
      {/* Spotlight overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${spotX}% ${spotY}%, ${spotlightColor}33 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
