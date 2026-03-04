import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../../lib/brand";

interface ParticleFieldProps {
  particleCount?: number;
  startFrame?: number;
  color?: string;
  speed?: number;
}

interface Particle {
  /** Base X position 0–1 */
  x: number;
  /** Base Y position 0–1 */
  y: number;
  /** Radius in px */
  r: number;
  /** Phase offset (radians) so particles don't move in unison */
  phase: number;
  /** Per-particle frequency multiplier */
  freq: number;
  /** Base opacity 0–1 */
  opacity: number;
}

/**
 * ParticleField — Floating dot particles rendered with SVG.
 *
 * Each particle has a deterministic pseudo-random position, phase, and
 * frequency.  Its position is offset by sinusoidal functions of the
 * current frame so the field gently drifts without any runtime state.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  particleCount = 60,
  startFrame = 0,
  color = colors.blue,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Deterministic seed-based random for reproducibility across renders.
  const particles = useMemo<Particle[]>(() => {
    const seed = (n: number) => {
      // Simple LCG — good enough for visual distribution
      let s = n;
      s = ((s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      return s;
    };

    return Array.from({ length: particleCount }, (_, i) => ({
      x: seed(i * 3 + 1),
      y: seed(i * 3 + 2),
      r: 1.5 + seed(i * 3 + 3) * 3,
      phase: seed(i * 7) * Math.PI * 2,
      freq: 0.6 + seed(i * 11) * 0.8,
      opacity: 0.15 + seed(i * 13) * 0.55,
    }));
  }, [particleCount]);

  // Global fade-in
  const globalOpacity = interpolate(relativeFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Time factor — maps frames to a smooth [0..∞) value
  const t = (relativeFrame / fps) * speed;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity: globalOpacity,
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => {
        const dx = Math.sin(t * p.freq + p.phase) * 0.03;
        const dy = Math.cos(t * p.freq * 0.7 + p.phase) * 0.03;

        // Pulse opacity gently
        const pulseOpacity =
          p.opacity + 0.15 * Math.sin(t * p.freq * 1.3 + p.phase);

        return (
          <circle
            key={i}
            cx={`${(p.x + dx) * 100}%`}
            cy={`${(p.y + dy) * 100}%`}
            r={p.r}
            fill={color}
            opacity={Math.max(0, Math.min(1, pulseOpacity))}
          />
        );
      })}
    </svg>
  );
};
