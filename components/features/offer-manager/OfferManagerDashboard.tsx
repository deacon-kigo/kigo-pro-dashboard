"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GiftIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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

interface OfferManagerDashboardProps {
  onCreateOffer: () => void;
}

// Analytics mock data
const performanceTrendData = [
  { date: "Jan 1", redemptions: 1200, revenue: 24000 },
  { date: "Jan 8", redemptions: 1450, revenue: 29000 },
  { date: "Jan 15", redemptions: 1680, revenue: 33600 },
  { date: "Jan 22", redemptions: 1920, revenue: 38400 },
  { date: "Jan 29", redemptions: 2150, revenue: 43000 },
  { date: "Feb 5", redemptions: 2380, revenue: 47600 },
];

const offerTypeData = [
  { name: "Percentage", value: 45, color: "#3B82F6" },
  { name: "Fixed $", value: 30, color: "#10B981" },
  { name: "BOGO", value: 15, color: "#F59E0B" },
  { name: "Cashback", value: 10, color: "#8B5CF6" },
];

const programPerformanceData = [
  { program: "John Deere", redemptions: 3200, ctr: 18.5 },
  { program: "Yardi", redemptions: 2800, ctr: 23.2 },
  { program: "General", redemptions: 1500, ctr: 15.8 },
];

// Mock data based on BRD requirements
const mockOffers = [
  {
    id: "1",
    title: "20% Off Parts & Service",
    description: "Dealer Network Promotion",
    programType: "john_deere",
    programLabel: "John Deere",
    programBadge: "Closed Loop",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 1234,
    ctr: "15%",
    daysRemaining: 47,
    offerType: "Percentage Discount",
    campaignCount: 3,
  },
  {
    id: "2",
    title: "$50 Tenant Welcome Bonus",
    description: "Property Portfolio Campaign",
    programType: "yardi",
    programLabel: "Yardi",
    programBadge: "Open Loop",
    status: "active",
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 892,
    ctr: "23%",
    daysRemaining: 12,
    offerType: "Fixed Discount",
    campaignCount: 1,
  },
  {
    id: "3",
    title: "Lightning Deal: BOGO Tools",
    description: "Q4 Flash Sale",
    programType: "general",
    programLabel: "General",
    programBadge: "Hybrid",
    status: "draft",
    redemptionMethod: "Show & Save",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    offerType: "BOGO",
    campaignCount: 0,
  },
  {
    id: "4",
    title: "Summer Equipment Financing",
    description: "National Campaign",
    programType: "john_deere",
    programLabel: "John Deere",
    programBadge: "Closed Loop",
    status: "scheduled",
    redemptionMethod: "Online Link",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    scheduledDate: "Jun 1, 2026",
    offerType: "Cashback",
    campaignCount: 2,
  },
  {
    id: "5",
    title: "Loyalty Points Boost",
    description: "Member Appreciation Week",
    programType: "yardi",
    programLabel: "Yardi",
    programBadge: "Open Loop",
    status: "active",
    redemptionMethod: "Promo Code",
    redemptionCount: 2145,
    ctr: "31%",
    daysRemaining: 5,
    offerType: "Loyalty Points",
    campaignCount: 4,
  },
];

// Compact stats for top bar
const quickStats = [
  { label: "Total Offers", value: "156", change: "+12", trend: "up" },
  { label: "Active Campaigns", value: "24", change: "+3", trend: "up" },
  { label: "Redemptions (30d)", value: "7.5K", change: "+18%", trend: "up" },
  { label: "Avg. CTR", value: "18.5%", change: "-2.3%", trend: "down" },
  { label: "Revenue (30d)", value: "$145.2K", change: "+24%", trend: "up" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "active":
      return {
        backgroundColor: "#D1FAE5",
        color: "#065F46",
        borderColor: "#A7F3D0",
      };
    case "draft":
      return {
        backgroundColor: "#FEF3C7",
        color: "#92400E",
        borderColor: "#FDE68A",
      };
    case "scheduled":
      return {
        backgroundColor: "#E9D5FF",
        color: "#6B21A8",
        borderColor: "#D8B4FE",
      };
    case "paused":
      return {
        backgroundColor: "#F3F4F6",
        color: "#1F2937",
        borderColor: "#E5E7EB",
      };
    default:
      return {
        backgroundColor: "#F3F4F6",
        color: "#1F2937",
        borderColor: "#E5E7EB",
      };
  }
};

const getProgramStyle = (programType: string) => {
  switch (programType) {
    case "john_deere":
      return {
        backgroundColor: "#ECFDF5",
        color: "#047857",
        borderColor: "#A7F3D0",
      };
    case "yardi":
      return {
        backgroundColor: "#EFF6FF",
        color: "#1D4ED8",
        borderColor: "#BFDBFE",
      };
    default:
      return {
        backgroundColor: "#F9FAFB",
        color: "#374151",
        borderColor: "#E5E7EB",
      };
  }
};

export default function OfferManagerDashboard({
  onCreateOffer,
}: OfferManagerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");

  const filteredOffers = mockOffers.filter((offer) => {
    const matchesSearch = offer.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || offer.status === filterStatus;
    const matchesProgram =
      filterProgram === "all" || offer.programType === filterProgram;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GiftIcon className="h-7 w-7" style={{ color: "#2563EB" }} />
            Offer Manager
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage promotional offers and campaigns across all programs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Deep Analytics
          </Button>
          <Button
            onClick={onCreateOffer}
            className="text-white shadow-sm"
            style={{
              background: "linear-gradient(to right, #2563EB, #3B82F6)",
            }}
          >
            <SparklesIcon
              className="h-4 w-4 mr-2"
              style={{ color: "#FFFFFF" }}
            />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Compact Stats Bar */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-xs font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{ color: stat.trend === "up" ? "#059669" : "#DC2626" }}
                >
                  {stat.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Performance Trend */}
        <Card className="p-6 border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Performance Trend
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Redemptions & revenue over last 30 days
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-gray-600">Redemptions</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="redemptions"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FireIcon className="h-5 w-5" style={{ color: "#F97316" }} />
            <h3 className="text-base font-semibold text-gray-900">
              Top Performers
            </h3>
          </div>
          <div className="space-y-3">
            {mockOffers.slice(0, 3).map((offer, index) => (
              <div
                key={offer.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
                style={{
                  background: "linear-gradient(to right, #EFF6FF, #FAF5FF)",
                  borderColor: "#DBEAFE",
                }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 shadow-md"
                  style={{
                    background:
                      "linear-gradient(to bottom right, #3B82F6, #9333EA)",
                    color: "#FFFFFF",
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {offer.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {offer.redemptionCount.toLocaleString()} redemptions
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0 h-5 bg-white border-gray-300"
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

      {/* Program & Offer Type Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Program Performance */}
        <Card className="p-6 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Performance by Program
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="program"
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="redemptions"
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Offer Type Distribution */}
        <Card className="p-6 border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Offer Type Distribution
          </h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {offerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
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
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-xs text-gray-700">
                  {type.name} ({type.value}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Programs</option>
              <option value="john_deere">John Deere</option>
              <option value="yardi">Yardi</option>
              <option value="general">General</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="paused">Paused</option>
            </select>

            <Button variant="outline" size="sm">
              <FunnelIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Offers Cards/List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">All Offers</h2>
          <p className="text-sm text-gray-600">
            {filteredOffers.length} of {mockOffers.length} offers
          </p>
        </div>
        <div className="space-y-3">
          {filteredOffers.map((offer) => (
            <Card
              key={offer.id}
              className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Offer Info - 5 cols */}
                <div className="lg:col-span-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{
                        background:
                          "linear-gradient(to bottom right, #3B82F6, #9333EA)",
                      }}
                    >
                      <GiftIcon
                        className="h-6 w-6"
                        style={{ color: "#FFFFFF" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {offer.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {offer.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 font-medium border"
                          style={getProgramStyle(offer.programType)}
                        >
                          {offer.programLabel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 border-gray-300 bg-white"
                        >
                          {offer.redemptionMethod}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status - 2 cols */}
                <div className="lg:col-span-2">
                  <Badge
                    variant="outline"
                    className="font-semibold capitalize border"
                    style={getStatusStyle(offer.status)}
                  >
                    {offer.status}
                  </Badge>
                  {offer.status === "active" && offer.daysRemaining && (
                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {offer.daysRemaining} days left
                    </p>
                  )}
                  {offer.status === "scheduled" && offer.scheduledDate && (
                    <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {offer.scheduledDate}
                    </p>
                  )}
                </div>

                {/* Performance - 3 cols */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {offer.redemptionCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">redemptions</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div>
                      <p
                        className="text-lg font-bold"
                        style={{ color: "#2563EB" }}
                      >
                        {offer.ctr}
                      </p>
                      <p className="text-xs text-gray-600">CTR</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div>
                      <Badge
                        variant="outline"
                        className="font-semibold border"
                        style={{
                          backgroundColor: "#EFF6FF",
                          color: "#1D4ED8",
                          borderColor: "#BFDBFE",
                        }}
                      >
                        {offer.campaignCount}{" "}
                        {offer.campaignCount === 1 ? "campaign" : "campaigns"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions - 2 cols */}
                <div className="lg:col-span-2 flex justify-end gap-2">
                  {/* Action buttons temporarily removed to fix infinite loop */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Card className="p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredOffers.length}</span>{" "}
            of <span className="font-medium">{mockOffers.length}</span> offers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              ← Previous
            </Button>
            <Button variant="outline" size="sm">
              Next →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
