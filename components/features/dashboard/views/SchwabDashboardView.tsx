"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  TicketIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

// Types for the asset card props
interface AssetCardProps {
  id: string;
  title: string;
  eventDate: string;
  status: "active" | "scheduled" | "draft";
  recipientCount: number;
  redemptionCount: number;
  thumbnail?: string;
  onView: (id: string) => void;
}

// Types for the component props
interface SchwabDashboardViewProps {
  onCreateAsset: () => void;
  onViewAsset: (assetId: string) => void;
}

// The main Schwab Dashboard component
export default function SchwabDashboardView({
  onCreateAsset,
  onViewAsset,
}: SchwabDashboardViewProps) {
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

  // Sample digital pass assets
  const digitalAssets = [
    {
      id: "asset-001",
      title: "Investor Workshop Series - Q2 2025",
      eventDate: "May 15, 2025",
      status: "active" as const,
      recipientCount: 342,
      redemptionCount: 287,
    },
    {
      id: "asset-002",
      title: "Retirement Planning Seminar",
      eventDate: "June 8, 2025",
      status: "scheduled" as const,
      recipientCount: 156,
      redemptionCount: 0,
    },
    {
      id: "asset-003",
      title: "Market Insights Webinar",
      eventDate: "April 22, 2025",
      status: "active" as const,
      recipientCount: 521,
      redemptionCount: 498,
    },
    {
      id: "asset-004",
      title: "Financial Literacy Workshop",
      eventDate: "July 12, 2025",
      status: "draft" as const,
      recipientCount: 0,
      redemptionCount: 0,
    },
  ];

  // Asset Card component
  const AssetCard = ({
    id,
    title,
    eventDate,
    status,
    recipientCount,
    redemptionCount,
    onView,
  }: AssetCardProps) => {
    const getStatusBadge = () => {
      switch (status) {
        case "active":
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Active
            </span>
          );
        case "scheduled":
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
              <ClockIcon className="h-3 w-3 mr-1" />
              Scheduled
            </span>
          );
        case "draft":
          return (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
              <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
              Draft
            </span>
          );
      }
    };

    const redemptionRate =
      recipientCount > 0
        ? ((redemptionCount / recipientCount) * 100).toFixed(1)
        : "0.0";

    return (
      <Card className="p-5 hover:shadow-md transition-shadow border border-[#009DDB]/20">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-[#009DDB]" />
              {eventDate}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center text-xs text-[#009DDB] font-medium mb-1">
              <UsersIcon className="h-3.5 w-3.5 mr-1" />
              Recipients
            </div>
            <div className="text-xl font-bold text-gray-900">
              {recipientCount.toLocaleString()}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center text-xs text-green-700 font-medium mb-1">
              <TicketIcon className="h-3.5 w-3.5 mr-1" />
              Redeemed
            </div>
            <div className="text-xl font-bold text-gray-900">
              {redemptionCount.toLocaleString()}
            </div>
          </div>
        </div>

        {status !== "draft" && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Redemption Rate</span>
              <span className="font-semibold text-gray-900">
                {redemptionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#009DDB] h-2 rounded-full transition-all"
                style={{ width: `${redemptionRate}%` }}
              />
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full border-[#009DDB] text-[#009DDB] hover:bg-[#009DDB] hover:text-white"
          onClick={() => onView(id)}
        >
          View Asset Details
        </Button>
      </Card>
    );
  };

  // Stats for the dashboard
  const stats = useMemo(() => {
    return {
      totalAssets: digitalAssets.length,
      activeAssets: digitalAssets.filter((a) => a.status === "active").length,
      totalRecipients: digitalAssets.reduce(
        (sum, a) => sum + a.recipientCount,
        0
      ),
      totalRedemptions: digitalAssets.reduce(
        (sum, a) => sum + a.redemptionCount,
        0
      ),
    };
  }, []);

  const overallRedemptionRate =
    stats.totalRecipients > 0
      ? ((stats.totalRedemptions / stats.totalRecipients) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-4">
      {/* Custom Schwab Header - Pastel Design */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 border border-slate-200 shadow-sm">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="schwab-pattern"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="#CBD5E1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#schwab-pattern)" />
          </svg>
        </div>

        {/* Decorative accent shapes - subtle pastel colors */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-48 translate-x-48" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-slate-100/50 rounded-full blur-3xl translate-y-32 -translate-x-32" />

        <div className="relative z-10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Logo - prominent with subtle shadow */}
              <div className="flex-shrink-0 bg-white p-2 shadow-md border border-slate-200">
                <Image
                  src="/logos/CharlesSchwab_Logo.svg"
                  alt="Charles Schwab"
                  width={64}
                  height={64}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Vertical divider */}
              <div className="h-16 w-px bg-slate-300" />

              {/* Header text */}
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">
                  Welcome, {userProfile?.name?.split(" ")[0] || "User"}!
                </h1>
                <div className="flex items-center space-x-3 text-slate-600 text-sm">
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                    {currentDate}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-700">
                    Charles Schwab
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    Events & Marketing
                  </span>
                </div>
              </div>
            </div>

            {/* Stats badge */}
            <div className="flex items-center space-x-3">
              <div className="text-right bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-0.5">
                  Digital Passes
                </div>
                <div className="text-2xl font-bold text-slate-800">4</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="h-full flex flex-col">
        <div
          className="mt-4 flex-1 bg-white rounded-lg p-6 overflow-auto relative"
          style={{
            border: "1px solid #E2E8F0",
            boxSizing: "border-box",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            minHeight: "700px",
            backgroundImage:
              'radial-gradient(circle at 80% 10%, rgba(0, 157, 219, 0.03) 0%, rgba(255, 255, 255, 0) 50%), linear-gradient(to right bottom, rgba(255, 255, 255, 0.99), rgba(255, 255, 255, 0.96)), url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:%23009DDB;stop-opacity:0.05" /><stop offset="100%" style="stop-color:%231B53B1;stop-opacity:0.08" /></linearGradient></defs><rect x="560" y="20" width="180" height="100" rx="20" fill="url(%23grad1)" /><rect x="620" y="150" width="120" height="70" rx="15" fill="%23009DDB" opacity="0.04" /><rect x="680" y="250" width="80" height="50" rx="10" fill="%231B53B1" opacity="0.03" /><circle cx="720" cy="180" r="15" fill="%23009DDB" opacity="0.04" /><circle cx="680" cy="200" r="10" fill="%2300A86B" opacity="0.03" /></svg>\')',
            backgroundPosition: "right top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#009DDB] mb-1">
                Digital Pass Management
              </h1>
              <p className="text-sm text-gray-600">
                Create and manage digital passes for Schwab events
              </p>
            </div>
            <Button
              size="lg"
              className="bg-[#009DDB] hover:bg-[#1B53B1] text-white flex items-center shadow-md"
              onClick={onCreateAsset}
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Create Digital Pass with AI
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-[#009DDB]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Assets</p>
                  <p className="text-2xl font-bold text-[#009DDB]">
                    {stats.totalAssets}
                  </p>
                </div>
                <div className="p-3 bg-[#009DDB]/10 rounded-full">
                  <DocumentDuplicateIcon className="h-6 w-6 text-[#009DDB]" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-700">
                    {stats.activeAssets}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Recipients</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.totalRecipients.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <UsersIcon className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-white border-amber-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Redemption Rate</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {overallRedemptionRate}%
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <TicketIcon className="h-6 w-6 text-amber-700" />
                </div>
              </div>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-[#009DDB]/5 to-[#1B53B1]/5 border-[#009DDB]/30">
            <div className="flex items-start">
              <SparklesIcon className="h-5 w-5 text-[#009DDB] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[#009DDB] mb-1">
                  Streamline Your Event Marketing
                </h3>
                <p className="text-sm text-gray-700">
                  Create shareable digital passes for Schwab events using Kigo
                  Pro's AI-powered tools. Send passes directly to client digital
                  wallets for seamless event access and engagement tracking.
                </p>
              </div>
            </div>
          </Card>

          {/* Digital Assets Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Digital Passes
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-[#009DDB] text-[#009DDB]"
              >
                View All Assets
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {digitalAssets.map((asset) => (
                <AssetCard key={asset.id} {...asset} onView={onViewAsset} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="justify-start border-[#009DDB]/30 hover:border-[#009DDB] hover:bg-[#009DDB]/5"
                onClick={onCreateAsset}
              >
                <PlusIcon className="h-4 w-4 mr-2 text-[#009DDB]" />
                <span className="text-gray-700">New Event Pass</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start border-[#009DDB]/30 hover:border-[#009DDB] hover:bg-[#009DDB]/5"
              >
                <CalendarIcon className="h-4 w-4 mr-2 text-[#009DDB]" />
                <span className="text-gray-700">Schedule Campaign</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start border-[#009DDB]/30 hover:border-[#009DDB] hover:bg-[#009DDB]/5"
              >
                <UsersIcon className="h-4 w-4 mr-2 text-[#009DDB]" />
                <span className="text-gray-700">View Analytics</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
