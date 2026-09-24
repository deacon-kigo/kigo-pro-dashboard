"use client";

import type { MotionStyle, Transition } from "framer-motion-prod";

import { motion } from "framer-motion-prod";

import { cn } from "@/components/prod/utils/cn";

interface GlowEffectProps {
  blur?:
    | "medium"
    | "none"
    | "soft"
    | "softest"
    | "strong"
    | "stronger"
    | "strongest"
    | number;
  className?: string;
  colors?: string[];
  duration?: number;
  mode?:
    | "breathe"
    | "colorShift"
    | "flowHorizontal"
    | "pulse"
    | "rotate"
    | "static";
  scale?: number;
  style?: MotionStyle;
  transition?: Transition;
}

const DEFAULT_COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"];

const GlowEffect = ({
  blur = "medium",
  className,
  colors = DEFAULT_COLORS,
  duration = 5,
  mode = "rotate",
  scale = 1,
  style,
  transition,
}: GlowEffectProps) => {
  const BASE_TRANSITION = {
    duration,
    ease: "linear",
    repeat: Infinity,
  };

  const animations = {
    breathe: {
      background: [
        ...colors.map(
          (color) =>
            `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
        ),
      ],
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length]!;

        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length]!;

        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      opacity: [0.5, 0.8, 0.5],
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: "mirror",
        }),
      },
    },
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(", ")})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(", ")})`,
      ],
      transition: {
        ...(transition ?? BASE_TRANSITION),
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(", ")})`,
    },
  };

  const getBlurClass = (blur: GlowEffectProps["blur"]) => {
    if (typeof blur === "number") {
      return `blur-[${blur.toString()}px]`;
    }

    const presets = {
      medium: "blur-md",
      none: "blur-none",
      soft: "blur",
      softest: "blur-sm",
      strong: "blur-lg",
      stronger: "blur-xl",
      strongest: "blur-2xl",
    };

    return presets[blur!];
  };

  return (
    <motion.div
      animate={animations[mode]}
      className={cn(
        "pointer-events-none absolute -inset-[1px] -z-10",
        "rounded-[inherit]",
        "scale-[var(--scale)] transform-gpu",
        getBlurClass(blur),
        className
      )}
      data-testid="glow-effect"
      style={
        {
          ...style,
          "--scale": scale,
          backfaceVisibility: "hidden",
          willChange: "transform, opacity, background",
        } as MotionStyle
      }
    />
  );
};

export { GlowEffect, type GlowEffectProps };
