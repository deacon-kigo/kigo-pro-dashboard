"use client";

import React, { Suspense } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/atoms/Breadcrumb";
import { Card } from "@/components/ui/card";
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Enhanced forecast data with predictions
const forecastData = [
  { month: "Jan", actual: 42300, forecast: null, engagement: 68.2 },
  { month: "Feb", actual: 45700, forecast: null, engagement: 71.4 },
  { month: "Mar", actual: 48900, forecast: null, engagement: 73.8 },
  { month: "Apr", actual: 52100, forecast: null, engagement: 76.2 },
  { month: "May", actual: 55300, forecast: null, engagement: 78.5 },
  { month: "Jun", actual: 58700, forecast: null, engagement: 81.2 },
  { month: "Jul", actual: null, forecast: 63400, engagement: 84.1 },
  { month: "Aug", actual: null, forecast: 67200, engagement: 86.3 },
  { month: "Sep", actual: null, forecast: 70800, engagement: 88.7 },
];

const propertyPortfolioData = [
  {
    portfolio: "Downtown",
    tenants: 3200,
    engagement: 82,
    redemptions: 2640,
    revenue: 52800,
  },
  {
    portfolio: "Suburban",
    tenants: 4500,
    engagement: 76,
    redemptions: 3420,
    revenue: 68400,
  },
  {
    portfolio: "Luxury",
    tenants: 1800,
    engagement: 89,
    redemptions: 1602,
    revenue: 64080,
  },
  {
    portfolio: "Student",
    tenants: 5200,
    engagement: 68,
    redemptions: 3536,
    revenue: 42432,
  },
];

const tenantSegmentData = [
  {
    segment: "Premium Tenants",
    performance: 92,
    engagement: 88,
    retention: 95,
    satisfaction: 90,
    redemption: 85,
  },
  {
    segment: "Standard Tenants",
    performance: 78,
    engagement: 75,
    retention: 82,
    satisfaction: 76,
    redemption: 74,
  },
  {
    segment: "New Tenants",
    performance: 65,
    engagement: 68,
    retention: 70,
    satisfaction: 72,
    redemption: 58,
  },
];

const merchantPerformanceData = [
  { category: "Dining", partnerships: 45, redemptions: 12400, avgValue: 28 },
  { category: "Retail", partnerships: 38, redemptions: 9800, avgValue: 42 },
  { category: "Services", partnerships: 52, redemptions: 8200, avgValue: 65 },
  {
    category: "Entertainment",
    partnerships: 28,
    redemptions: 6500,
    avgValue: 35,
  },
];

const kpiData = [
  {
    title: "Total Tenant Engagement",
    value: "185,400",
    change: 18.3,
    period: "vs last quarter",
    icon: UsersIcon,
    color: "#0066CC",
  },
  {
    title: "Total Redemptions",
    value: "78,240",
    change: 24.7,
    period: "vs last quarter",
    icon: ShoppingCartIcon,
    color: "#10B981",
  },
  {
    title: "Avg. Engagement Rate",
    value: "78.5%",
    change: 12.4,
    period: "vs last quarter",
    icon: ChartBarIcon,
    color: "#F59E0B",
  },
  {
    title: "Revenue Generated",
    value: "$2.8M",
    change: 31.2,
    period: "vs last quarter",
    icon: ArrowTrendingUpIcon,
    color: "#8B5CF6",
  },
];

const roiMetrics = [
  { label: "Campaign ROI", value: "425%", status: "Excellent" },
  { label: "Cost per Acquisition", value: "$8.20", status: "Below Target" },
  { label: "Tenant Lifetime Value", value: "$1,840", status: "Above Avg" },
  { label: "Merchant Partner Growth", value: "+34%", status: "Strong" },
];

function AnalyticsDashboardContent() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{ background: "#F5F3FF", color: "#8B5CF6" }}
            >
              <ChartBarIcon className="h-7 w-7" />
            </div>
            Reporting & Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-Time Performance Insights & Predictive Analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-green-200 bg-green-50">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-700">
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={index}
              className="p-5 border border-gray-200 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="p-2.5 rounded-lg"
                  style={{
                    backgroundColor: `${kpi.color}20`,
                    color: kpi.color,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "#D1FAE5",
                    color: "#065F46",
                  }}
                >
                  <ArrowTrendingUpIcon className="h-3 w-3" />+{kpi.change}%
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {kpi.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {kpi.value}
              </p>
              <p className="text-xs text-gray-500">{kpi.period}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Predictive Forecast */}
        <Card className="p-6 border border-gray-200 shadow-sm col-span-2 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CpuChipIcon className="h-6 w-6 text-purple-600" />
                AI-Powered Redemption Forecast
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Predictive analytics with 94% confidence
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-700 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-dashed" />
                <span className="text-gray-700 font-medium">Forecast</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorForecast"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#0066CC"
                  strokeWidth={3}
                  fill="url(#colorActual)"
                  dot={{ fill: "#0066CC", r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  fill="url(#colorForecast)"
                  dot={{ fill: "#8B5CF6", r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div
            className="mt-4 p-4 rounded-lg border-2"
            style={{
              background: "linear-gradient(to right, #F5F3FF, #EDE9FE)",
              borderColor: "#8B5CF6",
            }}
          >
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-semibold text-gray-900">
                AI Insight: Projected 21% growth in Q3 driven by increased
                merchant partnerships and tenant engagement programs
              </p>
            </div>
          </div>
        </Card>

        {/* ROI Metrics */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">ROI Tracking</h3>
          </div>
          <div className="space-y-4">
            {roiMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2"
                style={{
                  background: "linear-gradient(to right, #ECFDF5, #D1FAE5)",
                  borderColor: "#86EFAC",
                }}
              >
                <p className="text-xs text-gray-600 font-medium mb-1">
                  {metric.label}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <div
                    className="px-2 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: "#DCFCE7",
                      color: "#065F46",
                    }}
                  >
                    {metric.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Property Portfolio Performance */}
        <Card className="p-6 border border-gray-200 shadow-sm col-span-2 bg-white">
          <div className="flex items-center gap-2 mb-6">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Property Portfolio Performance
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPortfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="portfolio"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Bar
                  dataKey="redemptions"
                  fill="#0066CC"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                />
                <Bar
                  dataKey="tenants"
                  fill="#93C5FD"
                  radius={[8, 8, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tenant Segment Analysis */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6">
            <FireIcon className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Segment Analysis
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={tenantSegmentData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="segment"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                />
                <Radar
                  name="Performance"
                  dataKey="performance"
                  stroke="#0066CC"
                  fill="#0066CC"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                <Radar
                  name="Engagement"
                  dataKey="engagement"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Key Insights Footer */}
      <Card
        className="p-6 border border-gray-200 shadow-sm"
        style={{
          background: "linear-gradient(to right, #DBEAFE, #E9D5FF)",
        }}
      >
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">185K+</div>
            <p className="text-sm font-semibold text-gray-700">
              Active Tenants
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">163</div>
            <p className="text-sm font-semibold text-gray-700">
              Merchant Partners
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">94%</div>
            <p className="text-sm font-semibold text-gray-700">
              AI Prediction Accuracy
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">425%</div>
            <p className="text-sm font-semibold text-gray-700">
              Average Campaign ROI
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function YardiSlide2() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Yardi Analytics Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AppLayout customBreadcrumb={breadcrumb}>
        <AnalyticsDashboardContent />
      </AppLayout>
    </Suspense>
  );
}
