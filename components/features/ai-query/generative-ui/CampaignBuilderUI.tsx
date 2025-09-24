/**
 * Generative UI: Campaign Builder Component
 *
 * Dynamically generated when user asks to create campaigns
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  // Interactive wizard states
  const [currentWizardStep, setCurrentWizardStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Campaign configuration states
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [giftValue, setGiftValue] = useState(100);
  const [followUpQuestion, setFollowUpQuestion] = useState(
    "Is there anything else we can help you with to plan your move?"
  );

  // Audience insights (shown after brief analysis)
  const [audienceInsights, setAudienceInsights] = useState<any>(null);

  // Brief initial analysis then show interactive wizard
  React.useEffect(() => {
    const runInitialAnalysis = async () => {
      // Brief analysis (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAudienceInsights({
        count: "2,847 customers",
        avgIncome: "$89K",
        engagement: "78%",
        roiPotential: "3.2x",
      });

      setIsAnalyzing(false);
      setSelectedOffers([
        "$100 AI Gift Personalization",
        "Moving Journey Bundle",
      ]);
    };

    runInitialAnalysis();
  }, []);

  const toggleOffer = (offer: string) => {
    setSelectedOffers((prev) =>
      prev.includes(offer) ? prev.filter((o) => o !== offer) : [...prev, offer]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
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
                      <p className="text-lg font-semibold text-blue-900">
                        $89K
                      </p>
                      <p className="text-xs text-blue-600">Avg. Income</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-semibold text-green-900">
                        78%
                      </p>
                      <p className="text-xs text-green-600">Engagement</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <p className="text-lg font-semibold text-purple-900">
                        3.2x
                      </p>
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
                    Conversational Flow Overview
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
                          <p className="text-sm font-medium text-gray-900">
                            {step}
                          </p>
                          {index === 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              AI personalizes gift options based on customer
                              profile
                            </p>
                          )}
                          {index === 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                              "Is there anything else we can help you with to
                              plan your move?"
                            </p>
                          )}
                          {index === 2 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Pre-built bundle with U-Haul, Public Storage,
                              Hilton offers
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
          </>
        );

      case 2:
        return (
          <>
            {/* Step 1: Configure AI Gift */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Step 1: AI-Powered Gifting Moment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Gift Value
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={giftValue}
                        onChange={(e) => setGiftValue(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        AI Gift Personalization Enabled
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      AI will offer 3 personalized gift choices based on
                      customer profile (restaurant, home goods, local service)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Configure Follow-up */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Step 2: Follow-Up Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    AI Agent Question
                  </label>
                  <textarea
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This question will be asked after the gift is delivered
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        );

      case 3:
        return (
          <>
            {/* Step 3: Journey Bundle Configuration */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Step 3: Moving Journey Bundle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 mb-3">
                    Select partner offers to include in the Moving Journey
                    bundle:
                  </p>
                  {[
                    "U-Haul Moving Services",
                    "Public Storage",
                    "Hilton Hotels",
                    "Two Men and a Truck",
                    "Home Depot",
                  ].map((partner) => (
                    <div
                      key={partner}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={[
                            "U-Haul Moving Services",
                            "Public Storage",
                            "Hilton Hotels",
                          ].includes(partner)}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {partner}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {partner.includes("U-Haul")
                          ? "15% off"
                          : partner.includes("Storage")
                            ? "First month free"
                            : partner.includes("Hilton")
                              ? "20% off"
                              : "10% off"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Ready to Launch */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="text-sm font-semibold text-green-900">
                      Campaign Ready to Launch
                    </h4>
                    <p className="text-xs text-green-700">
                      All steps configured successfully
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-lg font-bold text-green-900">
                      ${giftValue}
                    </p>
                    <p className="text-xs text-green-600">Gift Value</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-lg font-bold text-green-900">567</p>
                    <p className="text-xs text-green-600">Target Customers</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-lg font-bold text-green-900">$127K</p>
                    <p className="text-xs text-green-600">Projected Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );

      default:
        return null;
    }
  };

  // Show brief analysis first
  if (isAnalyzing) {
    return (
      <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Campaign Builder
            </h3>
            <p className="text-sm text-purple-600">
              Analyzing ABC FI customer data...
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Identifying optimal audience segments and campaign opportunities...
          </p>
        </div>
      </div>
    );
  }

  // Interactive wizard - Tucker architects the campaign with AI guidance
  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Architecture Builder
            </h3>
            <p className="text-sm text-gray-600">{campaignType}</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
          Step {currentWizardStep} of 3
        </Badge>
      </div>

      {/* Audience Insights */}
      {audienceInsights && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Target Audience Insights
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
                  • {audienceInsights.count} identified
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900">
                    {audienceInsights.avgIncome}
                  </p>
                  <p className="text-xs text-blue-600">Avg. Income</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-900">
                    {audienceInsights.engagement}
                  </p>
                  <p className="text-xs text-green-600">Engagement</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <p className="text-lg font-semibold text-purple-900">
                    {audienceInsights.roiPotential}
                  </p>
                  <p className="text-xs text-purple-600">ROI Potential</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Configuration Steps */}
      {currentWizardStep === 1 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Step 1: Configure AI Gift Personalization
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gift Value (Tucker, set your housewarming gift amount)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={giftValue}
                    onChange={(e) => setGiftValue(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  AI will personalize gift options based on customer profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentWizardStep === 2 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Step 2: Configure Follow-up Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Question (Tucker, customize your engagement message)
                </label>
                <textarea
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This question appears after gift selection to continue the
                  conversation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentWizardStep === 3 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-600" />
              Step 3: Select Moving Journey Bundle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Tucker, choose which partner offers to include in your Moving
                Journey bundle:
              </p>
              <div className="space-y-2">
                {(
                  offers || [
                    "$100 AI Gift Personalization",
                    "U-Haul Moving Package",
                    "Public Storage Denver",
                    "Hilton Hotel Suite",
                  ]
                ).map((offer, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOffers.includes(offer)}
                      onChange={() => toggleOffer(offer)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{offer}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {currentWizardStep > 1 && (
          <Button
            onClick={() => setCurrentWizardStep(currentWizardStep - 1)}
            variant="outline"
            className="flex-1"
          >
            ← Previous Step
          </Button>
        )}

        {currentWizardStep < 3 ? (
          <Button
            onClick={() => setCurrentWizardStep(currentWizardStep + 1)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Next:{" "}
            {currentWizardStep === 1 ? "Follow-up Message" : "Partner Offers"}
          </Button>
        ) : (
          <div className="flex-1 flex gap-2">
            <Button
              onClick={() => {
                const campaignData = {
                  type: campaignType,
                  audience: targetAudience,
                  giftValue,
                  followUpQuestion,
                  offers: selectedOffers,
                  steps: steps || [],
                };
                sessionStorage.setItem(
                  "aiGeneratedCampaign",
                  JSON.stringify(campaignData)
                );
                router.push(
                  "/campaign-manager/campaign-create?source=ai-builder"
                );
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              🚀 Launch Campaign
            </Button>

            <Button
              onClick={() => router.push("/campaign-manager/ai-insights")}
              variant="outline"
              className="px-4"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => router.push("/campaign-manager/analytics")}
              variant="outline"
              className="px-4"
            >
              <DollarSign className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
