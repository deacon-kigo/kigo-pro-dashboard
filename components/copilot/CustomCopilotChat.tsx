"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleChat, setChatWidth } from "@/lib/redux/slices/uiSlice";
import { CopilotSidebar } from "@copilotkit/react-ui";
import type { WindowProps } from "@copilotkit/react-ui";
import { usePathname } from "next/navigation";
import { useCopilotContext } from "@copilotkit/react-core";
import {
  OfferProgressViewer,
  OfferStep,
} from "@/components/features/offer-manager/OfferProgressViewer";
import {
  generateSystemPrompt,
  generateInitialGreeting,
  OFFER_MANAGER_CONTEXT_PROMPT,
  type FeatureContext,
} from "@/lib/copilot-kit/offer-manager-prompts";

/**
 * Custom Window component for CopilotSidebar with Progress Viewer
 * Overrides default positioning to integrate with our layout system
 * Shows Perplexity-style thinking steps when on Offer Manager
 */
const CustomWindow: React.FC<WindowProps & { children?: React.ReactNode }> = ({
  children,
  clickOutsideToClose,
  hitEscapeToClose,
  shortcut,
}) => {
  const dispatch = useAppDispatch();
  const { chatOpen, chatWidth } = useAppSelector((state) => state.ui);
  const pathname = usePathname();
  const context = useCopilotContext();

  // Track steps from co-agent state
  const [steps, setSteps] = useState<OfferStep[]>([]);

  // Listen to state changes from offer_manager agent
  useEffect(() => {
    // Check if we're on offer manager page
    const isOfferManager = pathname?.includes("offer-manager") || false;

    if (isOfferManager) {
      // TODO: Re-enable when LangGraph agent state is properly configured
      // For now, steps are empty
      setSteps([]);
    } else {
      setSteps([]);
    }
  }, [pathname]);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const chatRef = useRef<HTMLDivElement>(null);

  // Handle close button
  const handleClose = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

  // Mouse down on resize handle
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(chatWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [chatWidth]
  );

  // Mouse move during resize
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startX - e.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + deltaX));
      dispatch(setChatWidth(newWidth));
    },
    [isResizing, startX, startWidth, dispatch]
  );

  // Mouse up to end resize
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Add/remove event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!chatOpen) return null;

  return (
    <div
      ref={chatRef}
      className="fixed right-0 top-0 h-full z-40 flex transition-transform duration-300 ease-in-out bg-white shadow-2xl border-l border-gray-200"
      style={{
        width: `${chatWidth}px`,
        transform: chatOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {/* Resize Handle */}
      <div
        className="w-px h-full cursor-ew-resize bg-gray-200 hover:bg-blue-400 transition-colors z-10 group flex-shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 group-hover:bg-blue-500 transition-colors" />
      </div>

      {/* CopilotSidebar Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center"
          aria-label="Close AI Assistant"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>

        {/* Progress Viewer - Shows when we have steps */}
        {steps && steps.length > 0 && (
          <div className="border-b bg-gray-50 flex-shrink-0">
            <OfferProgressViewer steps={steps} defaultCollapsed={false} />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

/**
 * Custom Draggable Chat Window with CopilotSidebar
 *
 * Uses custom Window component to properly integrate with layout system
 */
export function CustomCopilotChat() {
  const dispatch = useAppDispatch();
  const { chatOpen } = useAppSelector((state) => state.ui);
  const offerManagerState = useAppSelector((state) => state.offerManager);
  const pathname = usePathname();

  // Dynamic instructions and greetings based on current page and context
  const isOfferManager = pathname?.includes("offer-manager");

  // Detect current feature from pathname
  const detectFeature = (): FeatureContext => {
    if (!pathname) return "dashboard";

    if (pathname.includes("/offer-manager")) return "offer_manager";
    if (pathname.includes("/product-filters")) return "product_filters";
    if (pathname.includes("/ads-create")) return "ad_creation";
    if (pathname.includes("/campaign-manager")) return "campaign_manager";
    if (pathname.includes("/analytics")) return "analytics";

    return "dashboard";
  };

  const currentFeature = detectFeature();

  // Generate dynamic context for prompts from Redux state
  const contextData = React.useMemo(() => {
    const feature = detectFeature();

    // Offer Manager context
    if (feature === "offer_manager") {
      return {
        feature: "offer_manager" as FeatureContext,
        workflowPhase: offerManagerState.workflowPhase,
        isCreating: offerManagerState.isCreatingOffer,
        currentStep: offerManagerState.currentStep,
        businessObjective: offerManagerState.formData.businessObjective,
        offerType: offerManagerState.formData.offerType,
        programType: offerManagerState.formData.programType,
      };
    }

    // Product Filters context
    if (feature === "product_filters") {
      const isCreating = pathname?.includes("/new") || false;
      return {
        feature: "product_filters" as FeatureContext,
        isCreating,
        filterName: "", // TODO: Get from state
        currentStep: "",
      };
    }

    // Campaign/Ad Manager context
    if (feature === "campaign_manager" || feature === "ad_creation") {
      const isCreating = pathname?.includes("/create") || false;
      return {
        feature: feature as FeatureContext,
        isCreating,
        campaignType: "", // TODO: Get from state
        currentStep: "",
      };
    }

    // Analytics context
    if (feature === "analytics") {
      return {
        feature: "analytics" as FeatureContext,
      };
    }

    // Default dashboard context
    return {
      feature: "dashboard" as FeatureContext,
      workflowPhase: "dashboard",
      isCreating: false,
    };
  }, [pathname, offerManagerState]);

  // Generate dynamic system prompt with context
  const instructions =
    currentFeature !== "dashboard"
      ? generateSystemPrompt({
          userName: undefined,
          programType: (contextData as any).programType || undefined,
          currentPhase: (contextData as any).workflowPhase || currentFeature,
        })
      : "You are an AI assistant for Kigo Pro, a marketing campaign management platform. Help users with campaign creation, optimization, and insights.";

  // Generate dynamic initial greeting based on feature
  const initialGreeting = generateInitialGreeting(contextData);

  // Handle toggle
  const handleToggle = useCallback(() => {
    dispatch(toggleChat());
  }, [dispatch]);

  return (
    <>
      {/* Floating Chat Button - only show when chat is closed */}
      {!chatOpen && (
        <Button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0"
          style={{
            backgroundColor: "#2563eb",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
          aria-label="Open AI Assistant"
        >
          <SparklesIcon className="h-6 w-6" style={{ color: "#ffffff" }} />
        </Button>
      )}

      {/* CopilotSidebar with custom Window component */}
      <CopilotSidebar
        instructions={instructions}
        labels={{
          title: "Kigo Pro AI Assistant",
          initial: initialGreeting,
        }}
        defaultOpen={chatOpen}
        clickOutsideToClose={false}
        onSetOpen={(open) => {
          if (!open) {
            dispatch(toggleChat());
          }
        }}
        Window={CustomWindow}
      />
    </>
  );
}
