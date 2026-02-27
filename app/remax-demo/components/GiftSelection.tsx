"use client";

import { useState } from "react";
import { MobileLayout } from "./MobileLayout";

interface GiftSelectionProps {
  onGiftSelected: (giftId: string) => void;
  onNext: () => void;
}

interface Gift {
  id: string;
  title: string;
  merchant: string;
  logo: string;
  value: string;
  description: string;
  category: "restaurant" | "home-goods" | "local-service";
}

export function GiftSelection({ onGiftSelected, onNext }: GiftSelectionProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const gifts: Gift[] = [
    {
      id: "restaurant-1",
      title: "20% Off Olive & Finch",
      merchant: "Popular Italian Restaurant",
      logo: "/illustration/abc-fi/mock/italian-restaurant.jpg",
      value: "20% OFF",
      description: "Discover authentic Italian cuisine in downtown Denver",
      category: "restaurant",
    },
    {
      id: "home-goods-1",
      title: "15% Off Home Depot",
      merchant: "Home Improvement",
      logo: "/logos/home-depot-logo.png",
      value: "15% OFF",
      description: "Everything you need for your new home",
      category: "home-goods",
    },
    {
      id: "local-service-1",
      title: "25% Off Denver Cleaning Co",
      merchant: "Professional Cleaning Service",
      logo: "/illustration/abc-fi/mock/cleaning-service.jpg",
      value: "25% OFF",
      description: "Professional home cleaning for your new place",
      category: "local-service",
    },
  ];

  const handleGiftSelection = (giftId: string) => {
    setSelectedGift(giftId);
    setShowConfirmation(true);

    // Simulate gift card delivery
    setTimeout(() => {
      onGiftSelected(giftId);
      onNext();
    }, 2000);
  };

  if (showConfirmation && selectedGift) {
    const gift = gifts.find((g) => g.id === selectedGift);
    return (
      <MobileLayout>
        <div className="bg-gradient-to-b from-green-50 to-white min-h-full flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
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

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Discount Activated!
            </h2>

            <p className="text-gray-600 mb-4">
              Your {gift?.value} discount for {gift?.title} has been added to
              your RE/MAX Rewards
            </p>

            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img
                    src={gift?.logo}
                    alt={gift?.merchant}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{gift?.title}</h3>
                  <p className="text-sm text-gray-600">{gift?.description}</p>
                  <p className="text-sm font-semibold text-green-600">
                    {gift?.value} Discount
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-pulse">
              <p className="text-sm text-gray-500">
                Continuing to your move planning...
              </p>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-red-50 to-white min-h-full">
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
              <div className="px-3 py-1 bg-red-100 rounded-full">
                <span className="text-xs font-medium text-red-700">
                  Welcome Gift
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Denver, Jessica!
            </h1>
            <p className="text-gray-600 text-sm">
              Choose your exclusive housewarming discount
            </p>
          </div>
        </div>

        {/* AI Personalized Gift Options */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-2xl p-4 mb-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-purple-900 text-sm">
                  AI-Personalized for You
                </h3>
                <p className="text-xs text-purple-700">
                  Based on your family profile and Denver location
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Your Gift
          </h2>

          <div className="space-y-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                onClick={() => handleGiftSelection(gift.id)}
                className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-red-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <img
                      src={gift.logo}
                      alt={gift.merchant}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">
                        {gift.title}
                      </h3>
                      <span className="text-lg font-bold text-green-600">
                        {gift.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {gift.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        {gift.category === "restaurant" && "🍽️ Dining"}
                        {gift.category === "home-goods" && "🏠 Home & Kitchen"}
                        {gift.category === "local-service" &&
                          "🧹 Local Service"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {gift.merchant}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Explanation */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <img
                  src="/mock/remax_logo.svg"
                  alt="RE/MAX"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  Why these options?
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your RE/MAX agent's AI selected these discounts based on your
                  family profile (married with 2 kids), your new Denver
                  location, and popular choices for new homeowners in your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
