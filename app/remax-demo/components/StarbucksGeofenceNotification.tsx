"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface StarbucksGeofenceNotificationProps {
  onNotificationClick: () => void;
}

export function StarbucksGeofenceNotification({
  onNotificationClick,
}: StarbucksGeofenceNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 2 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationClick = () => {
    setShowNotification(false);
    onNotificationClick();
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 z-50">
      {/* iOS Home Screen Image - Exact same as Step 0 */}
      <div className="absolute inset-0">
        <Image
          src="/illustration/abc-fi/asset/ios-homescreen.png"
          alt="iOS Home Screen"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* RE/MAX App Icon Overlay - Exact same as Step 0 */}
      <div className="absolute left-4 bottom-44">
        <div className="relative group">
          {/* RE/MAX App Icon */}
          <div className="w-16 h-16 rounded-2xl shadow-lg transform transition-all duration-200 group-active:scale-95 group-hover:shadow-xl overflow-hidden">
            <Image
              src="/illustration/abc-fi/asset/remax-app-icon.png"
              alt="RE/MAX App"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {/* App Name */}
          <div className="mt-1 text-center">
            <span className="text-white text-xs font-medium drop-shadow-sm">
              RE/MAX
            </span>
          </div>
        </div>
      </div>

      {/* iOS Status Bar - Exact same as Step 0 */}
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

      {/* iOS Home Indicator - Exact same as Step 0 */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>

      {/* iOS Push Notification */}
      {showNotification && (
        <div className="absolute top-12 left-2 right-2 z-50 animate-slide-down">
          <div
            className="rounded-2xl shadow-2xl p-5 cursor-pointer transition-all duration-200"
            onClick={handleNotificationClick}
            style={{
              background: "rgba(28, 28, 30, 0.95)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
            }}
          >
            <div className="flex items-start space-x-3">
              {/* RE/MAX App Icon */}
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src="/mock/remax_logo.svg"
                  alt="RE/MAX"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white text-sm">RE/MAX</h4>
                  <span className="text-xs text-gray-300">now</span>
                </div>

                <h3 className="font-semibold text-white text-sm mb-1">
                  Coffee Switch Campaign
                </h3>

                <p className="text-gray-200 text-sm leading-relaxed">
                  Time for a new coffee routine, Jessica? Earn{" "}
                  <span className="font-semibold text-green-400">
                    1,000 bonus points
                  </span>{" "}
                  when you try Starbucks with your RE/MAX card! ☕️
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
