import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface AnimatedBeamProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startFrame?: number;
  color?: string;
  /** Stroke width of the beam */
  strokeWidth?: number;
}

/**
 * AnimatedBeam — SVG line connecting two points with a travelling glow.
 *
 * A dashed stroke is animated via `strokeDashoffset` so the bright
 * segment appears to travel along the line.  An SVG glow filter adds
 * the neon effect.
 */
export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  startFrame = 0,
  color = colors.blue,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Compute total line length for dash calculations
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Fade the beam in over 20 frames
  const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Animate dash offset — one full cycle every 2 seconds
  const cycleDuration = fps * 2;
  const dashOffset = interpolate(
    relativeFrame % cycleDuration,
    [0, cycleDuration],
    [0, -length * 2],
    { extrapolateRight: "clamp" }
  );

  // Unique filter ID to avoid SVG id collisions when multiple beams exist
  const filterId = `beam-glow-${fromX}-${fromY}-${toX}-${toY}`;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Faint base line */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.15}
      />

      {/* Animated bright segment */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${length * 0.3} ${length * 0.7}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};
