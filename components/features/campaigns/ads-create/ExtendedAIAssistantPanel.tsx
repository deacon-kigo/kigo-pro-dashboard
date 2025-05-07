"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import AIAssistantPanel from "@/components/features/ai/AIAssistantPanel";
import { EnhancedAIWorkflowPanel } from "./EnhancedAIWorkflowPanel";
import { useEnhancedAIWorkflow } from "./useEnhancedAIWorkflow";
import { cn } from "@/lib/utils";
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Mock data for demo purposes
import { enhancedCampaignWorkflowSteps } from "./EnhancedAIWorkflowPanel";

// Define our own version of AIAssistantPanelProps since it's not exported
export interface ExtendedAIAssistantPanelProps {
  title?: string;
  description?: string;
  onOptionSelected?: (optionId: string) => void;
  onSend?: () => void;
  className?: string;
  initialFormState?: Record<string, any>;
  onFormUpdate?: (updates: Record<string, any>) => void;
  onWorkflowComplete?: (results: Record<string, any>) => void;
  onWorkflowError?: (error: any) => void;
  noHeader?: boolean;
  [key: string]: any; // For other props we might pass through
}

// Detect campaign creation intent from user message
const detectCampaignCreationIntent = (
  message: string
): { detected: boolean; details?: any } => {
  // Basic intent detection - could be enhanced with NLP in production
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("create") && lowerMsg.includes("campaign")) {
    // Extract key information (mock extraction)
    const product = lowerMsg.includes("coffee")
      ? "coffee"
      : lowerMsg.includes("food")
        ? "food"
        : "general";

    const brand = lowerMsg.includes("bank of america")
      ? "Bank of America"
      : lowerMsg.includes("chase")
        ? "Chase"
        : undefined;

    const dealType = lowerMsg.includes("treat")
      ? "treats"
      : lowerMsg.includes("discount")
        ? "discounts"
        : lowerMsg.includes("offer")
          ? "special offers"
          : "promotion";

    return {
      detected: true,
      details: {
        product,
        brand,
        dealType,
        campaignType: "promotional",
        audience: lowerMsg.includes("customer")
          ? "existing customers"
          : "general audience",
      },
    };
  }

  return { detected: false };
};

export function ExtendedAIAssistantPanel({
  title = "AI Assistant",
  description,
  onOptionSelected,
  onSend,
  className = "",
  initialFormState = {},
  onFormUpdate,
  onWorkflowComplete,
  onWorkflowError,
  noHeader = false,
  ...restProps
}: ExtendedAIAssistantPanelProps) {
  const [formState, setFormState] =
    useState<Record<string, any>>(initialFormState);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [intentDetected, setIntentDetected] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<any>(null);
  const [assistantMessages, setAssistantMessages] = useState<any[]>([]);

  // Ref to store the last detected intent message
  const lastIntentMessageRef = useRef<string>("");

  // Handle form updates from workflow
  const handleFormUpdate = useCallback(
    (updates: Record<string, any>) => {
      setFormState((prev) => {
        const newState = { ...prev, ...updates };
        onFormUpdate?.(newState);
        return newState;
      });
    },
    [onFormUpdate]
  );

  // Initialize the enhanced workflow with memoized callbacks
  const enhancedWorkflow = useEnhancedAIWorkflow({
    onStepComplete: useCallback(
      (stepId, result) => {
        // When a step completes, ensure workflow is visible
        setWorkflowVisible(true);
        console.log(`Step ${stepId} completed:`, result);

        // Add an assistant message about the completed step
        const stepMessages: Record<string, string> = {
          "analyze-requirements": `I've analyzed your campaign requirements for ${campaignDetails?.brand || "your brand"}. Based on your ${campaignDetails?.product || "product"} promotion, I recommend targeting a ${result.audienceSize || "50,000+"} audience size with focus on ${result.recommendedChannels?.join(", ") || "digital channels"}.`,
          "generate-targeting": `For your target audience, I recommend focusing on ${result.demographics?.ageGroups.join(", ") || "25-45"} age groups with interests in ${result.interests?.join(", ") || "relevant categories"}. This aligns well with ${campaignDetails?.brand || "your brand"}'s customer profile.`,
          "location-targeting": `I've identified optimal geographic targeting for your campaign. The recommended regions include ${result.recommendedRegions?.join(", ") || "major urban areas"} which have a ${result.demographicMatch || "85%+"} match with your target demographic.`,
          "design-creative": `For your creative direction, I recommend using ${result.imageStyles?.join(" and ") || "lifestyle imagery"} with a ${result.copyTone || "professional yet friendly"} tone. The primary colors should complement ${campaignDetails?.brand || "your brand"}'s identity.`,
          "generate-campaign": `I've finished generating your complete campaign configuration. Your budget allocation is optimized across ${Object.keys(result.budgetAllocation || {}).join(", ") || "channels"} with projected ${result.projectedMetrics?.impressions.toLocaleString() || "1,000,000+"} impressions and ${result.projectedMetrics?.conversions || "900+"} estimated conversions.`,
        };

        if (stepMessages[stepId]) {
          setAssistantMessages((prev) => [
            ...prev,
            {
              type: "assistant",
              content: stepMessages[stepId],
              timestamp: new Date(),
            },
          ]);
        }
      },
      [campaignDetails]
    ),
    onFormUpdate: handleFormUpdate,
    onWorkflowComplete: useCallback(
      (results) => {
        console.log("Workflow completed with results:", results);
        onWorkflowComplete?.(results);

        // Add final completion message
        setAssistantMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `I've completed setting up your ${campaignDetails?.product || ""} ${campaignDetails?.dealType || "promotion"} campaign for ${campaignDetails?.brand || "your brand"}! All the campaign details have been configured based on best practices and your requirements. You can review the details and make any adjustments before launching.`,
            timestamp: new Date(),
            options: [
              { id: "review_campaign", text: "Review campaign details" },
              { id: "make_adjustments", text: "Make adjustments" },
              { id: "launch_campaign", text: "Launch campaign" },
            ],
          },
        ]);
      },
      [onWorkflowComplete, campaignDetails]
    ),
    onStepError: useCallback(
      (stepId, error) => {
        // When an error occurs, ensure workflow is visible
        setWorkflowVisible(true);
        console.error(`Error in step ${stepId}:`, error);
        onWorkflowError?.(error);

        // Add error message
        setAssistantMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: `I encountered an issue while ${stepId.replace(/-/g, " ")} for your campaign. ${error.message || "Would you like me to try again or take a different approach?"}`,
            timestamp: new Date(),
            options: [
              { id: "retry_step", text: "Retry this step" },
              { id: "skip_step", text: "Skip this step" },
              { id: "modify_parameters", text: "Modify parameters" },
            ],
          },
        ]);
      },
      [onWorkflowError]
    ),
  });

  // Handle option selection from AI Assistant with memoization
  const handleExtendedOptionSelected = useCallback(
    (optionId: string) => {
      // If optionId is related to workflow actions
      if (optionId === "run_workflow") {
        setWorkflowVisible(true);
        enhancedWorkflow.simulateWorkflowProgress();
        return;
      }

      if (optionId === "retry_step") {
        enhancedWorkflow.retryCurrentStep();
        return;
      }

      if (optionId === "skip_step") {
        enhancedWorkflow.skipCurrentStep();
        return;
      }

      // Otherwise, pass to the original handler
      onOptionSelected?.(optionId);
      if (onSend) onSend();
    },
    [onOptionSelected, onSend, enhancedWorkflow]
  );

  // Custom message handler to detect campaign creation intent
  const handleMessageSent = useCallback(
    (message: string) => {
      // Detect intent from message
      const intent = detectCampaignCreationIntent(message);

      if (intent.detected && intent.details) {
        // Store detected intent
        setIntentDetected(true);
        setCampaignDetails(intent.details);
        lastIntentMessageRef.current = message;

        // Show workflow panel
        setWorkflowVisible(true);

        // Add assistant response
        setTimeout(() => {
          setAssistantMessages((prev) => [
            ...prev,
            {
              type: "assistant",
              content: `I'd be happy to help you create a ${intent.details.product} ${intent.details.dealType} campaign for ${intent.details.brand || "your brand"}! Let me analyze your requirements and set up an optimized campaign.`,
              timestamp: new Date(),
            },
          ]);

          // Start workflow after a brief delay
          setTimeout(() => {
            enhancedWorkflow.simulateWorkflowProgress();
          }, 1500);
        }, 1000);
      }

      // Always call the original onSend if provided
      if (onSend) onSend();
    },
    [enhancedWorkflow, onSend]
  );

  // Handle step interactions with memoization
  const handleExpandStep = useCallback((stepId: string) => {
    console.log(`Expanded step: ${stepId}`);
  }, []);

  const handleStepCancel = useCallback(() => {
    enhancedWorkflow.cancelWorkflow();

    // Add cancellation message
    setAssistantMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        content:
          "I've stopped the campaign creation process. Would you like to start over or modify your requirements?",
        timestamp: new Date(),
        options: [
          { id: "start_over", text: "Start over" },
          { id: "modify_requirements", text: "Modify requirements" },
        ],
      },
    ]);
  }, [enhancedWorkflow]);

  const handleStepRetry = useCallback(() => {
    enhancedWorkflow.retryCurrentStep();
  }, [enhancedWorkflow]);

  const handleStepSkip = useCallback(() => {
    enhancedWorkflow.skipCurrentStep();
  }, [enhancedWorkflow]);

  const handleStepEdit = useCallback(
    (stepId: string, params: Record<string, any>) => {
      enhancedWorkflow.editStepParams(stepId, params);

      // Add parameter edit message
      setAssistantMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: `I've updated the parameters for the ${stepId.replace(/-/g, " ")} step. The workflow will continue with your customized settings.`,
          timestamp: new Date(),
        },
      ]);
    },
    [enhancedWorkflow]
  );

  // Toggle workflow visibility
  const toggleWorkflowVisibility = useCallback(() => {
    setWorkflowVisible((prev) => !prev);
  }, []);

  // Reset form state when initialFormState changes
  useEffect(() => {
    setFormState(initialFormState);
  }, [initialFormState]);

  // Show workflow automatically when it's running
  useEffect(() => {
    if (enhancedWorkflow.isRunning && !workflowVisible) {
      setWorkflowVisible(true);
    }
  }, [enhancedWorkflow.isRunning, workflowVisible]);

  // Inject custom messages into AIAssistantPanel
  const injectCustomMessages = useCallback(
    (existingMessages: any[] = []) => {
      if (assistantMessages.length === 0) return existingMessages;

      // This is a simplified approach - in a real implementation,
      // you'd need to properly merge messages from both sources
      return [...existingMessages, ...assistantMessages];
    },
    [assistantMessages]
  );

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Panel Header */}
      {!noHeader && (
        <div className="p-3 flex items-center justify-between border-b">
          <div className="font-semibold flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </div>
        </div>
      )}

      {/* Main content area with AI Assistant and collapsible workflow */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* AI Assistant panel */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            workflowVisible ? "h-1/2" : "h-full"
          )}
        >
          <AIAssistantPanel
            {...restProps}
            title={title}
            description={description}
            onOptionSelected={handleExtendedOptionSelected}
            onSend={() => {
              // Extract the latest message from the input field
              // Note: in a real implementation, you'd need to access the input value
              // through proper React refs or state management
              setTimeout(() => {
                // Adding a timeout to simulate processing the message
                // In a real implementation, you'd properly hook into the message submission
                if (lastIntentMessageRef.current) {
                  handleMessageSent(lastIntentMessageRef.current);
                }
              }, 100);

              // Call the original onSend if provided
              if (onSend) onSend();
            }}
            noHeader={true}
            className="h-full"
            showWorkflowUI={false} // Disable the built-in workflow UI
          />

          {/* Custom messages display for the demo */}
          {assistantMessages.length > 0 && (
            <div className="absolute left-0 bottom-16 right-0 max-h-[60%] overflow-y-auto px-4">
              {assistantMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className="mb-3 bg-primary-50 p-3 rounded-lg border border-primary-100"
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt: any) => (
                        <Button
                          key={opt.id}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleExtendedOptionSelected(opt.id)}
                        >
                          {opt.text}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workflow panel */}
        <div
          className={cn(
            "border-t border-gray-200 transition-all duration-300 ease-in-out",
            workflowVisible ? "h-1/2" : "h-0"
          )}
        >
          {/* Workflow header/toggle bar */}
          <div
            className={cn(
              "flex items-center justify-between py-2 px-3 bg-gray-50 cursor-pointer",
              enhancedWorkflow.isRunning && "bg-blue-50"
            )}
            onClick={toggleWorkflowVisibility}
          >
            <div className="flex items-center gap-2">
              <LightBulbIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Workflow</span>
              {enhancedWorkflow.isRunning && (
                <span className="text-xs text-blue-600 animate-pulse">
                  Running...
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {workflowVisible && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setWorkflowVisible(false);
                  }}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {workflowVisible ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronUpIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Workflow content */}
          <div
            className={cn(
              "overflow-auto transition-all",
              workflowVisible ? "h-[calc(100%-32px)]" : "h-0"
            )}
          >
            {workflowVisible && (
              <div className="p-2">
                <EnhancedAIWorkflowPanel
                  steps={enhancedWorkflow.steps}
                  isRunning={enhancedWorkflow.isRunning}
                  isPaused={enhancedWorkflow.isPaused}
                  onExpandStep={handleExpandStep}
                  onRunWorkflow={enhancedWorkflow.simulateWorkflowProgress}
                  onPauseWorkflow={enhancedWorkflow.pauseWorkflow}
                  onResumeWorkflow={enhancedWorkflow.resumeWorkflow}
                  onCancelWorkflow={enhancedWorkflow.cancelWorkflow}
                  onStepCancel={handleStepCancel}
                  onStepRetry={handleStepRetry}
                  onStepSkip={handleStepSkip}
                  onStepEdit={handleStepEdit}
                  currentFormState={formState}
                />

                {enhancedWorkflow.isWorkflowComplete && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-md text-sm">
                    <div className="font-medium text-green-800 flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-1 text-green-600" />
                      Workflow Complete!
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                      The AI has completed the automation. Your configuration
                      has been updated.
                    </p>
                    <Button
                      className="mt-3 w-full"
                      size="sm"
                      variant="outline"
                      onClick={() => enhancedWorkflow.resetWorkflow()}
                    >
                      <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
                      Reset Workflow
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating button to show workflow when it's hidden */}
      {!workflowVisible && enhancedWorkflow.isRunning && (
        <div className="absolute bottom-14 right-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-9 w-9 p-0 bg-white shadow-md"
            onClick={() => setWorkflowVisible(true)}
            title="Show AI Workflow"
          >
            <LightBulbIcon className="h-5 w-5 text-primary" />
            {enhancedWorkflow.isRunning && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full animate-ping" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
