import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface SpotlightProps {
  startFrame?: number;
  color?: string;
  /** Diameter of the spotlight in pixels */
  size?: number;
  /** Frames for one full left-to-right sweep */
  sweepDuration?: number;
}

/**
 * Spotlight — Large radial light that sweeps across the scene.
 *
 * A radial-gradient overlay moves its center from left to right
 * (and back) over the given `sweepDuration`, creating a dramatic
 * stage-light effect.
 */
export const Spotlight: React.FC<SpotlightProps> = ({
  startFrame = 0,
  color = colors.white,
  size = 800,
  sweepDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  const effectiveSweep = sweepDuration ?? fps * 3; // default 3-second sweep

  // Fade-in
  const opacity = interpolate(relativeFrame, [0, 15], [0, 0.25], {
    extrapolateRight: "clamp",
  });

  // Ping-pong sweep: 0→100→0 using triangle wave
  const linearProgress = (relativeFrame % effectiveSweep) / effectiveSweep;
  const pingPong =
    linearProgress <= 0.5 ? linearProgress * 2 : 2 - linearProgress * 2;

  // Map to x-position percentage
  const xPercent = interpolate(pingPong, [0, 1], [10, 90]);

  // Slight vertical drift
  const yPercent = 40 + 10 * Math.sin((relativeFrame / fps) * 0.5);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle ${size}px at ${xPercent}% ${yPercent}%, ${color}22 0%, transparent 70%)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
