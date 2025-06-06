"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useDemoState } from "@/lib/redux/hooks";
import { Button } from "@/components/atoms/Button/Button";

// Define a type for the launch status
type LaunchStatusType = "ready" | "pending" | "launched" | "failed";

interface LaunchControlCenterProps {
  campaignDetails: {
    name: string;
    targetAudience: string;
    geographicReach: string;
    schedule: {
      startDate: Date | null;
      endDate: Date | null;
      activeDays: string[];
    };
    budget: {
      total: number;
      dailyAverage: number;
    };
    assets: {
      type: string;
      url: string;
      status: "ready" | "pending" | "failed";
    }[];
    metrics: {
      estimatedReach: {
        min: number;
        max: number;
      };
      predictedEngagement: {
        min: number;
        max: number;
      };
      estimatedRedemptions: {
        min: number;
        max: number;
      };
    };
  };
  onLaunch: () => void;
  isLoading?: boolean;
}

const LaunchControlCenter: React.FC<LaunchControlCenterProps> = ({
  campaignDetails,
  onLaunch,
  isLoading = false,
}) => {
  const { clientId } = useDemoState();
  const [reviewedSections, setReviewedSections] = useState<{
    [key: string]: boolean;
  }>({
    targeting: false,
    schedule: false,
    budget: false,
    assets: false,
  });
  const [launchStatus, setLaunchStatus] = useState<LaunchStatusType>("ready");

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Handle section review toggle
  const toggleSectionReview = (section: string) => {
    setReviewedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Check if all sections are reviewed
  const allSectionsReviewed = Object.values(reviewedSections).every(
    (value) => value
  );

  // Handle campaign launch
  const handleLaunch = () => {
    if (!allSectionsReviewed) return;

    setLaunchStatus("pending");

    // Simulate launch process
    setTimeout(() => {
      setLaunchStatus("launched");
      if (onLaunch) onLaunch();
    }, 2000);
  };

  // Generate colors with stronger, more visible green for checklists
  const getClientColors = () => {
    return {
      primary: "#4460F0",
      secondary: "#34D399",
      gradient: "from-blue-500 to-purple-500",
      activeDayBg: "bg-blue-100",
      activeDayText: "text-blue-700",
      checklistBg: "bg-green-100",
      checklistHoverBg: "hover:bg-green-100",
      checklistIconBorder: "border-green-600 bg-green-600",
    };
  };

  const colors = getClientColors();

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">Launch Control Center</h3>
          <p className="text-gray-600">
            Review all campaign details before launching. Ensure everything is
            set up correctly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Campaign Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h4 className="text-lg font-semibold mb-4">Campaign Overview</h4>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Campaign Name</p>
                <p className="font-medium">{campaignDetails.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Target Audience</p>
                  <p className="font-medium">
                    {campaignDetails.targetAudience}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Geographic Reach</p>
                  <p className="font-medium">
                    {campaignDetails.geographicReach}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium">
                    {formatDate(campaignDetails.schedule.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="font-medium">
                    {formatDate(campaignDetails.schedule.endDate)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Active Days</p>
                <div className="flex flex-wrap gap-2">
                  {campaignDetails.schedule.activeDays.map((day) => (
                    <span
                      key={day}
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: "#dcfce7 !important",
                        color: "#15803d !important",
                      }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Projections */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h4 className="text-lg font-semibold mb-4">Budget & Projections</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Budget</p>
                  <p className="font-medium">
                    {formatCurrency(campaignDetails.budget.total)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Daily Average</p>
                  <p className="font-medium">
                    {formatCurrency(campaignDetails.budget.dailyAverage)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-3">
                  Estimated Performance
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-gray-500">Reach</p>
                      <p className="text-xs font-medium">
                        {campaignDetails.metrics.estimatedReach.min.toLocaleString()}{" "}
                        -{" "}
                        {campaignDetails.metrics.estimatedReach.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: "75%",
                          backgroundColor: "#16a34a",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="text-xs font-medium">
                        {campaignDetails.metrics.predictedEngagement.min.toLocaleString()}{" "}
                        -{" "}
                        {campaignDetails.metrics.predictedEngagement.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: "60%",
                          backgroundColor: "#16a34a",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-gray-500">Redemptions</p>
                      <p className="text-xs font-medium">
                        {campaignDetails.metrics.estimatedRedemptions.min.toLocaleString()}{" "}
                        -{" "}
                        {campaignDetails.metrics.estimatedRedemptions.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: "45%",
                          backgroundColor: "#16a34a",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Launch Checklist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h4 className="text-lg font-semibold mb-4">Pre-Launch Checklist</h4>

          <div className="space-y-4">
            <ChecklistItem
              title="Targeting Strategy"
              description="Verify audience targeting and geographic settings"
              isChecked={reviewedSections.targeting}
              onClick={() => toggleSectionReview("targeting")}
            />

            <ChecklistItem
              title="Campaign Schedule"
              description="Confirm start date, end date, and active days"
              isChecked={reviewedSections.schedule}
              onClick={() => toggleSectionReview("schedule")}
            />

            <ChecklistItem
              title="Budget Allocation"
              description="Review total budget and spending strategy"
              isChecked={reviewedSections.budget}
              onClick={() => toggleSectionReview("budget")}
            />

            <ChecklistItem
              title="Creative Assets"
              description="Ensure all required creative assets are ready"
              isChecked={reviewedSections.assets}
              onClick={() => toggleSectionReview("assets")}
            />
          </div>
        </div>

        {/* Asset Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <h4 className="text-lg font-semibold mb-4">Asset Status</h4>

          <div className="space-y-3">
            {campaignDetails.assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center mr-3 ${
                      asset.status === "ready"
                        ? "bg-green-100"
                        : asset.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                    }`}
                  >
                    {asset.status === "ready" && (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    )}
                    {asset.status === "pending" && (
                      <ClockIcon className="w-5 h-5 text-yellow-600" />
                    )}
                    {asset.status === "failed" && (
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.type}</p>
                    <p className="text-xs text-gray-500">
                      {asset.status === "ready"
                        ? "Ready to publish"
                        : asset.status === "pending"
                          ? "Processing..."
                          : "Failed - please regenerate"}
                    </p>
                  </div>
                </div>

                {asset.status === "failed" && (
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Regenerate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Launch Button Section */}
        <div className="mt-auto pt-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {/* @ts-ignore: Type issue with launchStatus */}
            {launchStatus === "launched" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckIcon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  Campaign Successfully Launched!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your "{campaignDetails.name}" campaign is now live.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                  <h4 className="text-lg font-semibold">Ready to Launch?</h4>
                  <p className="text-sm text-gray-600">
                    {allSectionsReviewed
                      ? "You've reviewed all sections! You're ready to launch your campaign."
                      : "Please review all sections before launching your campaign."}
                  </p>
                </div>

                <Button
                  variant={allSectionsReviewed ? "primary" : "secondary"}
                  disabled={
                    !allSectionsReviewed ||
                    launchStatus === "pending" ||
                    String(launchStatus) === "launched"
                  }
                  onClick={handleLaunch}
                  className="min-w-[150px] shadow-sm"
                  icon={
                    (launchStatus as string) === "pending" ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (launchStatus as string) === "launched" ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : null
                  }
                  size="lg"
                >
                  {(launchStatus as string) === "pending"
                    ? "Launching..."
                    : (launchStatus as string) === "launched"
                      ? "Launched!"
                      : "Launch Campaign"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Checklist Item Component with CSS classes
const ChecklistItem: React.FC<{
  title: string;
  description: string;
  isChecked: boolean;
  onClick: () => void;
}> = ({ title, description, isChecked, onClick }) => {
  return (
    <div
      className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${
        isChecked ? "bg-green-100" : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full border ${
          isChecked
            ? "border-green-600 bg-green-600 flex items-center justify-center"
            : "border-gray-300"
        } mr-4 mt-0.5`}
      >
        {isChecked && <CheckIcon className="w-4 h-4 text-white" />}
      </div>

      <div>
        <h5 className="text-sm font-semibold mb-1">{title}</h5>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default LaunchControlCenter;
