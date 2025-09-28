"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Home,
  UtensilsCrossed,
} from "lucide-react";

interface CampaignPlanCardProps {
  title?: string;
  className?: string;
  isCompact?: boolean;
}

export function CampaignPlanCard({
  title = "New Homeowner Welcome Campaign",
  className = "",
  isCompact = false,
}: CampaignPlanCardProps) {
  if (isCompact) {
    return (
      <div
        className={`bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/30 ${className}`}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
              Ready to Launch
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
              High ROI
            </Badge>
          </div>
        </div>

        {/* Compact Campaign Sections */}
        <div className="space-y-3">
          {/* The Offer */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Gift className="w-3 h-3 text-purple-600" />
              $100 Gift Options
            </h4>
            <div className="grid grid-cols-3 gap-1">
              <div className="bg-gray-50 rounded p-1 text-center">
                <div className="text-sm">🏠</div>
                <p className="text-xs">Home Depot</p>
              </div>
              <div className="bg-gray-50 rounded p-1 text-center">
                <div className="text-sm">✨</div>
                <p className="text-xs">Cleaning</p>
              </div>
              <div className="bg-gray-50 rounded p-1 text-center">
                <div className="text-sm">🍽️</div>
                <p className="text-xs">Dining</p>
              </div>
            </div>
          </div>

          {/* Customer Journey */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Users className="w-3 h-3 text-blue-600" />
              Customer Journey
            </h4>
            <div className="flex items-center justify-between gap-1">
              <div className="flex-1 text-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Gift className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs">Select</p>
              </div>
              <div className="text-xs text-gray-400">→</div>
              <div className="flex-1 text-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs">Deliver</p>
              </div>
              <div className="text-xs text-gray-400">→</div>
              <div className="flex-1 text-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-1">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs">Follow-up</p>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2 text-sm">
              <Target className="w-3 h-3 text-green-600" />
              Partners
            </h4>
            <div className="flex justify-center gap-1">
              {["🏠", "🔨", "📱", "🛋️", "🔧", "⭐"].map((logo, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 bg-white rounded shadow-sm flex items-center justify-center text-xs"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full detailed version
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="flex justify-center gap-2">
          <Badge className="bg-green-100 text-green-700">Ready to Launch</Badge>
          <Badge className="bg-blue-100 text-blue-700">Partner Co-Funded</Badge>
          <Badge className="bg-purple-100 text-purple-700">+33% ROI</Badge>
        </div>
      </div>

      {/* Section 1: The Offer */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-600" />
          Section 1: The Offer - A $100 Congratulatory Gift
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option A */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Option A</h4>
                <p className="text-sm text-gray-600">
                  $100 Home Depot Gift Card
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> 78% of new homeowners visit a home
              improvement store within 30 days of moving.
            </p>
          </div>

          {/* Option B */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Option B</h4>
                <p className="text-sm text-gray-600">
                  Professional Home Cleaning Service
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> 65% of relocating families hire a
              cleaning service within their first month.
            </p>
          </div>

          {/* Option C */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Option C</h4>
                <p className="text-sm text-gray-600">Local Dining Experience</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> 84% of new residents explore local
              dining options within the first two weeks.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Customer Experience */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Section 2: The Customer Experience
        </h3>
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          {/* Step 1 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Gift Selection</h4>
            <p className="text-sm text-gray-600">
              Customer receives an in-app notification to select their gift.
            </p>
          </div>

          <div className="px-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          </div>

          {/* Step 2 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Gift Delivery</h4>
            <p className="text-sm text-gray-600">
              The digital gift card or voucher is delivered instantly to their
              Kigo Hub.
            </p>
          </div>

          <div className="px-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-green-600"></div>
          </div>

          {/* Step 3 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Follow-Up</h4>
            <p className="text-sm text-gray-600">
              After 30 days, Kigo automatically presents relevant offers for
              home services and furnishings.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Brand Partnership Network */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Section 3: Our Brand Partnership Network
        </h3>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: "The Home Depot", logo: "🏠" },
              { name: "Lowe's", logo: "🔨" },
              { name: "Best Buy", logo: "📱" },
              { name: "Wayfair", logo: "🛋️" },
              { name: "TaskRabbit", logo: "🔧" },
              { name: "Yelp", logo: "⭐" },
            ].map((partner, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2 text-2xl">
                  {partner.logo}
                </div>
                <p className="text-xs font-medium text-gray-700">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
