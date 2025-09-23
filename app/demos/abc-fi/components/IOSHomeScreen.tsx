"use client";

import React from "react";
import Image from "next/image";

interface IOSHomeScreenProps {
  onAppOpen: () => void;
}

export function IOSHomeScreen({ onAppOpen }: IOSHomeScreenProps) {
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* iOS Home Screen Background */}
      <div className="relative w-[375px] h-[812px] bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-800">
        {/* iOS Home Screen Image */}
        <div className="absolute inset-0">
          <Image
            src="/illustration/abc-fi/asset/ios-homescreen.png"
            alt="iOS Home Screen"
            fill
            className="object-cover rounded-[36px]"
            priority
          />
        </div>

        {/* ABC FI App Icon Overlay (clickable) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-6 p-8 w-full h-full">
            {/* Position ABC FI app icon in a realistic spot */}
            <div className="col-start-2 row-start-3 flex justify-center">
              <button onClick={onAppOpen} className="relative group">
                {/* App Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center transform transition-all duration-200 group-active:scale-95 group-hover:shadow-xl">
                  <Image
                    src="/illustration/abc-fi/asset/abc-fi-app-icon.png"
                    alt="ABC FI App"
                    width={56}
                    height={56}
                    className="rounded-xl"
                  />
                </div>

                {/* App Name */}
                <div className="mt-1 text-center">
                  <span className="text-white text-xs font-medium drop-shadow-sm">
                    ABC FI
                  </span>
                </div>

                {/* Tap Indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </button>
            </div>
          </div>
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

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-lg font-medium mb-2">
          Tap the ABC FI app to start Sarah's journey
        </p>
        <p className="text-gray-300 text-sm">
          Experience how Sarah uses ABC FI during her relocation to Denver
        </p>
      </div>
    </div>
  );
}
