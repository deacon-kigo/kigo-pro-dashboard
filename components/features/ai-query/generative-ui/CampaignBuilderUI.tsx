/**
 * Generative UI: Campaign Builder Component
 *
 * Dynamically generated when user asks to create campaigns
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface CampaignBuilderUIProps {
  campaignType: string;
  targetAudience: string;
  offers: string[];
  steps?: string[];
  audience?: string;
  funding?: string;
}

export default function CampaignBuilderUI({
  campaignType,
  targetAudience,
  offers,
  steps,
  audience,
  funding,
}: CampaignBuilderUIProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([
    "$100 AI Gift Personalization",
    "Moving Journey Bundle",
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  const toggleOffer = (offer: string) => {
    setSelectedOffers((prev) =>
      prev.includes(offer) ? prev.filter((o) => o !== offer) : [...prev, offer]
    );
  };

  return (
    <div className="space-y-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Builder
            </h3>
            <p className="text-sm text-gray-600">{campaignType}</p>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          Step {currentStep} of 3
        </Badge>
      </div>

      {/* Campaign Overview */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {targetAudience}
              </Badge>
              <span className="text-sm text-gray-600">
                • {audience || "2,847 customers identified"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-900">$89K</p>
                <p className="text-xs text-blue-600">Avg. Income</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-semibold text-green-900">78%</p>
                <p className="text-xs text-green-600">Engagement</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <p className="text-lg font-semibold text-purple-900">3.2x</p>
                <p className="text-xs text-purple-600">ROI Potential</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversational Flow Steps */}
      {steps && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Conversational Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{step}</p>
                    {index === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        AI personalizes gift options based on customer profile
                      </p>
                    )}
                    {index === 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        "Is there anything else we can help you with to plan
                        your move?"
                      </p>
                    )}
                    {index === 2 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Pre-built bundle with U-Haul, Public Storage, Hilton
                        offers
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partner Network */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Partner Network Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="grid grid-cols-1 gap-2">
            {offers.map((offer, index) => (
              <button
                key={index}
                onClick={() => toggleOffer(offer)}
                className={`p-2 rounded-lg border-2 text-left transition-all ${
                  selectedOffers.includes(offer)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {offer}
                  </span>
                  {selectedOffers.includes(offer) && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projected Results */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Projected Campaign Results
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-xl font-bold text-green-900">$127K</p>
              <p className="text-xs text-green-600 font-medium">Revenue</p>
              <p className="text-xs text-green-500">+23% vs baseline</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <p className="text-xl font-bold text-blue-900">445%</p>
              <p className="text-xs text-blue-600 font-medium">ROI</p>
              <p className="text-xs text-blue-500">Industry leading</p>
            </div>
            <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-xl font-bold text-purple-900">6 wks</p>
              <p className="text-xs text-purple-600 font-medium">Timeline</p>
              <p className="text-xs text-purple-500">Ready to launch</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-medium">
              💡 AI Insight: Peak conversion expected during spring home-buying
              season
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Funding Model (for brand-funded campaigns) */}
      {funding && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Funding Model
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {funding}
                </span>
              </div>
              <p className="text-xs text-green-700">
                Zero cost to ABC FI - all point rewards and campaign costs
                covered by advertiser partnership
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Configure Campaign
        </Button>
        <Button variant="outline" size="sm">
          Save Draft
        </Button>
      </div>
    </div>
  );
}
