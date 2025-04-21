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
    <div className="mt-0">
      {/* Personalized greeting header */}
      <div
        className="relative overflow-hidden rounded-lg mb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(226, 240, 253, 0.9), rgba(226, 232, 255, 0.85))",
          overflow: "hidden",
          borderRadius: "0.75rem",
          marginBottom: "1rem",
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
        <div className="relative p-5 z-10">
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

    return (
      <Card className="h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-600">
            {icon}
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
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          </div>

          {secondaryChange !== null && (
            <div className="text-xs text-gray-500">
              <div
                className={`flex items-center justify-end ${secondaryChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {secondaryChange >= 0 ? (
                  <ChevronUpIcon className="h-3 w-3" />
                ) : (
                  <ChevronDownIcon className="h-3 w-3" />
                )}
                <span>{Math.abs(secondaryChange)}%</span>
              </div>
              <div className="mt-1">{secondaryChangeLabel}</div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Personalized greeting header */}
      <GreetingHeader />

      {/* Page title */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Merchant Reporting Portal
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowPathIcon className="h-4 w-4" />}
          >
            Refresh Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<CalendarIcon className="h-4 w-4" />}
          >
            Last Updated: April 21, 2024
          </Button>
        </div>
      </div>

      {/* Scorecard metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Filter section */}
      <Card>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-0 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <ChartBarIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Overview Dashboard
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get a comprehensive view of your campaign performance metrics
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <Button
              variant="link"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View Dashboard
            </Button>
          </div>
        </Card>

        <Card className="text-center p-0 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <ReceiptRefundIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Redemption Report
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Track and analyze coupon redemptions across all merchants
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <Button
              variant="link"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View Report
            </Button>
          </div>
        </Card>

        <Card className="text-center p-0 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
              <TagIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Advertiser Reporting
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Review detailed performance metrics for all advertising campaigns
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <Button
              variant="link"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Merchant of the Month section - Removed "In the Works" section */}
      <Card title="Merchant of the Month" className="h-full">
        <div className="flex flex-col items-center justify-center h-full py-4">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Target</h3>
          <p className="text-sm text-gray-500 mt-1">April 2024</p>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Highest redemption rate increase:{" "}
              <span className="font-semibold text-green-600">+22%</span>
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            View Performance Report
          </Button>
        </div>
      </Card>
    </div>
  );
}
