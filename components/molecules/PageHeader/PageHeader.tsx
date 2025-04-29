"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  emoji?: string;
  logo?: ReactNode;
  actions?: ReactNode;
  gradientColors?: {
    from: string;
    to: string;
  };
  variant?: "default" | "aurora";
}

/**
 * PageHeader component with a gradient background and optional actions
 * Inspired by the GreetingHeader in CampaignManagerView
 */
export default function PageHeader({
  title,
  description,
  emoji = "✨",
  logo,
  actions,
  gradientColors = {
    from: "rgba(1, 32, 105, 0.9)",
    to: "rgba(1, 32, 105, 0.7)",
  },
  variant = "default",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg mb-4",
        variant === "default" && "shadow-sm",
        variant === "aurora" && "banner-aurora"
      )}
      style={
        variant === "default"
          ? {
              background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`,
              overflow: "hidden",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
            }
          : undefined
      }
    >
      {variant === "aurora" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(`
              [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
              [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
              [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
              [background-image:var(--white-gradient),var(--aurora)]
              dark:[background-image:var(--dark-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              filter blur-[10px] invert dark:invert-0
              after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
              after:dark:[background-image:var(--dark-gradient),var(--aurora)]
              after:[background-size:200%,_100%] 
              after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
              pointer-events-none
              absolute -inset-[10px] opacity-50 will-change-transform
              [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]
            `)}
          ></div>
        </div>
      )}

      <div className="relative p-5 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            {logo ? (
              <div className="mr-3">{logo}</div>
            ) : (
              <span className="text-4xl mr-3">{emoji}</span>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && (
                <p className="text-base text-white/80 mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
