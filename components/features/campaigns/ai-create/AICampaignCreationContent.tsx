"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useDemoActions, useDemoState } from "@/lib/redux/hooks";
import { AIAssistantPanel } from "@/components/features/ai";
import { DynamicCanvas } from "@/components/features/campaigns/creation";
import Card from "@/components/atoms/Card/Card";

// New component for the third panel - Campaign Context Panel
const CampaignContextPanel = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">
          Campaign Context
        </h3>
        <p className="text-sm text-gray-500">Additional tools and insights</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Quick Stats</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Active Campaigns: 3</div>
              <div>Monthly Budget: $2,500</div>
              <div>Avg. ROI: 285%</div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Best Performing</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div>Weekend Special: 340% ROI</div>
              <div>Family Bundle: 290% ROI</div>
              <div>Lunch Deal: 250% ROI</div>
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">
              Recommendations
            </h4>
            <div className="text-sm text-orange-700 space-y-2">
              <div>• Target 5-7pm for family campaigns</div>
              <div>• Focus on weekday promotions</div>
              <div>• Include social media assets</div>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">
              Recent Activity
            </h4>
            <div className="text-sm text-purple-700 space-y-1">
              <div>• Campaign "Weekend Special" launched</div>
              <div>• 45 new redemptions today</div>
              <div>• Budget 65% utilized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AICampaignCreationContent() {
  const router = useRouter();
  const { setClientId, setCampaignCreationStep } = useDemoActions();
  const { clientId, clientName } = useDemoState();
  const [greeting, setGreeting] = useState("");

  // Add initialization ref to ensure the effect only runs once
  const isInitializedRef = useRef(false);

  // Memoize the greeting calculation to avoid recalculation on every render
  const getGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }, []);

  // Set client ID and greeting only once on mount with initialization guard
  useEffect(() => {
    // Skip if already initialized
    if (isInitializedRef.current) {
      return;
    }

    // Mark as initialized immediately to prevent race conditions
    isInitializedRef.current = true;

    // Determine client ID from URL or use default
    const urlParams = new URLSearchParams(window.location.search);
    const clientParam = urlParams.get("client") || "seven-eleven";

    // Set client ID and greeting only once
    setClientId(clientParam);
    setGreeting(getGreeting);

    // Initialize at the first step
    setCampaignCreationStep("business-intelligence");
  }, [setClientId, setCampaignCreationStep, getGreeting]);

  // Get merchant name for display
  const merchantName = useMemo(() => {
    if (clientId === "seven-eleven") return "7-Eleven";
    if (clientId === "deacons") return "Deacon";
    return clientName || "Merchant";
  }, [clientId, clientName]);

  // Handle option selected from AI Assistant Panel
  const handleOptionSelected = useCallback(
    (optionId: string) => {
      switch (optionId) {
        case "tell-more":
        case "recommendation":
          setCampaignCreationStep("business-intelligence");
          break;
        case "create-campaign":
        case "next-step-campaign":
          setCampaignCreationStep("campaign-selection");
          break;
        case "select-campaign":
        case "customize-assets":
          setCampaignCreationStep("asset-creation");
          break;
        case "review-performance":
          setCampaignCreationStep("performance-prediction");
          break;
        case "launch-campaign":
        case "publish-campaign":
          setCampaignCreationStep("launch-control");
          break;
        case "view-campaign-performance":
          setCampaignCreationStep("performance-prediction");
          break;
      }
    },
    [setCampaignCreationStep]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0">
        <div className="p-3 sm:p-4">
          <div className="max-w-screen-2xl mx-auto">
            <Card className="flex justify-between items-center p-3">
              <Link
                href="/campaign-manager"
                className="flex items-center text-gray-500 hover:text-primary transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                <span className="font-medium">Back to Campaign Manager</span>
              </Link>
              <div className="text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 text-transparent bg-clip-text">
                  {greeting}, {merchantName}
                </h2>
                <p className="text-sm text-gray-500">
                  Let&apos;s create a new marketing campaign with AI
                </p>
              </div>
              <div className="w-32"></div> {/* Empty div for alignment */}
            </Card>
          </div>
        </div>
      </div>

      {/* Three Equal Panel Layout - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-3 sm:px-4 pb-3">
          <div className="flex gap-3 h-full">
            {/* AI Assistant Panel - Left Panel */}
            <div className="w-1/3 h-full flex flex-col">
              <Card className="h-full flex flex-col overflow-hidden">
                <AIAssistantPanel
                  onOptionSelected={handleOptionSelected}
                  title="AI Assistant"
                  className="h-full"
                />
              </Card>
            </div>

            {/* Dynamic Canvas - Middle Panel */}
            <div className="w-1/3 flex flex-col" style={{ height: "100vh" }}>
              <Card className="h-full flex flex-col overflow-hidden">
                <DynamicCanvas />
              </Card>
            </div>

            {/* Campaign Context Panel - Right Panel */}
            <div className="w-1/3 h-full flex flex-col">
              <Card className="h-full flex flex-col overflow-hidden">
                <CampaignContextPanel />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
