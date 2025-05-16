"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BorderTrail } from "../effects/BorderTrail";

interface ShineBorderProps {
  borderRadius?: number;
  color?: string;
  secondaryColor?: string;
  isActive?: boolean;
  className?: string;
  children: ReactNode;
  borderWidth?: number;
  borderTrail?: boolean;
  trailColor?: string;
  trailSize?: number;
}

/**
 * @name ShineBorder
 * @description A component that adds an animated gradient border effect when requirements are met.
 */
export function ShineBorder({
  borderRadius = 8,
  color = "rgba(74, 222, 128, 0.8)", // Light green with some transparency
  secondaryColor = "rgba(34, 197, 94, 0.8)", // Medium green with some transparency
  isActive = false,
  className,
  children,
  borderWidth = 1.5, // Thinner border (was 2)
  borderTrail = false,
  trailColor,
  trailSize = 10, // Smaller trail size (was 16)
}: ShineBorderProps) {
  // Handle client-side only animations to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isActive) {
      const timer = setTimeout(() => setShowBorder(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowBorder(false);
    }
  }, [isActive, isMounted]);

  // Don't render animations on server
  const shouldShowBorder = isMounted && isActive;

  // Use trail color that matches the primary color if not specified
  const effectiveTrailColor = trailColor || color;

  return (
    <div className={cn("relative", className)}>
      {shouldShowBorder && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500",
            showBorder ? "opacity-100" : "opacity-0"
          )}
          style={{
            borderRadius: `${borderRadius}px`,
            zIndex: 0,
          }}
        >
          {/* Border container with gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              borderRadius: `${borderRadius}px`,
              background: `linear-gradient(90deg, ${color}, ${secondaryColor}, ${color})`,
              backgroundSize: "200% 100%",
              boxShadow: `0 0 4px 0 ${color}99`, // Reduced glow
              border: `${borderWidth}px solid transparent`,
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%", "200% 0%"],
              boxShadow: [
                `0 0 2px 0 ${color}80`,
                `0 0 4px 0 ${color}99`,
                `0 0 2px 0 ${color}80`,
              ],
            }}
            transition={{
              backgroundPosition: {
                duration: 6, // Slower animation (was 3)
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
              boxShadow: {
                duration: 4, // Slower pulse (was 2)
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            {/* Inner mask to create border effect */}
            <div
              className="absolute bg-card"
              style={{
                top: borderWidth,
                right: borderWidth,
                bottom: borderWidth,
                left: borderWidth,
                borderRadius: `${borderRadius - borderWidth}px`,
              }}
            />
          </motion.div>

          {/* Add the BorderTrail component when borderTrail is true */}
          {borderTrail && (
            <BorderTrail
              size={trailSize}
              color={effectiveTrailColor}
              transition={{
                duration: 8, // Slower animation (was 4)
                ease: "linear",
                repeat: Infinity,
              }}
            />
          )}
        </div>
      )}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
