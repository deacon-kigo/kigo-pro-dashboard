"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import {
  PlusIcon,
  SparklesIcon,
  ChartBarIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/atoms/Card/Card";

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

// Action Cards Component
const ActionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Link href="/campaign-manager/ads-create" className="block">
        <Card className="h-full p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MegaphoneIcon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
              New
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Ads Campaign</h3>
          <p className="text-sm text-gray-600 mb-3">
            Create a new advertisement campaign with budget and targeting
            options
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <PlusIcon className="h-4 w-4 mr-1" /> Create
          </Button>
        </Card>
      </Link>

      <Link href="/campaign-manager/ai-create" className="block">
        <Card className="h-full p-4 hover:bg-purple-50 hover:border-purple-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <SparklesIcon className="h-6 w-6" />
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">AI Campaign</h3>
          <p className="text-sm text-gray-600 mb-3">
            Generate optimized campaigns with AI recommendations
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <PlusIcon className="h-4 w-4 mr-1" /> Create with AI
          </Button>
        </Card>
      </Link>

      <Link href="/campaigns/product-filters" className="block">
        <Card className="h-full p-4 hover:bg-green-50 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Product Filters</h3>
          <p className="text-sm text-gray-600 mb-3">
            Configure filters to determine which products appear in campaigns
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <PlusIcon className="h-4 w-4 mr-1" /> Manage Filters
          </Button>
        </Card>
      </Link>

      <Card className="h-full p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-gray-100 text-gray-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
              />
            </svg>
          </div>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">Analytics</h3>
        <p className="text-sm text-gray-600 mb-3">
          View detailed performance metrics for all your campaigns
        </p>
        <Button variant="outline" size="sm" className="w-full">
          View Reports
        </Button>
      </Card>
    </div>
  );
};

// The main Campaign Manager dashboard component
export default function CampaignManagerView() {
  return (
    <div className="space-y-4">
      {/* Personalized greeting header */}
      <GreetingHeader />

      {/* Action Cards */}
      <ActionCards />

      {/* PowerBI dashboard embed - direct without Card container */}
      <PowerBIEmbed />
    </div>
  );
}

// PowerBI Embed component
const PowerBIEmbed = () => {
  const powerBIUrl =
    "https://app.powerbi.com/reportEmbed?reportId=cd3e45c5-bf62-4248-ae49-ba2fc0659afe&autoAuth=true&ctid=81549142-4900-41ac-a022-6ce1b9a87cd1";

  return (
    <div className="w-full">
      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
        <iframe
          src={powerBIUrl}
          title="Campaign Analytics Dashboard"
          className="w-full h-full border-0"
          allowFullScreen
          style={{
            minHeight: "700px",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};
