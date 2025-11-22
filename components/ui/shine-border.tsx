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
  simulateLoading?: boolean; // New prop for loading simulation
  loadingDuration?: number; // Duration in seconds for loading animation
}

/**
 * @name ShineBorder
 * @description A component that adds an animated gradient border effect when requirements are met.
 */
export function ShineBorder({
  borderRadius = 8,
  color = "rgba(50, 143, 229, 0.8)", // Kigo blue #328FE5 with transparency
  secondaryColor = "rgba(37, 99, 235, 0.8)", // Darker Kigo blue #2563EB with transparency
  isActive = false,
  className,
  children,
  borderWidth = 1.5, // Thinner border (was 2)
  borderTrail = false,
  trailColor,
  trailSize = 10, // Smaller trail size (was 16)
  simulateLoading = false,
  loadingDuration = 3,
}: ShineBorderProps) {
  // Handle client-side only animations to prevent hydration errors
  const [isMounted, setIsMounted] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

  // Simulate loading progress
  useEffect(() => {
    if (isMounted && isActive && simulateLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 100 / (loadingDuration * 20); // Update 20 times per second
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [isActive, isMounted, simulateLoading, loadingDuration]);

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
              background: simulateLoading
                ? `linear-gradient(90deg, transparent 0%, transparent ${100 - loadingProgress}%, ${color} ${100 - loadingProgress}%, ${secondaryColor} 100%)`
                : `linear-gradient(90deg, ${color}, ${secondaryColor}, ${color})`,
              backgroundSize: simulateLoading ? "100% 100%" : "200% 100%",
              boxShadow: `0 0 4px 0 ${color}99`, // Reduced glow
              border: `${borderWidth}px solid transparent`,
            }}
            animate={{
              backgroundPosition: simulateLoading
                ? undefined
                : ["0% 0%", "100% 0%", "200% 0%"],
              boxShadow: [
                `0 0 2px 0 ${color}80`,
                `0 0 4px 0 ${color}99`,
                `0 0 2px 0 ${color}80`,
              ],
            }}
            transition={{
              backgroundPosition: simulateLoading
                ? undefined
                : {
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
