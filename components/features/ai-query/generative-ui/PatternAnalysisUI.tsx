/**
 * Pattern Analysis UI Component
 *
 * Step 2 of Tucker Williams' campaign creation workflow
 * Shows detailed journey pattern analysis with timeline, engagement rates, and financial impact
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";

interface PatternAnalysisUIProps {
  journeyType?: string;
  onContinue?: () => void;
}

export default function PatternAnalysisUI({
  journeyType = "Home Purchase + Relocation",
  onContinue,
}: PatternAnalysisUIProps) {
  // Mock data based on the ABC FI demo spec
  const analysisData = {
    timeline: "12-week pattern",
    phases: [
      { name: "Logistics", engagement: 94, color: "#3b82f6" },
      { name: "Travel", engagement: 89, color: "#10b981" },
      { name: "Setup", engagement: 96, color: "#8b5cf6" },
      { name: "Local Integration", engagement: 91, color: "#f59e0b" },
    ],
    financialImpact: {
      incrementalSpend: "$3,200-4,800",
      ltvBoost: "$2,400-3,800",
      confidence: 94,
    },
    roiProjections: [
      { type: "Immediate", value: "445%", color: "text-green-600" },
      { type: "LTV", value: "890%", color: "text-blue-600" },
      { type: "Combined", value: "1,200%+", color: "text-purple-600" },
    ],
    weeklyData: [
      { week: "Week 1-2", triggers: 12, engagement: 8, conversion: 2 },
      { week: "Week 3-4", triggers: 45, engagement: 42, conversion: 18 },
      { week: "Week 5-6", triggers: 67, engagement: 59, conversion: 32 },
      { week: "Week 7-8", triggers: 89, engagement: 85, conversion: 58 },
      { week: "Week 9-10", triggers: 76, engagement: 69, conversion: 45 },
      { week: "Week 11-12", triggers: 54, engagement: 49, conversion: 38 },
    ],
  };

  // Chart configurations
  const engagementChartConfig = {
    logistics: {
      label: "Logistics",
      color: "#3b82f6",
    },
    travel: {
      label: "Travel",
      color: "#10b981",
    },
    setup: {
      label: "Setup",
      color: "#8b5cf6",
    },
    integration: {
      label: "Local Integration",
      color: "#f59e0b",
    },
  };

  const timelineChartConfig = {
    triggers: {
      label: "Triggers",
      color: "#3b82f6",
    },
    engagement: {
      label: "Engagement",
      color: "#10b981",
    },
    conversion: {
      label: "Conversion",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Journey Pattern Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Deep-dive analysis for {journeyType}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Journey Timeline
                </p>
                <p className="text-xl font-bold text-blue-700">
                  {analysisData.timeline}
                </p>
                <p className="text-xs text-gray-500">
                  From purchase to local integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Financial Impact
                </p>
                <p className="text-xl font-bold text-green-700">
                  {analysisData.financialImpact.incrementalSpend}
                </p>
                <p className="text-xs text-gray-500">
                  Incremental spend per customer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pattern Confidence
                </p>
                <p className="text-xl font-bold text-purple-700">
                  {analysisData.financialImpact.confidence}%
                </p>
                <p className="text-xs text-gray-500">
                  Based on 18 months of data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Phases Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Engagement Rates by Phase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={engagementChartConfig} className="h-[200px]">
            <BarChart
              data={analysisData.phases}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`${value}%`, "Engagement Rate"]}
              />
              <Bar
                dataKey="engagement"
                fill="var(--color-logistics)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.8}
              >
                {analysisData.phases.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ROI Projections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            ROI Projections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {analysisData.roiProjections.map((roi) => (
              <div
                key={roi.type}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {roi.type}
                </p>
                <p className={`text-2xl font-bold ${roi.color}`}>{roi.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Journey Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            Journey Timeline Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={timelineChartConfig} className="h-[300px]">
            <AreaChart
              data={analysisData.weeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="triggers"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="conversion"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Revenue Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Ad-funded revenue:
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    $45-85 per customer
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Merchant partnerships:
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    $82-160 per customer
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">
                    Total potential:
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    $127-245 per customer
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                LTV Enhancement
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Incremental spend boost:
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {analysisData.financialImpact.incrementalSpend}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    LTV enhancement:
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {analysisData.financialImpact.ltvBoost}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">
                    Data confidence:
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    {analysisData.financialImpact.confidence}% predictability
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          size="lg"
        >
          Build Campaign Architecture
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
