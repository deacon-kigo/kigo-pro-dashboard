"use client";

import { useEffect } from "react";

interface DaysLaterTransitionProps {
  onTransitionComplete: () => void;
}

export function DaysLaterTransition({
  onTransitionComplete,
}: DaysLaterTransitionProps) {
  useEffect(() => {
    // Auto-advance after 3 seconds
    const timer = setTimeout(() => {
      onTransitionComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onTransitionComplete]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-white/15 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 space-y-6">
        {/* Calendar/time icon */}
        <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Days Later text with animation */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white animate-fade-in-up">
            Days Later...
          </h1>
          <p className="text-xl text-white/80 animate-fade-in-up delay-500">
            Sarah is settling into her new life in Denver
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
