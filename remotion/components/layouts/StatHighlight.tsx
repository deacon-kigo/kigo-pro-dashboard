import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { GradientText, NumberTicker } from "../fx";
import { colors, gradients } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

interface StatHighlightProps {
  stats: StatItem[];
  title?: string;
  startFrame?: number;
}

/**
 * StatHighlight — Large animated statistics display.
 *
 * Shows a row of stats with NumberTicker count-up animations.
 * Each stat staggers in with a 12-frame offset from the previous.
 * Divider lines separate the stats visually.
 */
export const StatHighlight: React.FC<StatHighlightProps> = ({
  stats,
  title,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Title fade-in
  const titleOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleTranslateY = interpolate(relativeFrame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: gradients.dark,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Optional title */}
      {title && (
        <div
          style={{
            marginBottom: 80,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          <GradientText
            text={title}
            startFrame={startFrame}
            style={{
              ...fontStyles.heading,
              fontSize: 52,
            }}
          />
        </div>
      )}

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "0 80px",
        }}
      >
        {stats.map((stat, i) => {
          const staggerDelay = (title ? 20 : 0) + i * 12;
          const statFrame = Math.max(0, relativeFrame - staggerDelay);

          // Per-stat fade-in
          const statOpacity = interpolate(statFrame, [0, 18], [0, 1], {
            extrapolateRight: "clamp",
          });

          const statTranslateY = interpolate(statFrame, [0, 18], [30, 0], {
            extrapolateRight: "clamp",
          });

          return (
            <React.Fragment key={i}>
              {/* Divider line (not before first stat) */}
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 80,
                    backgroundColor: `${colors.white}20`,
                    marginLeft: 60,
                    marginRight: 60,
                    opacity: statOpacity,
                  }}
                />
              )}

              {/* Stat card */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: statOpacity,
                  transform: `translateY(${statTranslateY}px)`,
                  minWidth: 180,
                }}
              >
                <NumberTicker
                  value={stat.value}
                  startFrame={startFrame + staggerDelay}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  style={{
                    ...fontStyles.heading,
                    fontSize: 84,
                    color: colors.white,
                    display: "block",
                    textAlign: "center",
                  }}
                />
                <span
                  style={{
                    ...fontStyles.label,
                    fontSize: 15,
                    color: `${colors.white}88`,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
