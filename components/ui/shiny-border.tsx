"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BorderTrail } from "./border-trail";
import { motion } from "framer-motion";

interface ShinyBorderProps {
  borderRadius?: number;
  className?: string;
  children: ReactNode;
  borderWidth?: number;
  isActive?: boolean;
}

/**
 * @name ShinyBorder
 * @description A component that adds a subtle animated border effect when requirements are met.
 */
export function ShinyBorder({
  borderRadius = 8,
  isActive = false,
  className,
  children,
  borderWidth = 1, // Thinner border
}: ShinyBorderProps) {
  // Define a sophisticated color palette with green, teal, and blue variations
  const darkGreen = "rgba(22, 163, 74, 0.9)"; // Dark green
  const mediumGreen = "rgba(34, 197, 94, 0.9)"; // Medium green
  const tealGreen = "rgba(45, 212, 191, 0.9)"; // Teal-green
  const deepTeal = "rgba(20, 184, 166, 0.9)"; // Deeper teal
  const subtleBlue = "rgba(56, 189, 248, 0.85)"; // Subtle blue
  const emeraldGreen = "rgba(16, 185, 129, 0.9)"; // Emerald green

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
            zIndex: 10, // Higher z-index to appear above the gray border
          }}
        >
          {/* Sophisticated animated border overlay with color transitions */}
          <motion.div
            className="absolute inset-0"
            style={{
              borderRadius: `${borderRadius}px`,
              border: `${borderWidth}px solid ${emeraldGreen}`,
              boxShadow: `0 0 4px ${tealGreen}`,
            }}
            animate={{
              boxShadow: [
                `0 0 3px ${mediumGreen}`,
                `0 0 5px ${tealGreen}`,
                `0 0 4px ${subtleBlue}`,
                `0 0 3px ${mediumGreen}`,
              ],
              border: [
                `${borderWidth}px solid ${darkGreen}`,
                `${borderWidth}px solid ${emeraldGreen}`,
                `${borderWidth}px solid ${deepTeal}`,
                `${borderWidth}px solid ${darkGreen}`,
              ],
            }}
            transition={{
              boxShadow: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
              border: {
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
          />

          {/* Add the BorderTrail component for the animated effect */}
          <BorderTrail
            size={borderRadius * 3}
            transition={{
              duration: 3.5,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}
