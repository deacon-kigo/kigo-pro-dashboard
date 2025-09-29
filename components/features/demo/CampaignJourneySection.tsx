"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Gift,
  Mail,
  BarChart3,
  CheckCircle,
  Clock,
} from "lucide-react";

interface CampaignJourneySectionProps {
  selectedOffer?: string;
  onJourneyConfirm: (journeyData: any) => void;
  className?: string;
}

export function CampaignJourneySection({
  selectedOffer = "home-depot",
  onJourneyConfirm,
  className = "",
}: CampaignJourneySectionProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>("30-days");
  const [isConfigured, setIsConfigured] = useState(false);

  const timelineOptions = [
    { id: "7-days", label: "7 days", description: "Quick follow-up" },
    { id: "30-days", label: "30 days", description: "Standard timing" },
    { id: "60-days", label: "60 days", description: "Extended period" },
  ];

  const journeySteps = [
    {
      id: "notification",
      icon: Gift,
      title: "Gift Selection",
      description: "Customer receives in-app notification to select their gift",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "delivery",
      icon: Mail,
      title: "Gift Delivery",
      description: "Digital gift card delivered instantly to Kigo Hub",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "followup",
      icon: BarChart3,
      title: "Follow-Up",
      description: `After ${selectedTimeline.split("-")[0]} days, present relevant home services offers`,
      color: "from-green-500 to-green-600",
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
        selectedOffer,
        needsLocationConfig: selectedTimeline === "30-days", // Trigger location config for 30-day timeline
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
            Section 2: Customer Experience
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Configure the customer journey timeline
        </p>
      </div>

      {/* Timeline Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Follow-up Timing
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {timelineOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleTimelineSelect(option.id)}
              className={`
                p-2 rounded-lg border text-center transition-all duration-200
                ${
                  selectedTimeline === option.id
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs opacity-75">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Journey Steps Timeline */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Customer Journey
        </h4>
        <div className="space-y-3">
          {journeySteps.map((step, index) => {
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex items-start gap-3">
                {/* Step Icon */}
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 text-sm">
                    {step.title}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < journeySteps.length - 1 && (
                  <div className="absolute left-[1.25rem] mt-10 w-0.5 h-6 bg-gray-200"></div>
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
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Configure Customer Journey
        </button>
      ) : (
        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Customer journey configured with {selectedTimeline.split("-")[0]}
              -day follow-up
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
