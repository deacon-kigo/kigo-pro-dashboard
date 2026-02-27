"use client";

import { useState, useEffect } from "react";
import { MapPin, Home, Navigation } from "lucide-react";

interface StaticDenverHomeLocationProps {
  address: string;
  neighborhood: string;
  onLocationShown?: () => void;
}

export function StaticDenverHomeLocation({
  address,
  neighborhood,
  onLocationShown,
}: StaticDenverHomeLocationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => setShowDetails(true), 800);
    const timer3 = setTimeout(() => onLocationShown?.(), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 border border-gray-100 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <Home className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            Your New Denver Home
          </h4>
          <p className="text-xs text-gray-600">{neighborhood}</p>
        </div>
      </div>

      {/* Static Map Visual */}
      <div className="bg-white rounded-xl mb-3 relative overflow-hidden">
        <div className="bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center h-32">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white mx-auto mb-2">
              <Home className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-700 mb-1">
              Your New Home
            </p>
            <p className="text-xs text-gray-600">{address}</p>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div
        className={`transition-all duration-500 delay-700 ${
          showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{address}</p>
            <p className="text-xs text-gray-600 mt-1">
              Premium location near shopping, dining, and entertainment
            </p>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Navigation className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 text-center">
        <p
          className={`text-xs transition-all duration-500 ${
            !showDetails ? "text-blue-600" : "text-green-600"
          }`}
        >
          {!showDetails
            ? "Locating your new home..."
            : "Location confirmed! Finding nearby offers..."}
        </p>
      </div>
    </div>
  );
}
