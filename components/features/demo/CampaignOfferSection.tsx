"use client";

import React, { useState } from "react";
import { Gift, Home, Utensils, Sparkles, CheckCircle } from "lucide-react";

interface CampaignOfferSectionProps {
  onOfferSelect: (offerId: string, offerData: any) => void;
  className?: string;
}

export function CampaignOfferSection({
  onOfferSelect,
  className = "",
}: CampaignOfferSectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const offers = [
    {
      id: "home-depot",
      title: "$100 Home Depot Gift Card",
      icon: Home,
      color: "from-orange-50 to-orange-100 border-orange-200",
      iconBg: "bg-orange-500",
      insight:
        "78% of new homeowners visit a home improvement store within 30 days of moving.",
      shortInsight: "78% visit home improvement stores within 30 days",
    },
    {
      id: "cleaning-service",
      title: "Professional Home Cleaning Service",
      icon: Sparkles,
      color: "from-blue-50 to-blue-100 border-blue-200",
      iconBg: "bg-blue-500",
      insight:
        "65% of relocating families hire a cleaning service within their first month.",
      shortInsight: "65% hire cleaning services within first month",
    },
    {
      id: "dining-experience",
      title: "$100 Williams Sonoma",
      icon: Utensils,
      color: "from-green-50 to-green-100 border-green-200",
      iconBg: "bg-green-500",
      insight:
        "84% of new residents explore local dining options within the first two weeks.",
      shortInsight: "84% explore local dining within two weeks",
    },
  ];

  const handleOfferClick = (offer: any) => {
    if (selectedOffer === offer.id) return;

    setSelectedOffer(offer.id);

    // Trigger callback after brief animation
    setTimeout(() => {
      onOfferSelect(offer.id, offer);
    }, 300);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Section 1: The Offer
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Choose the $100 congratulatory gift option
        </p>
      </div>

      {/* Gift Options */}
      <div className="grid grid-cols-1 gap-3">
        {offers.map((offer) => {
          const IconComponent = offer.icon;
          const isSelected = selectedOffer === offer.id;

          return (
            <div
              key={offer.id}
              onClick={() => handleOfferClick(offer)}
              className={`
                relative cursor-pointer transition-all duration-300 rounded-lg p-3 border
                ${
                  isSelected
                    ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50 border-blue-200"
                    : `bg-gradient-to-br ${offer.color} hover:shadow-md`
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 ${offer.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Insight:</strong> {offer.shortInsight}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Status */}
      {selectedOffer && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {offers.find((o) => o.id === selectedOffer)?.title} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
