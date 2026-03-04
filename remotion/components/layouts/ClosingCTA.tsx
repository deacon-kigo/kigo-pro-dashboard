import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GradientText, ParticleField, ShimmerBorder } from "../fx";
import { colors, gradients, springs } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface ClosingCTAProps {
  logoSrc?: string;
  ctaText: string;
  subtitle?: string;
  startFrame?: number;
}

/**
 * ClosingCTA — Final slide with logo, CTA text, and gradient.
 *
 * Features an animated gradient background, optional logo, spring-animated
 * GradientText CTA, delayed subtitle, ParticleField texture, and a
 * ShimmerBorder effect wrapping the CTA area.
 */
export const ClosingCTA: React.FC<ClosingCTAProps> = ({
  logoSrc,
  ctaText,
  subtitle,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Animated gradient background: shift the gradient angle over time
  const gradientAngle = interpolate(relativeFrame, [0, 300], [135, 225], {
    extrapolateRight: "extend",
  });

  const bgGradient = `linear-gradient(${gradientAngle}deg, ${colors.black} 0%, ${colors.blue}33 40%, ${colors.purple}44 70%, ${colors.black} 100%)`;

  // Logo fade-in
  const logoOpacity = interpolate(relativeFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoScale = interpolate(relativeFrame, [0, 25], [0.8, 1.0], {
    extrapolateRight: "clamp",
  });

  // CTA spring entrance
  const ctaProgress = spring({
    frame: Math.max(0, relativeFrame - 15),
    fps,
    config: springs.bouncy,
  });

  const ctaScale = interpolate(ctaProgress, [0, 1], [0.85, 1.0], {
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(relativeFrame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle delayed fade-in
  const subtitleDelay = 35;
  const subtitleOpacity = interpolate(
    relativeFrame,
    [subtitleDelay, subtitleDelay + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const subtitleTranslateY = interpolate(
    relativeFrame,
    [subtitleDelay, subtitleDelay + 20],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Background particle texture */}
      <ParticleField
        startFrame={startFrame}
        color={colors.purple}
        particleCount={50}
        speed={0.5}
      />

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          gap: 32,
        }}
      >
        {/* Logo */}
        {logoSrc && (
          <div
            style={{
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
              marginBottom: 24,
            }}
          >
            <Img
              src={logoSrc}
              style={{
                height: 80,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* CTA with ShimmerBorder */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
          }}
        >
          <ShimmerBorder
            borderWidth={2}
            borderRadius={20}
            startFrame={startFrame + 15}
          >
            <div
              style={{
                padding: "36px 64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GradientText
                text={ctaText}
                startFrame={startFrame + 15}
                style={{
                  ...fontStyles.heading,
                  fontSize: 68,
                  display: "block",
                  textAlign: "center",
                }}
              />
            </div>
          </ShimmerBorder>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleTranslateY}px)`,
              marginTop: 8,
            }}
          >
            <span
              style={{
                ...fontStyles.subheading,
                fontSize: 26,
                color: `${colors.white}BB`,
                textAlign: "center",
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
