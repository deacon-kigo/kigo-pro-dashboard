"use client";

import { useState, useEffect, useRef } from "react";
import { IOSHomeScreen } from "../demos/abc-fi/components/IOSHomeScreen";
import { SplashScreen } from "../demos/abc-fi/components/SplashScreen";
import { SarahBankingDashboard } from "../demos/abc-fi/components/SarahBankingDashboard";
import { PushNotificationScreen } from "../demos/abc-fi/components/PushNotificationScreen";
import { KigoMarketplace } from "../demos/abc-fi/components/KigoMarketplace";
import { LightningDeals } from "../demos/abc-fi/components/LightningDeals";
import { AIChatInterface } from "../demos/abc-fi/components/AIChatInterface";
import { StarbucksGeofenceNotification } from "../demos/abc-fi/components/StarbucksGeofenceNotification";
import { CoffeeConquestCampaign } from "../demos/abc-fi/components/CoffeeConquestCampaign";
import { TransactionConfirmation } from "../demos/abc-fi/components/TransactionConfirmation";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { WavyBackground } from "@/components/ui/wavy-background";

type DemoStep =
  | "ios-homescreen"
  | "splash-screen"
  | "banking-dashboard"
  | "push-notification"
  | "ai-chat"
  | "starbucks-geofence"
  | "coffee-conquest"
  | "transaction-confirmation"
  | "kigo-marketplace"
  | "lightning-deals";

export default function ABCFIDemoStandalone() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("ios-homescreen");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [showDevNav, setShowDevNav] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

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
    // Trigger confetti animation
    confettiRef.current?.fire({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    });

    setShowNotification(false);

    // Delay transition to AI chat to let confetti show
    setTimeout(() => {
      setCurrentStep("ai-chat");
    }, 500);
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
    // Direct transition to Scene 2: Starbucks notification
    setCurrentStep("starbucks-geofence");
  };

  const handleGeofenceNotificationClick = () => {
    setCurrentStep("coffee-conquest");
  };

  const handlePurchaseComplete = () => {
    setCurrentStep("transaction-confirmation");
  };

  const handleTransactionComplete = () => {
    // End the demo flow here - no need for receipt scanning or value summary
    setCurrentStep("banking-dashboard");
  };

  const handleRestart = () => {
    setCurrentStep("banking-dashboard");
    setShowNotification(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "ios-homescreen":
        return (
          <IOSHomeScreen onAppOpen={() => setCurrentStep("splash-screen")} />
        );
      case "splash-screen":
        return (
          <SplashScreen
            onSplashComplete={() => setCurrentStep("banking-dashboard")}
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

      // Scene 2: Coffee Conquest
      case "starbucks-geofence":
        return (
          <StarbucksGeofenceNotification
            onNotificationClick={handleGeofenceNotificationClick}
          />
        );
      case "coffee-conquest":
        return (
          <CoffeeConquestCampaign onPurchaseComplete={handlePurchaseComplete} />
        );
      case "transaction-confirmation":
        return (
          <TransactionConfirmation onComplete={handleTransactionComplete} />
        );

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

  return (
    <WavyBackground
      className="min-h-screen flex items-center justify-center p-8"
      containerClassName="min-h-screen"
      colors={["#3b82f6", "#1e40af", "#1d4ed8", "#2563eb", "#60a5fa"]}
      waveWidth={60}
      backgroundFill="rgb(243, 244, 246)"
      blur={15}
      speed="slow"
      waveOpacity={0.3}
    >
      {/* Standalone Mobile Container */}
      <div className="relative flex items-center justify-center gap-8">
        {/* Dev Navigation - Side Panel */}
        <div className="flex flex-col gap-4 hidden">
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
                { key: "splash-screen", label: "1. Splash" },
                { key: "banking-dashboard", label: "2. Dashboard" },
                { key: "ai-chat", label: "3. AI Chat" },
                { key: "starbucks-geofence", label: "4. Notification" },
                { key: "coffee-conquest", label: "5. Coffee" },
                { key: "transaction-confirmation", label: "6. Success" },
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
          <div className="absolute -top-12 left-0 right-0 flex justify-center hidden">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {currentStep === "ios-homescreen" &&
                    "Tap ABC FI app to start Sarah's journey"}
                  {currentStep === "splash-screen" && "ABC FI app launching..."}
                  {currentStep === "banking-dashboard" &&
                    !showNotification &&
                    "Banking dashboard - notification coming..."}
                  {currentStep === "banking-dashboard" &&
                    showNotification &&
                    "Tap notification to continue"}
                  {currentStep === "ai-chat" &&
                    "AI assistant with gift selection & move planning"}
                  {currentStep === "starbucks-geofence" &&
                    "Geofenced Starbucks notification appears"}
                  {currentStep === "coffee-conquest" &&
                    "Activating Starbucks offer in ABC FI"}
                  {currentStep === "transaction-confirmation" &&
                    "Purchase confirmed - 1,000 bonus points earned!"}
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
              {/* Confetti Canvas - confined to mobile screen */}
              <Confetti
                ref={confettiRef}
                className="absolute inset-0 pointer-events-none z-50"
                manualstart={true}
                globalOptions={{
                  resize: true,
                  useWorker: false,
                }}
              />
              {/* Main Content */}
              <div className="pb-16 h-full">{renderCurrentStep()}</div>

              {/* Bottom Navigation Bar - Only show from dashboard onwards */}
              {currentStep !== "ios-homescreen" &&
                currentStep !== "splash-screen" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-center px-4 py-2">
                      <div className="flex items-center justify-around w-full max-w-xs">
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
                )}

              {/* Floating AI Chat Entry Point */}
              {currentStep !== "ios-homescreen" &&
                currentStep !== "splash-screen" &&
                currentStep !== "ai-chat" && (
                  <div className="absolute bottom-20 right-4 z-40">
                    <button
                      onClick={() => setCurrentStep("ai-chat")}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:shadow-xl transition-all duration-200 active:scale-95"
                      style={{
                        boxShadow:
                          "0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-gray-800"
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
                )}
            </div>
          </div>

          {/* Phone Details */}
          <div className="absolute -bottom-12 left-0 right-0 text-center hidden">
            <p className="text-gray-600 text-sm font-medium">
              ABC FI Banking Demo
            </p>
            <p className="text-gray-500 text-xs">Sarah's Customer Journey</p>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
}
