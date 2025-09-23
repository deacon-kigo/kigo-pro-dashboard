"use client";

import { Signal, Wifi, BatteryMedium } from "lucide-react";

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
  return (
    <div className={`h-full bg-white relative ${className}`}>
      {/* Consistent Status Bar */}
      {showStatusBar && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
          <div className="flex justify-between items-center px-6 py-4 text-sm font-medium">
            <span className="select-none">9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4 text-black" />
              <Wifi className="w-4 h-4 text-black" />
              <BatteryMedium className="w-5 h-4 text-black" />
            </div>
          </div>
        </div>
      )}

      {/* Content with consistent padding */}
      <div className="pb-20 overflow-y-auto h-full">{children}</div>
    </div>
  );
}
