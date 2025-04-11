"use client";

import React, { useMemo } from "react";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import Image from "next/image";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/lib/utils/formatting";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  LightBulbIcon,
  TagIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Custom CSS for banner pattern
const headerStyles = `
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 120px 120px;
  }
`;

// Gradient styles for 7-Eleven brand pastel colors
// Using pastel colors from the Tailwind config
const sevenElevenGradients = {
  horizontal:
    "linear-gradient(to right, var(--pastel-red) 0%, var(--pastel-yellow) 50%, var(--pastel-green) 100%)",
  diagonal:
    "linear-gradient(135deg, var(--pastel-red) 0%, var(--pastel-yellow) 50%, var(--pastel-green) 100%)",
  cardShadow: "var(--shadow-sm)",
};

// Default campaigns data with real 7-Eleven promotions
const defaultCampaigns = [
  {
    id: "camp-001",
    name: "Free Pizza with 7NOW",
    status: "Active",
    type: "Mobile App + Delivery",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    budget: 18000,
    spent: 8245,
    regions: "Texas, Florida",
    promoCode: "BIGBITE",
    restrictions: "Limit 1 per customer",
    customers: 42500,
    engagement: 28,
    roi: 3.8,
  },
  {
    id: "camp-002",
    name: "$10 off $15+ for New Customers",
    status: "Active",
    type: "Delivery Only",
    startDate: "2023-03-24",
    endDate: "2023-07-24",
    budget: 22000,
    spent: 9800,
    regions: "Nationwide",
    promoCode: "GET10OFF",
    restrictions: "New customers only",
    customers: 35600,
    engagement: 32,
    roi: 3.2,
  },
  {
    id: "camp-003",
    name: "Summer Slurpee Promotion",
    status: "Draft",
    type: "In-Store + Mobile App",
    startDate: "2023-07-01",
    endDate: "2023-08-31",
    budget: 15000,
    spent: 0,
    regions: "Nationwide",
    promoCode: "SLURPSUMMER",
    restrictions: "One per day per customer",
    customers: 0,
    engagement: 0,
    roi: 0,
  },
  {
    id: "camp-004",
    name: "Weekend Fuel Discount",
    status: "Scheduled",
    type: "Fuel App",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    budget: 7500,
    spent: 0,
    regions: "Select Markets",
    promoCode: "WEEKENDFUEL",
    restrictions: "Weekends only",
    customers: 0,
    engagement: 0,
    roi: 0,
  },
];

// Default stats data
const defaultStatsData = {
  activeCampaigns: {
    value: 12,
    change: 8.3,
    increased: true,
  },
  totalStores: {
    value: 235,
    change: 4.2,
    increased: true,
  },
  monthlyRevenue: {
    value: 875000,
    change: 6.5,
    increased: true,
  },
  engagementRate: {
    value: 22.4,
    change: 7.8,
    increased: true,
  },
};

// Revenue data for chart
const revenueData = [
  { month: "Jan", revenue: 22000, expenses: 15000, profit: 7000 },
  { month: "Feb", revenue: 26000, expenses: 16800, profit: 9200 },
  { month: "Mar", revenue: 25000, expenses: 16500, profit: 8500 },
  { month: "Apr", revenue: 30000, expenses: 18000, profit: 12000 },
  { month: "May", revenue: 28000, expenses: 17500, profit: 10500 },
  { month: "Jun", revenue: 32000, expenses: 19000, profit: 13000 },
  { month: "Jul", revenue: 34000, expenses: 20000, profit: 14000 },
  { month: "Aug", revenue: 38000, expenses: 22000, profit: 16000 },
  { month: "Sep", revenue: 42000, expenses: 24000, profit: 18000 },
  { month: "Oct", revenue: 45000, expenses: 25500, profit: 19500 },
  { month: "Nov", revenue: 48000, expenses: 27000, profit: 21000 },
  { month: "Dec", revenue: 52000, expenses: 29000, profit: 23000 },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}

// Function component interface
interface SevenElevenViewProps {
  newCampaignAdded?: boolean;
  campaigns?: typeof defaultCampaigns;
  statsData?: typeof defaultStatsData;
  onCreateCampaign?: () => void;
  onCreateOffer?: () => void;
  onViewCampaign?: (campaignId: string) => void;
}

export default function SevenElevenView({
  newCampaignAdded = false,
  campaigns = defaultCampaigns,
  statsData = defaultStatsData,
  onCreateCampaign = () => console.log("Create campaign clicked"),
  onCreateOffer = () => console.log("Create offer clicked"),
  onViewCampaign = (id) => console.log(`View campaign ${id} clicked`),
}: SevenElevenViewProps) {
  const demoState = useDemoState();
  const mockUserProfile = demoState.userProfile;
  const userProfile = useMemo(
    () =>
      mockUserProfile
        ? convertMockUserToUserProfile(mockUserProfile)
        : undefined,
    [mockUserProfile]
  );

  // Use userProfile to get name or default to "Sarah"
  const userName = userProfile?.name || "Sarah";

  // Add state for chart type
  const [chartType, setChartType] = React.useState<"area" | "line" | "bar">(
    "area"
  );

  // Adjust active campaigns count based on prop
  const adjustedStatsData = {
    ...statsData,
    activeCampaigns: {
      ...statsData.activeCampaigns,
      value: newCampaignAdded
        ? statsData.activeCampaigns.value + 1
        : statsData.activeCampaigns.value,
    },
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format date string for header (e.g., "Friday, March 14")
  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Create stats section
  const statsSection = (
    <>
      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-start">
          <div className="p-1.5 bg-red-50 rounded-lg shadow-sm mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">
              Active Campaigns
            </p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-bold text-gray-800">
                {adjustedStatsData.activeCampaigns.value}
              </p>
              <span
                className={`text-xs ${adjustedStatsData.activeCampaigns.increased ? "text-green-500" : "text-red-500"} font-medium`}
              >
                {adjustedStatsData.activeCampaigns.increased ? "↑" : "↓"}{" "}
                {adjustedStatsData.activeCampaigns.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-start">
          <div className="p-1.5 bg-indigo-50 rounded-lg shadow-sm mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">Total Stores</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-bold text-gray-800">
                {adjustedStatsData.totalStores.value}
              </p>
              <span
                className={`text-xs ${adjustedStatsData.totalStores.increased ? "text-green-500" : "text-red-500"} font-medium`}
              >
                {adjustedStatsData.totalStores.increased ? "↑" : "↓"}{" "}
                {adjustedStatsData.totalStores.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-start">
          <div className="p-1.5 bg-blue-50 rounded-lg shadow-sm mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">Monthly Revenue</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-bold text-gray-800">
                ${formatNumber(adjustedStatsData.monthlyRevenue.value)}
              </p>
              <span
                className={`text-xs ${adjustedStatsData.monthlyRevenue.increased ? "text-green-500" : "text-red-500"} font-medium`}
              >
                {adjustedStatsData.monthlyRevenue.increased ? "↑" : "↓"}{" "}
                {adjustedStatsData.monthlyRevenue.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="flex items-start">
          <div className="p-1.5 bg-amber-50 rounded-lg shadow-sm mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">Engagement Rate</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl font-bold text-gray-800">
                {adjustedStatsData.engagementRate.value}%
              </p>
              <span
                className={`text-xs ${adjustedStatsData.engagementRate.increased ? "text-green-500" : "text-red-500"} font-medium`}
              >
                {adjustedStatsData.engagementRate.increased ? "↑" : "↓"}{" "}
                {adjustedStatsData.engagementRate.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
          </div>
        </div>
      </Card>
    </>
  );

  // 7NOW delivery promotion
  const deliveryPromotionSection = (
    <Card className="overflow-hidden shadow-sm">
      <div
        className="p-4 text-gray-800"
        style={{
          background: sevenElevenGradients.diagonal,
          boxShadow: sevenElevenGradients.cardShadow,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:pr-8">
            <h3 className="text-lg font-bold mb-1">
              Promote 7NOW Delivery Service
            </h3>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              Drive more delivery orders with targeted promotions for 7NOW.
              Create special offers for first-time customers.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                className="bg-red-600 text-white hover:bg-red-700 shadow-sm text-xs"
                onClick={onCreateCampaign}
              >
                Start Campaign
              </Button>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 text-xs"
                onClick={() => window.open("https://www.7now.com", "_blank")}
              >
                Visit 7NOW
              </Button>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur p-3 rounded-lg max-w-sm border border-gray-200 shadow-sm text-xs">
            <h4 className="font-bold mb-2 text-sm">Current 7NOW Promotions</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-red-600 text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold shadow-sm">
                  1
                </span>
                <span className="text-gray-700">
                  <strong>BIGBITE:</strong> Free pizza with your 7NOW order{" "}
                  <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs ml-1">
                    TX & FL
                  </span>
                </span>
              </li>
              <li className="flex items-center">
                <span className="bg-red-600 text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold shadow-sm">
                  2
                </span>
                <span className="text-gray-700">
                  <strong>GET10OFF:</strong> $10 off $15+ basket{" "}
                  <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-xs ml-1">
                    New Customers
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );

  // AI Assistant component
  const aiAssistantSection = (
    <Card className=" bg-white overflow-hidden p-4 border border-gray-100">
      <div className="flex items-start">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-blue-600"
          >
            <path d="M16.5 7.5h-9v9h9v-9z" />
            <path d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            Hey {userName}, I&apos;m your AI Assistant
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Personalized insights for your campaigns
          </p>

          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                </svg>
                Analyze morning campaign performance
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-sm text-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Run performance report
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );

  // Revenue Analytics Section with Chart
  const revenueAnalyticsSection = (
    <Card className="mt-6 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="font-semibold text-gray-800">Revenue Analytics</h3>
        </div>
        <div className="flex space-x-1 text-xs">
          <button className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
            Daily
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
            Weekly
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 font-medium">
            Monthly
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
            Quarterly
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="space-x-4">
            <button className="text-blue-600 text-sm font-medium">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-1"></span>
              Revenue
            </button>
            <button className="text-green-600 text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
              Expenses
            </button>
            <button className="text-purple-600 text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
              Profit
            </button>
          </div>
          <div className="ml-auto">
            <select className="bg-white border border-gray-200 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>All Campaigns</option>
              <option>Summer Promotion</option>
              <option>Holiday Special</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">Revenue Overview</h3>
          <span className="ml-auto text-green-500 text-sm font-medium">
            ↑ 8.6% vs previous period
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">$42.5k</h2>

        {/* ShadCN-style Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    boxShadow:
                      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    padding: "0.75rem",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `${label} 2023`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: "#22c55e",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: "#a855f7",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
              </AreaChart>
            ) : chartType === "line" ? (
              <LineChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    boxShadow:
                      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    padding: "0.75rem",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `${label} 2023`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3b82f6" }}
                  activeDot={{
                    r: 6,
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#22c55e" }}
                  activeDot={{
                    r: 6,
                    stroke: "#22c55e",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#a855f7" }}
                  activeDot={{
                    r: 6,
                    stroke: "#a855f7",
                    strokeWidth: 2,
                    fill: "white",
                  }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    boxShadow:
                      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    padding: "0.75rem",
                  }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    undefined,
                  ]}
                  labelFormatter={(label) => `${label} 2023`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-4 mt-4 text-xs">
          <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
            1M
          </button>
          <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
            3M
          </button>
          <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
            6M
          </button>
          <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            1Y
          </button>
          <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
            All
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-4 text-xs">
          <button
            className={`px-3 py-1 rounded-md ${chartType === "area" ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            onClick={() => setChartType("area")}
          >
            Area
          </button>
          <button
            className={`px-3 py-1 rounded-md ${chartType === "line" ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
          <button
            className={`px-3 py-1 rounded-md ${chartType === "bar" ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            onClick={() => setChartType("bar")}
          >
            Bar
          </button>
        </div>
      </div>
    </Card>
  );

  // Current promotions section
  const currentPromotionsSection = (
    <Card className="mt-6 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <h3 className="font-semibold text-gray-800">Current Promotions</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-xs shadow-sm"
            onClick={onCreateCampaign}
          >
            Create Campaign
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
            onClick={onCreateOffer}
          >
            Create Offer
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Campaign
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Promo Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Regions
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Period
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Budget
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {campaign.promoCode}
                  </div>
                  <div className="text-xs text-gray-500">
                    {campaign.restrictions}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {campaign.regions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(campaign.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    to {formatDate(campaign.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {campaign.spent > 0
                      ? `${formatCurrency(campaign.spent)} spent`
                      : "Not started"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors"
                    onClick={() => onViewCampaign(campaign.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Main content
  const mainContent = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {deliveryPromotionSection}
        {revenueAnalyticsSection}
        {currentPromotionsSection}
      </div>
      <div className="space-y-6">
        {aiAssistantSection}

        {/* Tasks & Notifications Section */}
        <Card className="bg-white overflow-hidden p-4">
          <h3 className="font-semibold text-gray-800 mb-4">
            Tasks & Notifications
          </h3>

          <div className="space-y-4">
            <div className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      Approve merchant discount request
                    </h4>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      Today
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Acme Corporation has requested a custom discount rate for
                    their upcoming campaign.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg
                    className="w-4 h-4 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      Review campaign performance
                    </h4>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      Today
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    The &quot;Summer Sale Promotion&quot; campaign has reached
                    50% completion. Review performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="border border-slate-200 rounded-lg p-4 flex flex-col hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center mb-2">
                  <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  <h4 className="font-medium">Create New Campaign</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Drive more traffic and sales with a targeted marketing
                  campaign.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    color="blue"
                    className="text-sm w-full"
                    onClick={onCreateCampaign}
                  >
                    Create Campaign{" "}
                    <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 flex flex-col hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center mb-2">
                  <TagIcon className="w-5 h-5 text-green-500 mr-2" />
                  <h4 className="font-medium">Create New Offer</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Boost sales with a special offer for your loyal customers.
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    color="green"
                    className="text-sm w-full"
                    onClick={onCreateOffer}
                  >
                    Create Offer{" "}
                    <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>

              {newCampaignAdded && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    <h4 className="font-medium text-green-700">
                      Campaign Created!
                    </h4>
                  </div>
                  <p className="text-sm text-green-600 mb-3">
                    Your new campaign has been created successfully and is now
                    active.
                  </p>
                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      color="green"
                      className="text-sm w-full"
                      onClick={() => onViewCampaign("new-campaign")}
                    >
                      View Campaign{" "}
                      <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Personal greeting banner
  const greetingBanner = (
    <div
      className="rounded-xl p-6 shadow-md overflow-hidden relative mb-6"
      style={{
        background: sevenElevenGradients.horizontal,
        color: "#333333",
      }}
    >
      {/* Pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23333333' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }}
      ></div>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-start">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1.5 mr-4 shadow-sm">
              <Image
                src="/images/seven-eleven-logo.png"
                alt="7-Eleven"
                width={48}
                height={48}
                className="rounded"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23c00200' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 10.2V14h1.5v-5h-2l-1.5 5h1.5l.2-.8h1.5L7 10.2zM15.5 9h-2v5h1.5v-1.8l1 1.8h2l-1.7-2.5L17.8 9h-1.8l-1 1.8V9z'/%3E%3Ccircle cx='12' cy='12' r='10' stroke-width='1'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1 text-gray-800">
                {getGreeting()}, {userName}!
              </h2>
              <p className="opacity-90 text-sm text-gray-700">
                {getFormattedDate()} • National Account Manager
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Driving national promotions for convenience across the country.
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-4 min-w-[250px]">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                Weekly Progress
              </span>
              <span className="text-sm font-medium text-gray-700">78%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-red-500"
                style={{
                  width: "78%",
                  boxShadow: "0 1px 3px rgba(192, 2, 0, 0.2)",
                }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1.5 shadow-sm"></span>
                <span>Complete: 18</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-1.5 shadow-sm"></span>
                <span>Total: 23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="bg-gray-50 space-y-6">
      {/* Include the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />

      {/* Greeting Banner */}
      {greetingBanner}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsSection}
      </div>

      {/* Main Dashboard Content */}
      {mainContent}
    </div>
  );
}
