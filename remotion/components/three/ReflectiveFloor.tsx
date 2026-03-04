/**
 * ReflectiveFloor — A reflective stage floor using MeshReflectorMaterial from drei.
 *
 * Place this at the bottom of your scene (y = 0 or slightly below objects)
 * to create a polished-floor reflection effect.
 */
import React from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { colors } from "../../lib/brand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ReflectiveFloorProps {
  /** Floor tint colour */
  color?: string;
  /** Gaussian blur applied to reflections [x, y] */
  blur?: [number, number];
  /** How much blur mixes into the reflection (0–1) */
  mixBlur?: number;
  /** Reflection strength (0 = none, 1 = full mirror) */
  mirror?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const ReflectiveFloor: React.FC<ReflectiveFloorProps> = ({
  color = colors.black,
  blur = [300, 100],
  mixBlur = 0.75,
  mirror = 0.6,
}) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        color={color}
        blur={blur}
        mixBlur={mixBlur}
        mirror={mirror}
        resolution={1024}
        mixStrength={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        metalness={0.5}
        roughness={0.7}
      />
    </mesh>
  );
};
