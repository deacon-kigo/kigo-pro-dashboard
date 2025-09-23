/**
 * Generative UI: Analytics Dashboard Component
 *
 * Dynamically generated when user asks for analytics or performance data
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react";

interface AnalyticsDashboardUIProps {
  metric: string;
  timeframe: string;
}

export default function AnalyticsDashboardUI({
  metric,
  timeframe,
}: AnalyticsDashboardUIProps) {
  const metrics = [
    {
      title: "Revenue",
      value: "$425K",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Active Campaigns",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Target,
      color: "blue",
    },
    {
      title: "Customer Engagement",
      value: "89%",
      change: "-2%",
      trend: "down",
      icon: Users,
      color: "orange",
    },
    {
      title: "Conversion Rate",
      value: "3.4%",
      change: "+0.8%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const topCampaigns = [
    { name: "Home Buyer HELOC", revenue: "$89K", roi: "445%" },
    { name: "Back to School", revenue: "$67K", roi: "312%" },
    { name: "Weekend Dining", revenue: "$45K", roi: "278%" },
  ];

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Analytics Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              {metric} • {timeframe}
            </p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-700">Live Data</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 text-${metric.color}-600`} />
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" ? (
                      <ArrowUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-600">{metric.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Performing Campaigns */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top Performing Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {topCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Revenue: {campaign.revenue}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {campaign.roi} ROI
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Chart Visualization */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-20 flex items-end justify-between gap-1">
            {[65, 78, 85, 92, 89, 95, 102, 98, 105, 112, 108, 115].map(
              (value, index) => (
                <div
                  key={index}
                  className="bg-green-200 rounded-t-sm flex-1"
                  style={{
                    height: `${(value / 115) * 100}%`,
                    minHeight: "4px",
                  }}
                />
              )
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
