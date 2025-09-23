"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";

interface ValueSummaryProps {
  onNext: () => void;
}

export function ValueSummary({ onNext }: ValueSummaryProps) {
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateNumbers(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const savingsData = [
    {
      category: "Moving & Logistics",
      amount: 680,
      color: "bg-orange-100 text-orange-700",
      businesses: ["U-Haul", "PODS", "Two Men and a Truck"],
      logos: [
        "/logos/U-Haul-logo.png",
        "/logos/pods-logo.svg",
        "/logos/two-men-and-truck.jpg",
      ],
      icon: (
        <img
          src="/logos/U-Haul-logo.png"
          alt="U-Haul"
          className="w-5 h-5 object-contain"
        />
      ),
    },
    {
      category: "Travel & Accommodation",
      amount: 485,
      color: "bg-blue-100 text-blue-700",
      businesses: [
        "Southwest Airlines",
        "Hilton Honors",
        "National Car Rental",
      ],
      logos: [
        "/logos/southwest-logo.svg",
        "/logos/hilton-honor-logo.png",
        "/logos/national-car-rental-logo.svg",
      ],
      icon: (
        <img
          src="/logos/southwest-logo.svg"
          alt="Southwest"
          className="w-5 h-5 object-contain"
        />
      ),
    },
    {
      category: "Home Setup & Kids Furniture",
      amount: 420,
      color: "bg-green-100 text-green-700",
      businesses: ["IKEA", "Home Depot", "Target"],
      logos: [
        "/logos/ikea-logo.png",
        "/logos/home-depot-logo.png",
        "/logos/target-logo.png",
      ],
      icon: (
        <img
          src="/logos/ikea-logo.png"
          alt="IKEA"
          className="w-5 h-5 object-contain"
        />
      ),
    },
    {
      category: "Local Experiences",
      amount: 315,
      color: "bg-purple-100 text-purple-700",
      businesses: ["Denver Zoo", "Denver Art Museum", "Snooze"],
      logos: [
        "/logos/denver-zoo-logo.png",
        "/logos/denver-art-museum-logo.svg",
        "/logos/snooze-logo.png",
      ],
      icon: (
        <img
          src="/logos/denver-zoo-logo.png"
          alt="Denver Zoo"
          className="w-5 h-5 object-contain"
        />
      ),
    },
  ];

  const totalSavings = savingsData.reduce((sum, item) => sum + item.amount, 0);
  const bonusPoints = 2800;

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="/illustration/abc-fi/mock/sarah-martinez.jpg"
              alt="Sarah Martinez"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Good afternoon,</p>
            <p className="font-semibold text-gray-900 text-lg">Sarah M.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 active:scale-95 transition-all touch-manipulation">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button className="p-2 relative active:scale-95 transition-all touch-manipulation">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 19h9m-9-4h9m-9-4h9m-9-4h9"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="px-6 mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Move Summary
        </h1>
        <p className="text-gray-600 text-sm">
          Your relocation savings & rewards
        </p>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Total Savings */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-30">
              <img
                src="/illustration/abc-fi/mastercard/save-money.svg"
                alt="Save Money"
                className="w-8 h-8 object-contain"
              />
            </div>
            <p className="text-blue-600 text-sm font-medium mb-1">
              Total Savings
            </p>
            <p className="text-2xl font-bold text-blue-900">
              ${animateNumbers ? totalSavings.toLocaleString() : "0"}
            </p>
          </div>

          {/* Bonus Points */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-30">
              <img
                src="/illustration/abc-fi/mastercard/cashback.svg"
                alt="Cashback"
                className="w-8 h-8 object-contain"
              />
            </div>
            <p className="text-green-600 text-sm font-medium mb-1">
              Bonus Points
            </p>
            <p className="text-2xl font-bold text-green-900">
              {animateNumbers ? bonusPoints.toLocaleString() : "0"}
            </p>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-lg">🎉</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">
                Move Complete!
              </p>
              <p className="text-gray-600 text-xs">
                You saved $1,900 on your Denver relocation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Breakdown */}
      <div className="px-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Savings by Category
        </h3>

        <div className="space-y-3">
          {savingsData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item.category}
                    </h4>
                    <p className="text-lg font-bold text-gray-900">
                      ${animateNumbers ? item.amount.toLocaleString() : "0"}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Business Logos */}
              <div className="flex items-center gap-2">
                {item.logos.slice(0, 4).map((logo, logoIndex) => (
                  <div
                    key={logoIndex}
                    className="w-8 h-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-1"
                  >
                    <img
                      src={logo}
                      alt={item.businesses[logoIndex]}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
                {item.businesses.length > 4 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">
                      +{item.businesses.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Move Highlights
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-600 text-sm">⚡</span>
            </div>
            <p className="font-bold text-gray-900 text-lg">4</p>
            <p className="text-xs text-gray-600">Deals</p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 text-sm">🏪</span>
            </div>
            <p className="font-bold text-gray-900 text-lg">12</p>
            <p className="text-xs text-gray-600">Partners</p>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-gray-100 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-sm">📱</span>
            </div>
            <p className="font-bold text-gray-900 text-lg">1</p>
            <p className="text-xs text-gray-600">Receipt</p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="px-6 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="/illustration/abc-fi/mock/sarah-martinez.jpg"
                alt="Sarah Martinez"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-sm mb-1">
                Sarah Martinez
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                "ABC FI made our move so much easier. The AI found deals I never
                would have discovered!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Continue Your Journey
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs">
                Earn points with local Denver businesses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs">
                Discover family activities in your area
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">
                Start your "Local Discovery" streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
    </MobileLayout>
  );
}
