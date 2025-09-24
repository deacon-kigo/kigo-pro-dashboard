"use client";

import { useState, useEffect } from "react";

interface CoffeeConquestCampaignProps {
  onPurchaseComplete: () => void;
}

export function CoffeeConquestCampaign({
  onPurchaseComplete,
}: CoffeeConquestCampaignProps) {
  const [currentStep, setCurrentStep] = useState<
    "offer" | "ordering" | "payment"
  >("offer");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptOffer = () => {
    setCurrentStep("ordering");
  };

  const handlePlaceOrder = () => {
    setCurrentStep("payment");
  };

  const handlePayWithCard = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPurchaseComplete();
    }, 3000);
  };

  const renderOfferScreen = () => (
    <div className="w-full h-full bg-gradient-to-br from-green-700 via-green-600 to-green-800 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold">★</span>
            </div>
            <h1 className="text-white font-bold text-lg">
              Coffee Switch Campaign
            </h1>
          </div>
          <div className="text-white/80 text-sm">ABC FI</div>
        </div>
      </div>

      {/* Main offer content */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-6">
        {/* Starbucks logo */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">★</span>
          </div>
        </div>

        {/* Offer details */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Welcome to Starbucks!
          </h2>
          <p className="text-xl text-white/90">Try something new, Sarah</p>
        </div>

        {/* Points offer */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 space-y-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300">1,000</div>
            <div className="text-white text-lg">Bonus Points</div>
          </div>
          <p className="text-white/90 text-sm">
            Earn when you make your first purchase with your ABC FI card
          </p>
        </div>

        {/* Brand-funded badge */}
        <div className="bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
          🎯 Brand-Funded Offer
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAcceptOffer}
          className="w-full bg-white text-green-700 font-bold py-4 px-6 rounded-2xl text-lg hover:bg-gray-50 transition-colors shadow-lg"
        >
          Let's Try Starbucks! ☕️
        </button>

        <p className="text-white/70 text-xs">
          Points will be automatically added to your ABC FI account
        </p>
      </div>
    </div>
  );

  const renderOrderingScreen = () => (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Starbucks header */}
      <div className="bg-green-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-800 font-bold">★</span>
            </div>
            <h1 className="text-white font-bold text-lg">Starbucks</h1>
          </div>
          <div className="text-white/80 text-sm">Order Here</div>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Drinks</h2>

        {/* Featured drink */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">☕️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Pike Place Roast</h3>
              <p className="text-gray-600 text-sm">Medium roast coffee</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-700">$2.45</span>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                  +1,000 pts with ABC FI
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other options */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🥤</span>
              <div>
                <div className="font-medium">Iced Coffee</div>
                <div className="text-sm text-gray-600">$2.25</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🍵</span>
              <div>
                <div className="font-medium">Green Tea Latte</div>
                <div className="text-sm text-gray-600">$4.65</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-700 text-white font-bold py-4 px-6 rounded-2xl text-lg hover:bg-green-800 transition-colors mt-6"
        >
          Order Pike Place Roast - $2.45
        </button>
      </div>
    </div>
  );

  const renderPaymentScreen = () => (
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
      {currentStep === "ordering" && renderOrderingScreen()}
      {currentStep === "payment" && renderPaymentScreen()}
    </div>
  );
}
