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
  // Mock data for journey timeline
  const journeyTimelineData = [
    { week: "Week 1", triggers: 45, engagement: 12, conversion: 3 },
    { week: "Week 2", triggers: 67, engagement: 28, conversion: 8 },
    { week: "Week 3", triggers: 89, engagement: 52, conversion: 18 },
    { week: "Week 4", triggers: 123, engagement: 78, conversion: 32 },
    { week: "Week 5", triggers: 156, engagement: 98, conversion: 45 },
    { week: "Week 6", triggers: 134, engagement: 89, conversion: 52 },
    { week: "Week 7", triggers: 178, engagement: 124, conversion: 67 },
    { week: "Week 8", triggers: 145, engagement: 102, conversion: 58 },
    { week: "Week 9", triggers: 167, engagement: 118, conversion: 71 },
    { week: "Week 10", triggers: 189, engagement: 142, conversion: 89 },
    { week: "Week 11", triggers: 201, engagement: 156, conversion: 98 },
    { week: "Week 12", triggers: 234, engagement: 178, conversion: 124 },
  ];

  // Mock data for engagement phases
  const engagementPhasesData = [
    { phase: "Discovery", rate: 94, color: "#3b82f6" },
    { phase: "Consideration", rate: 89, color: "#10b981" },
    { phase: "Decision", rate: 96, color: "#f59e0b" },
    { phase: "Integration", rate: 91, color: "#8b5cf6" },
  ];

  // Mock data for geographic distribution
  const geographicData = [
    { region: "Denver Metro", customers: 156, percentage: 28 },
    { region: "Austin Metro", customers: 134, percentage: 24 },
    { region: "Seattle Metro", customers: 98, percentage: 18 },
    { region: "Charleston Metro", customers: 89, percentage: 16 },
    { region: "Other Markets", customers: 78, percentage: 14 },
  ];

  // Mock data for seasonal patterns
  const seasonalData = [
    { month: "Jan", volume: 45, confidence: 82 },
    { month: "Feb", volume: 52, confidence: 85 },
    { month: "Mar", volume: 78, confidence: 89 },
    { month: "Apr", volume: 134, confidence: 92 },
    { month: "May", volume: 189, confidence: 94 },
    { month: "Jun", volume: 234, confidence: 96 },
    { month: "Jul", volume: 267, confidence: 94 },
    { month: "Aug", volume: 298, confidence: 91 },
    { month: "Sep", volume: 234, confidence: 89 },
    { month: "Oct", volume: 178, confidence: 87 },
    { month: "Nov", volume: 123, confidence: 84 },
    { month: "Dec", volume: 89, confidence: 82 },
  ];

  const chartConfig = {
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
    <div className="space-y-3">
      {/* Journey Timeline Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Journey Timeline Analysis
          </CardTitle>
          <CardDescription>
            12-week customer journey progression from trigger to conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={journeyTimelineData}>
              <defs>
                <linearGradient
                  id="triggersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="engagementGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="conversionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="triggers"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#triggersGradient)"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#engagementGradient)"
              />
              <Area
                type="monotone"
                dataKey="conversion"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#conversionGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Phases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Engagement Phases
            </CardTitle>
            <CardDescription>
              Success rates across customer journey phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementPhasesData.map((phase, index) => (
                <div
                  key={phase.phase}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {phase.phase}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${phase.rate}%`,
                          backgroundColor: phase.color,
                        }}
                      />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gray-50 text-gray-700"
                    >
                      {phase.rate}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Customer concentration by metro areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-48">
              <BarChart data={geographicData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  width={100}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">
                            {payload[0].value} customers (
                            {payload[0].payload.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="customers" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Seasonal Patterns & Confidence
          </CardTitle>
          <CardDescription>
            Monthly volume trends with AI confidence levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={seasonalData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                yAxisId="volume"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                yAxisId="confidence"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                domain={[75, 100]}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-purple-600">
                          Volume: {payload[0]?.value}
                        </p>
                        <p className="text-sm text-red-600">
                          Confidence: {payload[1]?.value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="volume"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#volumeGradient)"
              />
              <Line
                yAxisId="confidence"
                type="monotone"
                dataKey="confidence"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
