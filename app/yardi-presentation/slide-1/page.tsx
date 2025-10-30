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
import { Badge } from "@/components/ui/badge";
import {
  GiftIcon,
  SparklesIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data - Yardi specific
const performanceTrendData = [
  { date: "Week 1", redemptions: 2200, revenue: 44000 },
  { date: "Week 2", redemptions: 2450, revenue: 49000 },
  { date: "Week 3", redemptions: 2680, revenue: 53600 },
  { date: "Week 4", redemptions: 2920, revenue: 58400 },
  { date: "Week 5", redemptions: 3180, revenue: 63600 },
  { date: "Week 6", redemptions: 3450, revenue: 69000 },
];

const offerTypeData = [
  { name: "Percentage Off", value: 42, color: "#0066CC" },
  { name: "Fixed Discount", value: 35, color: "#00A3E0" },
  { name: "Cashback", value: 15, color: "#6CB4E8" },
  { name: "Points Boost", value: 8, color: "#003B71" },
];

const propertyPerformanceData = [
  { property: "Downtown Properties", redemptions: 4200, ctr: 28.5 },
  { property: "Suburban Portfolio", redemptions: 3800, ctr: 24.2 },
  { property: "Luxury Residences", redemptions: 2100, ctr: 31.8 },
];

const yardiOffers = [
  {
    id: "1",
    title: "Move-In Welcome Package - $100 Value",
    description:
      "New Tenant Onboarding Incentive | Downtown & Suburban Properties",
    status: "active",
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 2892,
    ctr: "28%",
    daysRemaining: 12,
    properties: 45,
  },
  {
    id: "2",
    title: "20% Off Home Services Bundle",
    description: "Partner Discount: Cleaning, Handyman & Moving Services",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 3245,
    ctr: "31%",
    daysRemaining: 23,
    properties: 62,
  },
  {
    id: "3",
    title: "Rent Rewards Program - Double Points",
    description: "Q4 Loyalty Boost | All On-Time Payments Earn 2x Points",
    status: "active",
    redemptionMethod: "Promoted Marketplace",
    redemptionCount: 4156,
    ctr: "35%",
    daysRemaining: 8,
    properties: 78,
  },
  {
    id: "4",
    title: "Lease Renewal Bonus - $250 Credit",
    description: "Early Renewal Incentive | Luxury & Premium Properties",
    status: "active",
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 1847,
    ctr: "42%",
    daysRemaining: 45,
    properties: 28,
  },
  {
    id: "5",
    title: "Local Dining & Entertainment - $50 Monthly",
    description: "Neighborhood Partnership Program | 15+ Restaurant Partners",
    status: "active",
    redemptionMethod: "Organic Marketplace",
    redemptionCount: 5234,
    ctr: "38%",
    daysRemaining: 60,
    properties: 92,
  },
  {
    id: "6",
    title: "Resident Referral Program - $500 Each",
    description: "Bring a Friend | Bonus for Both Referrer & New Tenant",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 1456,
    ctr: "52%",
    daysRemaining: 90,
    properties: 185,
  },
  {
    id: "7",
    title: "Fitness & Wellness Pass - Free 3 Months",
    description: "Gym Partnership | Premium Properties Exclusive",
    status: "active",
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 2103,
    ctr: "29%",
    daysRemaining: 30,
    properties: 34,
  },
  {
    id: "8",
    title: "Pet-Friendly Perks - $75 Pet Supply Credit",
    description: "New Pet Owner Welcome | Partnered Pet Stores & Services",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 987,
    ctr: "45%",
    daysRemaining: 25,
    properties: 56,
  },
];

const quickStats = [
  { label: "Active Offers", value: "24", change: "+8", trend: "up" },
  { label: "Total Properties", value: "185", change: "+12", trend: "up" },
  { label: "Tenant Redemptions", value: "12.8K", change: "+23%", trend: "up" },
  { label: "Avg. CTR", value: "28.2%", change: "+4.1%", trend: "up" },
];

function OfferManagerContent() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{ background: "#EFF6FF", color: "#0066CC" }}
            >
              <GiftIcon className="h-7 w-7" />
            </div>
            Offer Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Tenant Engagement & Merchant Partnership Platform
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="p-6 border border-gray-200 shadow-sm bg-white">
        <div className="grid grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {stat.label}
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div
                  className="flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full"
                  style={{ color: "#059669", backgroundColor: "#D1FAE5" }}
                >
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Analytics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Performance Trend */}
        <Card className="p-6 border border-gray-200 shadow-sm col-span-2 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Redemption Performance
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                6-week trend across all properties
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#0066CC" }}
                />
                <span className="text-gray-700 font-medium">Redemptions</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#10B981" }}
                />
                <span className="text-gray-700 font-medium">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
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
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="redemptions"
                  stroke="#0066CC"
                  strokeWidth={3}
                  dot={{ fill: "#0066CC", r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Offers */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6">
            <FireIcon className="h-6 w-6" style={{ color: "#F97316" }} />
            <h3 className="text-xl font-bold text-gray-900">
              Top Performing Offers
            </h3>
          </div>
          <div className="space-y-4">
            {yardiOffers.slice(0, 3).map((offer, index) => (
              <div
                key={offer.id}
                className="p-4 rounded-lg border-2"
                style={{
                  background: "linear-gradient(to right, #EFF6FF, #DBEAFE)",
                  borderColor: "#93C5FD",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold flex-shrink-0 shadow-md"
                    style={{ background: "#0066CC", color: "#FFFFFF" }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {offer.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {offer.redemptionCount.toLocaleString()} redemptions
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 h-6 font-semibold"
                      style={{
                        backgroundColor: "#DCFCE7",
                        color: "#065F46",
                        borderColor: "#86EFAC",
                      }}
                    >
                      {offer.ctr} CTR
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-2 gap-6">
        {/* Property Performance */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Performance by Property Portfolio
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="property"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="redemptions"
                  fill="#0066CC"
                  radius={[8, 8, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Offer Type Distribution */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Offer Type Distribution
          </h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {offerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {offerTypeData.map((type, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {type.name} ({type.value}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key Features Callout */}
      <Card
        className="p-6 border border-gray-200 shadow-sm"
        style={{
          background: "linear-gradient(to right, #EFF6FF, #DBEAFE)",
        }}
      >
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#0066CC" }}
            >
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">AI-Powered</h4>
            <p className="text-sm text-gray-600">Smart offer recommendations</p>
          </div>
          <div className="text-center">
            <div
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#0066CC" }}
            >
              <GiftIcon className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Multi-Channel</h4>
            <p className="text-sm text-gray-600">Hub, marketplace, campaigns</p>
          </div>
          <div className="text-center">
            <div
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#0066CC" }}
            >
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">
              Real-Time Analytics
            </h4>
            <p className="text-sm text-gray-600">Live performance tracking</p>
          </div>
          <div className="text-center">
            <div
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#0066CC" }}
            >
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Easy Management</h4>
            <p className="text-sm text-gray-600">Streamlined offer creation</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function YardiSlide1() {
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Yardi Offer Manager</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AppLayout customBreadcrumb={breadcrumb}>
        <OfferManagerContent />
      </AppLayout>
    </Suspense>
  );
}
