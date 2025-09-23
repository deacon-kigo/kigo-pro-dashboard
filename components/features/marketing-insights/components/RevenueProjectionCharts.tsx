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
  ComposedChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Zap } from "lucide-react";

interface RevenueProjectionChartsProps {
  selectedJourney: string | null;
}

export default function RevenueProjectionCharts({
  selectedJourney,
}: RevenueProjectionChartsProps) {
  // Mock data for revenue projections
  const revenueProjectionData = [
    {
      month: "Jan",
      immediate: 72000,
      ltv: 680000,
      combined: 752000,
      target: 700000,
    },
    {
      month: "Feb",
      immediate: 78000,
      ltv: 740000,
      combined: 818000,
      target: 750000,
    },
    {
      month: "Mar",
      immediate: 85000,
      ltv: 820000,
      combined: 905000,
      target: 800000,
    },
    {
      month: "Apr",
      immediate: 92000,
      ltv: 890000,
      combined: 982000,
      target: 850000,
    },
    {
      month: "May",
      immediate: 98000,
      ltv: 950000,
      combined: 1048000,
      target: 900000,
    },
    {
      month: "Jun",
      immediate: 105000,
      ltv: 1020000,
      combined: 1125000,
      target: 950000,
    },
    {
      month: "Jul",
      immediate: 112000,
      ltv: 1080000,
      combined: 1192000,
      target: 1000000,
    },
    {
      month: "Aug",
      immediate: 118000,
      ltv: 1140000,
      combined: 1258000,
      target: 1050000,
    },
    {
      month: "Sep",
      immediate: 125000,
      ltv: 1200000,
      combined: 1325000,
      target: 1100000,
    },
    {
      month: "Oct",
      immediate: 132000,
      ltv: 1260000,
      combined: 1392000,
      target: 1150000,
    },
    {
      month: "Nov",
      immediate: 139000,
      ltv: 1320000,
      combined: 1459000,
      target: 1200000,
    },
    {
      month: "Dec",
      immediate: 145000,
      ltv: 1380000,
      combined: 1525000,
      target: 1250000,
    },
  ];

  // Mock data for ROI breakdown
  const roiBreakdownData = [
    {
      category: "Ad-Funded Revenue",
      q1: 245000,
      q2: 289000,
      q3: 334000,
      q4: 378000,
    },
    {
      category: "Merchant Partnerships",
      q1: 412000,
      q2: 478000,
      q3: 545000,
      q4: 612000,
    },
    {
      category: "LTV Enhancement",
      q1: 1680000,
      q2: 1950000,
      q3: 2220000,
      q4: 2490000,
    },
    {
      category: "Cross-sell Revenue",
      q1: 156000,
      q2: 189000,
      q3: 223000,
      q4: 267000,
    },
  ];

  // Mock data for campaign phase revenue
  const campaignPhaseData = [
    {
      phase: "Phase 1: Moving Logistics",
      customers: 567,
      revenuePerCustomer: 45,
      totalRevenue: 25515,
      roi: 445,
    },
    {
      phase: "Phase 2: Travel & Transition",
      customers: 534,
      revenuePerCustomer: 40,
      totalRevenue: 21360,
      roi: 380,
    },
    {
      phase: "Phase 3: Home Setup",
      customers: 498,
      revenuePerCustomer: 52,
      totalRevenue: 25896,
      roi: 520,
    },
    {
      phase: "Phase 4: Local Integration",
      customers: 467,
      revenuePerCustomer: 50,
      totalRevenue: 23350,
      roi: 485,
    },
  ];

  // Mock data for partner revenue distribution
  const partnerRevenueData = [
    {
      partner: "National Partners",
      revenue: 450000,
      percentage: 35,
      count: 15,
    },
    { partner: "Regional Chains", revenue: 380000, percentage: 29, count: 45 },
    {
      partner: "Local Merchants",
      revenue: 290000,
      percentage: 23,
      count: 12000,
    },
    { partner: "Digital Platforms", revenue: 165000, percentage: 13, count: 8 },
  ];

  const chartConfig = {
    immediate: {
      label: "Immediate Revenue",
      color: "#10b981",
    },
    ltv: {
      label: "LTV Impact",
      color: "#3b82f6",
    },
    combined: {
      label: "Combined Revenue",
      color: "#8b5cf6",
    },
    target: {
      label: "Target",
      color: "#ef4444",
    },
    revenue: {
      label: "Revenue",
      color: "#f59e0b",
    },
  };

  return (
    <div className="space-y-6">
      {/* Revenue Projection Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Projection Analysis
          </CardTitle>
          <CardDescription>
            12-month immediate revenue vs LTV impact projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ComposedChart data={revenueProjectionData}>
              <defs>
                <linearGradient
                  id="immediateGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="ltvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
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
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 mb-2">
                          {label}
                        </p>
                        {payload.map((entry, index) => (
                          <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                          >
                            {entry.name}: $
                            {(entry.value as number).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="immediate"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#immediateGradient)"
              />
              <Area
                type="monotone"
                dataKey="ltv"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#ltvGradient)"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Phase Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Campaign Phase Revenue
            </CardTitle>
            <CardDescription>
              Revenue breakdown by journey phase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPhaseData.map((phase, index) => (
                <div key={phase.phase} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {phase.phase}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`${
                        phase.roi >= 500
                          ? "bg-green-50 text-green-700 border-green-200"
                          : phase.roi >= 400
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      {phase.roi}% ROI
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <p>Customers: {phase.customers}</p>
                    </div>
                    <div>
                      <p>Per Customer: ${phase.revenuePerCustomer}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-600">
                        Total: ${phase.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                      style={{ width: `${(phase.roi / 600) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partner Revenue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Partner Revenue Distribution
            </CardTitle>
            <CardDescription>
              Revenue by partner category and network size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={partnerRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="partner"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">
                            Revenue: ${data.revenue.toLocaleString()} (
                            {data.percentage}%)
                          </p>
                          <p className="text-sm text-gray-600">
                            Partners: {data.count.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Breakdown by Quarter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Quarterly ROI Breakdown
          </CardTitle>
          <CardDescription>
            Revenue streams across quarters with growth projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={roiBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 mb-2">
                          {label}
                        </p>
                        {payload.map((entry, index) => (
                          <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                          >
                            {entry.dataKey}: $
                            {(entry.value as number).toLocaleString()}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="q1" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="q2" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="q3" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="q4" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
