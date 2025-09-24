"use client";

import { useState, useEffect } from "react";

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
    <div className="w-full h-full bg-gradient-to-b from-blue-400 via-blue-300 to-green-200 relative overflow-hidden">
      {/* Same street view background as DenverStreetView */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-400 to-blue-300">
        <div className="absolute top-8 left-1/4 w-16 h-8 bg-white/80 rounded-full"></div>
        <div className="absolute top-12 right-1/3 w-12 h-6 bg-white/60 rounded-full"></div>
        <div className="absolute top-6 right-1/4 w-20 h-10 bg-white/70 rounded-full"></div>
      </div>

      <div className="absolute bottom-1/3 left-0 w-full h-1/4 flex items-end justify-center space-x-2">
        <div className="w-8 h-16 bg-gray-600"></div>
        <div className="w-6 h-20 bg-gray-700"></div>
        <div className="w-10 h-24 bg-gray-800"></div>
        <div className="w-4 h-12 bg-gray-600"></div>
        <div className="w-8 h-18 bg-gray-700"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gray-300">
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gray-400"></div>

        {/* Highlighted Starbucks storefront */}
        <div className="absolute bottom-16 right-1/4 w-24 h-20 bg-green-700 rounded-t-lg ring-4 ring-yellow-400 ring-opacity-75 animate-pulse">
          <div className="w-full h-8 bg-green-800 rounded-t-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 text-xs font-bold">★</span>
            </div>
          </div>
          <div className="flex justify-center mt-2 space-x-2">
            <div className="w-4 h-8 bg-yellow-200 rounded"></div>
            <div className="w-4 h-8 bg-yellow-200 rounded"></div>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/4 w-16 h-16 bg-red-600"></div>
        <div className="absolute bottom-16 left-1/2 w-20 h-18 bg-blue-600"></div>
      </div>

      {/* Sarah stopped near Starbucks */}
      <div className="absolute bottom-20 right-1/3">
        <div className="relative">
          <div className="w-4 h-4 bg-pink-200 rounded-full mx-auto"></div>
          <div className="w-3 h-8 bg-blue-500 mx-auto"></div>
          <div className="flex justify-center space-x-1">
            <div className="w-1 h-4 bg-blue-800"></div>
            <div className="w-1 h-4 bg-blue-800"></div>
          </div>
        </div>
      </div>

      {/* Geofence indicator */}
      <div className="absolute bottom-16 right-1/4 w-32 h-32 border-4 border-blue-400 border-dashed rounded-full animate-ping opacity-30"></div>

      {/* Push notification */}
      {showNotification && (
        <div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 max-w-sm animate-slide-down cursor-pointer hover:shadow-3xl transition-all duration-200"
          onClick={handleNotificationClick}
        >
          <div className="flex items-start space-x-3">
            {/* ABC FI App Icon */}
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/logos/abc-fi-logo.png"
                alt="ABC FI"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">ABC FI</h4>
                <span className="text-xs text-gray-500">now</span>
              </div>

              <h3 className="font-bold text-gray-900 text-base mb-1">
                Coffee Switch Campaign
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed">
                Time for a new coffee routine, Sarah? Earn{" "}
                <span className="font-bold text-green-600">
                  1,000 bonus points
                </span>{" "}
                when you try Starbucks with your ABC FI card! ☕️
              </p>

              <div className="flex items-center mt-2 space-x-2">
                <div className="flex items-center text-xs text-blue-600">
                  <svg
                    className="w-3 h-3 mr-1"
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
                  <span>Nearby Starbucks</span>
                </div>
                <div className="text-xs text-gray-500">•</div>
                <div className="text-xs text-green-600 font-medium">
                  Brand-funded offer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location indicator */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-800">
            Near Starbucks
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
