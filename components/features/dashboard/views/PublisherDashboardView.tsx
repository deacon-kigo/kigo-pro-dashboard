"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import { PageHeader } from "@/components/molecules/PageHeader";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  TagIcon,
  ReceiptRefundIcon,
  CalendarIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
  BanknotesIcon,
  UsersIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";

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

// The main Publisher Dashboard component
export default function PublisherDashboardView() {
  const demoState = useDemoState();
  const mockUserProfile = demoState.userProfile;
  const userProfile = useMemo(
    () =>
      mockUserProfile
        ? convertMockUserToUserProfile(mockUserProfile)
        : undefined,
    [mockUserProfile]
  );

  // Get current date in a nice format
  const currentDate = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  }, []);

  // Sample publisher metrics data
  const publisherMetrics = {
    activeAdvertisers: 143,
    activeAdvertisersChange: 7.5,
    activePrograms: 38,
    activeProgramsChange: 12.4,
    activeOffers: 256,
    activeOffersChange: 9.1,
    totalRedemptions12m: 843256,
    totalRedemptions12mChange: 15.8,
    redemptionsLast30d: 83426,
    redemptionsLast30dWoWChange: 6.7,
    redemptionsLast30dMoMChange: 8.3,
  };

  const [dateRange, setDateRange] = useState({
    startDate: new Date("04/15/2024"),
    endDate: new Date("04/17/2025"),
  });

  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState("All");
  const [selectedProgramType, setSelectedProgramType] = useState("All");

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
        case "Active Advertisers":
          return { background: "#FEF2F2" }; // Light red
        case "Active Programs":
          return { background: "#EFF6FF" }; // Light blue
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
        case "Active Advertisers":
          return "text-red-600";
        case "Active Programs":
          return "text-blue-600";
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
        <div className="mt-1">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {formattedValue}
            </span>
            <div className="ml-2.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPercentageBg()} ${getPercentageColor()}`}
              >
                {isPositive ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
          </div>
          {secondaryChange !== null && (
            <div className="mt-1 text-xs text-gray-500">
              <span
                className={
                  isSecondaryPositive ? "text-green-700" : "text-red-700"
                }
              >
                {isSecondaryPositive ? "+" : ""}
                {secondaryChange.toFixed(1)}%
              </span>{" "}
              {secondaryChangeLabel || "WoW"}
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
        case "Program Performance":
          return {
            bgColor: "#F9FAFB",
            textColor: "#3B82F6",
            iconBg: "#EFF6FF",
          }; // Blue
        case "Revenue Analytics":
          return {
            bgColor: "#F9FAFB",
            textColor: "#10B981",
            iconBg: "#ECFDF5",
          }; // Green
        case "Advertiser Insights":
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
    <div className="space-y-4">
      {/* Custom PageHeader with Bread Financial logo and background image */}
      <PageHeader
        title={`Welcome, ${userProfile?.name?.split(" ")[0] || "User"}!`}
        description={`${currentDate} • Bread Financial • Publisher`}
        logo={
          <div className="w-12 h-12 relative">
            <Image
              src="/logos/bread-financial-logo.png"
              alt="Bread Financial"
              width={48}
              height={48}
              style={{ objectFit: "contain" }}
            />
          </div>
        }
        variant="default"
        gradientColors={{
          from: "rgba(0, 0, 0, 0.8)",
          to: "rgba(0, 0, 0, 0.65)",
        }}
      />

      {/* Custom Dashboard Content */}
      <div className="h-full flex flex-col">
        {/* Dashboard content - replacing PowerBI */}
        <div
          className="mt-4 flex-1 bg-white rounded-lg p-4 overflow-auto relative"
          style={{
            border: "1px solid #E2E8F0",
            boxSizing: "border-box",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            minHeight: "700px",
            backgroundImage:
              "url('/images/bread-financial/hero-bg-desktop.png')",
            backgroundPosition: "right top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          {/* Dashboard content starts here */}
          <div className="h-full flex flex-col">
            {/* Page title and actions */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Publisher Program Analytics
              </h1>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  Last Updated: April 22, 2024
                </Button>
              </div>
            </div>

            {/* Scorecard metrics section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <MetricCard
                title="Active Advertisers"
                value={publisherMetrics.activeAdvertisers}
                change={publisherMetrics.activeAdvertisersChange}
                icon={<BuildingStorefrontIcon className="h-5 w-5" />}
              />

              <MetricCard
                title="Active Programs"
                value={publisherMetrics.activePrograms}
                change={publisherMetrics.activeProgramsChange}
                icon={<PresentationChartLineIcon className="h-5 w-5" />}
              />

              <MetricCard
                title="Active Offers"
                value={publisherMetrics.activeOffers}
                change={publisherMetrics.activeOffersChange}
                icon={<TagIcon className="h-5 w-5" />}
              />

              <MetricCard
                title="Redemptions (12m)"
                value={publisherMetrics.totalRedemptions12m}
                change={publisherMetrics.totalRedemptions12mChange}
                icon={<ReceiptRefundIcon className="h-5 w-5" />}
              />

              <MetricCard
                title="Redemptions (30d)"
                value={publisherMetrics.redemptionsLast30d}
                change={publisherMetrics.redemptionsLast30dWoWChange}
                secondaryChange={publisherMetrics.redemptionsLast30dMoMChange}
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
                        Advertiser
                      </label>
                      <Select
                        value={selectedAdvertiserId}
                        onValueChange={(value) =>
                          setSelectedAdvertiserId(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Advertiser" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Advertisers</SelectItem>
                          <SelectItem value="A1001">Target</SelectItem>
                          <SelectItem value="A1002">Walmart</SelectItem>
                          <SelectItem value="A1003">Kroger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program Type
                      </label>
                      <Select
                        value={selectedProgramType}
                        onValueChange={(value) => setSelectedProgramType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Program Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Programs</SelectItem>
                          <SelectItem value="Coupons">Coupons</SelectItem>
                          <SelectItem value="Rewards">Rewards</SelectItem>
                          <SelectItem value="Cashback">Cashback</SelectItem>
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
                            date &&
                            setDateRange({ ...dateRange, endDate: date })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Report types section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ReportCard
                    title="Program Performance"
                    icon={<ChartBarIcon className="h-6 w-6" />}
                    description="Track campaign performance across all advertiser programs"
                    bgColor="bg-blue-50"
                    iconBgColor="bg-blue-100"
                    textColor="text-blue-600"
                    buttonText="View Dashboard"
                  />

                  <ReportCard
                    title="Revenue Analytics"
                    icon={<BanknotesIcon className="h-6 w-6" />}
                    description="View financial performance and revenue by advertiser"
                    bgColor="bg-green-50"
                    iconBgColor="bg-green-100"
                    textColor="text-green-600"
                  />

                  <ReportCard
                    title="Advertiser Insights"
                    icon={<ChartPieIcon className="h-6 w-6" />}
                    description="Analyze promotion performance by advertiser segments"
                    bgColor="bg-purple-50"
                    iconBgColor="bg-purple-100"
                    textColor="text-purple-600"
                  />
                </div>
              </div>
            </div>
            {/* Dashboard content ends here */}
          </div>
        </div>
      </div>
    </div>
  );
}
