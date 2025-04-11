"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useDemoActions, useDemoState } from "@/lib/redux/hooks";
import { AIAssistantPanel } from "../../../components/features/ai";
import { DynamicCanvas } from "../../../components/features/campaigns/creation";
import Card from "@/components/atoms/Card/Card";
import { buildDemoUrl } from "@/lib/utils";

// Define ViewType locally to match DynamicCanvas
type ViewType =
  | "business-intelligence"
  | "campaign-selection"
  | "asset-creation"
  | "performance-prediction"
  | "launch-control";

export default function AICampaignCreation() {
  const searchParams = useSearchParams();
  const { setClientId } = useDemoActions();
  const { clientId, clientName } = useDemoState();
  const [currentView, setCurrentView] = useState<ViewType>(
    "business-intelligence"
  );
  const [greeting, setGreeting] = useState("");

  // Add initialization ref to ensure the effect only runs once
  const isInitializedRef = useRef(false);

  // Store client parameter to use later for navigation
  const clientParam = searchParams.get("client") || "deacons";
  const typeParam = searchParams.get("type") || "";

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
      console.log("AICampaignCreation: Skipping repeated initialization");
      return;
    }

    // Mark as initialized immediately to prevent race conditions
    isInitializedRef.current = true;

    // Use the client parameter from URL or default to "deacons"
    console.log(
      `AICampaignCreation: Initializing once with clientId=${clientParam}`
    );

    // Set client ID and greeting only once
    setClientId(clientParam);
    setGreeting(getGreeting);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get merchant name for display
  const merchantName = useMemo(() => {
    if (clientId === "seven-eleven") return "7-Eleven";
    if (clientId === "deacons") return "Deacon";
    return clientName || "Merchant";
  }, [clientId, clientName]);

  // Get return URL based on client
  const getDashboardUrl = useCallback(() => {
    return buildDemoUrl(clientId, clientId === "deacons" ? "pizza" : "");
  }, [clientId]);

  // Handle option selected from AI Assistant Panel - memoize to avoid recreation
  const handleOptionSelected = useCallback((optionId: string) => {
    switch (optionId) {
      case "tell-more":
      case "recommendation":
        setCurrentView("business-intelligence");
        break;
      case "create-campaign":
        setCurrentView("campaign-selection");
        break;
      case "select-campaign":
      case "customize-assets":
        setCurrentView("asset-creation");
        break;
      case "review-performance":
        setCurrentView("performance-prediction");
        break;
      case "launch-campaign":
        setCurrentView("launch-control");
        break;
    }
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <Card className="flex justify-between items-center p-3">
            <Link
              href={getDashboardUrl()}
              className="flex items-center text-gray-500 hover:text-primary transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="text-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 text-transparent bg-clip-text">
                {greeting}, {merchantName}
              </h2>
              <p className="text-sm text-gray-500">
                Let&apos;s create a new{" "}
                {typeParam ? typeParam : "marketing campaign"}
              </p>
            </div>
            <div className="w-32"></div> {/* Empty div for alignment */}
          </Card>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex-1 max-w-screen-2xl mx-auto px-3 sm:px-4 pb-3 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full flex-1">
          {/* AI Assistant Panel - Left Side */}
          <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
            <Card className="h-full flex-1 p-0 overflow-hidden flex flex-col">
              <AIAssistantPanel onOptionSelected={handleOptionSelected} />
            </Card>
          </div>

          {/* Dynamic Canvas - Right Side */}
          <div className="lg:col-span-8 h-full overflow-hidden flex flex-col">
            <Card className="h-full p-0 overflow-hidden flex flex-col">
              <DynamicCanvas initialView={currentView} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
