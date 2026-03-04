/**
 * Standardized motion design tokens for Remotion compositions.
 * Import into every composition for consistency across scenes.
 *
 * Usage:
 *   import { MOTION } from '../../lib/motion-tokens';
 *   const opacity = interpolate(frame, [0, MOTION.duration.base], [0, 1], {
 *     easing: MOTION.easing.enter,
 *     extrapolateRight: 'clamp',
 *   });
 */
import { Easing } from "remotion";

export const MOTION = {
  // Duration in frames (at 30fps: 8f = 0.27s, 12f = 0.4s, 20f = 0.67s, 30f = 1s)
  duration: {
    micro: 4, // instant feedback
    fast: 8, // UI-style snappy
    base: 12, // standard transition (0.3–0.4s)
    slow: 20, // deliberate movement
    dramatic: 30, // hero moments, scene transitions
    breathe: 45, // holds / breathing room
  },

  // Easing curves for interpolate()
  easing: {
    enter: Easing.out(Easing.cubic), // decelerate into position
    exit: Easing.in(Easing.cubic), // accelerate out
    emphasis: Easing.out(Easing.back(1.4)), // slight overshoot = anticipation
    smooth: Easing.inOut(Easing.cubic), // position changes
    elastic: Easing.out(Easing.elastic(1)), // playful bounce
  },

  // Spring configs for spring() calls
  spring: {
    gentle: { damping: 15, stiffness: 100, mass: 1 },
    snappy: { damping: 20, stiffness: 200, mass: 0.8 },
    bouncy: { damping: 10, stiffness: 150, mass: 1 },
    heavy: { damping: 25, stiffness: 80, mass: 1.5 },
  },

  // Stagger delay in frames between sequential element animations
  stagger: {
    tight: 3, // rapid-fire list items
    normal: 5, // standard stagger
    loose: 8, // deliberate sequence
    dramatic: 12, // one-by-one reveal
  },
} as const;

/** Type helper for motion preset selection */
export type MotionPreset = "snappy" | "gentle" | "dramatic";

/** Get spring config by preset name */
export function getSpringForPreset(preset: MotionPreset) {
  switch (preset) {
    case "snappy":
      return MOTION.spring.snappy;
    case "gentle":
      return MOTION.spring.gentle;
    case "dramatic":
      return MOTION.spring.heavy;
  }
}

/** Get stagger for preset name */
export function getStaggerForPreset(preset: MotionPreset) {
  switch (preset) {
    case "snappy":
      return MOTION.stagger.tight;
    case "gentle":
      return MOTION.stagger.normal;
    case "dramatic":
      return MOTION.stagger.dramatic;
  }
}
