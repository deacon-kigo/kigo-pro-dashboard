import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AccentBar } from "../fx";
import { colors, springs } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface SplitContentProps {
  heading: string;
  body?: string;
  bullets?: string[];
  rightContent: React.ReactNode;
  accentColor?: string;
  startFrame?: number;
}

/**
 * SplitContent — Left text + right media/component split layout.
 *
 * 45% left panel with heading, body/bullets, and AccentBar.
 * 55% right panel renders caller-provided content (3D scene, UI, etc.).
 * Text slides in from the left with stagger; right content fades in after.
 */
export const SplitContent: React.FC<SplitContentProps> = ({
  heading,
  body,
  bullets,
  rightContent,
  accentColor = colors.coral,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Heading entrance: slide from left + fade
  const headingProgress = spring({
    frame: relativeFrame,
    fps,
    config: springs.smooth,
  });

  const headingTranslateX = interpolate(headingProgress, [0, 1], [-60, 0], {
    extrapolateRight: "clamp",
  });

  const headingOpacity = interpolate(relativeFrame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Body/bullets entrance: staggered ~12 frames after heading
  const bodyOpacity = interpolate(relativeFrame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyTranslateX = interpolate(relativeFrame, [12, 30], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Right content fades in ~20 frames after left text starts
  const rightOpacity = interpolate(relativeFrame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightTranslateY = interpolate(relativeFrame, [20, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        flexDirection: "row",
      }}
    >
      {/* Left panel — 45% */}
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px 80px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* AccentBar + Heading row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            opacity: headingOpacity,
            transform: `translateX(${headingTranslateX}px)`,
          }}
        >
          <AccentBar color={accentColor} height={56} startFrame={startFrame} />
          <h2
            style={{
              ...fontStyles.heading,
              fontSize: 48,
              color: colors.white,
              margin: 0,
            }}
          >
            {heading}
          </h2>
        </div>

        {/* Body text */}
        {body && (
          <p
            style={{
              ...fontStyles.body,
              fontSize: 20,
              color: `${colors.white}CC`,
              marginTop: 32,
              paddingLeft: 26,
              opacity: bodyOpacity,
              transform: `translateX(${bodyTranslateX}px)`,
            }}
          >
            {body}
          </p>
        )}

        {/* Bullets */}
        {bullets && bullets.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginTop: 32,
              paddingLeft: 26,
            }}
          >
            {bullets.map((bullet, i) => {
              const bulletDelay = 12 + i * 8;
              const bulletOpacity = interpolate(
                relativeFrame,
                [bulletDelay, bulletDelay + 15],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );
              const bulletSlide = interpolate(
                relativeFrame,
                [bulletDelay, bulletDelay + 15],
                [-30, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              return (
                <li
                  key={i}
                  style={{
                    ...fontStyles.body,
                    fontSize: 20,
                    color: `${colors.white}CC`,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    opacity: bulletOpacity,
                    transform: `translateX(${bulletSlide}px)`,
                  }}
                >
                  <span
                    style={{
                      color: accentColor,
                      fontSize: 24,
                      lineHeight: 1.3,
                      flexShrink: 0,
                    }}
                  >
                    {"\u2022"}
                  </span>
                  {bullet}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Gradient divider */}
      <div
        style={{
          width: 2,
          alignSelf: "stretch",
          background: `linear-gradient(180deg, transparent 10%, ${accentColor}44 50%, transparent 90%)`,
        }}
      />

      {/* Right panel — 55% */}
      <div
        style={{
          width: "55%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          opacity: rightOpacity,
          transform: `translateY(${rightTranslateY}px)`,
        }}
      >
        {rightContent}
      </div>
    </AbsoluteFill>
  );
};
