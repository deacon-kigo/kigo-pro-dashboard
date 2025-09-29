"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Target, Zap, CheckCircle, ArrowRight } from "lucide-react";
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
      title: "Customer Profile Analysis",
      description: "AI analyzing new homeowner behavior patterns",
      status: "configuring",
    },
    {
      id: "location-mapping",
      title: "Location Intelligence",
      description: "Mapping Denver area merchant partners",
      status: "pending",
    },
    {
      id: "offer-optimization",
      title: "Offer Optimization",
      description: "Personalizing offers based on proximity and preferences",
      status: "pending",
    },
  ]);

  // Customer Denver home coordinates and address
  const customerData = {
    name: "Sarah Martinez",
    address: "4988 Valentia Ct, Denver, CO 80238",
    neighborhood: "Stapleton",
    coordinates: { lat: 39.7817, lng: -104.8897 },
    profile: {
      moveFrom: "Kansas City, MO",
      homeValue: "$650K",
      customerType: "New Homeowner",
    },
  };

  // Diverse merchant partners near Denver location (like Sarah's demo)
  const nearbyMerchants = [
    {
      name: "The Home Depot",
      address: "8500 E Northfield Blvd, Denver, CO 80238",
      coordinates: { lat: 39.7856, lng: -104.8934 },
      category: "Home Improvement",
      logo: "/logos/home-depot-logo.png",
    },
    {
      name: "U-Haul Storage",
      address: "7290 E 36th Ave, Denver, CO 80238",
      coordinates: { lat: 39.7698, lng: -104.8912 },
      category: "Storage",
      logo: "/logos/U-Haul-logo.png",
    },
    {
      name: "Hilton Denver Airport",
      address: "8500 Peña Blvd, Denver, CO 80249",
      coordinates: { lat: 39.8561, lng: -104.6737 },
      category: "Hotel",
      logo: "/logos/hilton-honor-logo.png",
    },
    {
      name: "Two Men and a Truck",
      address: "4155 E Jewell Ave, Denver, CO 80222",
      coordinates: { lat: 39.6897, lng: -104.9234 },
      category: "Moving Services",
      logo: "/logos/two-men-and-truck.jpg",
    },
  ];

  useEffect(() => {
    // Simulate AI configuration process
    const configurationFlow = async () => {
      // Step 1: Customer Profile Analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateStepStatus(0, "completed");
      setCurrentStep(1);

      // Step 2: Location Intelligence
      updateStepStatus(1, "configuring");
      setShowHomeLocation(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      updateStepStatus(1, "completed");
      setCurrentStep(2);

      // Step 3: Offer Optimization
      updateStepStatus(2, "configuring");
      setShowMerchantMap(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      updateStepStatus(2, "completed");

      // Complete configuration
      setTimeout(() => {
        onConfigComplete({
          customerData,
          nearbyMerchants,
          giftAmount,
          timeline,
          aiInsights: {
            proximityScore: 95,
            relevanceScore: 88,
            expectedEngagement: "High",
            merchantCount: nearbyMerchants.length,
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
          Optimizing campaign for new homeowner: Sarah Martinez
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
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "configuring"
                    ? "bg-blue-500"
                    : "bg-gray-300"
              }
            `}
            >
              {step.status === "completed" ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : step.status === "configuring" ? (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              ) : (
                <div className="w-3 h-3 bg-white rounded-full opacity-50" />
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

      {/* Customer Profile Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Target Customer Profile
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Customer:</span>
            <span className="ml-1 text-gray-900">{customerData.name}</span>
          </div>
          <div>
            <span className="text-gray-500">Move:</span>
            <span className="ml-1 text-gray-900">Kansas City → Denver</span>
          </div>
          <div>
            <span className="text-gray-500">Home:</span>
            <span className="ml-1 text-gray-900">$650K, Stapleton</span>
          </div>
          <div>
            <span className="text-gray-500">Timeline:</span>
            <span className="ml-1 text-gray-900">
              {timeline.split("-")[0]} day follow-up
            </span>
          </div>
        </div>
      </div>

      {/* Denver Home Location */}
      {showHomeLocation && (
        <div className="mb-4 animate-in slide-in-from-bottom-2 fade-in">
          <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Customer Location: Denver Home
          </h4>
          <DenverHomeLocation
            address={customerData.address}
            neighborhood={customerData.neighborhood}
          />
        </div>
      )}

      {/* Nearby Merchant Partners */}
      {showMerchantMap && (
        <div className="mb-4 animate-in slide-in-from-bottom-2 fade-in">
          <h4 className="font-medium text-gray-900 text-sm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Nearby Partner Network
          </h4>

          {/* Merchant Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {nearbyMerchants.map((merchant, index) => (
              <div
                key={merchant.name}
                className="bg-gray-50 rounded-lg p-2 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <img
                    src={merchant.logo}
                    alt={merchant.name}
                    className="w-6 h-4 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {merchant.name}
                  </p>
                  <p className="text-xs text-gray-500">{merchant.category}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Show map for primary merchant */}
          <MerchantLocationMap
            homeAddress={customerData.address}
            homeCoordinates={customerData.coordinates}
            merchantName={nearbyMerchants[0].name}
            merchantAddress={nearbyMerchants[0].address}
            merchantCoordinates={nearbyMerchants[0].coordinates}
          />
        </div>
      )}

      {/* AI Insights */}
      {currentStep >= 2 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-in slide-in-from-bottom-2 fade-in">
          <h4 className="font-medium text-blue-900 text-sm mb-2">
            AI Optimization Insights
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-blue-700">95%</div>
              <div className="text-blue-600">Proximity Score</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-700">88%</div>
              <div className="text-blue-600">Relevance</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-700">High</div>
              <div className="text-blue-600">Engagement</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
