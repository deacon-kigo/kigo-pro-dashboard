"use client";

import React, { useState } from "react";
import {
  Gift,
  DollarSign,
  CheckCircle,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

interface CampaignGiftAmountSectionProps {
  onAmountSet: (amount: number) => void;
  className?: string;
}

export function CampaignGiftAmountSection({
  onAmountSet,
  className = "",
}: CampaignGiftAmountSectionProps) {
  const [giftAmount, setGiftAmount] = useState<number>(100);
  const [isAmountSet, setIsAmountSet] = useState(false);

  const presetAmounts = [50, 100, 150, 200];

  const handleAmountChange = (amount: number) => {
    setGiftAmount(amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setGiftAmount(value);
  };

  const handleSetAmount = () => {
    if (giftAmount > 0) {
      setIsAmountSet(true);

      setTimeout(() => {
        onAmountSet(giftAmount);
      }, 500);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Create a Gift Card Gift Reward
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Configure the congratulatory gift budget
        </p>
      </div>

      {/* Amount Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Gift Budget
        </h4>

        {/* Preset Amounts */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountChange(amount)}
              className={`
                p-3 rounded-lg border text-center transition-all duration-200 shadow-sm
                ${
                  giftAmount === amount
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                }
              `}
            >
              <div className="text-lg font-bold">${amount}</div>
              <div className="text-xs opacity-80">Gift Value</div>
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">
            Custom Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={giftAmount}
              onChange={handleCustomAmountChange}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Gift Preview with AI Insights */}
      <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
        <h4 className="font-semibold text-purple-900 text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          AI-Recommended Gift Options
        </h4>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 bg-white border border-gray-100 p-2">
                <img
                  src="/logos/home-depot-logo.png"
                  alt="Home Depot"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    ${giftAmount} Home Depot Gift Card
                  </div>
                  <div className="text-right">
                    <div className="text-orange-600 font-bold text-lg">78%</div>
                    <div className="text-xs text-gray-500">adoption rate</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Perfect for home improvement needs
                </div>
                <div className="text-xs text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 rounded px-2 py-1 border border-blue-200">
                  <strong>AI Insight:</strong> 78% of new homeowners visit a
                  home improvement store within 30 days of moving
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 bg-white border border-gray-100 p-1">
                <img
                  src="/logos/williams_sonoma_logo.svg"
                  alt="Williams Sonoma"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    ${giftAmount} Williams Sonoma Gift Card
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-bold text-lg">65%</div>
                    <div className="text-xs text-gray-500">adoption rate</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Premium kitchen and home essentials
                </div>
                <div className="text-xs text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 rounded px-2 py-1 border border-blue-200">
                  <strong>AI Insight:</strong> 65% of relocating families hire a
                  cleaning service within their first month
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 bg-gray-50 border border-gray-100">
                <div className="text-4xl">✨</div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-gray-900 text-sm">
                    ${giftAmount} Professional Cleaning Service
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-bold text-lg">65%</div>
                    <div className="text-xs text-gray-500">adoption rate</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Professional cleaning for your new place
                </div>
                <div className="text-xs text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 rounded px-2 py-1 border border-blue-200">
                  <strong>AI Insight:</strong> 65% of relocating families hire a
                  cleaning service within their first month
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Amount Button */}
      {!isAmountSet ? (
        <button
          onClick={handleSetAmount}
          disabled={giftAmount <= 0}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Set ${giftAmount} Gift Budget
        </button>
      ) : (
        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              ${giftAmount} gift budget configured
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
