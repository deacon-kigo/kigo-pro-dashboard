/**
 * Video-specific brand constants for Remotion compositions.
 * Timing, spring configs, and video dimensions.
 */

// Video dimensions
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

// Kigo brand colors (matching tailwind.config.mjs)
export const colors = {
  black: "#231F20",
  charcoal: "#5A5858",
  white: "#FFFFFF",
  stone: "#f6f5f1",
  red: "#DC1021",
  coral: "#FF4F5E",
  orange: "#FF8717",
  blue: "#328FE5",
  darkSkyBlue: "#25BDFE",
  skyBlue: "#CCFFFE",
  green: "#77D898",
  purple: "#8941EB",
  lightPurple: "#E5D7FA",
  pastelBlue: "#E1F0FF",
  pastelGreen: "#DCFCE7",
} as const;

// Gradient presets
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.blue} 0%, ${colors.purple} 100%)`,
  dark: `linear-gradient(135deg, ${colors.black} 0%, ${colors.charcoal} 100%)`,
  hero: `linear-gradient(135deg, ${colors.black} 0%, ${colors.blue} 50%, ${colors.purple} 100%)`,
  coral: `linear-gradient(135deg, ${colors.coral} 0%, ${colors.orange} 100%)`,
  sky: `linear-gradient(135deg, ${colors.skyBlue} 0%, ${colors.blue} 100%)`,
} as const;

// Spring configs for Remotion spring()
export const springs = {
  snappy: { damping: 20, mass: 0.5, stiffness: 200 },
  smooth: { damping: 15, mass: 1, stiffness: 100 },
  bouncy: { damping: 10, mass: 0.8, stiffness: 150 },
  gentle: { damping: 20, mass: 1.2, stiffness: 80 },
} as const;

// Standard durations in frames (at 30fps)
export const durations = {
  titleCard: 120, // 4s
  shortScene: 90, // 3s
  mediumScene: 150, // 5s
  longScene: 210, // 7s
  transition: 15, // 0.5s
} as const;

// Easing curve aliases for interpolate()
export const easings = {
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOut: [0.42, 0, 0.58, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;
