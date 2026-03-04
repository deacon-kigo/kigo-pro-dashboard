import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { GlassMorphCard, GradientText } from "../fx";
import { colors } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3;
  title?: string;
  startFrame?: number;
}

/**
 * FeatureGrid — Card grid with stagger entrance animation.
 *
 * Renders features in a 2-column or 3-column CSS Grid.
 * Each card uses GlassMorphCard and staggers in by ~8 frames
 * (left-to-right, top-to-bottom order).
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 2,
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

  // Base delay for cards (after title)
  const cardsBaseDelay = title ? 15 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "60px 80px",
      }}
    >
      {/* Optional title */}
      {title && (
        <div
          style={{
            marginBottom: 48,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          <GradientText
            text={title}
            startFrame={startFrame}
            style={{
              ...fontStyles.heading,
              fontSize: 48,
            }}
          />
        </div>
      )}

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: columns === 3 ? 24 : 32,
          width: "100%",
          maxWidth: columns === 3 ? 1600 : 1200,
        }}
      >
        {features.map((feature, i) => {
          const staggerDelay = cardsBaseDelay + i * 8;

          return (
            <GlassMorphCard
              key={i}
              startFrame={startFrame + staggerDelay}
              opacity={0.1}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: columns === 3 ? 8 : 12,
                }}
              >
                {/* Icon */}
                {feature.icon && (
                  <div style={{ marginBottom: 4 }}>{feature.icon}</div>
                )}

                {/* Title */}
                <h3
                  style={{
                    ...fontStyles.subheading,
                    fontSize: columns === 3 ? 20 : 24,
                    color: colors.white,
                    margin: 0,
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    ...fontStyles.body,
                    fontSize: columns === 3 ? 14 : 16,
                    color: `${colors.white}AA`,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </GlassMorphCard>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
