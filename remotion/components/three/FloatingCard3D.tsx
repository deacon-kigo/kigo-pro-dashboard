/**
 * FloatingCard3D — A card in 3D space with gentle sinusoidal rotation and float.
 *
 * Uses a thin RoundedBox with MeshPhysicalMaterial for a premium look.
 * All motion driven by Remotion's useCurrentFrame — no R3F useFrame.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { RoundedBox } from "@react-three/drei";
import { colors, springs as springPresets } from "../../lib/brand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface FloatingCard3DProps {
  /** Optional React children rendered as an Html overlay (not used in mesh) */
  children?: React.ReactNode;
  /** Card face colour */
  color?: string;
  /** Frame offset for staggered entrance */
  startFrame?: number;
  /** Card width in world units */
  width?: number;
  /** Card height in world units */
  height?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const FloatingCard3D: React.FC<FloatingCard3DProps> = ({
  color = colors.white,
  startFrame = 0,
  width = 3,
  height = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // Entrance scale
  const scale = spring({
    frame: localFrame,
    fps,
    config: springPresets.smooth,
  });

  // Sinusoidal hover — gentle Y-axis rotation
  const rotY = Math.sin(localFrame * 0.03) * 0.12;

  // Float up/down on Y position
  const floatY = Math.sin(localFrame * 0.04) * 0.08;

  // Subtle tilt on X
  const rotX = Math.sin(localFrame * 0.025) * 0.04;

  const depth = 0.04; // very thin card

  return (
    <group
      position={[0, floatY, 0]}
      rotation={[rotX, rotY, 0]}
      scale={[scale, scale, scale]}
    >
      <RoundedBox
        args={[width, height, depth]}
        radius={0.08}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={color}
          roughness={0.35}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </RoundedBox>
    </group>
  );
};
