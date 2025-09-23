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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Heart, Repeat } from "lucide-react";

interface CustomerBehaviorAnalyticsProps {
  selectedJourney: string | null;
}

export default function CustomerBehaviorAnalytics({
  selectedJourney,
}: CustomerBehaviorAnalyticsProps) {
  // Mock data for engagement patterns
  const engagementPatternData = [
    { hour: "6AM", weekday: 12, weekend: 8 },
    { hour: "8AM", weekday: 45, weekend: 23 },
    { hour: "10AM", weekday: 67, weekend: 56 },
    { hour: "12PM", weekday: 89, weekend: 78 },
    { hour: "2PM", weekday: 76, weekend: 89 },
    { hour: "4PM", weekday: 92, weekend: 95 },
    { hour: "6PM", weekday: 134, weekend: 156 },
    { hour: "8PM", weekday: 98, weekend: 134 },
    { hour: "10PM", weekday: 67, weekend: 89 },
    { hour: "12AM", weekday: 34, weekend: 45 },
  ];

  // Mock data for customer segments
  const customerSegmentData = [
    {
      segment: "High Value",
      engagement: 95,
      retention: 89,
      ltv: 92,
      satisfaction: 94,
    },
    {
      segment: "Growing",
      engagement: 78,
      retention: 72,
      ltv: 75,
      satisfaction: 81,
    },
    {
      segment: "At Risk",
      engagement: 45,
      retention: 38,
      ltv: 42,
      satisfaction: 51,
    },
    { segment: "New", engagement: 67, retention: 0, ltv: 25, satisfaction: 73 },
  ];

  // Mock data for journey progression
  const journeyProgressionData = [
    { stage: "Awareness", dropoff: 5, conversion: 95, avgTime: 2.3 },
    { stage: "Interest", dropoff: 12, conversion: 88, avgTime: 4.7 },
    { stage: "Consideration", dropoff: 18, conversion: 82, avgTime: 8.2 },
    { stage: "Intent", dropoff: 8, conversion: 74, avgTime: 12.5 },
    { stage: "Purchase", dropoff: 15, conversion: 59, avgTime: 18.9 },
    { stage: "Retention", dropoff: 22, conversion: 37, avgTime: 45.2 },
  ];

  // Mock data for behavioral triggers
  const behavioralTriggerData = [
    { trigger: "Transaction Amount", impact: 87, frequency: 234, success: 92 },
    { trigger: "Location Change", impact: 94, frequency: 156, success: 89 },
    { trigger: "Time of Day", impact: 73, frequency: 445, success: 76 },
    { trigger: "Category Spend", impact: 81, frequency: 334, success: 84 },
    { trigger: "Payment Method", impact: 68, frequency: 567, success: 71 },
    { trigger: "Merchant Type", impact: 79, frequency: 289, success: 82 },
  ];

  // Mock data for retention analysis
  const retentionData = [
    {
      cohort: "Jan 2024",
      month1: 100,
      month2: 87,
      month3: 76,
      month4: 68,
      month5: 62,
      month6: 58,
    },
    {
      cohort: "Feb 2024",
      month1: 100,
      month2: 89,
      month3: 78,
      month4: 71,
      month5: 65,
      month6: 0,
    },
    {
      cohort: "Mar 2024",
      month1: 100,
      month2: 91,
      month3: 82,
      month4: 74,
      month5: 0,
      month6: 0,
    },
    {
      cohort: "Apr 2024",
      month1: 100,
      month2: 88,
      month3: 79,
      month4: 0,
      month5: 0,
      month6: 0,
    },
    {
      cohort: "May 2024",
      month1: 100,
      month2: 92,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
    },
    {
      cohort: "Jun 2024",
      month1: 100,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
    },
  ];

  const chartConfig = {
    weekday: {
      label: "Weekday",
      color: "#3b82f6",
    },
    weekend: {
      label: "Weekend",
      color: "#10b981",
    },
    conversion: {
      label: "Conversion Rate",
      color: "#8b5cf6",
    },
    dropoff: {
      label: "Drop-off Rate",
      color: "#ef4444",
    },
    impact: {
      label: "Impact Score",
      color: "#f59e0b",
    },
  };

  return (
    <div className="space-y-6">
      {/* Engagement Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Daily Engagement Patterns
          </CardTitle>
          <CardDescription>
            Customer activity patterns by time of day and day type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={engagementPatternData}>
              <defs>
                <linearGradient
                  id="weekdayGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="weekendGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="hour"
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
                dataKey="weekday"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#weekdayGradient)"
              />
              <Area
                type="monotone"
                dataKey="weekend"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#weekendGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Customer Segment Analysis
            </CardTitle>
            <CardDescription>
              Multi-dimensional view of customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <RadarChart data={customerSegmentData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis
                  dataKey="segment"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <Radar
                  name="Engagement"
                  dataKey="engagement"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="Retention"
                  dataKey="retention"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar
                  name="LTV"
                  dataKey="ltv"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          {payload.map((entry, index) => (
                            <p
                              key={index}
                              className="text-sm"
                              style={{ color: entry.color }}
                            >
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Journey Progression Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-green-600" />
              Journey Progression Analysis
            </CardTitle>
            <CardDescription>
              Conversion rates and time spent at each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journeyProgressionData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {stage.stage}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${
                          stage.conversion >= 80
                            ? "bg-green-50 text-green-700 border-green-200"
                            : stage.conversion >= 60
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {stage.conversion}% convert
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {stage.avgTime}d avg
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${stage.conversion}%` }}
                      />
                    </div>
                    <div className="w-16 h-3 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${stage.dropoff}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Conversion Rate</span>
                    <span>Drop-off: {stage.dropoff}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Behavioral Trigger Analysis
          </CardTitle>
          <CardDescription>
            Impact and frequency of different behavioral triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ScatterChart data={behavioralTriggerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="frequency"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                name="Frequency"
                label={{
                  value: "Frequency",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                dataKey="impact"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                name="Impact"
                label={{
                  value: "Impact Score",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">
                          {data.trigger}
                        </p>
                        <p className="text-sm text-gray-600">
                          Impact: {data.impact}%
                        </p>
                        <p className="text-sm text-gray-600">
                          Frequency: {data.frequency}
                        </p>
                        <p className="text-sm text-gray-600">
                          Success: {data.success}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="impact" fill="#f59e0b" r={6} />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Retention Cohort Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-indigo-600" />
            Retention Cohort Analysis
          </CardTitle>
          <CardDescription>
            Monthly retention rates by customer cohort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="cohort"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        {payload.map(
                          (entry, index) =>
                            entry.value > 0 && (
                              <p
                                key={index}
                                className="text-sm"
                                style={{ color: entry.color }}
                              >
                                {entry.dataKey}: {entry.value}%
                              </p>
                            )
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="month1"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="month2"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="month3"
                stroke="#f59e0b"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="month4"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="month5"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="month6"
                stroke="#6b7280"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
