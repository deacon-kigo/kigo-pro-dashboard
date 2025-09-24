"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Zap,
  ArrowRight,
  Clock,
  Gift,
} from "lucide-react";

interface RefinedCampaignWidgetProps {
  campaignType?: string;
  targetAudience?: string;
  estimatedReach?: string;
  projectedEngagement?: string;
  expectedConversion?: string;
  offers?: string[];
  steps?: string[];
  currentStep?: number;
  stepStatus?: "configuring" | "configured" | "complete";
}

export function RefinedCampaignWidget({
  campaignType = "AI-Powered New Mover Journey",
  targetAudience = "New mortgage customers in Denver metro area",
  estimatedReach = "2,847 customers",
  projectedEngagement = "68% open rate",
  expectedConversion = "23% conversion",
  offers = [],
  steps = [],
  currentStep = 0,
  stepStatus = "configuring",
}: RefinedCampaignWidgetProps) {
  const router = useRouter();
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [giftAmount, setGiftAmount] = useState(100);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  // Configuration step states
  const [configStep, setConfigStep] = useState<
    "overview" | "step1" | "step2" | "step3"
  >("overview");
  const [giftPersonalization, setGiftPersonalization] = useState(true);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([
    "Olive & Finch - Italian Restaurant",
    "Williams Sonoma - Home & Kitchen",
    "Denver Cleaning Co - Professional Service",
  ]);
  const [followUpQuestion, setFollowUpQuestion] = useState(
    "Is there anything else we can help you with to plan your move?"
  );
  const [selectedPartners, setSelectedPartners] = useState<string[]>([
    "U-Haul",
    "Public Storage",
    "Hilton Hotels",
  ]);

  const handleLaunchCampaign = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setIsConfiguring(true);
      setConfigStep("step1");
    }, 150);
  };

  const handleBackToOverview = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setIsConfiguring(false);
      setConfigStep("overview");
    }, 150);
  };

  const handleNextStep = () => {
    if (configStep === "step1") setConfigStep("step2");
    else if (configStep === "step2") setConfigStep("step3");
  };

  const handlePrevStep = () => {
    if (configStep === "step2") setConfigStep("step1");
    else if (configStep === "step3") setConfigStep("step2");
    else handleBackToOverview();
  };

  const handleConfirmLaunch = () => {
    setIsLaunching(true);
    setLaunchProgress(0);

    // Simulate campaign creation steps
    const steps = [
      { progress: 20, message: "Analyzing customer segments..." },
      { progress: 40, message: "Configuring AI personalization..." },
      { progress: 60, message: "Setting up partner integrations..." },
      { progress: 80, message: "Preparing gift card inventory..." },
      { progress: 100, message: "Campaign launched successfully!" },
    ];

    steps.forEach((step, index) => {
      setTimeout(
        () => {
          setLaunchProgress(step.progress);
          if (step.progress === 100) {
            setTimeout(() => {
              // Store campaign data with configured values
              const campaignData = {
                type: campaignType,
                audience: targetAudience,
                giftAmount,
                giftPersonalization,
                giftOptions: selectedGifts.map(
                  (gift) => `${gift} ($${giftAmount})`
                ),
                followUpQuestion,
                journeyBundle: selectedPartners,
                reach: estimatedReach,
                engagement: projectedEngagement,
                conversion: expectedConversion,
                timestamp: new Date().toISOString(),
              };

              sessionStorage.setItem(
                "aiCampaignData",
                JSON.stringify(campaignData)
              );
              router.push(
                "/campaign-manager/campaign-create?source=ai-builder"
              );
            }, 2000);
          }
        },
        (index + 1) * 1000
      );
    });
  };

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-purple-200/50 shadow-2xl animate-fade-in backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.8) 100%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header with glassmorphic design */}
      <div
        className="p-4 border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.3) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {campaignType}
              </h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-500" />
                AI-optimized customer journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"}`}
                ></div>
                <span className="text-xs text-gray-500 ml-1">
                  Step {currentStep}/3
                </span>
              </div>
            )}
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background:
                  stepStatus === "complete"
                    ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)"
                    : stepStatus === "configured"
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)",
                border:
                  stepStatus === "complete"
                    ? "1px solid rgba(34, 197, 94, 0.2)"
                    : stepStatus === "configured"
                      ? "1px solid rgba(59, 130, 246, 0.2)"
                      : "1px solid rgba(251, 146, 60, 0.2)",
                color:
                  stepStatus === "complete"
                    ? "#166534"
                    : stepStatus === "configured"
                      ? "#1e40af"
                      : "#ea580c",
              }}
            >
              {stepStatus === "complete"
                ? "✨ Ready to Launch"
                : stepStatus === "configured"
                  ? "⚙️ Configured"
                  : "🔧 Configuring..."}
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Content Container */}
      <div className="relative overflow-hidden">
        {/* Overview Content */}
        <div
          className={`transition-transform duration-500 ease-in-out ${
            isConfiguring
              ? slideDirection === "left"
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {/* Impact Metrics */}
          <div
            className="p-4 border-b border-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(248, 250, 252, 0.1) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Projected Impact
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div
                className="text-center p-3 rounded-xl border border-white/30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-blue-900 mb-1">
                  {estimatedReach.split(" ")[0]}
                </div>
                <div className="text-xs text-blue-700 font-medium">
                  Target Customers
                </div>
              </div>

              <div
                className="text-center p-3 rounded-xl border border-white/30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xl font-bold text-green-900 mb-1">
                  {projectedEngagement.split("%")[0]}%
                </div>
                <div className="text-xs text-green-700 font-medium">
                  Engagement Rate
                </div>
              </div>

              <div
                className="text-center p-3 rounded-xl border border-white/30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                  }}
                >
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-purple-900 mb-1">
                  {expectedConversion.split("%")[0]}%
                </div>
                <div className="text-xs text-purple-700 font-medium">
                  Conversion Rate
                </div>
              </div>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="p-4 border-b bg-gray-50">
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Target Customer Profile
            </h4>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
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
                  <div className="text-sm text-gray-600">Timing</div>
                  <div className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    Within 30 days of purchase
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Channel</div>
                  <div className="font-semibold text-gray-900">
                    Push Notification + In-App
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Steps */}
          <div className="p-4 border-b">
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-600" />
              Customer Journey Flow
            </h4>

            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: "Personalized Gift",
                  description: "$100 AI-selected gift card",
                  icon: Gift,
                  color: "blue",
                },
                {
                  step: 2,
                  title: "Follow-Up Question",
                  description: "Moving assistance inquiry",
                  icon: ArrowRight,
                  color: "green",
                },
                {
                  step: 3,
                  title: "Journey Bundle",
                  description: "U-Haul, Storage, Hotels",
                  icon: MapPin,
                  color: "purple",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : item.color === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Step {item.step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4">
            <button
              onClick={handleLaunchCampaign}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Configure & Launch Campaign
            </button>
          </div>
        </div>

        {/* Configuration View */}
        <div
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            isConfiguring
              ? slideDirection === "left"
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
              : slideDirection === "left"
                ? "translate-x-full opacity-0"
                : "translate-x-full opacity-0"
          }`}
        >
          {!isLaunching ? (
            <div className="p-4">
              {/* Step 1: The Gift */}
              {configStep === "step1" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Step 1: The Gift
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">1/3</span>
                      <button
                        onClick={handleBackToOverview}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure the AI-powered gifting moment, setting the value
                    and enabling personalization.
                  </p>

                  {/* Gift Amount Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Card Value
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 150, 200].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setGiftAmount(amount)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                            giftAmount === amount
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Personalization Toggle */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={giftPersonalization}
                        onChange={(e) =>
                          setGiftPersonalization(e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Enable AI Gift Personalization
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      AI will select hyper-relevant options for each user
                    </p>
                  </div>

                  {/* Gift Options Preview */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Gift Options
                    </label>
                    <div className="space-y-2">
                      {selectedGifts.map((gift, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            ✓ {gift} (${giftAmount})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Next: Follow-Up →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: The Follow-Up */}
              {configStep === "step2" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Step 2: The Follow-Up
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">2/3</span>
                      <button
                        onClick={handleBackToOverview}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Program the agent to ask a follow-up question to guide
                    customers to the moving journey.
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-Up Question
                    </label>
                    <textarea
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                      rows={3}
                      placeholder="Enter the question the AI agent will ask..."
                    />
                  </div>

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Preview: Customer Experience
                    </h4>
                    <div className="text-xs text-blue-800">
                      <div className="mb-2">
                        🎁 <strong>AI:</strong> "Here's your ${giftAmount} gift
                        card for {selectedGifts[0]}!"
                      </div>
                      <div>
                        💬 <strong>AI:</strong> "{followUpQuestion}"
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Next: Journey Bundle →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: The Journey Bundle */}
              {configStep === "step3" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Step 3: The Journey Bundle
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">3/3</span>
                      <button
                        onClick={handleBackToOverview}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Link the pre-built "Moving Journey" offer bundle to this
                    conversational path.
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner Offers
                    </label>
                    <div className="space-y-2">
                      {["U-Haul", "Public Storage", "Hilton Hotels"].map(
                        (partner) => (
                          <label
                            key={partner}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPartners.includes(partner)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPartners([
                                    ...selectedPartners,
                                    partner,
                                  ]);
                                } else {
                                  setSelectedPartners(
                                    selectedPartners.filter(
                                      (p) => p !== partner
                                    )
                                  );
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              {partner}
                            </span>
                            <span className="text-xs text-gray-500">
                              {partner === "U-Haul" && "(Moving truck rentals)"}
                              {partner === "Public Storage" &&
                                "(Storage solutions)"}
                              {partner === "Hilton Hotels" && "(Accommodation)"}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 mb-2">
                      Complete Journey Preview
                    </h4>
                    <div className="text-xs text-green-800 space-y-1">
                      <div>
                        1. 🎁 AI personalizes ${giftAmount} gift from{" "}
                        {selectedGifts.length} options
                      </div>
                      <div>
                        2. 💬 AI asks: "{followUpQuestion.substring(0, 50)}..."
                      </div>
                      <div>
                        3. 🏠 AI presents {selectedPartners.length} moving
                        partner offers
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleConfirmLaunch}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                    >
                      🚀 Launch Campaign
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mb-6">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from 0deg, #3b82f6 ${launchProgress * 3.6}deg, #e5e7eb ${launchProgress * 3.6}deg)`,
                  }}
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">
                      {launchProgress}%
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {launchProgress < 100
                    ? "Creating Your Campaign..."
                    : "🎉 Campaign Launched!"}
                </h3>
                {launchProgress < 100 && (
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>

              {launchProgress === 100 && (
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900 mb-1">
                      Connected Gift Options:
                    </div>
                    <div className="text-green-800">
                      • Olive & Finch - Italian Restaurant
                      <br />
                      • Williams Sonoma - Home & Kitchen
                      <br />• Denver Cleaning Co - Professional Service
                    </div>
                  </div>
                  <div className="text-gray-700">
                    <strong>Target Audience:</strong> {estimatedReach}
                    <br />
                    <strong>Campaign Status:</strong> Active & Running
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
