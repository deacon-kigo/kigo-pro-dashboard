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
      {/* ABC FI Splash Screen with fade-in animation */}
      <div className="relative w-full h-full animate-fade-in">
        <Image
          src="/illustration/abc-fi/asset/abc-fi-splash.png"
          alt="ABC FI Splash Screen"
          fill
          className="object-cover"
          priority
        />

        {/* Loading indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
