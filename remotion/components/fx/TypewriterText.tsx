import React, { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  /** Characters revealed per frame (supports fractional values) */
  charsPerFrame?: number;
  cursorColor?: string;
  style?: CSSProperties;
}

/**
 * TypewriterText — Character-by-character text reveal with a blinking cursor.
 *
 * Visible character count is derived directly from `useCurrentFrame()`.
 * The cursor blinks on/off every 15 frames — no `useState` needed.
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.5,
  cursorColor = colors.coral,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Number of visible characters — clamped to text length
  const charCount = Math.min(
    text.length,
    Math.floor(relativeFrame * charsPerFrame)
  );
  const visibleText = text.slice(0, charCount);

  // Typing is "done" when all characters are shown
  const isDone = charCount >= text.length;

  // Cursor blinks every 15 frames (on for 15, off for 15)
  const cursorVisible = isDone
    ? Math.floor(relativeFrame / 15) % 2 === 0
    : true; // always visible while typing

  // Fade-in the whole element
  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline",
        opacity,
        fontFamily: "Inter, monospace",
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {visibleText}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: "1em",
          marginLeft: 2,
          verticalAlign: "text-bottom",
          backgroundColor: cursorVisible ? cursorColor : "transparent",
        }}
      />
    </span>
  );
};
