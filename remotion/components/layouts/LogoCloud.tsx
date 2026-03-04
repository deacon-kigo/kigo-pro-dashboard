import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { GradientText } from "../fx";
import { colors, springs } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface LogoItem {
  src: string;
  alt: string;
}

interface LogoCloudProps {
  logos: LogoItem[];
  title?: string;
  startFrame?: number;
}

/**
 * LogoCloud — Staggered logo/partner grid with grayscale-to-color animation.
 *
 * Renders logos in centered rows (auto-wrapping for large sets).
 * Each logo fades in + scales with an 8-frame stagger offset,
 * transitioning from grayscale to full color.
 */
export const LogoCloud: React.FC<LogoCloudProps> = ({
  logos,
  title,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Title fade-in
  const titleOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleTranslateY = interpolate(relativeFrame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
  });

  // Base delay for logos (after title)
  const logosBaseDelay = title ? 20 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Optional title */}
      {title && (
        <div
          style={{
            marginBottom: 64,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          <GradientText
            text={title}
            startFrame={startFrame}
            style={{
              ...fontStyles.heading,
              fontSize: 44,
            }}
          />
        </div>
      )}

      {/* Logos grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 56,
          maxWidth: 1400,
          padding: "0 80px",
        }}
      >
        {logos.map((logo, i) => {
          const staggerDelay = logosBaseDelay + i * 8;
          const logoFrame = Math.max(0, relativeFrame - staggerDelay);

          // Fade + scale entrance
          const logoOpacity = interpolate(logoFrame, [0, 18], [0, 1], {
            extrapolateRight: "clamp",
          });

          const logoScale = interpolate(logoFrame, [0, 18], [0.7, 1.0], {
            extrapolateRight: "clamp",
          });

          // Grayscale to full color transition
          const grayscale = interpolate(logoFrame, [10, 35], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: logoOpacity,
                transform: `scale(${logoScale})`,
                filter: `grayscale(${grayscale})`,
              }}
            >
              <Img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: 60,
                  width: "auto",
                  maxWidth: 180,
                  objectFit: "contain",
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
