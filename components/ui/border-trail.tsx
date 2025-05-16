"use client";
import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
  color?: string;
  animate?: any;
};

export function BorderTrail({
  className,
  size = 30,
  transition,
  delay,
  onAnimationComplete,
  style,
  color = "rgba(34, 197, 94, 0.9)", // Default medium green
  animate,
}: BorderTrailProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 3,
    ease: "linear",
  };

  // Define expanded color palette with green, teal, and blue tones
  const lightGreen = "rgba(134, 239, 172, 0.9)"; // Light green
  const mediumGreen = "rgba(34, 197, 94, 0.9)"; // Medium green
  const darkGreen = "rgba(22, 163, 74, 0.9)"; // Dark green
  const tealGreen = "rgba(45, 212, 191, 0.9)"; // Teal-green
  const deepTeal = "rgba(20, 184, 166, 0.9)"; // Deeper teal
  const lightTeal = "rgba(153, 246, 228, 0.9)"; // Light teal
  const subtleSkyBlue = "rgba(56, 189, 248, 0.85)"; // Subtle sky blue
  const lightBlue = "rgba(125, 211, 252, 0.8)"; // Light blue with lower opacity

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size / 2}px)`,
          filter: `blur(2px)`,
          opacity: 0.9,
          ...style,
        }}
        animate={
          animate || {
            offsetDistance: ["0%", "100%"],
            backgroundColor: [
              lightGreen,
              mediumGreen,
              tealGreen,
              deepTeal,
              lightTeal,
              subtleSkyBlue,
              lightBlue,
              tealGreen,
              mediumGreen,
            ], // Expanded palette with subtle variations
          }
        }
        transition={{
          offsetDistance: {
            ...(transition ? transition : BASE_TRANSITION),
            delay: delay,
          },
          backgroundColor: {
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
        onAnimationComplete={onAnimationComplete}
      />

      {/* Single trail element is sufficient for a more subtle effect */}
    </div>
  );
}
