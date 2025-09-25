"use client";

import { useState, useEffect } from "react";
import { MobileLayout } from "./MobileLayout";

interface CoffeeConquestCampaignProps {
  onPurchaseComplete: () => void;
}

export function CoffeeConquestCampaign({
  onPurchaseComplete,
}: CoffeeConquestCampaignProps) {
  const [currentStep, setCurrentStep] = useState<
    "offer" | "activated" | "transaction"
  >("offer");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivateOffer = () => {
    setCurrentStep("activated");
  };

  const handleSimulateTransaction = () => {
    setCurrentStep("transaction");
    setIsProcessing(true);

    // Simulate Sarah going to Starbucks and making a purchase
    setTimeout(() => {
      setIsProcessing(false);
      onPurchaseComplete();
    }, 3000);
  };

  const renderOfferScreen = () => (
    <MobileLayout>
      <div className="relative animate-fade-in">
        {/* Header - Exact same as banking dashboard */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center">
            <img
              src="/logos/abc-fi-logo.png"
              alt="ABC FI"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main offer content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Offer Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">★</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Coffee Switch Campaign</h2>
                <p className="text-blue-100 text-sm">Brand-funded offer</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-blue-50">
                Time for a new coffee routine, Sarah? Earn bonus points when you
                try Starbucks with your ABC FI card!
              </p>

              <div
                className="text-blue-900 px-4 py-3 rounded-xl font-bold text-center"
                style={{ backgroundColor: "#fbbf24" }}
              >
                🎉 Earn 1,000 Bonus Points
              </div>

              <div className="text-blue-100 text-sm space-y-1">
                <p>• Valid for 30 days</p>
                <p>• Use your ABC FI card at any Starbucks</p>
                <p>• Points automatically added to your account</p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              📍 Nearest Starbucks
            </h3>
            <p className="text-gray-700 font-medium">
              1847 Broadway, Denver, CO
            </p>
            <p className="text-gray-500 text-sm">0.2 miles away • 3 min walk</p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleActivateOffer}
            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:bg-blue-700 transition-colors"
          >
            Activate Offer ✅
          </button>

          <p className="text-gray-500 text-xs text-center">
            Points will be automatically added to your ABC FI account when you
            make a purchase
          </p>
        </div>
      </div>
    </MobileLayout>
  );

  const renderActivatedScreen = () => (
    <MobileLayout>
      <div className="relative animate-fade-in">
        {/* Header - Exact same as banking dashboard */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center">
            <img
              src="/logos/abc-fi-logo.png"
              alt="ABC FI"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Success content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Success Card */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">✅</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Offer Activated Successfully!
            </h2>

            <p className="text-gray-600">
              Your Starbucks offer is now active and ready to use.
            </p>
          </div>

          {/* Offer Details Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="text-center mb-4">
              <div
                className="text-blue-900 px-4 py-3 rounded-xl font-bold text-xl mb-3"
                style={{ backgroundColor: "#fbbf24" }}
              >
                🎉 1,000 Bonus Points
              </div>
              <p className="text-blue-100">
                Visit any Starbucks location and pay with your ABC FI card to
                earn bonus points
              </p>
            </div>

            <div className="text-blue-100 text-sm space-y-1">
              <p>• Offer valid for 30 days</p>
              <p>• Points automatically added to your account</p>
              <p>• Use at any Starbucks location</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              📍 Nearest Starbucks
            </h3>
            <p className="text-gray-700 font-medium">
              1847 Broadway, Denver, CO
            </p>
            <p className="text-gray-500 text-sm">0.2 miles away • 3 min walk</p>
          </div>

          {/* Demo button to simulate transaction */}
          <button
            onClick={handleSimulateTransaction}
            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:bg-blue-700 transition-colors"
          >
            Simulate Purchase at Starbucks 🚀
          </button>

          <p className="text-gray-500 text-xs text-center">
            (Demo: This simulates Sarah making a purchase)
          </p>
        </div>
      </div>
    </MobileLayout>
  );

  const renderTransactionScreen = () => (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900 text-center">
          Complete Purchase
        </h1>
      </div>

      {/* Order summary */}
      <div className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">☕️</span>
              <div>
                <div className="font-medium">Pike Place Roast</div>
                <div className="text-sm text-gray-600">Medium • Grande</div>
              </div>
            </div>
            <span className="font-bold">$2.45</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Payment Method</h3>

          {/* ABC FI Card - highlighted */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">ABC</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">ABC FI Debit Card</div>
                <div className="text-sm text-gray-600">•••• 4567</div>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-bold text-sm">
                  +1,000 pts
                </div>
                <div className="text-xs text-gray-500">Bonus points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePayWithCard}
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            "Pay $2.45 with ABC FI Card"
          )}
        </button>

        {/* Security note */}
        <p className="text-center text-xs text-gray-500">
          🔒 Secure payment powered by ABC FI
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      {currentStep === "offer" && renderOfferScreen()}
      {currentStep === "activated" && renderActivatedScreen()}
      {currentStep === "transaction" && renderTransactionScreen()}
    </div>
  );
}
