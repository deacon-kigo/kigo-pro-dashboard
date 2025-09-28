"use client";

import { useState, useEffect, useRef } from "react";

interface InlineTravelAnimationProps {
  fromCity: string;
  toCity: string;
  onAnimationComplete?: () => void;
}

export function InlineTravelAnimation({
  fromCity,
  toCity,
  onAnimationComplete,
}: InlineTravelAnimationProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer1 = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);

    // Complete animation
    const timer2 = setTimeout(() => {
      setAnimationComplete(true);
      // Only call completion callback once
      if (!hasCalledComplete.current && onAnimationComplete) {
        hasCalledComplete.current = true;
        onAnimationComplete();
      }
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); // Remove onAnimationComplete from dependencies

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <div
            className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
              !animationStarted
                ? "bg-blue-500 ring-2 ring-blue-200"
                : "bg-blue-300"
            }`}
          ></div>
          <p className="text-xs font-medium text-gray-700">{fromCity}</p>
        </div>

        {/* Animated Route */}
        <div className="flex-1 mx-4 relative">
          <div className="h-1 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-3000 ease-in-out ${
                animationStarted ? "w-full" : "w-0"
              }`}
            ></div>
          </div>

          {/* Car Animation */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 text-lg transition-all duration-3000 ease-in-out ${
              animationStarted ? "left-full -translate-x-full" : "left-0"
            }`}
          >
            🚗
          </div>
        </div>

        <div className="text-center">
          <div
            className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
              animationComplete
                ? "bg-green-500 ring-2 ring-green-200"
                : "bg-gray-300"
            }`}
          ></div>
          <p className="text-xs font-medium text-gray-700">{toCity}</p>
        </div>
      </div>

      {/* Simple status */}
      <div className="text-center">
        <p
          className={`text-xs transition-all duration-500 ${
            !animationStarted
              ? "text-blue-600"
              : !animationComplete
                ? "text-yellow-600"
                : "text-green-600"
          }`}
        >
          {!animationStarted && "Planning your route..."}
          {animationStarted &&
            !animationComplete &&
            "Your future journey to Denver"}
          {animationComplete && "Journey planned! Ready for offers 📍"}
        </p>
      </div>

      <style jsx>{`
        .duration-3000 {
          transition-duration: 3000ms;
        }
      `}</style>
    </div>
  );
}
