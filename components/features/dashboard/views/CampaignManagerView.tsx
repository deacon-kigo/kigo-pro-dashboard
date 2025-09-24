"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/lib/redux/hooks";
import { convertMockUserToUserProfile } from "@/lib/userProfileUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SparklesIcon,
  XMarkIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

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

// AI Insight Notification - Proactive suggestion that appears while Tucker works
interface AIInsightNotificationProps {
  onDismiss: () => void;
}

const AIInsightNotification = ({ onDismiss }: AIInsightNotificationProps) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExploreOpportunity = () => {
    // Navigate to AI chat interface with the new mover journey context
    router.push(
      "/campaign-manager/ai-create?insight=new-mover-journey&client=abc-fi"
    );
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in-right">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  AI Insight
                </h3>
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  Q4 Opportunity
                </Badge>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <strong>Tucker</strong>, I've identified a high-impact Q4
                opportunity for ABC FI.
              </p>
            </div>

            {!isExpanded ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>567 new mortgage customers/month</strong> could
                  benefit from an AI-powered moving journey.
                </p>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Show details →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/60 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Target Opportunity
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-900">567</div>
                      <div className="text-blue-600">customers/month</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-900">
                        $127K-$245K
                      </div>
                      <div className="text-green-600">revenue potential</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Recommended Strategy
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>AI-Powered New Mover Journey:</strong> Start with
                    personalized $100 gifts, then guide customers through
                    curated moving offers from U-Haul, Public Storage, and
                    Hilton.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleExploreOpportunity}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                <ArrowRightIcon className="w-3 h-3 mr-1" />
                Explore Opportunity
              </Button>
              <Button
                onClick={onDismiss}
                variant="outline"
                className="text-xs px-3"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// The main Campaign Manager dashboard component
export default function CampaignManagerView() {
  const [showAIInsight, setShowAIInsight] = useState(false);

  // Show AI insight after user has been on dashboard for a few seconds (simulating Tucker working on Q4 objectives)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAIInsight(true);
    }, 4000); // Show after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Personalized greeting header */}
      <GreetingHeader />

      {/* Proactive AI Insight - appears while Tucker is working */}
      {showAIInsight && (
        <AIInsightNotification onDismiss={() => setShowAIInsight(false)} />
      )}

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
