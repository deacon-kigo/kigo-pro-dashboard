"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { SparklesIcon, LightBulbIcon } from "@heroicons/react/24/outline";

interface OfferRecommendationsProps {
  businessObjective: string;
  programType: string;
  currentStep: string;
}

export default function OfferRecommendations({
  businessObjective,
  programType,
  currentStep,
}: OfferRecommendationsProps) {
  const getRecommendations = () => {
    if (!businessObjective) {
      return [
        {
          title: "Get Started",
          description:
            "Define your business objective to receive AI-powered recommendations.",
          type: "info",
        },
      ];
    }

    switch (currentStep) {
      case "goal_setting":
        return [
          {
            title: "Clear Objectives",
            description:
              "Be specific about your goals (e.g., increase sales, clear inventory, acquire new customers)",
            type: "tip",
          },
          {
            title: "Know Your Audience",
            description:
              "Understanding your target audience will help create more effective offers",
            type: "tip",
          },
        ];

      case "offer_creation":
        return [
          {
            title: "Recommended: 15-20% Discount",
            description:
              "Based on industry benchmarks for customer acquisition campaigns",
            type: "recommendation",
          },
          {
            title: "Consider Cashback",
            description:
              "Cashback offers typically see 30% higher engagement than straight discounts",
            type: "recommendation",
          },
        ];

      case "campaign_setup":
        return [
          {
            title: "Multi-Channel Approach",
            description:
              "Combine in-app and push notifications for 2x better reach",
            type: "recommendation",
          },
          {
            title: "Optimal Duration",
            description:
              "30-day campaigns balance urgency with adequate exposure time",
            type: "tip",
          },
        ];

      case "validation":
        return [
          {
            title: "Compliance Check",
            description:
              "All brand guidelines and business rules are being validated automatically",
            type: "info",
          },
        ];

      case "approval":
        return [
          {
            title: "Ready to Launch",
            description:
              "Your offer has passed all validation checks and is ready for approval",
            type: "success",
          },
        ];

      default:
        return [];
    }
  };

  const recommendations = getRecommendations();

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "recommendation":
        return "text-blue-600";
      case "tip":
        return "text-yellow-600";
      case "info":
      default:
        return "text-gray-600";
    }
  };

  const getCardBorder = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-500 bg-green-50";
      case "recommendation":
        return "border-l-4 border-l-blue-500 bg-blue-50";
      case "tip":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      case "info":
      default:
        return "border-l-4 border-l-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="h-5 w-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <p className="text-sm opacity-90">
          I'm here to help you create the perfect offer. Ask me anything or use
          the "Ask AI" buttons for instant guidance.
        </p>
      </Card>

      {recommendations.map((rec, index) => (
        <Card
          key={index}
          className={`p-4 ${getCardBorder(rec.type)} border border-gray-200 shadow-sm`}
        >
          <div className="flex items-start gap-3">
            <LightBulbIcon
              className={`h-5 w-5 flex-shrink-0 ${getIconColor(rec.type)}`}
            />
            <div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">
                {rec.title}
              </h4>
              <p className="text-xs text-gray-700">{rec.description}</p>
            </div>
          </div>
        </Card>
      ))}

      {/* Program-Specific Tips */}
      {programType !== "general" && (
        <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-500 border border-blue-200 shadow-sm">
          <h4 className="font-medium text-blue-900 mb-1 text-sm">
            {programType === "john_deere"
              ? "John Deere Program"
              : "Yardi Program"}{" "}
            Tips
          </h4>
          <p className="text-xs text-blue-700">
            {programType === "john_deere"
              ? "Focus on seasonal promotions and equipment financing offers for best results."
              : "Target property managers with bulk purchase discounts and recurring payment options."}
          </p>
        </Card>
      )}
    </div>
  );
}
