"use client";

import React from "react";
import { Gift, Mail, TrendingUp, Home, Utensils, Sparkles } from "lucide-react";

interface CampaignPlanUIProps {
  title?: string;
  className?: string;
}

export function CampaignPlanUI({
  title = "New Homeowner Welcome Campaign",
  className = "",
}: CampaignPlanUIProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header - More Compact */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
      </div>

      {/* Section 1: The Offer - A $100 Congratulatory Gift */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4 text-blue-600" />
          Section 1: The Offer - A $100 Congratulatory Gift
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Option A: Home Depot Gift Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-medium text-gray-900 text-center mb-1 text-sm">
              Option A: $100 Home Depot Gift Card
            </h4>
            <p className="text-xs text-gray-600 text-center">
              <strong>Insight:</strong> 78% visit home improvement stores within
              30 days.
            </p>
          </div>

          {/* Option B: Professional Home Cleaning Service */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-medium text-gray-900 text-center mb-1 text-sm">
              Option B: Professional Home Cleaning Service
            </h4>
            <p className="text-xs text-gray-600 text-center">
              <strong>Insight:</strong> 65% hire cleaning services within first
              month.
            </p>
          </div>

          {/* Option C: Local Dining Experience */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
            </div>
            <h4 className="font-medium text-gray-900 text-center mb-1 text-sm">
              Option C: Local Dining Experience
            </h4>
            <p className="text-xs text-gray-600 text-center">
              <strong>Insight:</strong> 84% explore local dining within two
              weeks.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: The Customer Experience */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Section 2: The Customer Experience
        </h3>

        {/* 3-Icon Horizontal Timeline - More Compact */}
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Icon 1: Gift Selection */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1 text-sm">
              Gift Selection
            </h4>
            <p className="text-xs text-gray-600 max-w-24">
              In-app notification to select gift.
            </p>
          </div>

          {/* Connection Line */}
          <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 mx-4 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>

          {/* Icon 2: Gift Delivery */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1 text-sm">
              Gift Delivery
            </h4>
            <p className="text-xs text-gray-600 max-w-24">
              Instant delivery to Kigo Hub.
            </p>
          </div>

          {/* Connection Line */}
          <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 mx-4 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
          </div>

          {/* Icon 3: Follow-Up */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1 text-sm">
              Follow-Up
            </h4>
            <p className="text-xs text-gray-600 max-w-24">
              30-day follow-up offers.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Brand Partnership Network - More Compact */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">
          Our Brand Partnership Network
        </h3>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Partner logos - more compact */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Home className="w-3 h-3 text-orange-600" />
            <span className="font-medium text-gray-700">Home Depot</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Home className="w-3 h-3 text-blue-600" />
            <span className="font-medium text-gray-700">Lowe's</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Sparkles className="w-3 h-3 text-yellow-600" />
            <span className="font-medium text-gray-700">Best Buy</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Home className="w-3 h-3 text-purple-600" />
            <span className="font-medium text-gray-700">Wayfair</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Sparkles className="w-3 h-3 text-green-600" />
            <span className="font-medium text-gray-700">TaskRabbit</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs">
            <Utensils className="w-3 h-3 text-red-600" />
            <span className="font-medium text-gray-700">Yelp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
