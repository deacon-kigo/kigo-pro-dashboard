import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { TypewriterText, AccentBar, Spotlight } from "../fx";
import { colors } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface QuoteCalloutProps {
  quote: string;
  author?: string;
  role?: string;
  startFrame?: number;
}

/**
 * QuoteCallout — Large testimonial/quote display.
 *
 * Features a decorative quotation mark, TypewriterText effect for the
 * quote body, delayed author/role attribution, AccentBar, and a sweeping
 * Spotlight effect for dramatic stage lighting.
 */
export const QuoteCallout: React.FC<QuoteCalloutProps> = ({
  quote,
  author,
  role,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Decorative quotation mark fade-in
  const quoteMarkOpacity = interpolate(relativeFrame, [0, 25], [0, 0.12], {
    extrapolateRight: "clamp",
  });

  const quoteMarkScale = interpolate(relativeFrame, [0, 25], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  // Estimate when typewriter finishes: text length / charsPerFrame
  const charsPerFrame = 0.8;
  const typewriterDuration = Math.ceil(quote.length / charsPerFrame);
  const authorDelay = typewriterDuration + 15;

  // Author/role fade-in after quote finishes
  const authorOpacity = interpolate(
    relativeFrame,
    [authorDelay, authorDelay + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const authorTranslateY = interpolate(
    relativeFrame,
    [authorDelay, authorDelay + 20],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Spotlight sweep */}
      <Spotlight startFrame={startFrame} size={1000} color={colors.blue} />

      {/* Left AccentBar */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <AccentBar
          color={colors.coral}
          height={200}
          width={5}
          startFrame={startFrame}
        />
      </div>

      {/* Decorative quotation mark */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 160,
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          transformOrigin: "top left",
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 240,
            fontWeight: 800,
            color: colors.blue,
            lineHeight: 1,
            display: "block",
            userSelect: "none",
          }}
        >
          {"\u201C"}
        </span>
      </div>

      {/* Quote content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 1200,
          padding: "0 160px",
          zIndex: 1,
        }}
      >
        {/* Quote text */}
        <div style={{ textAlign: "center" }}>
          <TypewriterText
            text={quote}
            startFrame={startFrame + 10}
            charsPerFrame={charsPerFrame}
            cursorColor={colors.coral}
            style={{
              ...fontStyles.body,
              fontSize: 38,
              fontStyle: "italic",
              color: colors.white,
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Author attribution */}
        {(author || role) && (
          <div
            style={{
              marginTop: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              opacity: authorOpacity,
              transform: `translateY(${authorTranslateY}px)`,
            }}
          >
            {author && (
              <span
                style={{
                  ...fontStyles.subheading,
                  fontSize: 22,
                  color: colors.white,
                }}
              >
                {author}
              </span>
            )}
            {role && (
              <span
                style={{
                  ...fontStyles.body,
                  fontSize: 16,
                  color: `${colors.white}88`,
                }}
              >
                {role}
              </span>
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
