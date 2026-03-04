import React, { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface GradientTextProps {
  text: string;
  startFrame?: number;
  colors?: string[];
  style?: CSSProperties;
}

/**
 * GradientText — Animated gradient sweep across text.
 *
 * Uses a wide linear-gradient background clipped to the text shape.
 * `interpolate()` drives `backgroundPosition` so the gradient slides
 * continuously from left to right, creating a shimmering color sweep.
 */
export const GradientText: React.FC<GradientTextProps> = ({
  text,
  startFrame = 0,
  colors: gradientColors = [colors.blue, colors.purple, colors.coral],
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Fade-in over 15 frames
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Build a repeating gradient string from the supplied colors.
  // We duplicate the first color at the end so the loop is seamless.
  const stops = [...gradientColors, gradientColors[0]]
    .map((c, i, arr) => `${c} ${(i / (arr.length - 1)) * 100}%`)
    .join(", ");

  // Cycle through 200% of background width every 2 seconds for a
  // continuous sweep.  Using modulo keeps the value bounded.
  const cycleDuration = fps * 2;
  const position = interpolate(
    relativeFrame % cycleDuration,
    [0, cycleDuration],
    [0, 200],
    { extrapolateRight: "clamp" }
  );

  return (
    <span
      style={{
        display: "inline-block",
        background: `linear-gradient(90deg, ${stops})`,
        backgroundSize: "200% 100%",
        backgroundPosition: `${position}% 50%`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        opacity,
        fontWeight: 700,
        ...style,
      }}
    >
      {text}
    </span>
  );
};
