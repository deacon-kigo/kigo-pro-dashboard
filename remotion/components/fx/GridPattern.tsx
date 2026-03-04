import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface GridPatternProps {
  dotSize?: number;
  gap?: number;
  startFrame?: number;
  /** Radius of the radial fade mask (percentage of container) */
  fadeRadius?: number;
  color?: string;
}

/**
 * GridPattern — SVG dot grid background with a radial gradient fade mask
 * and subtle parallax drift driven by the current frame.
 *
 * The pattern is defined as an SVG `<pattern>` and filled into a full-size
 * rect.  A second rect with a radial gradient mask fades the edges.
 */
export const GridPattern: React.FC<GridPatternProps> = ({
  dotSize = 2,
  gap = 32,
  startFrame = 0,
  fadeRadius = 70,
  color = colors.charcoal,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Fade-in
  const opacity = interpolate(relativeFrame, [0, 30], [0, 0.5], {
    extrapolateRight: "clamp",
  });

  // Subtle parallax drift — moves the pattern origin
  const t = relativeFrame / fps;
  const offsetX = Math.sin(t * 0.3) * 8;
  const offsetY = Math.cos(t * 0.2) * 6;

  const patternId = "grid-dot-pattern";
  const maskId = "grid-radial-mask";
  const cellSize = gap;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Dot pattern tile */}
        <pattern
          id={patternId}
          x={offsetX}
          y={offsetY}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={cellSize / 2}
            cy={cellSize / 2}
            r={dotSize}
            fill={color}
          />
        </pattern>

        {/* Radial fade mask — center is opaque, edges are transparent */}
        <radialGradient id={maskId} cx="50%" cy="50%" r={`${fadeRadius}%`}>
          <stop offset="0%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </radialGradient>

        <mask id={`${maskId}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${maskId})`} />
        </mask>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${maskId}-mask)`}
      />
    </svg>
  );
};
