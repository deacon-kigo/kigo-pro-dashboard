"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { useCopilotChat } from "@/lib/copilot-stubs";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface OfferCreationFormProps {
  currentStep: string;
  businessObjective: string;
  programType: string;
  offerConfig: any;
  campaignSetup: any;
  onUpdate: (updates: any) => void;
}

export default function OfferCreationForm({
  currentStep,
  businessObjective,
  programType,
  offerConfig,
  campaignSetup,
  onUpdate,
}: OfferCreationFormProps) {
  const [formData, setFormData] = useState({
    objective: businessObjective || "",
    targetAudience: "",
    offerType: "",
    offerValue: "",
    deliveryChannel: "",
    campaignDuration: "",
  });

  const { append } = useCopilotChat();

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAskAI = (field: string) => {
    let question = "";

    switch (field) {
      case "objective":
        question =
          "Help me define a clear business objective for my promotional offer";
        break;
      case "targetAudience":
        question = "What target audience should I focus on for this offer?";
        break;
      case "offerType":
        question = "What type of offer would work best for my goal?";
        break;
      case "offerValue":
        question = "What's the optimal offer value or discount percentage?";
        break;
      case "deliveryChannel":
        question = "Which delivery channels should I use for this campaign?";
        break;
      case "campaignDuration":
        question = "How long should I run this campaign?";
        break;
    }

    append({ role: "user", content: question });
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 border border-blue-200">
          <span className="text-blue-600 text-sm font-bold">📝</span>
        </span>
        Offer Configuration
      </h3>

      <div className="space-y-5">
        {/* Business Objective */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label
              htmlFor="objective"
              className="text-sm font-medium text-gray-700"
            >
              Business Objective <span className="text-red-500">*</span>
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAskAI("objective")}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <Input
            id="objective"
            placeholder="e.g., Increase Q4 sales by 20%"
            value={formData.objective}
            onChange={(e) => handleFieldChange("objective", e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            What do you want to achieve with this offer?
          </p>
        </div>

        {/* Program Type */}
        <div>
          <Label
            htmlFor="programType"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Program Type
          </Label>
          <select
            id="programType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={programType}
            onChange={(e) => onUpdate({ program_type: e.target.value })}
          >
            <option value="general">General</option>
            <option value="john_deere">John Deere Program</option>
            <option value="yardi">Yardi Program</option>
          </select>
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label
              htmlFor="targetAudience"
              className="text-sm font-medium text-gray-700"
            >
              Target Audience
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAskAI("targetAudience")}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <Input
            id="targetAudience"
            placeholder="e.g., First-time customers, Loyal members"
            value={formData.targetAudience}
            onChange={(e) =>
              handleFieldChange("targetAudience", e.target.value)
            }
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Offer Type */}
        {currentStep !== "goal_setting" && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="offerType"
                  className="text-sm font-medium text-gray-700"
                >
                  Offer Type
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAskAI("offerType")}
                  className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>
              <select
                id="offerType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={formData.offerType}
                onChange={(e) => handleFieldChange("offerType", e.target.value)}
              >
                <option value="">Select offer type</option>
                <option value="percentage_discount">Percentage Discount</option>
                <option value="fixed_amount">Fixed Amount Off</option>
                <option value="cashback">Cashback</option>
                <option value="bogo">Buy One Get One</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="offerValue"
                  className="text-sm font-medium text-gray-700"
                >
                  Offer Value
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAskAI("offerValue")}
                  className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>
              <Input
                id="offerValue"
                placeholder="e.g., 20%, $50"
                value={formData.offerValue}
                onChange={(e) =>
                  handleFieldChange("offerValue", e.target.value)
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Campaign Setup Fields */}
        {(currentStep === "campaign_setup" ||
          currentStep === "validation" ||
          currentStep === "approval") && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="deliveryChannel"
                  className="text-sm font-medium text-gray-700"
                >
                  Delivery Channel
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAskAI("deliveryChannel")}
                  className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>
              <select
                id="deliveryChannel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={formData.deliveryChannel}
                onChange={(e) =>
                  handleFieldChange("deliveryChannel", e.target.value)
                }
              >
                <option value="">Select channel</option>
                <option value="in_app">In-App</option>
                <option value="email">Email</option>
                <option value="push">Push Notification</option>
                <option value="geofence">Geofence</option>
                <option value="multi_channel">Multi-Channel</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="campaignDuration"
                  className="text-sm font-medium text-gray-700"
                >
                  Campaign Duration
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAskAI("campaignDuration")}
                  className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Ask AI
                </Button>
              </div>
              <Input
                id="campaignDuration"
                placeholder="e.g., 30 days, Q4 2024"
                value={formData.campaignDuration}
                onChange={(e) =>
                  handleFieldChange("campaignDuration", e.target.value)
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Save Progress Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={() => {
              onUpdate({
                business_objective: formData.objective,
                offer_config: {
                  ...offerConfig,
                  target_audience: formData.targetAudience,
                  offer_type: formData.offerType,
                  offer_value: formData.offerValue,
                },
                campaign_setup: {
                  ...campaignSetup,
                  delivery_channel: formData.deliveryChannel,
                  campaign_duration: formData.campaignDuration,
                },
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Progress
          </Button>
        </div>
      </div>
    </Card>
  );
}
