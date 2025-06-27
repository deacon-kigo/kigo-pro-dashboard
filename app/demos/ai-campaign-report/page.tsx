"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowTrendingUpIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Mock data for the campaign report
const campaignData = {
  optIns: 1250000,
  optInsChange: 8.3,
  optInsWoWChange: 12.1,
  redemptions: 312500,
  redemptionsChange: 15.7,
  redemptionsWoWChange: 6.4,
  redemptionRate: 25.0,
  redemptionRateChange: 2.3,
  redemptionRateBaseline: 22.7,
  aiIncrementality: 62.4,
  aiIncrementalityChange: 5.1,
  aiIncrementalityConfidence: 94.2,
};

// Enhanced forecast data with actual and predicted values including confidence intervals
const forecastData = [
  {
    week: "Week 1",
    actual: 42340,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 68.2,
  },
  {
    week: "Week 2",
    actual: 45720,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 71.4,
  },
  {
    week: "Week 3",
    actual: 38950,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 65.8,
  },
  {
    week: "Week 4",
    actual: 52180,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 73.6,
  },
  {
    week: "Week 5",
    actual: 48640,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 69.9,
  },
  {
    week: "Week 6",
    actual: 55290,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 75.2,
  },
  {
    week: "Week 7",
    actual: 58730,
    forecast: null,
    upperBound: null,
    lowerBound: null,
    engagement: 77.8,
  },
  {
    week: "Week 8",
    actual: null,
    forecast: 67420,
    upperBound: 72100,
    lowerBound: 62740,
    engagement: 79.1,
  },
  {
    week: "Week 9",
    actual: null,
    forecast: 69850,
    upperBound: 74680,
    lowerBound: 65020,
    engagement: 80.3,
  },
  {
    week: "Week 10",
    actual: null,
    forecast: 72340,
    upperBound: 77310,
    lowerBound: 67370,
    engagement: 81.7,
  },
  {
    week: "Week 11",
    actual: null,
    forecast: 74920,
    upperBound: 80040,
    lowerBound: 69800,
    engagement: 83.2,
  },
  {
    week: "Week 12",
    actual: null,
    forecast: 77680,
    upperBound: 82950,
    lowerBound: 72410,
    engagement: 84.6,
  },
];

// Enhanced top performing segments with more detailed metrics
const topSegments = [
  {
    segment: "High-Value Subscribers",
    redemptionRate: "35.2%",
    totalUsers: 28640,
    avgOrderValue: "$47.30",
    conversionLift: "+12.4%",
  },
  {
    segment: "Frequent Shoppers",
    redemptionRate: "28.7%",
    totalUsers: 45290,
    avgOrderValue: "$32.80",
    conversionLift: "+8.9%",
  },
  {
    segment: "Mobile App Users",
    redemptionRate: "22.1%",
    totalUsers: 67850,
    avgOrderValue: "$24.60",
    conversionLift: "+15.7%",
  },
];

// Enhanced fraud analysis data with more detail
const fraudData = [
  {
    name: "Verified Authentic",
    value: 82.4,
    fill: "hsl(var(--chart-1))",
    count: 1035000,
  },
  {
    name: "Blocked Duplicates",
    value: 11.7,
    fill: "hsl(var(--chart-2))",
    count: 146250,
  },
  {
    name: "Blocked Suspicious",
    value: 4.3,
    fill: "hsl(var(--chart-3))",
    count: 53750,
  },
  {
    name: "Under Review",
    value: 1.6,
    fill: "hsl(var(--chart-4))",
    count: 20000,
  },
];

// Additional analytics data
const fraudAnalytics = {
  totalAttempts: 1255000,
  fraudPrevented: "$2.8M",
  falsePositiveRate: 0.8,
  detectionAccuracy: 97.3,
  avgProcessingTime: "147ms",
};

// Chart configurations
const forecastChartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "AI Forecast",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const fraudChartConfig = {
  value: {
    label: "Percentage",
  },
} satisfies ChartConfig;

// Enhanced KPI Card Component following the robust publisher dashboard pattern
const KPICard = ({
  title,
  value,
  change,
  secondaryChange = null,
  secondaryChangeLabel = null,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: number;
  secondaryChange?: number | null;
  secondaryChangeLabel?: string | null;
  icon: any;
}) => {
  const isPositive = change >= 0;
  const isSecondaryPositive =
    secondaryChange !== null ? secondaryChange >= 0 : true;

  // Format large numbers with commas
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  // Get distinctive styling for each metric type
  const getIconBg = () => {
    switch (title) {
      case "Opt-Ins":
        return "#EFF6FF"; // Light blue
      case "Redemptions":
        return "#ECFDF5"; // Light green
      case "Redemption Rate":
        return "#FFFBEB"; // Light amber
      case "AI Incrementality":
        return "#F5F3FF"; // Light purple
      default:
        return "#F9FAFB"; // Light gray
    }
  };

  const getIconColor = () => {
    switch (title) {
      case "Opt-Ins":
        return "text-blue-600";
      case "Redemptions":
        return "text-green-600";
      case "Redemption Rate":
        return "text-amber-600";
      case "AI Incrementality":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getPercentageColor = () => {
    return isPositive ? "text-green-700" : "text-red-700";
  };

  const getPercentageBg = () => {
    return isPositive ? "bg-green-100" : "bg-red-100";
  };

  return (
    <div
      className="rounded-lg border border-gray-200 p-4 h-full bg-white"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-gray-700">
          <div
            className={`p-2.5 rounded-full ${getIconColor()}`}
            style={{ background: getIconBg() }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
      </div>
      <div className="mt-1">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">
            {formattedValue}
          </span>
          <div className="ml-2.5">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPercentageBg()} ${getPercentageColor()}`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          </div>
        </div>
        {secondaryChange !== null && (
          <div className="mt-1 text-xs text-gray-500">
            <span
              className={
                isSecondaryPositive ? "text-green-700" : "text-red-700"
              }
            >
              {isSecondaryPositive ? "+" : ""}
              {secondaryChange.toFixed(1)}%
            </span>{" "}
            {secondaryChangeLabel || "WoW"}
          </div>
        )}
      </div>
    </div>
  );
};

export default function AICampaignReport() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg text-purple-600"
              style={{ background: "#F5F3FF" }}
            >
              <CpuChipIcon className="h-6 w-6" />
            </div>
            AI Campaign Report
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered performance insights and forecasting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: "#DCFCE7",
              borderColor: "#BBF7D0",
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#10B981" }}
            ></div>
            <span className="text-sm font-medium" style={{ color: "#059669" }}>
              Live Data
            </span>
          </div>
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: "#059669",
              color: "#FFFFFF",
            }}
          >
            Campaign Active
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Opt-Ins"
          value={campaignData.optIns}
          change={campaignData.optInsChange}
          secondaryChange={campaignData.optInsWoWChange}
          secondaryChangeLabel="WoW"
          icon={UsersIcon}
        />
        <KPICard
          title="Redemptions"
          value={campaignData.redemptions}
          change={campaignData.redemptionsChange}
          secondaryChange={campaignData.redemptionsWoWChange}
          secondaryChangeLabel="WoW"
          icon={ShoppingCartIcon}
        />
        <KPICard
          title="Redemption Rate"
          value={`${campaignData.redemptionRate}%`}
          change={campaignData.redemptionRateChange}
          secondaryChange={campaignData.redemptionRateBaseline}
          secondaryChangeLabel="vs baseline"
          icon={ChartBarIcon}
        />
        <KPICard
          title="AI Incrementality"
          value={`${campaignData.aiIncrementality}%`}
          change={campaignData.aiIncrementalityChange}
          secondaryChange={campaignData.aiIncrementalityConfidence}
          secondaryChangeLabel="confidence"
          icon={ArrowTrendingUpIcon}
        />
      </div>

      {/* Main Content: Chart and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart - Large Column */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Redemption Forecast
              </h2>
              <div className="flex items-center gap-4 text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-purple-500 border-dashed rounded-full"></div>
                  <span className="text-gray-700 font-medium">AI Forecast</span>
                </div>
              </div>
            </div>

            <ChartContainer
              config={forecastChartConfig}
              className="h-80 w-full"
            >
              <LineChart data={forecastData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="week"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-actual)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-actual)", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "var(--color-actual)",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="var(--color-forecast)"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  dot={{ fill: "var(--color-forecast)", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    stroke: "var(--color-forecast)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ChartContainer>

            {/* AI Insight Callout */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <CpuChipIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-purple-900">
                      AI Prediction Insight
                    </p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      92% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-purple-800">
                    AI predicts a <strong>15% lift in the final week</strong>{" "}
                    driven by increased mobile engagement and optimized send
                    times.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Two Stacked Cards */}
        <div className="space-y-6">
          {/* Top Performing Segments */}
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2.5 rounded-lg text-green-600 mr-2"
                style={{ background: "#ECFDF5" }}
              >
                <UsersIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Segments
              </h3>
            </div>
            <div className="space-y-3">
              {topSegments.map((segment, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">
                      {segment.segment}
                    </span>
                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                      {segment.redemptionRate}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <p className="font-medium">
                        {segment.totalUsers.toLocaleString()}
                      </p>
                      <p>Users</p>
                    </div>
                    <div>
                      <p className="font-medium">{segment.avgOrderValue}</p>
                      <p>AOV</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-700">
                        {segment.conversionLift}
                      </p>
                      <p>Lift</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fraud Analysis */}
          <Card
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="p-2.5 rounded-lg text-red-600 mr-2"
                style={{ background: "#FEF2F2" }}
              >
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fraud Detection
              </h3>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">
                  Total Attempts
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {fraudAnalytics.totalAttempts.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">
                  Fraud Prevented
                </p>
                <p className="text-lg font-bold text-red-700">
                  {fraudAnalytics.fraudPrevented}
                </p>
              </div>
            </div>

            {/* Detection breakdown */}
            <div className="space-y-2 mb-4">
              {fraudData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    ></div>
                    <span className="text-gray-800 font-medium">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {entry.value}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {entry.count.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="font-bold text-green-700">
                  {fraudAnalytics.detectionAccuracy}%
                </p>
                <p className="text-gray-600">Accuracy</p>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <p className="font-bold text-yellow-700">
                  {fraudAnalytics.falsePositiveRate}%
                </p>
                <p className="text-gray-600">False Positive</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="font-bold text-blue-700">
                  {fraudAnalytics.avgProcessingTime}
                </p>
                <p className="text-gray-600">Avg Processing</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
