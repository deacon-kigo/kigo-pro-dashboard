"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onSplashComplete: () => void;
}

export function SplashScreen({ onSplashComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fade in immediately
    setIsVisible(true);

    // Start fade out after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Complete transition after fade out animation
    const completeTimer = setTimeout(() => {
      onSplashComplete();
    }, 2200);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onSplashComplete]);

  return (
    <div
      className={`absolute inset-0 w-full h-full bg-white flex items-center justify-center transition-opacity duration-200 ${
        isVisible && !isExiting ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ABC FI Splash Screen with smooth transitions */}
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
