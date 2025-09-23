"use client";

import { useState, useEffect } from "react";
import { IOSHomeScreen } from "../demos/abc-fi/components/IOSHomeScreen";
import { SarahBankingDashboard } from "../demos/abc-fi/components/SarahBankingDashboard";
import { PushNotificationScreen } from "../demos/abc-fi/components/PushNotificationScreen";
import { KigoMarketplace } from "../demos/abc-fi/components/KigoMarketplace";
import { LightningDeals } from "../demos/abc-fi/components/LightningDeals";
import { AIChatInterface } from "../demos/abc-fi/components/AIChatInterface";
import { ReceiptScanning } from "../demos/abc-fi/components/ReceiptScanning";
import { ValueSummary } from "../demos/abc-fi/components/ValueSummary";

type DemoStep =
  | "ios-homescreen"
  | "banking-dashboard"
  | "push-notification"
  | "kigo-marketplace"
  | "lightning-deals"
  | "ai-chat"
  | "receipt-scanning"
  | "value-summary";

export default function ABCFIDemoStandalone() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("ios-homescreen");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [showDevNav, setShowDevNav] = useState(false);

  // Auto-trigger notification after user lands on dashboard
  useEffect(() => {
    if (currentStep === "banking-dashboard" && !notificationDismissed) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 3000); // Show notification after 3 seconds

      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [currentStep, notificationDismissed]);

  const handleNotificationClick = () => {
    setShowNotification(false);
    setCurrentStep("kigo-marketplace");
  };

  const handleNotificationDismiss = () => {
    setShowNotification(false);
    setNotificationDismissed(true);
  };

  const handleNotificationReshow = () => {
    setNotificationDismissed(false);
    setShowNotification(true);
  };

  const handleMarketplaceAction = () => {
    setCurrentStep("lightning-deals");
  };

  const handleLightningDealsAction = () => {
    setCurrentStep("ai-chat");
  };

  const handleChatComplete = () => {
    setCurrentStep("receipt-scanning");
  };

  const handleReceiptScanned = () => {
    setCurrentStep("value-summary");
  };

  const handleRestart = () => {
    setCurrentStep("banking-dashboard");
    setShowNotification(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "ios-homescreen":
        return (
          <IOSHomeScreen
            onAppOpen={() => setCurrentStep("banking-dashboard")}
          />
        );
      case "banking-dashboard":
        return (
          <SarahBankingDashboard
            showNotification={showNotification}
            onNotificationClick={handleNotificationClick}
            onNotificationDismiss={handleNotificationDismiss}
          />
        );
      case "kigo-marketplace":
        return <KigoMarketplace onExploreDeals={handleMarketplaceAction} />;
      case "lightning-deals":
        return <LightningDeals onChatWithAI={handleLightningDealsAction} />;
      case "ai-chat":
        return <AIChatInterface onChatComplete={handleChatComplete} />;
      case "receipt-scanning":
        return <ReceiptScanning onReceiptScanned={handleReceiptScanned} />;
      case "value-summary":
        return <ValueSummary onRestart={handleRestart} />;
      default:
        return (
          <SarahBankingDashboard
            showNotification={showNotification}
            onNotificationClick={handleNotificationClick}
            onNotificationDismiss={handleNotificationDismiss}
          />
        );
    }
  };

  // If iOS homescreen, render it fullscreen without any containers
  if (currentStep === "ios-homescreen") {
    return renderCurrentStep();
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Standalone Mobile Container */}
      <div className="relative flex items-center justify-center gap-8">
        {/* Dev Navigation - Side Panel */}
        <div className="flex flex-col gap-4">
          {/* Dev Toggle */}
          <button
            onClick={() => setShowDevNav(!showDevNav)}
            className="px-3 py-2 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            {showDevNav ? "✕" : "⚙️"} Dev
          </button>

          {/* Dev Navigation */}
          {showDevNav && (
            <div className="flex flex-col gap-2 w-32">
              {[
                { key: "ios-homescreen", label: "0. iOS Home" },
                { key: "banking-dashboard", label: "1. Dashboard" },
                { key: "kigo-marketplace", label: "2. Marketplace" },
                { key: "lightning-deals", label: "3. Lightning" },
                { key: "ai-chat", label: "4. AI Chat" },
                { key: "receipt-scanning", label: "5. Receipt" },
                { key: "value-summary", label: "6. Summary" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCurrentStep(key as DemoStep)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all shadow-sm text-left ${
                    currentStep === key
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Container */}
        <div className="relative">
          {/* Demo Progress Indicator */}
          <div className="absolute -top-12 left-0 right-0 flex justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {currentStep === "ios-homescreen" &&
                    "Tap ABC FI app to start Sarah's journey"}
                  {currentStep === "banking-dashboard" &&
                    !showNotification &&
                    "Banking dashboard - notification coming..."}
                  {currentStep === "banking-dashboard" &&
                    showNotification &&
                    "Tap notification to continue"}
                  {currentStep === "kigo-marketplace" &&
                    "Exploring personalized marketplace"}
                  {currentStep === "lightning-deals" &&
                    "Discovering limited-time offers"}
                  {currentStep === "ai-chat" &&
                    "AI assistant helping with move"}
                  {currentStep === "receipt-scanning" &&
                    "Earning points from purchases"}
                  {currentStep === "value-summary" &&
                    "Journey complete - $1,900 saved!"}
                </span>
              </div>
            </div>
          </div>

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
                  <div className="flex items-center justify-between w-full max-w-xs">
                    {/* Home */}
                    <button
                      onClick={() => setCurrentStep("banking-dashboard")}
                      className={`flex flex-col items-center justify-center p-2 transition-colors ${
                        currentStep === "banking-dashboard"
                          ? "text-blue-500"
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

                    {/* Analytics */}
                    <button
                      onClick={() => setCurrentStep("value-summary")}
                      className={`flex flex-col items-center justify-center p-2 transition-colors ${
                        currentStep === "value-summary"
                          ? "text-blue-500"
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </button>

                    {/* Center Action Button */}
                    <button
                      onClick={() => {
                        if (!showNotification && notificationDismissed) {
                          handleNotificationReshow();
                        } else {
                          const steps: DemoStep[] = [
                            "banking-dashboard",
                            "kigo-marketplace",
                            "lightning-deals",
                            "ai-chat",
                            "receipt-scanning",
                            "value-summary",
                          ];
                          const currentIndex = steps.indexOf(currentStep);
                          const nextStep = steps[currentIndex + 1] || steps[0];
                          setCurrentStep(nextStep);
                        }
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors border-0"
                      style={{ backgroundColor: "#3b82f6" }}
                    >
                      {!showNotification && notificationDismissed ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-5 5-5-5h5V3h0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Marketplace */}
                    <button
                      onClick={() => setCurrentStep("kigo-marketplace")}
                      className={`flex flex-col items-center justify-center p-2 transition-colors ${
                        currentStep === "kigo-marketplace"
                          ? "text-blue-500"
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-1h1m-1 1v1m0-1h1m-1 1H5m14-4v2m0-2a2 2 0 00-2-2h-1m3 2h-1m1 0v1M9 7h6"
                        />
                      </svg>
                    </button>

                    {/* Profile */}
                    <button
                      onClick={() => setCurrentStep("ai-chat")}
                      className={`flex flex-col items-center justify-center p-2 transition-colors ${
                        currentStep === "ai-chat"
                          ? "text-blue-500"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Details */}
          <div className="absolute -bottom-12 left-0 right-0 text-center">
            <p className="text-gray-600 text-sm font-medium">
              ABC FI Banking Demo
            </p>
            <p className="text-gray-500 text-xs">Sarah's Customer Journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
