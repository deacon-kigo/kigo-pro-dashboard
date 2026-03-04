/**
 * Text3DHeading — Extruded-look 3D text with metallic material and spring entrance.
 *
 * Uses drei's <Text> (troika-based, no JSON font file needed).
 * All animation via Remotion's useCurrentFrame / spring — no R3F useFrame.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Text } from "@react-three/drei";
import { colors, springs as springPresets } from "../../lib/brand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Text3DHeadingProps {
  /** The text string to render */
  text: string;
  /** Text colour */
  color?: string;
  /** Frame offset for staggered entrance */
  startFrame?: number;
  /** Font size in world units */
  size?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Text3DHeading: React.FC<Text3DHeadingProps> = ({
  text,
  color = colors.white,
  startFrame = 0,
  size = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // Spring entrance: scale 0 → 1
  const scale = spring({
    frame: localFrame,
    fps,
    config: springPresets.snappy,
  });

  // Subtle continuous rotation on Y
  const rotY = Math.sin(localFrame * 0.02) * 0.08;

  // Slight nod on X for depth feel
  const rotX = Math.sin(localFrame * 0.015) * 0.03;

  return (
    <group rotation={[rotX, rotY, 0]} scale={[scale, scale, scale]}>
      <Text
        fontSize={size}
        maxWidth={10}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        outlineWidth={size * 0.04}
        outlineColor={colors.black}
      >
        {text}
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Text>
    </group>
  );
};
