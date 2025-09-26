"use client";

import { useState, useEffect, useRef } from "react";
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
  Brain,
} from "lucide-react";
import {
  StepHeader,
  Card,
  SelectionButton,
  InfoBanner,
  ActionButtons,
  SectionHeader,
  OptionCard,
  StepContainer,
  ContentSection,
} from "./CampaignUIComponents";

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

  // Ref for scrolling to bottom of step containers
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when step changes
  useEffect(() => {
    if (stepContainerRef.current && isConfiguring) {
      setTimeout(() => {
        stepContainerRef.current?.scrollTo({
          top: stepContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [configStep, isConfiguring]);

  const handleLaunchCampaign = () => {
    console.log("handleLaunchCampaign called");
    setSlideDirection("left");
    setTimeout(() => {
      console.log("Setting isConfiguring to true and configStep to step1");
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
    console.log("handleNextStep called, current step:", configStep);
    if (configStep === "step1") {
      console.log("Moving to step2");
      setConfigStep("step2");
    } else if (configStep === "step2") {
      console.log("Moving to step3");
      setConfigStep("step3");
    }
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
            className="p-4 border-b"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              backdropFilter: "blur(8px)",
              borderColor: "#e5e7eb",
            }}
          >
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Projected Impact
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div
                className="text-center p-3 rounded-xl border"
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                  backdropFilter: "blur(10px)",
                  borderColor: "#bfdbfe",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)",
                    border: "1px solid #93c5fd",
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
                className="text-center p-3 rounded-xl border"
                style={{
                  background:
                    "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)",
                  backdropFilter: "blur(10px)",
                  borderColor: "#bbf7d0",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #bbf7d0 0%, #dcfce7 100%)",
                    border: "1px solid #86efac",
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
                className="text-center p-3 rounded-xl border"
                style={{
                  background:
                    "linear-gradient(135deg, #e9d5ff 0%, #f3e8ff 100%)",
                  backdropFilter: "blur(10px)",
                  borderColor: "#c4b5fd",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #c4b5fd 0%, #e9d5ff 100%)",
                    border: "1px solid #a78bfa",
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
        {isConfiguring && (
          <div
            className="absolute inset-0 animate-slide-in-right"
            style={{
              background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            {!isLaunching ? (
              <div className="h-full flex flex-col">
                {/* Step 1: The Gift - Using Reusable Components */}
                {configStep === "step1" && (
                  <StepContainer stepRef={stepContainerRef}>
                    <StepHeader
                      stepNumber={1}
                      totalSteps={3}
                      title="Configure AI Gift Selection"
                      subtitle="Set up personalized $100 housewarming gifts"
                      icon={Gift}
                      iconColor="#2563eb"
                      iconBackgroundColor="#dbeafe"
                      onBack={handleBackToOverview}
                    />

                    <ContentSection>
                      <InfoBanner
                        title="AI-Powered Gift Personalization"
                        description="Automatically selects hyper-relevant options for each customer"
                        icon={Sparkles}
                        iconColor="#7c3aed"
                        iconBackgroundColor="#e9d5ff"
                        backgroundColor="linear-gradient(to right, #faf5ff, #eff6ff)"
                        borderColor="#c4b5fd"
                      />

                      {/* Gift Amount Selection */}
                      <div className="mb-4">
                        <SectionHeader title="Gift Card Value" />
                        <div className="grid grid-cols-2 gap-2">
                          {[50, 100, 150, 200].map((amount) => (
                            <SelectionButton
                              key={amount}
                              isSelected={giftAmount === amount}
                              onClick={() => setGiftAmount(amount)}
                            >
                              <div className="text-lg font-bold">${amount}</div>
                              <div className="text-xs opacity-75">
                                Gift Value
                              </div>
                            </SelectionButton>
                          ))}
                        </div>
                      </div>

                      {/* Available Gift Options */}
                      <div className="mb-4">
                        <SectionHeader title="AI-Selected Gift Options" />
                        <div className="space-y-2">
                          {[
                            {
                              title: "Olive & Finch",
                              merchant: "Popular Italian Restaurant",
                              description:
                                "Authentic Italian cuisine in downtown Denver",
                              category: "🍽️ Dining",
                              logo: "/illustration/abc-fi/mock/italian-restaurant.jpg",
                            },
                            {
                              title: "Williams Sonoma",
                              merchant: "Home & Kitchen",
                              description:
                                "Premium kitchen and home essentials",
                              category: "🏠 Home & Kitchen",
                              logo: "/logos/williams-sonoma-logo.png",
                            },
                            {
                              title: "Denver Cleaning Co",
                              merchant: "Professional Cleaning Service",
                              description:
                                "Professional home cleaning for your new place",
                              category: "🧹 Local Service",
                              logo: "/illustration/abc-fi/mock/cleaning-service.jpg",
                            },
                          ].map((gift, index) => (
                            <OptionCard
                              key={index}
                              title={gift.title}
                              description={gift.description}
                              category={gift.category}
                              price={giftAmount}
                              image={gift.logo}
                            />
                          ))}
                        </div>
                      </div>

                      {/* AI Explanation */}
                      <div className="mb-4">
                        <Card>
                          <div className="flex items-start gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: "#dbeafe" }}
                            >
                              <Brain
                                className="w-4 h-4"
                                style={{ color: "#2563eb" }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-xs mb-1">
                                Why these options?
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                Our AI selected these gifts based on new
                                homeowner profiles, Denver location data, and
                                successful campaigns for similar customer
                                segments.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <ActionButtons
                        onBack={handlePrevStep}
                        onNext={handleNextStep}
                        backLabel="← Back to Overview"
                        nextLabel="Next: Follow-Up →"
                        nextColor="#2563eb"
                      />
                    </ContentSection>
                  </StepContainer>
                )}

                {/* Step 2: The Follow-Up - Using Reusable Components */}
                {configStep === "step2" && (
                  <StepContainer stepRef={stepContainerRef}>
                    <StepHeader
                      stepNumber={2}
                      totalSteps={3}
                      title="Configure Follow-Up Question"
                      subtitle="Guide customers to the moving journey"
                      icon={ArrowRight}
                      iconColor="#16a34a"
                      iconBackgroundColor="#dcfce7"
                      onBack={handleBackToOverview}
                    />

                    <ContentSection>
                      {/* Follow-Up Question Configuration */}
                      <div className="mb-4">
                        <SectionHeader title="AI Agent Question" />
                        <Card>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Follow-Up Question
                          </label>
                          <textarea
                            value={followUpQuestion}
                            onChange={(e) =>
                              setFollowUpQuestion(e.target.value)
                            }
                            className="w-full p-3 border rounded-lg text-sm resize-none"
                            style={{ borderColor: "#e5e7eb" }}
                            rows={3}
                            placeholder="Enter the question the AI agent will ask after gift delivery..."
                          />
                        </Card>
                      </div>

                      {/* Preview Section */}
                      <div className="mb-4">
                        <SectionHeader title="Customer Experience Preview" />
                        <div
                          className="rounded-xl p-3 border"
                          style={{
                            background:
                              "linear-gradient(to right, #eff6ff, #f0f9ff)",
                            borderColor: "#bfdbfe",
                          }}
                        >
                          <h4
                            className="text-xs font-medium mb-2"
                            style={{ color: "#1e40af" }}
                          >
                            Conversation Flow Preview
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div
                              className="flex items-start gap-2 p-2 rounded-lg"
                              style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: "#dcfce7" }}
                              >
                                🎁
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  AI Agent
                                </div>
                                <div className="text-gray-700">
                                  "Here's your ${giftAmount} gift card for Olive
                                  & Finch! It's been added to your Kigo Hub."
                                </div>
                              </div>
                            </div>
                            <div
                              className="flex items-start gap-2 p-2 rounded-lg"
                              style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: "#dbeafe" }}
                              >
                                💬
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  AI Agent
                                </div>
                                <div className="text-gray-700">
                                  "{followUpQuestion}"
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ActionButtons
                        onBack={handlePrevStep}
                        onNext={handleNextStep}
                        backLabel="← Back to Gift Setup"
                        nextLabel="Next: Journey Bundle →"
                        nextColor="#16a34a"
                      />
                    </ContentSection>
                  </StepContainer>
                )}

                {/* Step 3: The Journey Bundle - Using Reusable Components */}
                {configStep === "step3" && (
                  <StepContainer stepRef={stepContainerRef}>
                    <StepHeader
                      stepNumber={3}
                      totalSteps={3}
                      title="Configure Journey Bundle"
                      subtitle="Link moving partner offers to the conversation"
                      icon={MapPin}
                      iconColor="#d97706"
                      iconBackgroundColor="#fef3c7"
                      onBack={handleBackToOverview}
                    />

                    <ContentSection>
                      {/* Partner Selection */}
                      <div className="mb-4">
                        <SectionHeader title="Moving Partner Offers" />
                        <div className="space-y-2">
                          {[
                            {
                              name: "U-Haul",
                              description: "Moving truck rentals and equipment",
                              category: "🚛 Moving Services",
                              offer:
                                "20% off truck rental + free moving supplies",
                            },
                            {
                              name: "Public Storage",
                              description: "Secure storage solutions",
                              category: "📦 Storage",
                              offer: "First month free + 50% off second month",
                            },
                            {
                              name: "Hilton Hotels",
                              description: "Accommodation during transition",
                              category: "🏨 Hotels",
                              offer: "25% off extended stays + free breakfast",
                            },
                          ].map((partner, index) => (
                            <div
                              key={partner.name}
                              className="bg-white rounded-xl shadow-sm p-3 border transition-all"
                              style={{ borderColor: "#e5e7eb" }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex items-center pt-1">
                                  <input
                                    type="checkbox"
                                    checked={selectedPartners.includes(
                                      partner.name
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPartners([
                                          ...selectedPartners,
                                          partner.name,
                                        ]);
                                      } else {
                                        setSelectedPartners(
                                          selectedPartners.filter(
                                            (p) => p !== partner.name
                                          )
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-2"
                                    style={{
                                      borderColor: selectedPartners.includes(
                                        partner.name
                                      )
                                        ? "#2563eb"
                                        : "#d1d5db",
                                      backgroundColor:
                                        selectedPartners.includes(partner.name)
                                          ? "#2563eb"
                                          : "#ffffff",
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-sm text-gray-900">
                                      {partner.name}
                                    </h3>
                                    <span
                                      className="px-2 py-0.5 text-xs font-medium rounded-full"
                                      style={{
                                        backgroundColor: "#fef3c7",
                                        color: "#92400e",
                                      }}
                                    >
                                      {partner.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    {partner.description}
                                  </p>
                                  <div
                                    className="text-xs font-medium p-2 rounded-lg"
                                    style={{
                                      backgroundColor: "#dcfce7",
                                      color: "#166534",
                                    }}
                                  >
                                    💰 {partner.offer}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Complete Journey Preview */}
                      <div className="mb-4">
                        <h2 className="text-base font-semibold text-gray-900 mb-3">
                          Complete Journey Preview
                        </h2>
                        <div
                          className="rounded-xl p-3 border"
                          style={{
                            background:
                              "linear-gradient(to right, #f0fdf4, #ecfdf5)",
                            borderColor: "#bbf7d0",
                          }}
                        >
                          <h4
                            className="text-xs font-medium mb-2"
                            style={{ color: "#166534" }}
                          >
                            End-to-End Customer Experience
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: "#2563eb" }}
                              >
                                1
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  AI Gift Personalization
                                </div>
                                <div className="text-gray-600">
                                  AI selects ${giftAmount} gift from 3 curated
                                  options
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: "#16a34a" }}
                              >
                                2
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Follow-Up Conversation
                                </div>
                                <div className="text-gray-600">
                                  "{followUpQuestion.substring(0, 60)}..."
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: "#d97706" }}
                              >
                                3
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Moving Journey Bundle
                                </div>
                                <div className="text-gray-600">
                                  Present {selectedPartners.length} partner
                                  offers for seamless move
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <ActionButtons
                        onBack={handlePrevStep}
                        onNext={handleConfirmLaunch}
                        backLabel="← Back to Follow-Up"
                        nextLabel="🚀 Launch Campaign"
                        nextColor="linear-gradient(to right, #16a34a, #2563eb)"
                      />
                    </ContentSection>
                  </StepContainer>
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
        )}
      </div>
    </div>
  );
}
