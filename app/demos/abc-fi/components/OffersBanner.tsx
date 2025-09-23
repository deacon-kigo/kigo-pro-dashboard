"use client";

import React, { useEffect, useState } from "react";

interface OffersBannerProps {
  onTap?: () => void;
}

export function OffersBanner({ onTap }: OffersBannerProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti animation on mount
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-6 my-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                backgroundColor: [
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Banner Content */}
      <div
        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-200 active:scale-98"
        onClick={onTap}
      >
        {/* Icon */}
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 text-sm">
            Tap into the all new offers experience
          </h3>
          <p className="text-blue-700 text-xs mt-1">
            Unlock deep everyday savings through our new offers experience
          </p>
        </div>

        {/* Arrow */}
        <div className="text-blue-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
