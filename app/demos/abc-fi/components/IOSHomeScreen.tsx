"use client";

import React from "react";
import Image from "next/image";

interface IOSHomeScreenProps {
  onAppOpen: () => void;
}

export function IOSHomeScreen({ onAppOpen }: IOSHomeScreenProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 z-50">
      {/* iOS Home Screen Image */}
      <div className="absolute inset-0">
        <Image
          src="/illustration/abc-fi/asset/ios-homescreen.png"
          alt="iOS Home Screen"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* ABC FI App Icon Overlay (clickable) - Positioned under Settings */}
      <div className="absolute left-4 bottom-40">
        <button onClick={onAppOpen} className="relative group">
          {/* ABC FI App Icon */}
          <div className="w-16 h-16 rounded-2xl shadow-lg transform transition-all duration-200 group-active:scale-95 group-hover:shadow-xl overflow-hidden">
            <Image
              src="/illustration/abc-fi/asset/abc-fi-app-icon.png"
              alt="ABC FI App"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* App Name */}
          <div className="mt-1 text-center">
            <span className="text-white text-xs font-medium drop-shadow-sm">
              ABC FI
            </span>
          </div>
        </button>
      </div>

      {/* iOS Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 pt-2">
        <div className="flex items-center gap-1">
          <span className="text-white text-sm font-semibold">9:41</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
          </div>
          <div className="ml-2 w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  );
}
