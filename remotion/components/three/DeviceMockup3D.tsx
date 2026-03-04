/**
 * DeviceMockup3D — 3D laptop or phone that rotates to reveal a screenshot on its screen.
 *
 * Uses RoundedBox for the device body and a Plane for the textured screen.
 * Animation is driven entirely by Remotion's useCurrentFrame / spring —
 * never by R3F's useFrame.
 */
import React, { Suspense } from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { RoundedBox, useTexture } from "@react-three/drei";
import { colors, springs as springPresets } from "../../lib/brand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DeviceMockup3DProps {
  /** "laptop" (wider, slight tilt) or "phone" (thin, tall) */
  type?: "laptop" | "phone";
  /** URL or path of the screenshot texture for the screen */
  screenContent: string;
  /** Frame offset for staggered entrance */
  startFrame?: number;
  /** Initial Euler rotation [x, y, z] in radians */
  rotateFrom?: [number, number, number];
  /** Target Euler rotation [x, y, z] in radians */
  rotateTo?: [number, number, number];
}

// ---------------------------------------------------------------------------
// Dimensions per device type
// ---------------------------------------------------------------------------
const DEVICE_SPECS = {
  laptop: {
    width: 4,
    height: 2.6,
    depth: 0.15,
    screenInset: 0.15,
    tiltX: -0.15,
  },
  phone: { width: 1.4, height: 2.8, depth: 0.12, screenInset: 0.1, tiltX: 0 },
} as const;

// ---------------------------------------------------------------------------
// Inner screen mesh (loads texture via drei)
// ---------------------------------------------------------------------------
const Screen: React.FC<{
  url: string;
  width: number;
  height: number;
  depth: number;
  inset: number;
}> = ({ url, width, height, depth, inset }) => {
  const texture = useTexture(url);
  const sw = width - inset * 2;
  const sh = height - inset * 2;

  return (
    <mesh position={[0, 0, depth / 2 + 0.001]}>
      <planeGeometry args={[sw, sh]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const DeviceMockup3D: React.FC<DeviceMockup3DProps> = ({
  type = "laptop",
  screenContent,
  startFrame = 0,
  rotateFrom = [0, Math.PI * 0.25, 0],
  rotateTo = [0, 0, 0],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const spec = DEVICE_SPECS[type];

  // Spring-driven progress (0 → 1)
  const progress = spring({
    frame: localFrame,
    fps,
    config: springPresets.smooth,
  });

  // Interpolate rotation
  const rx =
    rotateFrom[0] + (rotateTo[0] - rotateFrom[0]) * progress + spec.tiltX;
  const ry = rotateFrom[1] + (rotateTo[1] - rotateFrom[1]) * progress;
  const rz = rotateFrom[2] + (rotateTo[2] - rotateFrom[2]) * progress;

  // Entrance scale
  const scale = spring({
    frame: localFrame,
    fps,
    config: springPresets.snappy,
  });

  return (
    <group rotation={[rx, ry, rz]} scale={[scale, scale, scale]}>
      {/* Device body */}
      <RoundedBox
        args={[spec.width, spec.height, spec.depth]}
        radius={0.06}
        smoothness={4}
      >
        <meshStandardMaterial
          color={colors.charcoal}
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Screen */}
      <Suspense fallback={null}>
        <Screen
          url={screenContent}
          width={spec.width}
          height={spec.height}
          depth={spec.depth}
          inset={spec.screenInset}
        />
      </Suspense>
    </group>
  );
};
