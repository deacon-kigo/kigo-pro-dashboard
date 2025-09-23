"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";

interface LightningDealsProps {
  onNext: () => void;
}

export function LightningDeals({ onNext }: LightningDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    movers: { hours: 46, minutes: 23 },
    storage: { hours: 44, minutes: 15 },
    flights: { hours: 68, minutes: 45 },
    furniture: { hours: 20, minutes: 8 },
  });

  const [claimedDeals, setClaimedDeals] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => ({
        movers: {
          hours:
            prev.movers.minutes > 0 ? prev.movers.hours : prev.movers.hours - 1,
          minutes: prev.movers.minutes > 0 ? prev.movers.minutes - 1 : 59,
        },
        storage: {
          hours:
            prev.storage.minutes > 0
              ? prev.storage.hours
              : prev.storage.hours - 1,
          minutes: prev.storage.minutes > 0 ? prev.storage.minutes - 1 : 59,
        },
        flights: {
          hours:
            prev.flights.minutes > 0
              ? prev.flights.hours
              : prev.flights.hours - 1,
          minutes: prev.flights.minutes > 0 ? prev.flights.minutes - 1 : 59,
        },
        furniture: {
          hours:
            prev.furniture.minutes > 0
              ? prev.furniture.hours
              : prev.furniture.hours - 1,
          minutes: prev.furniture.minutes > 0 ? prev.furniture.minutes - 1 : 59,
        },
      }));
    }, 60000); // Update every minute for demo

    return () => clearInterval(timer);
  }, []);

  const claimDeal = (dealId: string) => {
    setClaimedDeals((prev) => [...prev, dealId]);
  };

  return (
    <div className="h-full bg-white overflow-hidden">
      {/* Sticky Status Bar */}
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

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
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
            ⚡ Limited Time - Perfect for Your Move!
          </h1>
          <p className="text-gray-600 text-sm">Exclusive deals ending soon</p>
        </div>
      </div>

      {/* Lightning Deals */}
      <div className="px-6 space-y-4 mb-6">
        {/* Two Men and a Truck */}
        <Card
          className={`${claimedDeals.includes("movers") ? "bg-green-50 border-green-200" : "bg-white"} border`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                1 of 200
              </span>
              <span className="text-xs text-gray-600">
                {timeLeft.movers.hours}h {timeLeft.movers.minutes}m left
              </span>
            </div>
            {claimedDeals.includes("movers") && (
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                ✓ Claimed
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10 3v4h4V3m-4 4h4v4h-4V7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                40% off Two Men and a Truck
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                KC → Denver full service move
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">$1,440</span>
                <span className="text-sm text-gray-500 line-through">
                  $2,400
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                  Save $960
                </span>
              </div>
            </div>
          </div>

          {!claimedDeals.includes("movers") ? (
            <Button
              onClick={() => claimDeal("movers")}
              className="w-full mt-4 bg-red-500 hover:bg-red-600"
            >
              Claim Deal
            </Button>
          ) : (
            <div className="mt-4 p-3 bg-green-100 rounded-xl text-center">
              <p className="text-green-700 font-medium text-sm">
                Deal claimed! Check your email for details.
              </p>
            </div>
          )}
        </Card>

        {/* U-Haul Storage */}
        <Card
          className={`${claimedDeals.includes("storage") ? "bg-green-50 border-green-200" : "bg-white"} border`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                1 of 500
              </span>
              <span className="text-xs text-gray-600">
                {timeLeft.storage.hours}h {timeLeft.storage.minutes}m left
              </span>
            </div>
            {claimedDeals.includes("storage") && (
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                ✓ Claimed
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                FREE month U-Haul storage Denver
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                10x10 climate controlled unit
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">FREE</span>
                <span className="text-sm text-gray-500 line-through">$89</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                  Save $89
                </span>
              </div>
            </div>
          </div>

          {!claimedDeals.includes("storage") ? (
            <Button
              onClick={() => claimDeal("storage")}
              className="w-full mt-4 bg-red-500 hover:bg-red-600"
            >
              Claim Deal
            </Button>
          ) : (
            <div className="mt-4 p-3 bg-green-100 rounded-xl text-center">
              <p className="text-green-700 font-medium text-sm">
                Deal claimed! Storage reserved in Denver.
              </p>
            </div>
          )}
        </Card>

        {/* Southwest Flights */}
        <Card className="bg-white border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                1 of 300
              </span>
              <span className="text-xs text-gray-600">
                {timeLeft.flights.hours}h {timeLeft.flights.minutes}m left
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                50% off Southwest flights
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                KC → Denver family of 4
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">$600</span>
                <span className="text-sm text-gray-500 line-through">
                  $1,200
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                  Save $600
                </span>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4 bg-red-500 hover:bg-red-600">
            Save for Later
          </Button>
        </Card>

        {/* Kids Furniture */}
        <Card className="bg-white border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                1 of 800
              </span>
              <span className="text-xs text-gray-600">
                {timeLeft.furniture.hours}h {timeLeft.furniture.minutes}m left
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                35% off West Elm kids' bedroom sets
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Perfect for Emma & Jake
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">$910</span>
                <span className="text-sm text-gray-500 line-through">
                  $1,400
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                  Save $490
                </span>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4 bg-red-500 hover:bg-red-600">
            Save for Later
          </Button>
        </Card>
      </div>
    </div>
  );
}
