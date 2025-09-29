"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, MapPin, Calendar } from "lucide-react";

interface JourneyDiscoveryDashboardProps {
  selectedJourney: string | null;
}

export default function JourneyDiscoveryDashboard({
  selectedJourney,
}: JourneyDiscoveryDashboardProps) {
  // Realistic data for journey timeline - showing the story progression
  const journeyTimelineData = [
    {
      week: "Week 1",
      activeMembers: 1150000,
      totalRedemptions: 655000,
      incrementalValue: 310000,
      triggers: 45,
      engagement: 12,
      conversion: 3,
    },
    {
      week: "Week 2",
      activeMembers: 1155000,
      totalRedemptions: 670000,
      incrementalValue: 315000,
      triggers: 50,
      engagement: 18,
      conversion: 8,
    },
    {
      week: "Week 3",
      activeMembers: 1160000,
      totalRedemptions: 660000,
      incrementalValue: 312000,
      triggers: 48,
      engagement: 15,
      conversion: 6,
    },
    {
      week: "Week 4",
      activeMembers: 1165000,
      totalRedemptions: 690000,
      incrementalValue: 330000,
      triggers: 65,
      engagement: 35,
      conversion: 18,
    },
    {
      week: "Week 5",
      activeMembers: 1170000,
      totalRedemptions: 710000,
      incrementalValue: 345000,
      triggers: 75,
      engagement: 45,
      conversion: 25,
    },
    {
      week: "Week 6",
      activeMembers: 1175000,
      totalRedemptions: 705000,
      incrementalValue: 340000,
      triggers: 72,
      engagement: 42,
      conversion: 22,
    },
    {
      week: "Week 7",
      activeMembers: 1180000,
      totalRedemptions: 725000,
      incrementalValue: 355000,
      triggers: 85,
      engagement: 55,
      conversion: 32,
    },
    {
      week: "Week 8",
      activeMembers: 1185000,
      totalRedemptions: 740000,
      incrementalValue: 365000,
      triggers: 92,
      engagement: 62,
      conversion: 38,
    },
    {
      week: "Week 9",
      activeMembers: 1190000,
      totalRedemptions: 755000,
      incrementalValue: 380000,
      triggers: 98,
      engagement: 68,
      conversion: 45,
    },
    {
      week: "Week 10",
      activeMembers: 1195000,
      totalRedemptions: 720000,
      incrementalValue: 360000,
      triggers: 85,
      engagement: 50,
      conversion: 28,
    },
    {
      week: "Week 11",
      activeMembers: 1200000,
      totalRedemptions: 695000,
      incrementalValue: 340000,
      triggers: 75,
      engagement: 38,
      conversion: 18,
    },
    {
      week: "Week 12",
      activeMembers: 1205000,
      totalRedemptions: 680000,
      incrementalValue: 335000,
      triggers: 68,
      engagement: 32,
      conversion: 12,
    },
  ];

  // Mock data for top performing offer categories
  const engagementPhasesData = [
    {
      phase: "Dining & Restaurants",
      rate: 94,
      color: "#3b82f6",
      value: "$1.1M",
    },
    { phase: "Home & Garden", rate: 89, color: "#10b981", value: "$850K" },
    {
      phase: "Travel & Experiences",
      rate: 96,
      color: "#f59e0b",
      value: "$670K",
    },
    { phase: "Health & Wellness", rate: 91, color: "#8b5cf6", value: "$550K" },
    {
      phase: "Apparel & Accessories",
      rate: 87,
      color: "#ef4444",
      value: "$480K",
    },
  ];

  // Mock data for geographic distribution
  const geographicData = [
    { region: "Denver Metro", customers: 156, percentage: 28 },
    { region: "Austin Metro", customers: 134, percentage: 24 },
    { region: "Seattle Metro", customers: 98, percentage: 18 },
    { region: "Charleston Metro", customers: 89, percentage: 16 },
    { region: "Other Markets", customers: 78, percentage: 14 },
  ];

  // Mock data for audience spotlight
  const seasonalData = [
    {
      month: "High Earners",
      volume: 245,
      confidence: 94,
      description: "Premium segment",
    },
    {
      month: "New Movers",
      volume: 189,
      confidence: 92,
      description: "Relocation journey",
    },
    {
      month: "Families w/ Kids",
      volume: 167,
      confidence: 89,
      description: "Family-focused",
    },
    {
      month: "Young Professionals",
      volume: 134,
      confidence: 85,
      description: "Career-driven",
    },
  ];

  const chartConfig = {
    activeMembers: {
      label: "Active Members",
      color: "#3b82f6",
    },
    totalRedemptions: {
      label: "Total Redemptions",
      color: "#10b981",
    },
    incrementalValue: {
      label: "Incremental Value Generated",
      color: "#f59e0b",
    },
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
      color: "#f59e0b",
    },
    volume: {
      label: "Volume",
      color: "#8b5cf6",
    },
    confidence: {
      label: "Confidence",
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-4">
      {/* Comprehensive Engagement Dashboard */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Engagement Over Time
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                90-day engagement trend showing customer interaction patterns
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Triggers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Conversion</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Chart with Side Stats - Dynamic Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chart Area - Dynamic Width */}
            <div className="flex-1 min-w-0">
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={journeyTimelineData}>
                    <defs>
                      <linearGradient
                        id="triggersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="engagementGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="conversionGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="bg-white border border-gray-200 shadow-lg rounded-lg p-3"
                          labelClassName="text-gray-900 font-medium"
                          valueClassName="text-gray-700"
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="activeMembers"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#triggersGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalRedemptions"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#engagementGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="incrementalValue"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#conversionGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Chart Legend */}
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#3b82f6" }}
                  ></div>
                  <span className="text-xs text-gray-600">Active Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#10b981" }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    Total Redemptions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#f59e0b" }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    Incremental Value
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics Sidebar - Fixed Width */}
            <div className="w-full lg:w-80 xl:w-96 space-y-3">
              {/* Peak Performance */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#1d4ed8" }}
                  >
                    Redemptions peak at 755K in week 9
                  </span>
                  <Badge
                    className="text-white text-xs"
                    style={{ backgroundColor: "#2563eb" }}
                  >
                    Week 9
                  </Badge>
                </div>
                <div className="text-lg font-bold" style={{ color: "#1e3a8a" }}>
                  178
                </div>
                <div className="text-xs" style={{ color: "#2563eb" }}>
                  triggers generated
                </div>
              </div>

              {/* Avg Weekly Redemptions */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#15803d" }}
                  >
                    Avg Weekly Redemptions
                  </span>
                  <Badge
                    className="text-white text-xs"
                    style={{ backgroundColor: "#16a34a" }}
                  >
                    +12%
                  </Badge>
                </div>
                <div className="text-lg font-bold" style={{ color: "#14532d" }}>
                  700K
                </div>
                <div className="text-xs" style={{ color: "#16a34a" }}>
                  Trailing 90 Days
                </div>
              </div>

              {/* Growth Trend */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#b45309" }}
                  >
                    Growth Rate
                  </span>
                  <Badge
                    className="text-white text-xs"
                    style={{ backgroundColor: "#d97706" }}
                  >
                    +295%
                  </Badge>
                </div>
                <div className="text-lg font-bold" style={{ color: "#92400e" }}>
                  8 Weeks
                </div>
                <div className="text-xs" style={{ color: "#d97706" }}>
                  sustained growth
                </div>
              </div>

              {/* Engagement Quality */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#7c3aed" }}
                  >
                    Quality Score
                  </span>
                  <Badge
                    className="text-white text-xs"
                    style={{ backgroundColor: "#9333ea" }}
                  >
                    92/100
                  </Badge>
                </div>
                <div className="text-lg font-bold" style={{ color: "#581c87" }}>
                  High
                </div>
                <div className="text-xs" style={{ color: "#9333ea" }}>
                  engagement quality
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Insights Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Total Triggers</div>
                <div className="text-lg font-bold text-gray-900">1,037</div>
                <div className="text-xs text-green-600">+23% vs target</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  Engagement Rate
                </div>
                <div className="text-lg font-bold text-gray-900">64.2%</div>
                <div className="text-xs text-green-600">
                  +8.3% vs last period
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  Redemption Rate
                </div>
                <div className="text-lg font-bold text-gray-900">37.6%</div>
                <div className="text-xs text-green-600">+12.1% improvement</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Revenue Impact</div>
                <div className="text-lg font-bold text-gray-900">$127K</div>
                <div className="text-xs text-green-600">+18% vs projection</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Performance Insights */}
      <div className="grid grid-cols-3 gap-4">
        {/* Journey Phases */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Top performing offer categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {engagementPhasesData.slice(0, 4).map((phase, index) => (
                <div
                  key={phase.phase}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="text-xs text-gray-700">{phase.phase}</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
                    {phase.rate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Top Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {geographicData.slice(0, 4).map((region, index) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-700">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(region.customers / 2500) * 100}%` }}
                      />
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5">
                      {region.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Trends */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Audience Spotlight
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {seasonalData.slice(0, 4).map((month, index) => (
                <div
                  key={month.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-700">{month.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">
                      {month.volume}
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                      {month.confidence}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
