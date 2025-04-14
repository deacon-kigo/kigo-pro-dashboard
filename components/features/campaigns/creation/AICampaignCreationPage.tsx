"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import { useDemoActions, useDemoState } from "@/lib/redux/hooks";
import { AIAssistantPanel } from "../../ai";
import DynamicCanvas from "./DynamicCanvas";
import Card from "@/components/atoms/Card/Card";

export default function AICampaignCreationPage() {
  const searchParams = useSearchParams();
  const { setClientId, setCampaignCreationStep } = useDemoActions();
  const { clientId, clientName } = useDemoState();
  const [greeting, setGreeting] = useState("");

  // Store client parameter to use later for navigation
  const clientParam = searchParams.get("client") || "deacons";
  const typeParam = searchParams.get("type") || "";

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

    // Initialize at the first step
    setCampaignCreationStep("business-intelligence");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get merchant name for display
  const merchantName = useMemo(() => {
    if (clientId === "seven-eleven") return "7-Eleven";
    if (clientId === "deacons") return "Deacon";
    return clientName || "Merchant";
  }, [clientId, clientName]);

  // Handle option selected from AI Assistant Panel - memoize to avoid recreation
  const handleOptionSelected = useCallback(
    (optionId: string) => {
      switch (optionId) {
        case "tell-more":
        case "recommendation":
          setCampaignCreationStep("business-intelligence");
          break;
        case "create-campaign":
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
          setCampaignCreationStep("launch-control");
          break;
      }
    },
    [setCampaignCreationStep]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Dual Panel Layout */}
      <div className="flex-1 max-w-screen-2xl mx-auto sm: pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
          {/* AI Assistant Panel - Left Side */}
          <div className="lg:col-span-4 h-full">
            <Card className="h-full p-0 overflow-hidden" title=" ">
              <AIAssistantPanel
                className="w-full h-full"
                onOptionSelected={handleOptionSelected}
              />
            </Card>
          </div>

          {/* Dynamic Canvas - Right Side */}
          <div className="lg:col-span-8 h-full">
            <Card className="h-full p-0 overflow-hidden">
              <DynamicCanvas />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
