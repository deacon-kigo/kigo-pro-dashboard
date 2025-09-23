/**
 * Generative UI: Customer Insights Component
 *
 * Dynamically generated when user asks for customer behavior analysis
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  MapPin,
  Clock,
  ShoppingBag,
  Heart,
  Brain,
} from "lucide-react";

interface CustomerInsightsUIProps {
  segment: string;
  insights: string[];
}

export default function CustomerInsightsUI({
  segment,
  insights,
}: CustomerInsightsUIProps) {
  const behaviorPatterns = [
    {
      pattern: "Peak Shopping Hours",
      value: "7-9 PM weekdays",
      icon: Clock,
      color: "blue",
    },
    {
      pattern: "Preferred Categories",
      value: "Dining, Travel, Home",
      icon: ShoppingBag,
      color: "green",
    },
    {
      pattern: "Geographic Concentration",
      value: "Urban centers, Suburbs",
      icon: MapPin,
      color: "purple",
    },
    {
      pattern: "Loyalty Score",
      value: "8.4/10",
      icon: Heart,
      color: "red",
    },
  ];

  const journeyStages = [
    { stage: "Discovery", percentage: 94, customers: "2,680" },
    { stage: "Consideration", percentage: 87, customers: "2,330" },
    { stage: "Purchase", percentage: 76, customers: "2,040" },
    { stage: "Retention", percentage: 89, customers: "1,815" },
  ];

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Insights
            </h3>
            <p className="text-sm text-gray-600">{segment} Analysis</p>
          </div>
        </div>
        <Badge className="bg-purple-100 text-purple-700">AI Generated</Badge>
      </div>

      {/* Key Insights */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Key Behavioral Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {behaviorPatterns.map((pattern, index) => {
              const Icon = pattern.icon;
              return (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 text-${pattern.color}-600`} />
                    <p className="text-xs font-medium text-gray-700">
                      {pattern.pattern}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {pattern.value}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customer Journey */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Customer Journey Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {journeyStages.map((stage, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {stage.customers} customers
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
