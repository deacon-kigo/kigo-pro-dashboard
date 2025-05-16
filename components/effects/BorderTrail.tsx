"use client";
import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";
import { useEffect, useState } from "react";

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
  color?: string;
  withParticles?: boolean;
  particleCount?: number;
};

export function BorderTrail({
  className,
  size = 40,
  transition,
  delay = 0,
  onAnimationComplete,
  style,
  color = "rgb(74, 222, 128)",
  withParticles = true,
  particleCount = 3,
}: BorderTrailProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 8,
    ease: "linear",
  };

  // Handle client-side only animations to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Return nothing during SSR to prevent hydration mismatch
  }

  // Ensure valid color for better compatibility
  const safeColor = color || "rgb(74, 222, 128)";

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent">
      {/* Main trail element - smaller and more subtle */}
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          height: size,
          offsetPath: `rect(0 auto auto 0 round ${size / 2}px)`,
          backgroundColor: "transparent",
          boxShadow: `0 0 3px 1px ${safeColor}`,
          borderRadius: "50%",
          opacity: 0.3,
          ...style,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          offsetDistance: {
            ...BASE_TRANSITION,
            duration: 8,
            delay,
          },
          opacity: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay,
          },
        }}
        onAnimationComplete={onAnimationComplete}
      />

      {/* Subtle trailing glow */}
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size * 0.7,
          height: size * 0.7,
          offsetPath: `rect(0 auto auto 0 round ${size / 2}px)`,
          backgroundColor: "transparent",
          boxShadow: `0 0 4px 1px ${safeColor}`,
          borderRadius: "50%",
          opacity: 0.15,
          ...style,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          offsetDistance: {
            ...BASE_TRANSITION,
            duration: 12,
            delay: delay + 0.5,
          },
        }}
      />

      {/* Minimal particles */}
      {withParticles &&
        Array.from({ length: particleCount }).map((_, i) => {
          const particleSize = Math.max(1, Math.random() * 3);
          const particleDelay = delay + i * 1;
          const duration = 6 + Math.random() * 4;
          const offsetStart = i * (100 / particleCount) + "%";

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: particleSize,
                height: particleSize,
                backgroundColor: safeColor,
                offsetPath: `rect(0 auto auto 0 round ${size / 2}px)`,
                offsetDistance: offsetStart,
                boxShadow: `0 0 2px ${safeColor}`,
                opacity: 0.2,
              }}
              animate={{
                offsetDistance: [offsetStart, "100%"],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                offsetDistance: {
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: particleDelay,
                },
                opacity: {
                  duration: duration * 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: particleDelay,
                },
              }}
            />
          );
        })}
    </div>
  );
}
