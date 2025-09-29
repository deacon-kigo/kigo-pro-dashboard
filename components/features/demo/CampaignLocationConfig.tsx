"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  Globe,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DenverHomeLocation } from "./DenverHomeLocation";
import { MerchantLocationMap } from "./MerchantLocationMap";

interface CampaignLocationConfigProps {
  giftAmount: number;
  timeline: string;
  onConfigComplete: (configData: any) => void;
  className?: string;
}

interface ConfigStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "configuring" | "completed";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function CampaignLocationConfig({
  giftAmount,
  timeline,
  onConfigComplete,
  className = "",
}: CampaignLocationConfigProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHomeLocation, setShowHomeLocation] = useState(false);
  const [showMerchantMap, setShowMerchantMap] = useState(false);
  const [configSteps, setConfigSteps] = useState<ConfigStep[]>([
    {
      id: "customer-profile",
      title: "Nationwide Segment Analysis",
      description:
        "AI analyzing new homeowner behavior patterns across all markets",
      status: "configuring",
      icon: Users,
      color: "blue",
    },
    {
      id: "location-mapping",
      title: "Partner Network Mapping",
      description: "Mapping nationwide merchant partner network",
      status: "pending",
      icon: Globe,
      color: "green",
    },
    {
      id: "offer-optimization",
      title: "Hyper-Local Personalization",
      description: "Configuring location-based offer personalization engine",
      status: "pending",
      icon: Settings,
      color: "purple",
    },
  ]);

  // Nationwide program configuration data
  const programData = {
    campaignName: "New Homeowner Welcome Program",
    targetSegment: "New Mortgage Customers",
    scope: "Nationwide",
    monthlyVolume: "567 customers/month",
    profile: {
      averageHomeValue: "$450K-$750K",
      customerType: "New Homeowner",
      demographics: "Families, 25-45 years old",
    },
  };

  // Nationwide merchant partner network
  const partnerNetwork = [
    {
      name: "The Home Depot",
      coverage: "2,300+ locations nationwide",
      category: "Home Improvement",
      logo: "/logos/home-depot-logo.png",
      offer: "3X points on moving supplies",
    },
    {
      name: "U-Haul",
      coverage: "22,000+ locations nationwide",
      category: "Moving Services",
      logo: "/logos/U-Haul-logo.png",
      offer: "20% off truck rentals + 2X points",
    },
    {
      name: "Hilton",
      coverage: "6,800+ properties worldwide",
      category: "Temporary Lodging",
      logo: "/logos/hilton-honor-logo.png",
      offer: "15% off 3-night stays + 2X points",
    },
    {
      name: "TaskRabbit",
      coverage: "140+ cities nationwide",
      category: "Home Services",
      logo: "/logos/taskrabbit-logo.png",
      offer: "$50 off first task",
    },
  ];

  useEffect(() => {
    // Simulate AI configuration process
    const configurationFlow = async () => {
      // Step 1: Customer Profile Analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateStepStatus(0, "completed");
      setCurrentStep(1);

      // Step 2: Partner Network Mapping
      updateStepStatus(1, "configuring");
      setShowHomeLocation(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      updateStepStatus(1, "completed");
      setCurrentStep(2);

      // Step 3: Hyper-Local Personalization
      updateStepStatus(2, "configuring");
      setShowMerchantMap(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      updateStepStatus(2, "completed");

      // Complete configuration
      setTimeout(() => {
        onConfigComplete({
          programData,
          partnerNetwork,
          giftAmount,
          timeline,
          aiInsights: {
            networkCoverage: "98% of US markets",
            partnerCount: "30,000+ locations",
            expectedEngagement: "High",
            scalability: "Nationwide",
          },
        });
      }, 1000);
    };

    configurationFlow();
  }, []);

  const updateStepStatus = (
    stepIndex: number,
    status: ConfigStep["status"]
  ) => {
    setConfigSteps((prev) =>
      prev.map((step, index) =>
        index === stepIndex ? { ...step, status } : step
      )
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            AI Campaign Configuration
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Configuring nationwide new homeowner welcome program
        </p>
      </div>

      {/* Configuration Steps */}
      <div className="space-y-4 mb-6">
        {configSteps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all duration-500
              ${
                step.status === "completed"
                  ? "bg-green-50 border-green-200"
                  : step.status === "configuring"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
              }
            `}
          >
            {/* Status Icon */}
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "configuring"
                    ? step.color === "blue"
                      ? "bg-blue-500"
                      : step.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    : "bg-gray-300"
              }
            `}
            >
              {step.status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : step.status === "configuring" ? (
                <step.icon className={`w-5 h-5 text-white animate-pulse`} />
              ) : (
                <step.icon className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">
                {step.title}
              </h4>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>

            {/* Progress Indicator */}
            {step.status === "configuring" && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                <div
                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Campaign Overview Card */}
      <div className="mb-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-blue-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900 text-base">
            Campaign Overview
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Program:</span>
              <span className="text-sm font-medium text-gray-900">
                {programData.campaignName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target:</span>
              <span className="text-sm font-medium text-gray-900">
                {programData.targetSegment}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Volume:</span>
              <span className="text-sm font-medium text-gray-900">
                {programData.monthlyVolume}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Follow-up:</span>
              <span className="text-sm font-medium text-gray-900">
                {timeline.split("-")[0]} days
              </span>
            </div>
          </div>
        </div>

        {/* Coverage Metrics */}
        {showHomeLocation && (
          <div className="animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                Nationwide Coverage
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-blue-600">98%</div>
                <div className="text-xs text-gray-600">Market Coverage</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-green-600">50</div>
                <div className="text-xs text-gray-600">States</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-lg font-bold text-purple-600">567</div>
                <div className="text-xs text-gray-600">Monthly Volume</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Partner Network Card */}
      {showMerchantMap && (
        <div className="mb-6 bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-xl border border-green-200 p-4 animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-base">
              Partner Network
            </h4>
            <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
              30,000+ Locations
            </Badge>
          </div>

          {/* Partner Grid */}
          <div className="space-y-3 mb-4">
            {partnerNetwork.map((partner, index) => (
              <div
                key={partner.name}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-8 h-6 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-semibold text-gray-900">
                        {partner.name}
                      </h5>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {partner.offer}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {partner.category}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {partner.coverage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Personalization Info */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                AI Hyper-Local Engine
              </span>
            </div>
            <p className="text-xs text-purple-700">
              Automatically selects nearest partner locations and personalizes
              offers based on customer geography, ensuring relevant local
              experiences at scale.
            </p>
          </div>
        </div>
      )}

      {/* AI Optimization Results */}
      {currentStep >= 2 && (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl border border-indigo-200 p-4 animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-600" />
            <h4 className="font-semibold text-gray-900 text-base">
              AI Optimization Complete
            </h4>
            <Badge className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1">
              Ready to Launch
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-indigo-600 mb-1">98%</div>
              <div className="text-xs text-gray-600 font-medium">
                Market Coverage
              </div>
              <div className="text-xs text-gray-500 mt-1">Nationwide reach</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">30K+</div>
              <div className="text-xs text-gray-600 font-medium">
                Partner Locations
              </div>
              <div className="text-xs text-gray-500 mt-1">Active network</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">High</div>
              <div className="text-xs text-gray-600 font-medium">
                Scalability
              </div>
              <div className="text-xs text-gray-500 mt-1">Enterprise ready</div>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Configuration Complete
              </span>
            </div>
            <p className="text-xs text-green-700">
              Your nationwide program is optimized and ready for deployment
              across all markets with hyper-local personalization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
