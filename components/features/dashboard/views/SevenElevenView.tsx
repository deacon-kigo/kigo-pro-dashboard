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
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-red-50 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
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
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600 font-medium">Active Campaigns</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            {adjustedStatsData.activeCampaigns.value}
          </p>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${adjustedStatsData.activeCampaigns.increased ? "text-green-500" : "text-red-500"} font-medium`}
            >
              {adjustedStatsData.activeCampaigns.increased ? "↑" : "↓"}{" "}
              {adjustedStatsData.activeCampaigns.change}% vs last month
            </span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-green-50 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
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
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600 font-medium">Total Stores</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            {adjustedStatsData.totalStores.value}
          </p>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${adjustedStatsData.totalStores.increased ? "text-green-500" : "text-red-500"} font-medium`}
            >
              {adjustedStatsData.totalStores.increased ? "↑" : "↓"}{" "}
              {adjustedStatsData.totalStores.change}% vs last month
            </span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-blue-50 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
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
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            ${formatNumber(adjustedStatsData.monthlyRevenue.value)}
          </p>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${adjustedStatsData.monthlyRevenue.increased ? "text-green-500" : "text-red-500"} font-medium`}
            >
              {adjustedStatsData.monthlyRevenue.increased ? "↑" : "↓"}{" "}
              {adjustedStatsData.monthlyRevenue.change}% vs last month
            </span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-4 bg-white shadow-sm hover:shadow transition-shadow duration-200">
        <div className="absolute top-3 left-3">
          <div className="p-2 bg-amber-50 rounded-lg shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-600"
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
        </div>
        <div className="mt-12">
          <p className="text-sm text-gray-600 font-medium">Engagement Rate</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            {adjustedStatsData.engagementRate.value}%
          </p>
          <div className="flex items-center mt-2">
            <span
              className={`text-xs ${adjustedStatsData.engagementRate.increased ? "text-green-500" : "text-red-500"} font-medium`}
            >
              {adjustedStatsData.engagementRate.increased ? "↑" : "↓"}{" "}
              {adjustedStatsData.engagementRate.change}% vs last month
            </span>
          </div>
        </div>
      </Card>
    </>
  );

  // 7NOW delivery promotion
  const deliveryPromotionSection = (
    <Card className="mt-6 overflow-hidden shadow-sm">
      <div
        className="p-6 text-white"
        style={{
          background: sevenElevenGradients.diagonal,
          boxShadow: sevenElevenGradients.cardShadow,
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Promote 7NOW Delivery Service
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Drive more delivery orders with targeted promotions for 7NOW.
              Create special offers for first-time customers or boost orders in
              specific regions.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                className="bg-red-600 text-white hover:bg-red-700 shadow-sm"
                onClick={onCreateCampaign}
              >
                Start Campaign
              </Button>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => window.open("https://www.7now.com", "_blank")}
              >
                Visit 7NOW
              </Button>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur p-5 rounded-lg max-w-sm border border-gray-200 shadow-sm">
            <h4 className="font-bold mb-3 text-lg text-gray-800">
              Current 7NOW Promotions
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="bg-red-600 text-white h-6 w-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold shadow-sm">
                  1
                </span>
                <span className="text-gray-700">
                  <strong>BIGBITE:</strong> Free pizza with your 7NOW order{" "}
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs ml-1">
                    TX & FL
                  </span>
                </span>
              </li>
              <li className="flex items-center">
                <span className="bg-red-600 text-white h-6 w-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold shadow-sm">
                  2
                </span>
                <span className="text-gray-700">
                  <strong>GET10OFF:</strong> $10 off $15+ basket{" "}
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs ml-1">
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
            className="bg-red-600 hover:bg-red-700 shadow-sm"
            onClick={onCreateCampaign}
          >
            Create Campaign
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
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
    <div className="space-y-4">
      {deliveryPromotionSection}
      {currentPromotionsSection}
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
