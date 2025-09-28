"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Gift,
  Mail,
  TrendingUp,
  Clock,
  Smartphone,
  Sparkles,
  ArrowRight,
  Settings,
} from "lucide-react";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  timing: string;
  customizable: boolean;
}

interface CustomerJourneyUIProps {
  selectedGift: string;
  giftAmount: number;
  onJourneyConfirm: (journeyConfig: any) => void;
  className?: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "notification",
    title: "Gift Selection",
    description:
      "Customer receives an in-app notification to select their gift",
    icon: Gift,
    color: "bg-purple-500",
    timing: "Immediately after home purchase",
    customizable: true,
  },
  {
    id: "delivery",
    title: "Gift Delivery",
    description:
      "The digital gift card or voucher is delivered instantly to their Kigo Hub",
    icon: Mail,
    color: "bg-blue-500",
    timing: "Within 5 minutes of selection",
    customizable: false,
  },
  {
    id: "followup",
    title: "Follow-Up",
    description:
      "After 30 days, Kigo automatically presents relevant offers for home services and furnishings",
    icon: TrendingUp,
    color: "bg-green-500",
    timing: "30 days after gift delivery",
    customizable: true,
  },
];

const NOTIFICATION_TEMPLATES = [
  {
    id: "congratulatory",
    title: "Congratulatory Tone",
    message:
      "🏡 Congratulations on your new home! We have a special welcome gift for you.",
    engagement: "89%",
  },
  {
    id: "helpful",
    title: "Helpful Tone",
    message:
      "Welcome to your new neighborhood! Let us help you settle in with a housewarming gift.",
    engagement: "84%",
  },
  {
    id: "exclusive",
    title: "Exclusive Tone",
    message:
      "As a valued ABC FI customer, you've earned an exclusive new homeowner gift!",
    engagement: "91%",
  },
];

const FOLLOWUP_TIMINGS = [
  { days: 7, label: "1 week", description: "Quick follow-up while moving" },
  { days: 14, label: "2 weeks", description: "After initial settling" },
  { days: 30, label: "1 month", description: "Recommended timing" },
  { days: 60, label: "2 months", description: "After full settling" },
];

export function CustomerJourneyUI({
  selectedGift,
  giftAmount,
  onJourneyConfirm,
  className = "",
}: CustomerJourneyUIProps) {
  const [selectedNotification, setSelectedNotification] =
    useState("congratulatory");
  const [followupTiming, setFollowupTiming] = useState(30);
  const [step, setStep] = useState<"overview" | "notification" | "followup">(
    "overview"
  );

  const handleConfirm = () => {
    const journeyConfig = {
      gift: selectedGift,
      amount: giftAmount,
      notification: selectedNotification,
      followupDays: followupTiming,
    };
    onJourneyConfirm(journeyConfig);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Customer Journey Configuration
        </h3>
        <p className="text-gray-600 text-sm">
          Customize how customers will experience your ${giftAmount} welcome
          campaign
        </p>
      </div>

      {/* Journey Overview */}
      {step === "overview" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              3-Step Customer Journey
            </h4>
            <p className="text-gray-600 text-sm">
              Here's how customers will experience your campaign
            </p>
          </div>

          {/* Journey Timeline */}
          <div className="relative">
            {JOURNEY_STEPS.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === JOURNEY_STEPS.length - 1;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4 pb-8">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-gray-900">
                          {step.title}
                        </h5>
                        {step.customizable && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            Customizable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {step.timing}
                        </span>
                      </div>
                    </div>

                    {/* Customize Button */}
                    {step.customizable && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setStep(
                            step.id === "notification"
                              ? "notification"
                              : "followup"
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        Customize
                      </Button>
                    )}
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Use Default Journey →
          </Button>
        </div>
      )}

      {/* Notification Customization */}
      {step === "notification" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Customize Notification Message
            </h4>
            <p className="text-gray-600 text-sm">
              Choose the tone and message for the initial gift notification
            </p>
          </div>

          <div className="space-y-4">
            {NOTIFICATION_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedNotification === template.id
                    ? "ring-2 ring-purple-500 bg-purple-50 border-purple-200"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setSelectedNotification(template.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {template.title}
                      </h5>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {template.engagement} engagement
                      </Badge>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedNotification === template.id
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedNotification === template.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          ABC
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        ABC FI Banking
                      </span>
                    </div>
                    <p className="text-sm text-gray-800">{template.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep("overview")}
              className="flex-1"
            >
              ← Back to Overview
            </Button>
            <Button
              onClick={() => setStep("overview")}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Save Notification
            </Button>
          </div>
        </div>
      )}

      {/* Follow-up Timing */}
      {step === "followup" && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Follow-up Timing
            </h4>
            <p className="text-gray-600 text-sm">
              When should we present additional home-related offers?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FOLLOWUP_TIMINGS.map((timing) => (
              <Card
                key={timing.days}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  followupTiming === timing.days
                    ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setFollowupTiming(timing.days)}
              >
                <div className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {timing.label}
                  </div>
                  <p className="text-sm text-gray-600">{timing.description}</p>
                  {timing.days === 30 && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs mt-2">
                      Recommended
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                AI Optimization
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Our AI will automatically select the best follow-up offers based
              on the customer's initial gift choice and local market data.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep("overview")}
              className="flex-1"
            >
              ← Back to Overview
            </Button>
            <Button
              onClick={() => setStep("overview")}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Save Timing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
