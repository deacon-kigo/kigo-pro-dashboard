"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button/Button";
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  TagIcon,
  ReceiptRefundIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ChartPieIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";

// Simplified greeting header component with proper gradient background
const GreetingHeader = () => {
  const demoState = useDemoState();
  const mockUserProfile = demoState.userProfile;
  const userProfile = useMemo(
    () =>
      mockUserProfile
        ? convertMockUserToUserProfile(mockUserProfile)
        : undefined,
    [mockUserProfile]
  );

  const [currentGreeting, setCurrentGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [weatherEmoji, setWeatherEmoji] = useState("☀️"); // Default sunny

  // Calculate greeting based on time of day
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();

      let newGreeting = "";
      if (hour < 12) {
        newGreeting = "Good morning";
        setWeatherEmoji("🌅");
      } else if (hour < 17) {
        newGreeting = "Good afternoon";
        setWeatherEmoji("☀️");
      } else {
        newGreeting = "Good evening";
        setWeatherEmoji("🌙");
      }

      setCurrentGreeting(newGreeting);

      // Format date - simpler format like "Friday, March 14"
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formattedDate = now.toLocaleDateString("en-US", options);
      setCurrentDate(formattedDate);
    };

    updateTimeAndGreeting();
    const timer = setInterval(updateTimeAndGreeting, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-4">
      {/* Personalized greeting header */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          background:
            "linear-gradient(135deg, rgba(226, 240, 253, 0.9), rgba(226, 232, 255, 0.85))",
          overflow: "hidden",
          borderRadius: "0.75rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div className="absolute inset-0 opacity-8">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 120px",
            }}
          />
        </div>
        <div className="relative p-4 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-3">{weatherEmoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">
                  {currentGreeting},{" "}
                  <span className="text-purple-600">
                    {userProfile?.name?.split(" ")[0] || "User"}
                  </span>
                  !
                </h1>
                <p className="text-sm text-blue-500 mt-1">
                  {currentDate} •{" "}
                  <span className="text-purple-600 font-medium">
                    {userProfile?.role || "Campaign Manager"}
                  </span>
                </p>
                <p className="text-sm text-blue-400 mt-1">
                  Don&apos;t watch the clock; do what it does. Keep going.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Types for the metric card props
interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  secondaryChange?: number | null;
  secondaryChangeLabel?: string | null;
}

// Types for the report card props
interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  buttonText?: string;
}

// The main Merchant Portal dashboard component that replaces PowerBI with our custom UI
export default function MerchantPortalView() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date("04/15/2024"),
    endDate: new Date("04/17/2025"),
  });

  const [selectedMerchantId, setSelectedMerchantId] = useState("All");
  const [selectedMerchantName, setSelectedMerchantName] = useState("All");

  // Sample scorecard metrics data
  const scorecardMetrics = {
    activeMerchants: 2863,
    activeMerchantsChange: 5.2,
    activeLocations: 12945,
    activeLocationsChange: -3.7,
    activeOffers: 342,
    activeOffersChange: 8.9,
    totalRedemptions12m: 1287652,
    totalRedemptions12mChange: -2.5,
    redemptionsLast30d: 127549,
    redemptionsLast30dWoWChange: 4.6,
    redemptionsLast30dMoMChange: -1.2,
  };

  // Function to render a metric card with change indicator
  const MetricCard = ({
    title,
    value,
    change,
    icon,
    secondaryChange = null,
    secondaryChangeLabel = null,
  }: MetricCardProps) => {
    const isPositive = change >= 0;
    const isSecondaryPositive =
      secondaryChange !== null ? secondaryChange >= 0 : true;

    // Format large numbers with commas
    const formattedValue = value.toLocaleString();

    // Get a consistent card background
    const getCardStyle = () => {
      return {
        background: "#FFFFFF",
        borderColor: "#E2E8F0",
        position: "relative" as const,
        overflow: "hidden" as const,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
      };
    };

    // Get distinctive background color for each metric type's icon
    const getIconBg = () => {
      switch (title) {
        case "Active Merchants":
          return { background: "#EFF6FF" }; // Light blue
        case "Active Locations":
          return { background: "#F5F3FF" }; // Light purple
        case "Active Offers":
          return { background: "#FFFBEB" }; // Light amber
        case "Redemptions (12m)":
          return { background: "#ECFDF5" }; // Light green
        case "Redemptions (30d)":
          return { background: "#F0FDFA" }; // Light teal
        default:
          return { background: "#F9FAFB" }; // Light gray
      }
    };

    // Get distinctive text color for each metric type's icon
    const getIconColor = () => {
      switch (title) {
        case "Active Merchants":
          return "text-blue-600";
        case "Active Locations":
          return "text-purple-600";
        case "Active Offers":
          return "text-amber-600";
        case "Redemptions (12m)":
          return "text-green-600";
        case "Redemptions (30d)":
          return "text-teal-600";
        default:
          return "text-gray-600";
      }
    };

    // Get accessible colors for percentage indicators
    const getPercentageColor = () => {
      return isPositive ? "text-green-700" : "text-red-700"; // High contrast accessible colors
    };

    const getPercentageBg = () => {
      return isPositive ? "bg-green-100" : "bg-red-100";
    };

    return (
      <div
        className="rounded-lg border p-4 h-full shadow-sm"
        style={getCardStyle()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-700">
            <div
              className={`p-2.5 rounded-full ${getIconColor()}`}
              style={getIconBg()}
            >
              {icon}
            </div>
            <span className="ml-2 text-sm font-medium">{title}</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {formattedValue}
            </div>
            <div className="flex items-center text-sm mt-1">
              <span
                className={`px-1.5 py-0.5 rounded-md ${getPercentageBg()} ${getPercentageColor()} font-medium flex items-center`}
              >
                {isPositive ? (
                  <ChevronUpIcon className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ChevronDownIcon className="h-3.5 w-3.5 mr-0.5" />
                )}
                {Math.abs(change)}%
              </span>
              <span className="ml-1.5 text-gray-500 text-xs">
                vs. last month
              </span>
            </div>
          </div>

          {secondaryChange !== null && (
            <div className="text-xs text-gray-500">
              <div className={`flex items-center justify-end`}>
                <span
                  className={`px-1.5 py-0.5 rounded-md ${isSecondaryPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} font-medium flex items-center`}
                >
                  {isSecondaryPositive ? (
                    <ChevronUpIcon className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ChevronDownIcon className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(secondaryChange)}%
                </span>
              </div>
              <div className="mt-1 text-right">{secondaryChangeLabel}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dashboard report card component
  const ReportCard = ({
    title,
    icon,
    description,
    bgColor,
    iconBgColor,
    textColor,
    buttonText = "View Report",
  }: ReportCardProps) => {
    // Get color based on card type
    const getCardColor = () => {
      switch (title) {
        case "Overview Dashboard":
          return {
            bgColor: "#F9FAFB",
            textColor: "#3B82F6",
            iconBg: "#EFF6FF",
          }; // Blue
        case "Redemption Report":
          return {
            bgColor: "#F9FAFB",
            textColor: "#10B981",
            iconBg: "#ECFDF5",
          }; // Green
        case "Advertiser Reporting":
          return {
            bgColor: "#F9FAFB",
            textColor: "#8B5CF6",
            iconBg: "#F5F3FF",
          }; // Purple
        default:
          return {
            bgColor: "#F9FAFB",
            textColor: "#6B7280",
            iconBg: "#F3F4F6",
          }; // Gray
      }
    };

    const colors = getCardColor();

    return (
      <div
        className="flex flex-col h-full rounded-lg border border-gray-200 overflow-hidden bg-white"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <div className="p-5 flex-1" style={{ background: colors.bgColor }}>
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 mb-4"
            style={{ background: colors.iconBg }}
          >
            <div style={{ color: colors.textColor }}>{icon}</div>
          </div>
          <h3 className="text-base font-semibold text-center text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-center text-gray-600">{description}</p>
        </div>
        <div className="px-4 py-3 border-t border-gray-200">
          <Button
            variant="link"
            className="w-full text-sm font-medium flex items-center justify-center"
            style={{ color: colors.textColor }}
          >
            {buttonText} <span className="ml-1">→</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Personalized greeting header - kept outside iframe */}
      <GreetingHeader />

      {/* Power BI iframe simulator - everything inside this div represents embedded content */}
      <div
        className="mt-4 flex-1 bg-white rounded-lg p-4 overflow-auto"
        style={{
          border: "1px solid #E2E8F0",
          boxSizing: "border-box",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          position: "relative",
        }}
      >
        {/* PowerBI embedded dashboard content starts here */}
        <div className="h-full flex flex-col">
          {/* Page title and actions */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Merchant Reporting Portal
            </h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                Last Updated: April 21, 2024
              </Button>
            </div>
          </div>

          {/* Scorecard metrics section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <MetricCard
              title="Active Merchants"
              value={scorecardMetrics.activeMerchants}
              change={scorecardMetrics.activeMerchantsChange}
              icon={<BuildingStorefrontIcon className="h-5 w-5" />}
            />

            <MetricCard
              title="Active Locations"
              value={scorecardMetrics.activeLocations}
              change={scorecardMetrics.activeLocationsChange}
              icon={<MapPinIcon className="h-5 w-5" />}
            />

            <MetricCard
              title="Active Offers"
              value={scorecardMetrics.activeOffers}
              change={scorecardMetrics.activeOffersChange}
              icon={<TagIcon className="h-5 w-5" />}
            />

            <MetricCard
              title="Redemptions (12m)"
              value={scorecardMetrics.totalRedemptions12m}
              change={scorecardMetrics.totalRedemptions12mChange}
              icon={<ReceiptRefundIcon className="h-5 w-5" />}
            />

            <MetricCard
              title="Redemptions (30d)"
              value={scorecardMetrics.redemptionsLast30d}
              change={scorecardMetrics.redemptionsLast30dWoWChange}
              secondaryChange={scorecardMetrics.redemptionsLast30dMoMChange}
              secondaryChangeLabel="MoM"
              icon={<ReceiptRefundIcon className="h-5 w-5" />}
            />
          </div>

          {/* Main dashboard content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left side: Filters */}
            <div className="lg:col-span-3">
              {/* Filter section */}
              <Card className="p-4 mb-4 bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant ID
                    </label>
                    <Select
                      value={selectedMerchantId}
                      onValueChange={(value) => setSelectedMerchantId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Merchant ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="M1001">M1001</SelectItem>
                        <SelectItem value="M1002">M1002</SelectItem>
                        <SelectItem value="M1003">M1003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant Name
                    </label>
                    <Select
                      value={selectedMerchantName}
                      onValueChange={(value) => setSelectedMerchantName(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Merchant Name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Target">Target</SelectItem>
                        <SelectItem value="Walmart">Walmart</SelectItem>
                        <SelectItem value="Kroger">Kroger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <DatePicker
                        date={dateRange.startDate}
                        onSelect={(date) =>
                          date &&
                          setDateRange({ ...dateRange, startDate: date })
                        }
                      />
                      <ArrowsRightLeftIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <DatePicker
                        date={dateRange.endDate}
                        onSelect={(date) =>
                          date && setDateRange({ ...dateRange, endDate: date })
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Report types section - removed Merchant of the Month */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard
                  title="Overview Dashboard"
                  icon={<ChartBarIcon className="h-6 w-6" />}
                  description="Get a comprehensive view of your campaign performance metrics"
                  bgColor="bg-blue-50"
                  iconBgColor="bg-blue-100"
                  textColor="text-blue-600"
                  buttonText="View Dashboard"
                />

                <ReportCard
                  title="Redemption Report"
                  icon={<ReceiptRefundIcon className="h-6 w-6" />}
                  description="Track and analyze coupon redemptions across all merchants"
                  bgColor="bg-green-50"
                  iconBgColor="bg-green-100"
                  textColor="text-green-600"
                />

                <ReportCard
                  title="Advertiser Reporting"
                  icon={<ChartPieIcon className="h-6 w-6" />}
                  description="Review detailed performance metrics for all advertising campaigns"
                  bgColor="bg-purple-50"
                  iconBgColor="bg-purple-100"
                  textColor="text-purple-600"
                />
              </div>
            </div>
          </div>
          {/* PowerBI embedded dashboard content ends here */}
        </div>
      </div>
    </div>
  );
}
