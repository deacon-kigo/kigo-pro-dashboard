"use client";

import { useEffect } from "react";

interface DenverStreetViewProps {
  onStarbucksApproach: () => void;
}

export function DenverStreetView({
  onStarbucksApproach,
}: DenverStreetViewProps) {
  useEffect(() => {
    // Auto-trigger Starbucks approach after 4 seconds
    const timer = setTimeout(() => {
      onStarbucksApproach();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onStarbucksApproach]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-400 via-blue-300 to-green-200 relative overflow-hidden">
      {/* Sky and clouds */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-400 to-blue-300">
        <div className="absolute top-8 left-1/4 w-16 h-8 bg-white/80 rounded-full"></div>
        <div className="absolute top-12 right-1/3 w-12 h-6 bg-white/60 rounded-full"></div>
        <div className="absolute top-6 right-1/4 w-20 h-10 bg-white/70 rounded-full"></div>
      </div>

      {/* Denver skyline */}
      <div className="absolute bottom-1/3 left-0 w-full h-1/4 flex items-end justify-center space-x-2">
        <div className="w-8 h-16 bg-gray-600"></div>
        <div className="w-6 h-20 bg-gray-700"></div>
        <div className="w-10 h-24 bg-gray-800"></div>
        <div className="w-4 h-12 bg-gray-600"></div>
        <div className="w-8 h-18 bg-gray-700"></div>
      </div>

      {/* Street level */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gray-300">
        {/* Sidewalk */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gray-400"></div>

        {/* Starbucks storefront */}
        <div className="absolute bottom-16 right-1/4 w-24 h-20 bg-green-700 rounded-t-lg">
          {/* Starbucks logo area */}
          <div className="w-full h-8 bg-green-800 rounded-t-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 text-xs font-bold">★</span>
            </div>
          </div>
          {/* Windows */}
          <div className="flex justify-center mt-2 space-x-2">
            <div className="w-4 h-8 bg-yellow-200 rounded"></div>
            <div className="w-4 h-8 bg-yellow-200 rounded"></div>
          </div>
        </div>

        {/* Other buildings */}
        <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-red-600"></div>
        <div className="absolute bottom-16 left-1/2 w-20 h-18 bg-blue-600"></div>
      </div>

      {/* Sarah walking (animated figure) */}
      <div className="absolute bottom-20 left-8 animate-walk">
        <div className="relative">
          {/* Head */}
          <div className="w-4 h-4 bg-pink-200 rounded-full mx-auto"></div>
          {/* Body */}
          <div className="w-3 h-8 bg-blue-500 mx-auto"></div>
          {/* Legs */}
          <div className="flex justify-center space-x-1">
            <div className="w-1 h-4 bg-blue-800"></div>
            <div className="w-1 h-4 bg-blue-800"></div>
          </div>
        </div>
      </div>

      {/* Location indicator */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-800">
            Downtown Denver
          </span>
        </div>
      </div>

      {/* Walking indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm text-gray-700">Walking to coffee shop</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes walk {
          0%,
          100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(200px);
          }
        }

        .animate-walk {
          animation: walk 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
