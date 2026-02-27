"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

interface StaticMerchantLocationMapProps {
  homeAddress: string;
  homeCoordinates: { lat: number; lng: number };
  merchantName: string;
  merchantAddress: string;
  merchantCoordinates: { lat: number; lng: number };
  onMapShown?: () => void;
}

export function StaticMerchantLocationMap({
  homeAddress,
  merchantName,
  merchantAddress,
  homeCoordinates,
  merchantCoordinates,
  onMapShown,
}: StaticMerchantLocationMapProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Rough distance estimate
  const latDiff = Math.abs(homeCoordinates.lat - merchantCoordinates.lat);
  const lngDiff = Math.abs(homeCoordinates.lng - merchantCoordinates.lng);
  const roughMiles = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69;
  const distance = `${roughMiles.toFixed(1)} miles`;
  const duration = `${Math.round(roughMiles * 2.5)} min drive`;

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => onMapShown?.(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      className={`bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-gray-100 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <Navigation className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              Distance to {merchantName}
            </h4>
            <p className="text-xs text-gray-600">From your new home</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-indigo-600">{distance}</p>
          <p className="text-xs text-gray-500">{duration}</p>
        </div>
      </div>

      {/* Static Map Visual */}
      <div className="bg-white rounded-xl mb-3 relative overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center h-32">
          <div className="text-center p-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <span className="text-white text-xs">🏠</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-0.5 bg-indigo-400 rounded"></div>
                <div className="w-2 h-0.5 bg-indigo-400 rounded"></div>
                <div className="w-2 h-0.5 bg-indigo-400 rounded"></div>
                <div className="w-3 h-0.5 bg-indigo-500 rounded"></div>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-700">
              Your Home → {merchantName}
            </p>
            <p className="text-xs text-gray-600">{merchantAddress}</p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-xs text-gray-600">Your Home: {homeAddress}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <p className="text-xs text-gray-600">
            {merchantName}: {merchantAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
