import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientText, GridPattern, ParticleField } from "../fx";
import { colors, gradients, springs } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface HeroTitleProps {
  title: string;
  subtitle?: string;
  backgroundEffect?: "grid" | "particles" | "gradient";
  startFrame?: number;
}

/**
 * HeroTitle — Full-screen title card with background effects.
 *
 * Apple-keynote-style title card with a dark background, animated
 * background effect, spring-scaled GradientText title, and a delayed
 * subtitle fade-in.
 */
export const HeroTitle: React.FC<HeroTitleProps> = ({
  title,
  subtitle,
  backgroundEffect = "grid",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Title entrance: spring scale from 0.85 to 1.0 + fade
  const titleScale = spring({
    frame: relativeFrame,
    fps,
    config: springs.smooth,
  });

  const titleOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const mappedScale = interpolate(titleScale, [0, 1], [0.85, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle fades in ~15 frames after title starts
  const subtitleOpacity = interpolate(relativeFrame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleTranslateY = interpolate(relativeFrame, [15, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background effect layer */}
      {backgroundEffect === "grid" && (
        <GridPattern startFrame={startFrame} color={colors.charcoal} />
      )}
      {backgroundEffect === "particles" && (
        <ParticleField
          startFrame={startFrame}
          color={colors.blue}
          particleCount={80}
        />
      )}
      {backgroundEffect === "gradient" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: gradients.hero,
            opacity: interpolate(relativeFrame, [0, 30], [0, 0.6], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          padding: "0 120px",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${mappedScale})`,
          }}
        >
          <GradientText
            text={title}
            startFrame={startFrame}
            style={{
              ...fontStyles.heading,
              fontSize: 90,
              display: "block",
            }}
          />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              marginTop: 28,
            }}
          >
            <span
              style={{
                ...fontStyles.subheading,
                fontSize: 32,
                color: `${colors.white}BB`,
                display: "block",
              }}
            >
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
