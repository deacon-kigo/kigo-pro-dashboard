"use client";

import { Signal, Wifi, BatteryMedium } from "lucide-react";
import { useState, useEffect } from "react";

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
    <div className={`h-full bg-white relative ${className}`}>
      {/* Consistent Status Bar */}
      {showStatusBar && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
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
      <div className="pb-12 overflow-y-auto h-full">{children}</div>
    </div>
  );
}
