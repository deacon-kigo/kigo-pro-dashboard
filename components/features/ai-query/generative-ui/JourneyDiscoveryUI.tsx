/**
 * Journey Discovery UI Component
 *
 * Step 1 of Tucker Williams' campaign creation workflow
 * Shows AI-discovered customer journey patterns with confidence scores and revenue projections
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  ShoppingBag,
  GraduationCap,
  Coffee,
  TrendingUp,
  Users,
  DollarSign,
  Brain,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

interface JourneyOpportunity {
  id: string;
  title: string;
  icon: React.ReactNode;
  customers: number;
  revenueRange: string;
  monthlyRevenue: string;
  confidence: number;
  description: string;
  color: string;
  isRecommended?: boolean;
}

interface JourneyDiscoveryUIProps {
  onJourneySelect?: (journey: JourneyOpportunity) => void;
  selectedJourney?: string | null;
}

const JOURNEY_OPPORTUNITIES: JourneyOpportunity[] = [
  {
    id: "home-purchase",
    title: "Home Purchase + Relocation",
    icon: <Home className="w-5 h-5" />,
    customers: 567,
    revenueRange: "$127-245",
    monthlyRevenue: "$72K-139K",
    confidence: 94,
    description:
      "Cross-state family relocations with high-value spending patterns",
    color: "bg-blue-500",
    isRecommended: true,
  },
  {
    id: "home-improvement",
    title: "DIY Home Improvement",
    icon: <ShoppingBag className="w-5 h-5" />,
    customers: 1240,
    revenueRange: "$85-156",
    monthlyRevenue: "$105K-194K",
    confidence: 87,
    description: "Seasonal home projects with predictable purchase cycles",
    color: "bg-orange-500",
  },
  {
    id: "back-to-school",
    title: "Back to School",
    icon: <GraduationCap className="w-5 h-5" />,
    customers: 2890,
    revenueRange: "$45-89",
    monthlyRevenue: "$130K-257K",
    confidence: 92,
    description:
      "Family preparation for new school year with seasonal spending",
    color: "bg-green-500",
  },
  {
    id: "weekend-entertainment",
    title: "Weekend Entertainment",
    icon: <Coffee className="w-5 h-5" />,
    customers: 4200,
    revenueRange: "$28-52",
    monthlyRevenue: "$118K-218K",
    confidence: 78,
    description: "Regular leisure and dining patterns with loyalty potential",
    color: "bg-purple-500",
  },
];

export default function JourneyDiscoveryUI({
  onJourneySelect,
  selectedJourney,
}: JourneyDiscoveryUIProps) {
  const [localSelectedJourney, setLocalSelectedJourney] = useState<
    string | null
  >(selectedJourney || null);

  const handleJourneySelect = (journey: JourneyOpportunity) => {
    setLocalSelectedJourney(journey.id);
    onJourneySelect?.(journey);
  };

  const currentSelection = localSelectedJourney || selectedJourney;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI Journey Discovery
          </h3>
          <p className="text-sm text-gray-600">
            High-value customer journey patterns from ABC FI's transaction data
          </p>
        </div>
      </div>

      {/* Journey Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JOURNEY_OPPORTUNITIES.map((journey) => {
          const isSelected = currentSelection === journey.id;

          return (
            <Card
              key={journey.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => handleJourneySelect(journey)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${journey.color} flex items-center justify-center text-white`}
                    >
                      {journey.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        {journey.title}
                        {journey.isRecommended && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Recommended
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {journey.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          Customers/Month
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {journey.customers.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          Revenue/Customer
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-green-600">
                        {journey.revenueRange}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          Monthly Revenue
                        </span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {journey.monthlyRevenue}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          AI Confidence
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${journey.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {journey.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        // This would trigger the next step in the workflow
                        console.log("Analyze journey pattern:", journey.id);
                      }}
                    >
                      Analyze Journey Pattern
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Total Opportunity Identified
              </h4>
              <p className="text-xs text-gray-600">
                AI analyzed 18 months of transaction data across{" "}
                {JOURNEY_OPPORTUNITIES.reduce(
                  (sum, j) => sum + j.customers,
                  0
                ).toLocaleString()}{" "}
                customers
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">$425K-798K</p>
              <p className="text-xs text-gray-600">Monthly revenue potential</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentSelection && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-semibold text-gray-900">
              {
                JOURNEY_OPPORTUNITIES.find((j) => j.id === currentSelection)
                  ?.title
              }
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
