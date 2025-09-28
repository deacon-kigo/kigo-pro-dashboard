"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Home,
  Sparkles,
  UtensilsCrossed,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

interface GiftOption {
  id: string;
  title: string;
  description: string;
  insight: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  emoji: string;
  percentage: string;
}

interface GiftSelectionUIProps {
  onGiftSelect: (giftId: string, giftAmount: number) => void;
  className?: string;
}

const GIFT_OPTIONS: GiftOption[] = [
  {
    id: "home-depot",
    title: "Home Depot Gift Card",
    description: "Perfect for home improvement needs",
    insight:
      "78% of new homeowners visit a home improvement store within 30 days of moving.",
    icon: Home,
    color: "bg-orange-500",
    emoji: "🏠",
    percentage: "78%",
  },
  {
    id: "cleaning-service",
    title: "Professional Home Cleaning Service",
    description: "Professional cleaning for your new place",
    insight:
      "65% of relocating families hire a cleaning service within their first month.",
    icon: Sparkles,
    color: "bg-blue-500",
    emoji: "✨",
    percentage: "65%",
  },
  {
    id: "dining-experience",
    title: "Local Dining Experience",
    description: "Explore local dining options",
    insight:
      "84% of new residents explore local dining options within the first two weeks.",
    icon: UtensilsCrossed,
    color: "bg-green-500",
    emoji: "🍽️",
    percentage: "84%",
  },
];

const GIFT_AMOUNTS = [50, 75, 100, 125, 150];

export function GiftSelectionUI({
  onGiftSelect,
  className = "",
}: GiftSelectionUIProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [step, setStep] = useState<"amount" | "gift">("amount");

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setStep("gift");
  };

  const handleGiftSelect = (giftId: string) => {
    setSelectedGift(giftId);
  };

  const handleConfirm = () => {
    if (selectedGift) {
      onGiftSelect(selectedGift, selectedAmount);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Configure Your Welcome Gift
        </h3>
        <p className="text-gray-600 text-sm">
          Let's set up the perfect welcome gift for new homeowners
        </p>
      </div>

      {/* Step 1: Gift Amount Selection */}
      {step === "amount" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Step 1: Select Gift Amount
            </h4>
            <p className="text-gray-600 text-sm">
              Choose the value for your congratulatory gift
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {GIFT_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  selectedAmount === amount
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    ${amount}
                  </div>
                  <div className="text-xs text-gray-500">Gift Value</div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Recommended: $100
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Based on industry data, $100 gifts have the highest engagement
              rate (89%) and provide optimal ROI for new homeowner campaigns.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Gift Type Selection */}
      {step === "gift" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Step 2: Choose Gift Options
            </h4>
            <p className="text-gray-600 text-sm">
              Select the ${selectedAmount} gift options to offer customers
            </p>
          </div>

          <div className="space-y-4">
            {GIFT_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedGift === option.id;

              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleGiftSelect(option.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon and Emoji */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-md`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl">{option.emoji}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-gray-900">
                            {option.title}
                          </h5>
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            ${selectedAmount}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {option.description}
                        </p>

                        {/* Insight */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-gray-700">
                              Data Insight
                            </span>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {option.percentage}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {option.insight}
                          </p>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep("amount")}
              className="flex-1"
            >
              ← Back to Amount
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedGift}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirm Selection →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
