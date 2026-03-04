/**
 * StudioScene — Pre-configured ThreeCanvas wrapper with environment, camera, and lighting.
 *
 * Wraps @remotion/three's <ThreeCanvas> (NOT @react-three/fiber's <Canvas>).
 * Camera can optionally orbit around the center.
 * All animation via Remotion's useCurrentFrame — no R3F useFrame.
 */
import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface StudioSceneProps {
  /** 3D content rendered inside the canvas */
  children: React.ReactNode;
  /** Frame offset for staggered entrance */
  startFrame?: number;
  /** Initial / base camera position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Point the camera looks at */
  cameraTarget?: [number, number, number];
  /** Whether the camera orbits around the center */
  cameraOrbit?: boolean;
  /** Orbit radius (defaults to distance from cameraPosition to Y axis) */
  orbitRadius?: number;
  /** Orbit speed — full rotations per 300 frames */
  orbitSpeed?: number;
  /** drei Environment preset name */
  environmentPreset?: string;
}

// ---------------------------------------------------------------------------
// Animated camera (runs inside the ThreeCanvas R3F tree)
// ---------------------------------------------------------------------------
interface AnimatedCameraProps {
  position: [number, number, number];
  target: [number, number, number];
  orbit: boolean;
  radius: number;
  speed: number;
  localFrame: number;
  fps: number;
}

const AnimatedCamera: React.FC<AnimatedCameraProps> = ({
  position,
  target,
  orbit,
  radius,
  speed,
  localFrame,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { set } = useThree();

  // Compute camera position per frame
  let cx = position[0];
  let cy = position[1];
  let cz = position[2];

  if (orbit) {
    const angle = (localFrame / 300) * Math.PI * 2 * speed;
    cx = Math.sin(angle) * radius;
    cz = Math.cos(angle) * radius;
  }

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(cx, cy, cz);
      cameraRef.current.lookAt(new THREE.Vector3(...target));
      cameraRef.current.updateProjectionMatrix();
      set({ camera: cameraRef.current });
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={50}
      near={0.1}
      far={100}
      position={[cx, cy, cz]}
    />
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const StudioScene: React.FC<StudioSceneProps> = ({
  children,
  startFrame = 0,
  cameraPosition = [0, 1.5, 6],
  cameraTarget = [0, 0, 0],
  cameraOrbit = false,
  orbitRadius,
  orbitSpeed = 1,
  environmentPreset = "studio",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  // Default orbit radius = XZ distance of cameraPosition from origin
  const defaultRadius = Math.sqrt(
    cameraPosition[0] ** 2 + cameraPosition[2] ** 2
  );
  const radius = orbitRadius ?? defaultRadius;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Camera */}
      <AnimatedCamera
        position={cameraPosition}
        target={cameraTarget}
        orbit={cameraOrbit}
        radius={radius}
        speed={orbitSpeed}
        localFrame={localFrame}
        fps={fps}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 4, -4]} intensity={0.3} />

      {/* Environment map for reflections / IBL */}
      <Environment preset={environmentPreset as any} />

      {/* Scene content — wrapped in Sequence with layout="none" */}
      <Sequence from={startFrame} layout="none">
        {children}
      </Sequence>
    </ThreeCanvas>
  );
};
