"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Gift,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Zap,
} from "lucide-react";

interface RefinedCampaignWidgetProps {
  campaignType?: string;
  targetAudience?: string;
  estimatedReach?: string;
  projectedEngagement?: string;
  expectedConversion?: string;
  offers?: string[];
  steps?: string[];
}

export function RefinedCampaignWidget({
  campaignType = "AI-Powered New Mover Journey",
  targetAudience = "New mortgage customers",
  estimatedReach = "2,847 customers",
  projectedEngagement = "68% open rate",
  expectedConversion = "23% conversion",
  offers = [],
  steps = [],
}: RefinedCampaignWidgetProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [giftAmount, setGiftAmount] = useState(100);

  const handleLaunchCampaign = () => {
    setIsConfiguring(true);
  };

  const handleConfirmLaunch = () => {
    // Store configuration and navigate to campaign creation
    const campaignData = {
      type: campaignType,
      audience: targetAudience,
      giftAmount,
      reach: estimatedReach,
      engagement: projectedEngagement,
      conversion: expectedConversion,
      timestamp: new Date().toISOString(),
    };

    sessionStorage.setItem("aiCampaignData", JSON.stringify(campaignData));
    window.location.href =
      "/campaign-manager/campaign-create?source=ai-builder";
  };

  if (isConfiguring) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-4 overflow-hidden border-2 border-blue-200 shadow-lg animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Campaign Configuration
              </h3>
              <p className="text-sm text-gray-600">
                Configure your campaign settings to launch
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Gift Amount Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Gift Card Value</h4>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[50, 100, 150, 200].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setGiftAmount(amount)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    giftAmount === amount
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg font-semibold">${amount}</div>
                  <div className="text-xs text-gray-500">
                    {amount === 50 && "Standard"}
                    {amount === 100 && "Recommended"}
                    {amount === 150 && "Premium"}
                    {amount === 200 && "Deluxe"}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Impact Projection
                  </p>
                  <p className="text-sm text-blue-700">
                    ${giftAmount} gift cards typically generate{" "}
                    {Math.round(giftAmount * 0.032)}% higher engagement and $
                    {(giftAmount * 4.2).toFixed(0)} average customer lifetime
                    value increase.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Launch Timeline</h4>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Campaign setup</span>
                  <span className="text-green-600 font-medium">~2 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">
                    First customer touchpoint
                  </span>
                  <span className="text-green-600 font-medium">~24 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Full campaign active</span>
                  <span className="text-green-600 font-medium">~48 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsConfiguring(false)}
              variant="outline"
              className="flex-1"
            >
              Back to Overview
            </Button>
            <Button
              onClick={handleConfirmLaunch}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Launch Campaign
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-4 rounded-2xl overflow-hidden border border-purple-200/50 shadow-2xl animate-fade-in backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(239, 246, 255, 0.9) 50%, rgba(243, 244, 246, 0.85) 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Header with glassmorphic design */}
      <div
        className="p-6 border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.3) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Sparkles className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {campaignType}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                AI-optimized customer journey
              </p>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background:
                "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              color: "#166534",
            }}
          >
            ✨ Ready to Launch
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div
        className="p-6 border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(248, 250, 252, 0.1) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Projected Impact
        </h4>

        <div className="grid grid-cols-3 gap-4">
          <div
            className="text-center p-5 rounded-xl border border-white/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {estimatedReach.split(" ")[0]}
            </div>
            <div className="text-sm text-blue-700 font-medium">
              Target Customers
            </div>
          </div>

          <div
            className="text-center p-5 rounded-xl border border-white/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {projectedEngagement.split("%")[0]}%
            </div>
            <div className="text-sm text-green-700 font-medium">
              Engagement Rate
            </div>
          </div>

          <div
            className="text-center p-5 rounded-xl border border-white/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
              }}
            >
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {expectedConversion.split("%")[0]}%
            </div>
            <div className="text-sm text-purple-700 font-medium">
              Conversion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Customer Profile */}
      <div className="p-6 border-b bg-gray-50">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          Target Customer Profile
        </h4>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Primary Audience</div>
              <div className="font-semibold text-gray-900">
                {targetAudience}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Geographic Focus</div>
              <div className="font-semibold text-gray-900">
                Denver Metro Area
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Home Value</div>
              <div className="font-semibold text-gray-900">$485K</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Household Income</div>
              <div className="font-semibold text-gray-900">$89K</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Key Behaviors</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Recent mortgage approval
              </Badge>
              <Badge variant="outline" className="text-xs">
                High mobile engagement
              </Badge>
              <Badge variant="outline" className="text-xs">
                Moving-related searches
              </Badge>
              <Badge variant="outline" className="text-xs">
                Premium banking tier
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Steps */}
      <div className="p-6 border-b">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-indigo-600" />
          Customer Journey Flow
        </h4>

        <div className="space-y-3">
          {[
            {
              step: 1,
              title: "AI Gift Personalization",
              desc: "Personalized $100 gift card based on customer preferences",
              color: "blue",
            },
            {
              step: 2,
              title: "Moving Conversation",
              desc: "AI-powered chat about moving needs and planning",
              color: "green",
            },
            {
              step: 3,
              title: "Partner Offers Bundle",
              desc: "Curated offers from U-Haul, Public Storage, Hilton",
              color: "purple",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}
              >
                <span className={`text-sm font-bold text-${item.color}-600`}>
                  {item.step}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div
        className="p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(248, 250, 252, 0.2) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={handleLaunchCampaign}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            boxShadow:
              "0 10px 30px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <Zap className="w-5 h-5" />
          Configure & Launch Campaign
        </button>

        <p className="text-center text-sm text-gray-600 mt-4 font-medium">
          ⚡ Campaign will be ready to launch in ~2 hours after configuration
        </p>
      </div>
    </div>
  );
}
