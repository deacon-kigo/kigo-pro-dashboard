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
  const [selectedMerchantOfMonth, setSelectedMerchantOfMonth] = useState("All");

  // Sample scorecard metrics data
  const scorecardMetrics = {
    activeMerchants: 2863,
    activeMerchantsChange: 5.2,
    activeLocations: 12945,
    activeLocationsChange: 3.7,
    activeOffers: 342,
    activeOffersChange: 8.9,
    totalRedemptions12m: 1287652,
    totalRedemptions12mChange: 12.3,
    redemptionsLast30d: 127549,
    redemptionsLast30dWoWChange: 4.6,
    redemptionsLast30dMoMChange: 7.8,
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

    // Format large numbers with commas
    const formattedValue = value.toLocaleString();

    // Background colors based on metric type
    const getBgColor = () => {
      switch (title) {
        case "Active Merchants":
          return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
        case "Active Locations":
          return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200";
        case "Active Offers":
          return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
        case "Redemptions (12m)":
          return "bg-gradient-to-br from-green-50 to-green-100 border-green-200";
        case "Redemptions (30d)":
          return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200";
        default:
          return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200";
      }
    };

    // Icon colors based on metric type
    const getIconColor = () => {
      switch (title) {
        case "Active Merchants":
          return "text-blue-600 bg-blue-100";
        case "Active Locations":
          return "text-purple-600 bg-purple-100";
        case "Active Offers":
          return "text-amber-600 bg-amber-100";
        case "Redemptions (12m)":
          return "text-green-600 bg-green-100";
        case "Redemptions (30d)":
          return "text-emerald-600 bg-emerald-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    return (
      <div className={`rounded-lg border p-4 h-full ${getBgColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-700">
            <div className={`p-2 rounded-full ${getIconColor()}`}>{icon}</div>
            <span className="ml-2 text-sm font-medium">{title}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{formattedValue}</div>
            <div
              className={`flex items-center text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isPositive ? (
                <ChevronUpIcon className="h-4 w-4 bg-green-100 rounded-full p-0.5" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 bg-red-100 rounded-full p-0.5" />
              )}
              <span className="ml-1">{Math.abs(change)}%</span>
            </div>
          </div>

          {secondaryChange !== null && (
            <div className="text-xs text-gray-500">
              <div
                className={`flex items-center justify-end ${secondaryChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {secondaryChange >= 0 ? (
                  <ChevronUpIcon className="h-3 w-3 bg-green-100 rounded-full p-0.5" />
                ) : (
                  <ChevronDownIcon className="h-3 w-3 bg-red-100 rounded-full p-0.5" />
                )}
                <span className="ml-1">{Math.abs(secondaryChange)}%</span>
              </div>
              <div className="mt-1">{secondaryChangeLabel}</div>
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
    return (
      <div className="flex flex-col h-full rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-4 flex-1">
          <div
            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor} mb-3`}
          >
            {icon}
          </div>
          <h3 className="text-base font-medium text-center text-gray-900">
            {title}
          </h3>
          <p className="mt-2 text-sm text-center text-gray-500">
            {description}
          </p>
        </div>
        <div className={`${bgColor} px-4 py-3 border-t border-gray-200`}>
          <Button
            variant="link"
            className={`w-full text-sm font-medium ${textColor}`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Personalized greeting header */}
      <GreetingHeader />

      {/* Page title and actions */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Merchant Reporting Portal
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowPathIcon className="h-4 w-4 mr-1.5" />
            Refresh Data
          </Button>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left side: Filters and Reports */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Filter section */}
          <Card className="p-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex items-center space-x-2">
                  <DatePicker
                    date={dateRange.startDate}
                    onSelect={(date) =>
                      date && setDateRange({ ...dateRange, startDate: date })
                    }
                  />
                  <ArrowsRightLeftIcon className="h-4 w-4 text-gray-400" />
                  <DatePicker
                    date={dateRange.endDate}
                    onSelect={(date) =>
                      date && setDateRange({ ...dateRange, endDate: date })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant of the Month
                </label>
                <Select
                  value={selectedMerchantOfMonth}
                  onValueChange={(value) => setSelectedMerchantOfMonth(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Merchant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Walmart">Walmart</SelectItem>
                    <SelectItem value="Kroger">Kroger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Report types section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <ReportCard
              title="Overview Dashboard"
              icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
              description="Get a comprehensive view of your campaign performance metrics"
              bgColor="bg-blue-50"
              iconBgColor="bg-blue-100"
              textColor="text-blue-600"
              buttonText="View Dashboard"
            />

            <ReportCard
              title="Redemption Report"
              icon={<ReceiptRefundIcon className="h-5 w-5 text-green-600" />}
              description="Track and analyze coupon redemptions across all merchants"
              bgColor="bg-green-50"
              iconBgColor="bg-green-100"
              textColor="text-green-600"
            />

            <ReportCard
              title="Advertiser Reporting"
              icon={<TagIcon className="h-5 w-5 text-purple-600" />}
              description="Review detailed performance metrics for all advertising campaigns"
              bgColor="bg-purple-50"
              iconBgColor="bg-purple-100"
              textColor="text-purple-600"
            />
          </div>
        </div>

        {/* Right side: Merchant of the Month */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="text-base font-semibold px-4 pt-4 pb-2">
              Merchant of the Month
            </div>
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Target</h3>
              <p className="text-sm text-gray-500 mt-1">April 2024</p>
              <div className="mt-3 text-center bg-green-50 p-2 rounded-lg border border-green-100">
                <p className="text-sm text-gray-600">
                  Highest redemption rate increase:{" "}
                  <span className="font-semibold text-green-600">+22%</span>
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Performance Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
