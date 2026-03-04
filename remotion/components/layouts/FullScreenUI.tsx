import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, gradients, springs } from "../../lib/brand";
import { fontFamily, fontStyles } from "../../lib/fonts";

interface FullScreenUIProps {
  children: React.ReactNode;
  deviceFrame?: boolean;
  title?: string;
  startFrame?: number;
}

/**
 * FullScreenUI — Renders a UI component or screenshot filling the frame.
 *
 * Optionally wraps content in a CSS-based laptop device frame (dark bezel,
 * camera dot, rounded corners). Entrance uses spring scale + Y translate.
 */
export const FullScreenUI: React.FC<FullScreenUIProps> = ({
  children,
  deviceFrame = false,
  title,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Spring scale entrance: 0.92 -> 1.0
  const scaleProgress = spring({
    frame: relativeFrame,
    fps,
    config: springs.smooth,
  });

  const scale = interpolate(scaleProgress, [0, 1], [0.92, 1.0], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(scaleProgress, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title bar fade
  const titleOpacity = interpolate(relativeFrame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: gradients.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Optional title bar */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 48,
            zIndex: 10,
            opacity: titleOpacity,
          }}
        >
          <span
            style={{
              ...fontStyles.label,
              fontSize: 14,
              color: `${colors.white}88`,
              letterSpacing: "0.08em",
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Content container with entrance animation */}
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          width: deviceFrame ? "85%" : "92%",
          height: deviceFrame ? "auto" : "88%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {deviceFrame ? (
          /* CSS-based laptop device frame */
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Screen bezel */}
            <div
              style={{
                width: "100%",
                backgroundColor: colors.charcoal,
                borderRadius: "16px 16px 0 0",
                padding: "12px 0 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: `0 20px 60px ${colors.black}80, 0 4px 16px ${colors.black}60`,
              }}
            >
              {/* Camera dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: `${colors.white}30`,
                  marginBottom: 10,
                }}
              />

              {/* Screen area */}
              <div
                style={{
                  width: "calc(100% - 16px)",
                  aspectRatio: "16/10",
                  backgroundColor: colors.black,
                  borderRadius: "4px 4px 0 0",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {children}
              </div>
            </div>

            {/* Laptop base */}
            <div
              style={{
                width: "110%",
                height: 14,
                backgroundColor: colors.charcoal,
                borderRadius: "0 0 8px 8px",
                position: "relative",
              }}
            >
              {/* Trackpad notch */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 80,
                  height: 4,
                  backgroundColor: `${colors.white}15`,
                  borderRadius: "0 0 4px 4px",
                }}
              />
            </div>
          </div>
        ) : (
          /* No device frame — content with subtle styling */
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 24px 80px ${colors.black}80, 0 8px 32px ${colors.black}60`,
              position: "relative",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
