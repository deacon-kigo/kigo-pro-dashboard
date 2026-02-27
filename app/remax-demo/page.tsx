"use client";

import { useState } from "react";
import { JessicaDashboard } from "./components/JessicaDashboard";
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

export default function REMAXDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("ai-chat");
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const demoSteps = [
    {
      key: "banking-dashboard",
      label: "Dashboard",
      component: JessicaDashboard,
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

  const renderCurrentStep = () => {
    const stepConfig = demoSteps.find((step) => step.key === currentStep);
    const StepComponent = stepConfig?.component || JessicaDashboard;

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
      colors={["#dc1c2e", "#003da5", "#b71625", "#0052cc", "#e8293c"]}
      waveWidth={60}
      backgroundFill="rgb(243, 244, 246)"
      blur={15}
      speed="slow"
      waveOpacity={0.3}
    >
      {/* Phone Container */}
      <div className="relative">
        {/* iPhone 15 Pro Mockup */}
        <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div
            className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Main Content */}
            <div className="pb-16 h-full">{renderCurrentStep()}</div>

            {/* Bottom Navigation Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
              <div className="flex items-center justify-center px-4 py-2">
                <div className="flex items-center justify-around w-full max-w-xs">
                  {/* Home */}
                  <button
                    onClick={() => setCurrentStep("banking-dashboard")}
                    className={`flex flex-col items-center justify-center p-2 transition-colors ${
                      currentStep === "banking-dashboard"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </button>

                  {/* Offers */}
                  <button
                    onClick={() => setCurrentStep("gift-selection")}
                    className={`flex flex-col items-center justify-center p-2 transition-colors ${
                      currentStep === "gift-selection"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  </button>

                  {/* Marketplace */}
                  <button
                    onClick={() => setCurrentStep("kigo-marketplace")}
                    className={`flex flex-col items-center justify-center p-2 transition-colors ${
                      currentStep === "kigo-marketplace"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </button>

                  {/* Chat */}
                  <button
                    onClick={() => setCurrentStep("ai-chat")}
                    className={`flex flex-col items-center justify-center p-2 transition-colors ${
                      currentStep === "ai-chat"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
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
