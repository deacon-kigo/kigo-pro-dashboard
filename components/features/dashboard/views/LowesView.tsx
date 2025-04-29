"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";
import Card from "@/components/atoms/Card/Card";
import { useDemoState } from "@/lib/redux/hooks";
import StandardDashboard from "@/components/templates/StandardDashboard";
import { PageHeader } from "@/components/molecules/PageHeader";
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
  ChartBarIcon,
  ArrowLongUpIcon,
  ArrowDownIcon,
  ChartPieIcon,
  ArrowPathIcon,
  ShoppingCartIcon,
  RocketLaunchIcon,
  CheckIcon,
  PlusIcon,
  ClockIcon,
  SparklesIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

// Custom CSS for banner pattern
const headerStyles = `
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-size: 120px 120px;
  }
`;

// Sample offer templates data
const offerTemplates = [
  {
    id: "template-1",
    name: "Percentage Discount",
    description: "Offer a percentage off the purchase price",
    parameters: ["discountPercent", "minimumPurchase", "maxDiscount"],
    icon: "🏷️",
  },
  {
    id: "template-2",
    name: "Buy One Get One",
    description: "Buy one item, get another free or at a discount",
    parameters: ["itemCategory", "discountPercent", "limit"],
    icon: "🎁",
  },
  {
    id: "template-3",
    name: "Dollar Amount Off",
    description: "Offer a fixed dollar amount off the purchase price",
    parameters: ["discountAmount", "minimumPurchase"],
    icon: "💵",
  },
  {
    id: "template-4",
    name: "Free Shipping",
    description: "Offer free shipping on qualifying purchases",
    parameters: ["minimumPurchase", "restrictions"],
    icon: "🚚",
  },
  {
    id: "template-5",
    name: "Tiered Discount",
    description: "Offer increasing discounts based on purchase amount",
    parameters: ["tierLevels", "discountPercents"],
    icon: "📊",
  },
];

// Sample campaigns data
const defaultCampaigns = [
  {
    id: "campaign-1",
    name: "Spring Home Improvement Sale",
    status: "Active",
    type: "Percentage Discount",
    audience: "Homeowners",
    reach: 50000,
    sent: 48500,
    opened: 28000,
    clicked: 12500,
    redeemed: 3800,
    startDate: "2023-04-01T00:00:00",
    endDate: "2023-04-30T23:59:59",
    budget: 75000,
    spent: 45000,
  },
  {
    id: "campaign-2",
    name: "DIY Workshop Promotion",
    status: "Scheduled",
    type: "Free Item",
    audience: "Workshop Attendees",
    reach: 15000,
    sent: 0,
    opened: 0,
    clicked: 0,
    redeemed: 0,
    startDate: "2023-05-15T00:00:00",
    endDate: "2023-06-15T23:59:59",
    budget: 25000,
    spent: 0,
  },
  {
    id: "campaign-3",
    name: "Pro Contractor Rewards",
    status: "Active",
    type: "Tiered Discount",
    audience: "Pro Contractors",
    reach: 25000,
    sent: 24800,
    opened: 19000,
    clicked: 9500,
    redeemed: 4200,
    startDate: "2023-03-15T00:00:00",
    endDate: "2023-05-15T23:59:59",
    budget: 100000,
    spent: 62000,
  },
  {
    id: "campaign-4",
    name: "Garden Center Kickoff",
    status: "Completed",
    type: "Dollar Amount Off",
    audience: "Garden Enthusiasts",
    reach: 35000,
    sent: 34500,
    opened: 22000,
    clicked: 15000,
    redeemed: 7200,
    startDate: "2023-02-01T00:00:00",
    endDate: "2023-03-15T23:59:59",
    budget: 50000,
    spent: 50000,
  },
  {
    id: "campaign-5",
    name: "New Homeowner Welcome",
    status: "Draft",
    type: "Bundle Offer",
    audience: "New Homeowners",
    reach: 10000,
    sent: 0,
    opened: 0,
    clicked: 0,
    redeemed: 0,
    startDate: "2023-06-01T00:00:00",
    endDate: "2023-07-31T23:59:59",
    budget: 40000,
    spent: 0,
  },
];

// Sample analytics data
const defaultAnalyticsData = {
  totalAudience: 135000,
  totalEngagement: {
    sent: 107800,
    opened: 69000,
    clicked: 37000,
    redeemed: 15200,
  },
  channelPerformance: {
    email: { sent: 65000, opened: 39000, clicked: 20000, redeemed: 8200 },
    sms: { sent: 30000, opened: 22000, clicked: 12000, redeemed: 5500 },
    app: { sent: 12800, opened: 8000, clicked: 5000, redeemed: 1500 },
  },
  offerPerformance: [
    { name: "Percentage Discount", redemptions: 6500, value: 187500 },
    { name: "Dollar Amount Off", redemptions: 5200, value: 124800 },
    { name: "Free Item", redemptions: 2100, value: 42000 },
    { name: "Buy One Get One", redemptions: 1400, value: 84000 },
  ],
};

// Lowes brand colors and styling
const lowesStyles = {
  primary: "#012069", // Lowes blue
  secondary: "#4c9e32", // Lowes green
  cardShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  gradient: {
    blue: "linear-gradient(135deg, #012069 0%, #1e3a7b 100%)",
    green: "linear-gradient(135deg, #4c9e32 0%, #3c8223 100%)",
    diagonal: "linear-gradient(135deg, #012069 0%, #4c9e32 100%)",
  },
};

// Revenue data for chart
const revenueData = [
  { month: "Jan", revenue: 35000, expenses: 18000, profit: 17000 },
  { month: "Feb", revenue: 42000, expenses: 22000, profit: 20000 },
  { month: "Mar", revenue: 48000, expenses: 24000, profit: 24000 },
  { month: "Apr", revenue: 55000, expenses: 26000, profit: 29000 },
  { month: "May", revenue: 62000, expenses: 29000, profit: 33000 },
  { month: "Jun", revenue: 70000, expenses: 32000, profit: 38000 },
  { month: "Jul", revenue: 72000, expenses: 33000, profit: 39000 },
  { month: "Aug", revenue: 68000, expenses: 31000, profit: 37000 },
  { month: "Sep", revenue: 74000, expenses: 34000, profit: 40000 },
  { month: "Oct", revenue: 82000, expenses: 38000, profit: 44000 },
  { month: "Nov", revenue: 88000, expenses: 41000, profit: 47000 },
  { month: "Dec", revenue: 96000, expenses: 44000, profit: 52000 },
];

// Campaign Performance data (for Spring Home Improvement campaign)
const campaignPerformanceData = {
  impressions: 425000,
  clicks: 37500,
  appInstalls: 15200,
  completedOrders: 9700,
  costPerInstall: 2.85,
  costPerOrder: 5.45,
  roas: 4.3,
  dailyData: [
    {
      day: "04/01",
      impressions: 20500,
      clicks: 1800,
      installs: 780,
      orders: 490,
    },
    {
      day: "04/02",
      impressions: 22000,
      clicks: 1950,
      installs: 840,
      orders: 530,
    },
    {
      day: "04/03",
      impressions: 24500,
      clicks: 2100,
      installs: 910,
      orders: 580,
    },
    {
      day: "04/04",
      impressions: 26800,
      clicks: 2350,
      installs: 1020,
      orders: 650,
    },
    {
      day: "04/05",
      impressions: 29300,
      clicks: 2580,
      installs: 1110,
      orders: 710,
    },
    {
      day: "04/06",
      impressions: 31000,
      clicks: 2750,
      installs: 1180,
      orders: 750,
    },
    {
      day: "04/07",
      impressions: 33200,
      clicks: 2950,
      installs: 1280,
      orders: 810,
    },
    {
      day: "04/08",
      impressions: 35500,
      clicks: 3120,
      installs: 1340,
      orders: 850,
    },
    {
      day: "04/09",
      impressions: 37800,
      clicks: 3350,
      installs: 1420,
      orders: 900,
    },
    {
      day: "04/10",
      impressions: 40100,
      clicks: 3540,
      installs: 1500,
      orders: 950,
    },
    {
      day: "04/11",
      impressions: 42300,
      clicks: 3720,
      installs: 1580,
      orders: 1000,
    },
    {
      day: "04/12",
      impressions: 44500,
      clicks: 3900,
      installs: 1650,
      orders: 1050,
    },
    {
      day: "04/13",
      impressions: 46700,
      clicks: 4080,
      installs: 1720,
      orders: 1090,
    },
    {
      day: "04/14",
      impressions: 48900,
      clicks: 4250,
      installs: 1790,
      orders: 1140,
    },
  ],
  regionPerformance: {
    northeast: {
      impressions: 127500,
      clicks: 11250,
      installs: 4560,
      orders: 2910,
      conversionRate: 25.8,
    },
    southeast: {
      impressions: 148750,
      clicks: 15000,
      installs: 6080,
      orders: 3880,
      conversionRate: 25.9,
    },
    midwest: {
      impressions: 85000,
      clicks: 6750,
      installs: 2736,
      orders: 1455,
      conversionRate: 21.6,
    },
    west: {
      impressions: 63750,
      clicks: 4500,
      installs: 1824,
      orders: 1455,
      conversionRate: 32.3,
    },
  },
  timePerformance: [
    { time: "8-10am", orders: 680, avgBasket: 125 },
    { time: "10am-12pm", orders: 845, avgBasket: 145 },
    { time: "12-2pm", orders: 1240, avgBasket: 180 },
    { time: "2-4pm", orders: 1580, avgBasket: 195 },
    { time: "4-6pm", orders: 1970, avgBasket: 210 },
    { time: "6-8pm", orders: 2250, avgBasket: 225 },
    { time: "8-10pm", orders: 1135, avgBasket: 160 },
  ],
  optimizationRecommendations: [
    {
      id: "rec-001",
      title: "Regional Performance Optimization",
      description:
        "Western regions outperforming other regions by 24% in conversion rate.",
      recommendation:
        "Shift budget allocation to increase western region focus by 15%.",
      impact: "High",
      savings: 18500,
      selected: false,
    },
    {
      id: "rec-002",
      title: "Evening Campaign Focus",
      description:
        "Orders between 4-8pm show 35% higher conversion rates and larger basket sizes.",
      recommendation:
        "Increase budget allocation during evening timeframes by 20%.",
      impact: "Medium",
      savings: 12700,
      selected: false,
    },
    {
      id: "rec-003",
      title: "Pro Contractor Targeting",
      description:
        "Pro contractor segment shows 42% higher average order value.",
      recommendation:
        "Create dedicated Pro contractor messaging and targeting.",
      impact: "High",
      savings: 22500,
      selected: false,
    },
    {
      id: "rec-004",
      title: "DIY Project Bundle Promotion",
      description:
        "Adding 'Complete Project Kits' messaging increased click-through rate by 28% in test markets.",
      recommendation: "Update creative to focus on complete project solutions.",
      impact: "Medium",
      savings: 14200,
      selected: false,
    },
    {
      id: "rec-005",
      title: "Store Pickup Promotion",
      description:
        "Customers choosing store pickup have 15% larger basket sizes than delivery customers.",
      recommendation:
        "Emphasize free store pickup option in campaign messaging.",
      impact: "Medium",
      savings: 9800,
      selected: false,
    },
  ],
};

// Stats data with change percentages
const statsData = {
  activeCampaigns: {
    value: defaultCampaigns.filter((c) => c.status === "Active").length,
    change: 12.5,
    increased: true,
  },
  totalAudience: {
    value: defaultAnalyticsData.totalAudience,
    change: 8.7,
    increased: true,
  },
  totalRedemptions: {
    value: defaultAnalyticsData.totalEngagement.redeemed,
    change: 15.3,
    increased: true,
  },
  campaignROI: {
    value: 248,
    change: 32.1,
    increased: true,
  },
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

// Component props interface
interface LowesViewProps {
  newOfferAdded?: boolean;
  newCampaignAdded?: boolean;
  campaigns?: typeof defaultCampaigns;
  analyticsData?: typeof defaultAnalyticsData;
  statsData?: typeof statsData;
  onCreateCampaign?: () => void;
  onCreateOffer?: () => void;
  onViewCampaign?: (campaignId: string) => void;
  showAnalytics?: boolean;
  showCampaignPerformance?: boolean;
}

export default function LowesView({
  newOfferAdded = false,
  newCampaignAdded = false,
  campaigns = defaultCampaigns,
  analyticsData = defaultAnalyticsData,
  statsData: propStatsData = statsData,
  onCreateCampaign = () => console.log("Create campaign clicked"),
  onCreateOffer = () => console.log("Create offer clicked"),
  onViewCampaign = (id) => console.log(`View campaign ${id} clicked`),
  showAnalytics = false,
  showCampaignPerformance = false,
}: LowesViewProps) {
  const { userProfile } = useDemoState();
  const [currentDate, setCurrentDate] = useState("");
  const router = useRouter();

  // Navigate to offer creation page
  const handleCreateOffer = () => {
    router.push("/dashboard/offers/create");
  };

  // Set current date on component mount
  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Header content for the dashboard
  const headerContent = (
    <>
      <style>{headerStyles}</style>
      <PageHeader
        title={`${getGreeting()}, ${userProfile.firstName}!`}
        description={`${currentDate} • Home Improvement Offer Management Platform`}
        variant="default"
        logo={
          <div className="h-16 w-28 relative p-2 rounded shadow-sm">
            <img
              src="/logos/lowes-logo-white.png"
              alt="Lowes Logo"
              className="w-full h-full object-contain"
            />
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button
              onClick={handleCreateOffer}
              variant="outline"
              size="sm"
              icon={<TagIcon className="h-4 w-4" />}
            >
              Create Offer
            </Button>
            <Button
              onClick={onCreateCampaign}
              variant="primary"
              size="sm"
              icon={<RocketLaunchIcon className="h-4 w-4" />}
            >
              Create Campaign
            </Button>
          </div>
        }
      />

      {newCampaignAdded && (
        <div className="mt-4 bg-white bg-opacity-90 border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                Campaign Created
              </h3>
              <p className="text-sm text-gray-600">
                Your new campaign has been successfully created! You can view it
                below.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Stats section for the dashboard
  const statsSection = (
    <>
      <Card className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg mr-4 text-white"
              style={{ backgroundColor: "#e1eaf4", color: lowesStyles.primary }}
            >
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {propStatsData.activeCampaigns.value}
                </p>
                <div className="flex items-center ml-2">
                  {propStatsData.activeCampaigns.increased ? (
                    <ArrowLongUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs ml-1 ${propStatsData.activeCampaigns.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {propStatsData.activeCampaigns.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg mr-4 text-white"
              style={{
                backgroundColor: "#e8f4e1",
                color: lowesStyles.secondary,
              }}
            >
              <TagIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Audience</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {formatNumber(propStatsData.totalAudience.value)}
                </p>
                <div className="flex items-center ml-2">
                  {propStatsData.totalAudience.increased ? (
                    <ArrowLongUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs ml-1 ${propStatsData.totalAudience.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {propStatsData.totalAudience.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg mr-4 text-white"
              style={{ backgroundColor: "#e1eaf4", color: lowesStyles.primary }}
            >
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Redemptions</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {formatNumber(propStatsData.totalRedemptions.value)}
                </p>
                <div className="flex items-center ml-2">
                  {propStatsData.totalRedemptions.increased ? (
                    <ArrowLongUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs ml-1 ${propStatsData.totalRedemptions.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {propStatsData.totalRedemptions.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg mr-4 text-white"
              style={{
                backgroundColor: "#e8f4e1",
                color: lowesStyles.secondary,
              }}
            >
              <ChartPieIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Campaign ROI</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {propStatsData.campaignROI.value}%
                </p>
                <div className="flex items-center ml-2">
                  {propStatsData.campaignROI.increased ? (
                    <ArrowLongUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs ml-1 ${propStatsData.campaignROI.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {propStatsData.campaignROI.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );

  // Main content - campaign table and analytics
  const mainContent = (
    <div className="space-y-6">
      {/* Active Campaigns Section */}
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="p-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-3">
                <RocketLaunchIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Active Campaigns
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your current promotional campaigns
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => router.push("/dashboard/campaigns/manage")}
                variant="outline"
                size="sm"
                icon={<ChartBarIcon className="h-4 w-4" />}
              >
                Manage Campaigns
              </Button>
              <Button
                onClick={onCreateCampaign}
                variant="primary"
                size="sm"
                icon={<PlusIcon className="h-4 w-4" />}
              >
                New Campaign
              </Button>
            </div>
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
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Audience
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timeline
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.audience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.startDate)} -{" "}
                    {formatDate(campaign.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>
                        {formatCurrency(campaign.spent)} /{" "}
                        {formatCurrency(campaign.budget)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Button
                      onClick={() => onViewCampaign(campaign.id)}
                      variant="outline"
                      size="xs"
                      icon={<ArrowRightIcon className="h-4 w-4" />}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analytics Overview Section */}
      {showAnalytics && (
        <>
          {/* AI Prompt Assistant */}
          <Card className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-3">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  AI Insights Assistant
                </h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <CommandLineIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ask about your campaign performance..."
                        className="w-full border-0 bg-white px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800">
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-1">
                    Suggested Prompts:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button className="text-left text-sm bg-white p-2 rounded border border-blue-200 hover:bg-blue-50">
                      "Which channel has the highest conversion rate?"
                    </button>
                    <button className="text-left text-sm bg-white p-2 rounded border border-blue-200 hover:bg-blue-50">
                      "Compare this month's ROI to last month"
                    </button>
                    <button className="text-left text-sm bg-white p-2 rounded border border-blue-200 hover:bg-blue-50">
                      "Show me redemption trends by offer type"
                    </button>
                    <button className="text-left text-sm bg-white p-2 rounded border border-blue-200 hover:bg-blue-50">
                      "Which audience segment has highest engagement?"
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-100 bg-white">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-1 bg-purple-100 rounded-full mt-0.5 mr-2">
                      <SparklesIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 font-medium">
                        Recent insight:
                      </p>
                      <p className="text-sm text-gray-600">
                        Your Spring Home Improvement campaign is generating
                        32.1% higher ROI compared to similar campaigns from last
                        year. Consider allocating more budget to this type of
                        promotion.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard Overview */}
          <Card className="bg-white rounded-lg shadow-md mt-6">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                  <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Analytics Overview
                </h2>
              </div>

              {/* Key Metrics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Audience</p>
                      <p className="text-xl font-bold">
                        {formatNumber(analyticsData.totalAudience)}
                      </p>
                      <div className="flex items-center mt-1">
                        <ArrowLongUpIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 ml-1">
                          8.7% vs last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-1.5 bg-green-100 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Redemptions</p>
                      <p className="text-xl font-bold">
                        {formatNumber(analyticsData.totalEngagement.redeemed)}
                      </p>
                      <div className="flex items-center mt-1">
                        <ArrowLongUpIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 ml-1">
                          15.3% vs last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-1.5 bg-yellow-100 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg. Click Rate</p>
                      <p className="text-xl font-bold">
                        {(
                          (analyticsData.totalEngagement.clicked /
                            analyticsData.totalEngagement.sent) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                      <div className="flex items-center mt-1">
                        <ArrowLongUpIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 ml-1">
                          5.2% vs last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-600"
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
                    <div>
                      <p className="text-xs text-gray-500">Campaign ROI</p>
                      <p className="text-xl font-bold">248%</p>
                      <div className="flex items-center mt-1">
                        <ArrowLongUpIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 ml-1">
                          32.1% vs last month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Monthly Revenue
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#4a85c9"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4a85c9"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#4a85c9"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Offer Performance Chart */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Offer Performance
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.offerPerformance}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="redemptions" fill="#6cb07b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Engagement Funnel and Channel Breakdown */}
          <Card className="bg-white rounded-lg shadow-md mt-6">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
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
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Engagement Funnel & Channel Breakdown
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Engagement Funnel */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Engagement Funnel
                  </h3>
                  <div className="relative pt-4">
                    {/* Funnel Steps */}
                    <div className="flex mb-2">
                      <div className="flex-1 relative">
                        <div className="h-16 bg-blue-500 rounded-t-lg flex items-center justify-center text-white font-medium text-sm">
                          Sent
                          <br />
                          {formatNumber(analyticsData.totalEngagement.sent)}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500"></div>
                      </div>
                    </div>
                    <div className="flex my-8">
                      <div className="flex-1 mx-8 relative">
                        <div className="h-16 bg-indigo-500 rounded-t-lg flex items-center justify-center text-white font-medium text-sm">
                          Opened
                          <br />
                          {formatNumber(analyticsData.totalEngagement.opened)}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-indigo-500"></div>
                      </div>
                    </div>
                    <div className="flex my-8">
                      <div className="flex-1 mx-16 relative">
                        <div className="h-16 bg-purple-500 rounded-t-lg flex items-center justify-center text-white font-medium text-sm">
                          Clicked
                          <br />
                          {formatNumber(analyticsData.totalEngagement.clicked)}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-500"></div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-1 mx-24 relative">
                        <div className="h-16 bg-green-500 rounded-t-lg flex items-center justify-center text-white font-medium text-sm">
                          Redeemed
                          <br />
                          {formatNumber(analyticsData.totalEngagement.redeemed)}
                        </div>
                      </div>
                    </div>

                    {/* Conversion Rates */}
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Open Rate</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(
                            (analyticsData.totalEngagement.opened /
                              analyticsData.totalEngagement.sent) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Click Rate</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(
                            (analyticsData.totalEngagement.clicked /
                              analyticsData.totalEngagement.opened) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Redemption Rate</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(
                            (analyticsData.totalEngagement.redeemed /
                              analyticsData.totalEngagement.clicked) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel Performance */}
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Channel Performance
                  </h3>
                  <div className="space-y-4">
                    {/* Email Channel */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600 mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium">Email</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(
                            (analyticsData.channelPerformance.email.redeemed /
                              analyticsData.channelPerformance.email.sent) *
                            100
                          ).toFixed(1)}
                          % Redemption
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{
                            width: `${(analyticsData.channelPerformance.email.redeemed / analyticsData.channelPerformance.email.sent) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          Sent:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.email.sent
                          )}
                        </span>
                        <span>
                          Redeemed:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.email.redeemed
                          )}
                        </span>
                      </div>
                    </div>

                    {/* SMS Channel */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-600 mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <span className="text-sm font-medium">SMS</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(
                            (analyticsData.channelPerformance.sms.redeemed /
                              analyticsData.channelPerformance.sms.sent) *
                            100
                          ).toFixed(1)}
                          % Redemption
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{
                            width: `${(analyticsData.channelPerformance.sms.redeemed / analyticsData.channelPerformance.sms.sent) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          Sent:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.sms.sent
                          )}
                        </span>
                        <span>
                          Redeemed:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.sms.redeemed
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Mobile App Channel */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-600 mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            Mobile App
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(
                            (analyticsData.channelPerformance.app.redeemed /
                              analyticsData.channelPerformance.app.sent) *
                            100
                          ).toFixed(1)}
                          % Redemption
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full"
                          style={{
                            width: `${(analyticsData.channelPerformance.app.redeemed / analyticsData.channelPerformance.app.sent) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          Sent:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.app.sent
                          )}
                        </span>
                        <span>
                          Redeemed:{" "}
                          {formatNumber(
                            analyticsData.channelPerformance.app.redeemed
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Channel Effectiveness
                      </h4>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1.5"></span>
                          <span>Mobile App</span>
                          <span className="ml-1 text-green-600 font-medium">
                            11.7%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1.5"></span>
                          <span>SMS</span>
                          <span className="ml-1 text-green-600 font-medium">
                            18.3%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1.5"></span>
                          <span>Email</span>
                          <span className="ml-1 text-green-600 font-medium">
                            12.6%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Campaign Performance Section */}
      {showCampaignPerformance && (
        <Card className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-3">
                  <ChartPieIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Campaign Performance
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Spring Home Improvement Sale
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowPathIcon className="h-4 w-4" />}
              >
                Refresh Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Impressions</p>
                <p className="text-2xl font-bold">
                  {formatNumber(campaignPerformanceData.impressions)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="text-2xl font-bold">
                  {formatNumber(campaignPerformanceData.completedOrders)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Cost Per Order</p>
                <p className="text-2xl font-bold">
                  ${campaignPerformanceData.costPerOrder}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ROAS</p>
                <p className="text-2xl font-bold">
                  {campaignPerformanceData.roas}x
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-blue-100 p-1.5 rounded-lg mr-2">
                  <ChartBarIcon className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-md font-semibold text-gray-700">
                  Daily Performance
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={campaignPerformanceData.dailyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#4a85c9"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="installs"
                      stroke="#6cb07b"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-yellow-100 p-1.5 rounded-lg mr-2">
                  <LightBulbIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="text-md font-semibold text-gray-700">
                  Optimization Recommendations
                </h3>
              </div>
              <div className="space-y-4">
                {campaignPerformanceData.optimizationRecommendations
                  .slice(0, 3)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-blue-800">
                            {rec.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {rec.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-green-700">
                            Est. Savings: {formatCurrency(rec.savings)}
                          </span>
                          <span
                            className={`text-xs mt-1 px-2 py-0.5 rounded-full 
                          ${
                            rec.impact === "High"
                              ? "bg-red-100 text-red-800"
                              : rec.impact === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                          >
                            {rec.impact} Impact
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="xs">
                          Apply Recommendation
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  // Sidebar content
  const sidebarContent = (
    <>
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-1.5 rounded-lg mr-2">
                <TagIcon className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Offer Templates</h3>
            </div>
            <Button onClick={onCreateOffer} variant="outline" size="xs">
              Create New
            </Button>
          </div>
          <div className="space-y-3">
            {offerTemplates.slice(0, 3).map((template) => (
              <div
                key={template.id}
                className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{template.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium">{template.name}</h4>
                      <p className="text-xs text-gray-500">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            {newOfferAdded && (
              <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-700">
                    New offer template added successfully!
                  </p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full text-center">
              View All Templates
            </Button>
          </div>
        </div>
      </Card>

      {/* Deep Links QR Code */}
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-100 p-1.5 rounded-lg mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
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
            <h3 className="font-semibold text-gray-800">Deep Links</h3>
          </div>

          <div className="flex flex-col">
            {/* QR Code Generator */}
            <div className="mb-4">
              <label
                htmlFor="qr-url"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Generate QR Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="qr-url"
                  placeholder="Enter URL or deep link"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="https://lowes.com/app"
                />
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Create custom QR codes for specific product pages or promotions
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-full h-56 mb-3">
                <Image
                  src="/images/lowes/QRcode.png"
                  alt="Lowes App QR Code"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <p className="text-xs text-gray-600 text-center">
                Scan this code to download the Lowe's app and access exclusive
                offers
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowRightIcon className="h-4 w-4" />}
                >
                  Share Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-red-100 p-1.5 rounded-lg mr-2">
              <ClockIcon className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Upcoming Deadlines</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-red-100 mr-3 mt-0.5">
                <ShoppingCartIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Summer Sale Planning</h4>
                <p className="text-xs text-gray-500">
                  Campaign brief due in 3 days
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-md bg-yellow-100 mr-3 mt-0.5">
                <TagIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Pro Contractor Offers</h4>
                <p className="text-xs text-gray-500">
                  Approval deadline in 5 days
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-md bg-blue-100 mr-3 mt-0.5">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Q2 Performance Review</h4>
                <p className="text-xs text-gray-500">
                  Meeting scheduled in 8 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded-lg shadow-sm">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-100 p-1.5 rounded-lg mr-2">
              <LightBulbIcon className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Campaign Tips</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800">Seasonal Planning</h4>
              <p className="text-xs text-gray-600 mt-1">
                Plan your campaigns 6-8 weeks ahead of seasonal events for
                maximum impact.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <h4 className="font-medium text-green-800">
                Audience Segmentation
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Target DIY customers and Pro contractors separately with
                tailored offers.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800">A/B Testing</h4>
              <p className="text-xs text-gray-600 mt-1">
                Test different offer values to find the optimal discount that
                drives conversion.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );

  return (
    <StandardDashboard
      headerContent={headerContent}
      statsSection={statsSection}
      sidebarContent={sidebarContent}
    >
      {mainContent}
    </StandardDashboard>
  );
}
