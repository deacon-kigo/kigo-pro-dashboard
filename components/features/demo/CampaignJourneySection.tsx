"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Gift,
  Mail,
  Wrench,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";

interface CampaignJourneySectionProps {
  giftAmount?: number;
  onJourneyConfirm: (journeyData: any) => void;
  className?: string;
}

export function CampaignJourneySection({
  giftAmount = 100,
  onJourneyConfirm,
  className = "",
}: CampaignJourneySectionProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("on-demand");
  const [isConfigured, setIsConfigured] = useState(false);

  const timelineOptions = [
    { id: "instant", label: "Instant", description: "Immediate delivery" },
    {
      id: "on-demand",
      label: "On-demand",
      description: "Available when needed",
    },
    { id: "scheduled", label: "Scheduled", description: "Timed follow-up" },
  ];

  const journeySteps = [
    {
      id: "selection",
      icon: Gift,
      title: "Gift Selection",
      description:
        "Customer receives an in-app notification to select their personalized gift.",
      hexColor: "#8b5cf6",
    },
    {
      id: "instant_delivery",
      icon: Zap,
      title: "Instant Delivery",
      description:
        "The digital gift card is delivered instantly to their Rewards Hub within seconds.",
      hexColor: "#3b82f6",
    },
    {
      id: "on_demand_offers",
      icon: Wrench,
      title: "On-Demand Offers",
      description:
        "A complete toolkit of moving and local offers is unlocked, available in the Hub for the customer to use whenever they need them.",
      hexColor: "#10b981",
    },
  ];

  const handleTimelineSelect = (timelineId: string) => {
    setSelectedTimeline(timelineId);
  };

  const handleConfirm = () => {
    setIsConfigured(true);

    setTimeout(() => {
      onJourneyConfirm({
        timeline: selectedTimeline,
        steps: journeySteps,
        giftAmount,
        needsLocationConfig: selectedTimeline === "on-demand", // Trigger location config for on-demand timeline
      });
    }, 500);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Configure Customer Experience
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Review the customer journey steps
        </p>
      </div>

      {/* Journey Steps Timeline */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Customer Journey
        </h4>
        <div className="relative">
          {journeySteps.map((step, index) => {
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-4">
                  {/* Step Icon with Hex Color */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white relative z-10"
                    style={{ backgroundColor: step.hexColor }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h5 className="font-semibold text-gray-900 text-sm mb-2">
                        {step.title}
                      </h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Connection Line */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200 z-0">
                    <div className="w-full h-full bg-gradient-to-b from-indigo-400 to-indigo-300 animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm Button */}
      {!isConfigured ? (
        <button
          onClick={handleConfirm}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl border-0"
        >
          Configure Customer Journey
        </button>
      ) : (
        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Customer journey configured with {selectedTimeline} delivery
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
