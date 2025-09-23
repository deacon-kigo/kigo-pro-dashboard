/**
 * Lightning Strategy UI Component
 *
 * Step 4 of Tucker Williams' campaign creation workflow
 * Shows lightning offers strategy with AI optimization and market growth opportunities
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Clock,
  TrendingUp,
  MapPin,
  AlertCircle,
  ArrowRight,
  Target,
  Users,
  DollarSign,
  Brain,
} from "lucide-react";

interface LightningOffer {
  id: string;
  phase: string;
  title: string;
  scarcity: string;
  window: string;
  impact: string;
  color: string;
}

interface MarketGrowth {
  market: string;
  growth: string;
  color: string;
}

interface LightningStrategyUIProps {
  onLaunchCampaign?: () => void;
}

export default function LightningStrategyUI({
  onLaunchCampaign,
}: LightningStrategyUIProps) {
  const [showMarketAlert, setShowMarketAlert] = useState(true);

  const lightningOffers: LightningOffer[] = [
    {
      id: "phase-1-offer",
      phase: "Phase 1",
      title: "40% off moving company",
      scarcity: "1 of 200 available",
      window: "48-hour window",
      impact: "+34% engagement",
      color: "bg-blue-500",
    },
    {
      id: "phase-2-offer",
      phase: "Phase 2",
      title: "Hotel suite upgrade",
      scarcity: "1 of 300 available",
      window: "Arrival-triggered",
      impact: "+28% conversion",
      color: "bg-green-500",
    },
    {
      id: "phase-3-offer",
      phase: "Phase 3",
      title: "Free furniture delivery",
      scarcity: "1 of 500 available",
      window: "Setup-phase triggered",
      impact: "+42% adoption",
      color: "bg-purple-500",
    },
    {
      id: "phase-4-offer",
      phase: "Phase 4",
      title: "Local discovery package",
      scarcity: "1 of 400 available",
      window: "Integration-phase",
      impact: "+38% retention",
      color: "bg-orange-500",
    },
  ];

  const marketGrowthData: MarketGrowth[] = [
    { market: "Denver", growth: "+34%", color: "text-blue-600" },
    { market: "Austin", growth: "+28%", color: "text-green-600" },
    { market: "Seattle", growth: "+31%", color: "text-purple-600" },
    { market: "Charleston", growth: "+42%", color: "text-orange-600" },
  ];

  const optimizationMetrics = {
    engagementBoost: "+34%",
    revenueIncrease: "+$67",
    timingAccuracy: "94%",
    customerSatisfaction: "+23 NPS",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lightning Offers & Optimization
          </h3>
          <p className="text-sm text-gray-600">
            AI-optimized scarcity strategy with performance enhancement
          </p>
        </div>
      </div>

      {/* AI Optimization Strategy */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-yellow-600" />
            AI Optimization Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {optimizationMetrics.engagementBoost}
              </p>
              <p className="text-xs text-gray-600">Engagement Boost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {optimizationMetrics.revenueIncrease}
              </p>
              <p className="text-xs text-gray-600">Revenue per Customer</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {optimizationMetrics.timingAccuracy}
              </p>
              <p className="text-xs text-gray-600">Timing Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {optimizationMetrics.customerSatisfaction}
              </p>
              <p className="text-xs text-gray-600">NPS Improvement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lightning Offers by Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lightningOffers.map((offer) => (
          <Card
            key={offer.id}
            className="border-2 border-gray-200 hover:border-yellow-300 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg ${offer.color} flex items-center justify-center text-white`}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    {offer.phase}: {offer.title}
                  </CardTitle>
                  <Badge className="bg-red-100 text-red-700 text-xs mt-1">
                    {offer.scarcity}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{offer.window}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">
                    {offer.impact}
                  </span>
                </div>
                <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                  Phase-specific timing creates urgency without pressure
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Growth Intelligence Alert */}
      {showMarketAlert && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-base font-semibold text-blue-900">
                    Kigo PRO AI Intelligence Alert
                  </CardTitle>
                  <p className="text-sm text-blue-700">
                    Market growth opportunities detected
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMarketAlert(false)}
                className="text-blue-600 hover:bg-blue-100"
              >
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-blue-800">
                "Tucker, before we launch - I'm detecting increased home-buying
                activity in multiple growth markets this quarter. Should I alert
                local partners and advertisers about acquisition opportunities
                to capture this increasing demand?"
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {marketGrowthData.map((market) => (
                  <div
                    key={market.market}
                    className="text-center p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {market.market}
                    </p>
                    <p className={`text-lg font-bold ${market.color}`}>
                      {market.growth}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    console.log(
                      "Notify local partners about growth opportunities"
                    );
                    setShowMarketAlert(false);
                  }}
                >
                  Yes, notify local partners
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => setShowMarketAlert(false)}
                >
                  Launch without alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategy Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Lightning Strategy Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">
                  Phase-Specific Timing
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                Offers triggered by customer journey progression for maximum
                relevance
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">
                  Scarcity Management
                </h4>
              </div>
              <p className="text-sm text-green-700">
                Limited quantity creates urgency without pressure or
                manipulation
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">
                  Cross-Phase Integration
                </h4>
              </div>
              <p className="text-sm text-purple-700">
                Early offers inform later opportunities for personalized
                experiences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Enhancement Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-purple-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Lightning Strategy Performance Enhancement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold text-green-600">+34%</p>
                <p className="text-sm text-gray-600">
                  Engagement Rate Increase
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">+$67</p>
                <p className="text-sm text-gray-600">
                  Additional Revenue per Customer
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">94%</p>
                <p className="text-sm text-gray-600">Timing Accuracy Score</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onLaunchCampaign}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
          size="lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          Launch Optimized Campaign
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
