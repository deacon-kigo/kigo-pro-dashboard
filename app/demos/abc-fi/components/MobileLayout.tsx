"use client";

import { Signal, Wifi, BatteryMedium } from "lucide-react";
import { useState, useEffect } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";

interface MobileLayoutProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
  className?: string;
}

export function MobileLayout({
  children,
  showStatusBar = true,
  className = "",
}: MobileLayoutProps) {
  const [currentTime, setCurrentTime] = useState("9:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
      setCurrentTime(formattedTime);
    };

    // Update time immediately
    updateTime();

    // Update time every minute
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-full relative ${className}`}>
      <WavyBackground
        className="h-full"
        containerClassName="h-full"
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
        waveWidth={30}
        backgroundFill="rgba(255, 255, 255, 0.95)"
        blur={15}
        speed="slow"
        waveOpacity={0.3}
      >
        {/* Consistent Status Bar */}
        {showStatusBar && (
          <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
            <div className="flex justify-between items-center px-6 py-4 text-sm font-medium">
              <span className="select-none">{currentTime}</span>
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-black" />
                <Wifi className="w-4 h-4 text-black" />
                <BatteryMedium className="w-5 h-4 text-black" />
              </div>
            </div>
          </div>
        )}

        {/* Content with consistent padding */}
        <div className="pb-12 overflow-y-auto h-full relative z-10">
          {children}
        </div>
      </WavyBackground>
    </div>
  );
}
