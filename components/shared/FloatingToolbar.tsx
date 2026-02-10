"use client";

import { memo, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface FloatingToolbarProps {
  visible: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Glassmorphic floating toolbar — centered at viewport bottom.
 * Uses a portal to escape parent layout. Animates in from below.
 *
 * Relies on the design system's glass tokens (globals.css):
 *   --glass-background-light, --glass-blur, --glass-shadow
 *
 * Reusable across any feature that needs a selection/action toolbar.
 */
export const FloatingToolbar = memo(function FloatingToolbar({
  visible,
  children,
  className,
}: FloatingToolbarProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible
          ? "opacity-100 -translate-x-1/2 translate-y-0"
          : "opacity-0 -translate-x-1/2 translate-y-4"
      )}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-60"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(165,180,252,0.12), rgba(221,214,254,0.1))",
          filter: "blur(1px)",
        }}
      />

      {/* Main bar */}
      <div
        className={cn(
          "relative flex items-center gap-3 px-5 py-2.5",
          "rounded-2xl",
          // Glass effect using the design system tokens
          "backdrop-blur-xl border",
          "shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]",
          className
        )}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,255,0.88))",
          borderColor: "rgba(203,213,225,0.45)",
        }}
      >
        {/* Subtle inner highlight along top edge */}
        <div
          className="absolute inset-x-3 top-px h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
          }}
        />

        {children}
      </div>
    </div>,
    document.body
  );
});
