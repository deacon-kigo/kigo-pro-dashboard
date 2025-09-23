"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onSplashComplete: () => void;
}

export function SplashScreen({ onSplashComplete }: SplashScreenProps) {
  useEffect(() => {
    // Auto-transition to banking dashboard after 3 seconds
    const timer = setTimeout(() => {
      onSplashComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex items-center justify-center">
      {/* ABC FI Splash Screen */}
      <div className="relative w-full h-full">
        <Image
          src="/illustration/abc-fi/asset/abc-fi-splash.png"
          alt="ABC FI Splash Screen"
          fill
          className="object-cover"
          priority
        />

        {/* Loading indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
