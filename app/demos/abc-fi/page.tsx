"use client";

import { useState, useEffect } from "react";
import { SarahBankingDashboard } from "./components/SarahBankingDashboard";
import { PushNotificationScreen } from "./components/PushNotificationScreen";
import { GiftSelection } from "./components/GiftSelection";
import { KigoMarketplace } from "./components/KigoMarketplace";
import { LightningDeals } from "./components/LightningDeals";
import { AIChatInterface } from "./components/AIChatInterface";
import { ReceiptScanning } from "./components/ReceiptScanning";
import { ValueSummary } from "./components/ValueSummary";
import { WavyBackground } from "@/components/ui/wavy-background";

type DemoStep =
  | "banking-dashboard"
  | "push-notification"
  | "gift-selection"
  | "ai-chat"
  | "kigo-marketplace"
  | "lightning-deals"
  | "receipt-scanning"
  | "value-summary";

export default function ABCFIDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("banking-dashboard");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const demoSteps = [
    {
      key: "banking-dashboard",
      label: "Dashboard",
      component: SarahBankingDashboard,
    },
    {
      key: "push-notification",
      label: "Notification",
      component: PushNotificationScreen,
    },
    {
      key: "gift-selection",
      label: "Gift Selection",
      component: GiftSelection,
    },
    { key: "ai-chat", label: "AI Chat", component: AIChatInterface },
    {
      key: "kigo-marketplace",
      label: "Marketplace",
      component: KigoMarketplace,
    },
    {
      key: "lightning-deals",
      label: "Lightning Deals",
      component: LightningDeals,
    },
    {
      key: "receipt-scanning",
      label: "Receipt Scan",
      component: ReceiptScanning,
    },
    { key: "value-summary", label: "Summary", component: ValueSummary },
  ];

  const currentStepIndex = demoSteps.findIndex(
    (step) => step.key === currentStep
  );
  const nextStep = demoSteps[currentStepIndex + 1]?.key || demoSteps[0].key;

  // Show notification after 3 seconds on banking dashboard
  useEffect(() => {
    if (currentStep === "banking-dashboard" && !notificationDismissed) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [currentStep, notificationDismissed]);

  const handleNotificationDismiss = () => {
    setShowNotification(false);
    setNotificationDismissed(true);
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    setCurrentStep("gift-selection");
  };

  const handleNotificationReshow = () => {
    setNotificationDismissed(false);
    setShowNotification(true);
  };

  const renderCurrentStep = () => {
    const stepConfig = demoSteps.find((step) => step.key === currentStep);
    const StepComponent = stepConfig?.component || SarahBankingDashboard;

    // Special handling for GiftSelection component
    if (currentStep === "gift-selection") {
      return (
        <GiftSelection
          onGiftSelected={(giftId: string) => setSelectedGift(giftId)}
          onNext={() => setCurrentStep("ai-chat")}
        />
      );
    }

    return (
      <StepComponent onNext={() => setCurrentStep(nextStep as DemoStep)} />
    );
  };

  return (
    <WavyBackground
      className="min-h-screen flex items-center justify-center p-4"
      containerClassName="min-h-screen"
      colors={["#3b82f6", "#1e40af", "#1d4ed8", "#2563eb", "#60a5fa"]}
      waveWidth={60}
      backgroundFill="rgb(243, 244, 246)"
      blur={15}
      speed="slow"
      waveOpacity={0.3}
    >
      {/* Mobile Container - Centered on Web */}
      <div className="w-full max-w-sm mx-auto">
        {/* Phone Mockup Container */}
        <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden h-[800px] relative">
            {/* Demo Navigation - Inside Phone */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-2">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {demoSteps.map((step, index) => (
                  <button
                    key={step.key}
                    onClick={() => setCurrentStep(step.key as DemoStep)}
                    className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                      currentStep === step.key
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}. {step.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="pt-12 pb-16 h-full">{renderCurrentStep()}</div>

            {/* Dismissible Notification Overlay */}
            {showNotification && (
              <div className="absolute top-16 left-4 right-4 z-40">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    {/* ABC FI Logo */}
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">
                        ABC
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          ABC FI
                        </p>
                        <button
                          onClick={handleNotificationDismiss}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>

                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        Congratulations on your new home purchase, Sarah!
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        We have a housewarming gift for you.
                      </p>

                      <button
                        onClick={handleNotificationClick}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        View Offers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation Drawer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentStep("banking-dashboard")}
                    className={`p-2 rounded-lg transition-colors ${
                      currentStep === "banking-dashboard"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xs">🏠</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep("gift-selection")}
                    className={`p-2 rounded-lg transition-colors ${
                      currentStep === "gift-selection"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xs">🎁</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep("kigo-marketplace")}
                    className={`p-2 rounded-lg transition-colors ${
                      currentStep === "kigo-marketplace"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xs">🛍️</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep("ai-chat")}
                    className={`p-2 rounded-lg transition-colors ${
                      currentStep === "ai-chat"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xs">💬</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {!showNotification && notificationDismissed && (
                    <button
                      onClick={handleNotificationReshow}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      🔔 Show Notification
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentStep(nextStep as DemoStep)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
}
