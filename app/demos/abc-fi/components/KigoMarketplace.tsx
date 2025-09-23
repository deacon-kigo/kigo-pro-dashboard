"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";

interface KigoMarketplaceProps {
  onNext: () => void;
}

export function KigoMarketplace({ onNext }: KigoMarketplaceProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-full">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 rounded-full">
                <span className="text-xs font-medium text-blue-700">
                  Moving Streak 1/3
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sarah's Complete Relocation Center
            </h1>
            <p className="text-gray-600 text-sm">
              AI-curated for your Kansas City → Denver move
            </p>
          </div>

          {/* Denver Hero Image */}
          <div className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-40 relative">
              <img
                src="/illustration/abc-fi/mock/denver-skyline.jpg"
                alt="Denver Skyline"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold text-lg">Welcome to Denver!</p>
                <p className="text-sm opacity-90">Your new home awaits</p>
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <img
                    src="/logos/abc-fi-logo.png"
                    alt="ABC FI"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Categories for Your Move
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Moving Logistics */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img
                    src="/logos/U-Haul-logo.png"
                    alt="U-Haul"
                    className="w-8 h-6 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  Moving & Logistics
                </h3>
                <p className="text-xs text-gray-600">U-Haul • PODS • Two Men</p>
              </div>
            </div>

            {/* Travel & Stay */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img
                    src="/logos/southwest-logo.svg"
                    alt="Southwest"
                    className="w-8 h-6 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  Travel & Stay
                </h3>
                <p className="text-xs text-gray-600">
                  Southwest • Hilton • National
                </p>
              </div>
            </div>

            {/* New Home Setup */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img
                    src="/logos/home-depot-logo.png"
                    alt="Home Depot"
                    className="w-8 h-6 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  Home Setup
                </h3>
                <p className="text-xs text-gray-600">
                  Home Depot • IKEA • Target
                </p>
              </div>
            </div>

            {/* Kids' New Rooms */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img
                    src="/illustration/abc-fi/mock/children-furniture-set.jpg"
                    alt="Kids Furniture"
                    className="w-8 h-8 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  Kids' Rooms
                </h3>
                <p className="text-xs text-gray-600">Emma & Jake's furniture</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Rewards */}
        <div className="px-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Featured Rewards
          </h2>

          <div className="space-y-4">
            {/* 65" TV Deal */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/illustration/abc-fi/mock/tv-65-inch.jpg"
                    alt="65 inch TV"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">65" Smart TV</h3>
                    <img
                      src="/logos/best-buy-logo.png"
                      alt="Best Buy"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    15,000 points + $199
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Perfect for new living room
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite("tv")}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${favorites.includes("tv") ? "text-red-500 fill-current" : "text-gray-400"}`}
                    fill={favorites.includes("tv") ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dining Set */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/illustration/abc-fi/mock/dining-set.jpg"
                    alt="Dining Set"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      Dining Set Collection
                    </h3>
                    <img
                      src="/logos/west-elm-logo.png"
                      alt="West Elm"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    8,500 points + $299
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Family of 4 perfect size
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite("dining")}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${favorites.includes("dining") ? "text-red-500 fill-current" : "text-gray-400"}`}
                    fill={
                      favorites.includes("dining") ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Moving Package */}
            <div className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src="/illustration/abc-fi/mock/moving-boxes.jpg"
                    alt="Moving Package"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      Complete Moving Package
                    </h3>
                    <img
                      src="/logos/U-Haul-logo.png"
                      alt="U-Haul"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    12,000 points + $450
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      KC → Denver ready
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite("moving")}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${favorites.includes("moving") ? "text-red-500 fill-current" : "text-gray-400"}`}
                    fill={
                      favorites.includes("moving") ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
