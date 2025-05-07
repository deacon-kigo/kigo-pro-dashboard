"use client";

import React, { useState, useEffect } from "react";
import {
  SparklesIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { AIAssistantPanel } from "@/components/features/ai";
import { LLMAIAssistant } from "@/components/features/ai/LLMAIAssistant";
import { AIWorkflowUI } from "./AIWorkflowUI";
import useAIWorkflow from "./useAIWorkflow";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdsCampaignContext,
  addMessage,
  setIsProcessing,
  magicGenerate,
} from "@/lib/redux/slices/ai-assistantSlice";
import {
  selectCompleteCampaignContext,
  selectMerchantId,
  selectMerchantName,
  selectOfferId,
  selectCampaignName,
  selectCampaignDescription,
  selectStartDate,
  selectEndDate,
  selectCampaignWeight,
  selectMediaTypes,
  selectLocations,
  selectBudget,
} from "@/lib/redux/selectors/adsCampaignSelectors";
import {
  applyAICampaignUpdate,
  setIsGenerating,
  setLastGenerated,
  CampaignLocation,
} from "@/lib/redux/slices/adsCampaignSlice";

interface AdsAIAssistantPanelProps {
  onOptionSelected?: (optionId: string) => void;
  className?: string;
  onWorkflowComplete?: (results: Record<string, any>) => void;
}

export function AdsAIAssistantPanel({
  onOptionSelected,
  className,
  onWorkflowComplete,
}: AdsAIAssistantPanelProps) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"chat" | "workflow">("chat");

  // Get campaign data from Redux
  const merchantId = useSelector(selectMerchantId);
  const merchantName = useSelector(selectMerchantName);
  const offerId = useSelector(selectOfferId);
  const campaignName = useSelector(selectCampaignName);
  const campaignDescription = useSelector(selectCampaignDescription);
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);
  const campaignWeight = useSelector(selectCampaignWeight);
  const mediaTypes = useSelector(selectMediaTypes);
  const locations = useSelector(selectLocations);
  const budget = useSelector(selectBudget);

  // Initialize the workflow hook
  const workflow = useAIWorkflow({
    onStepComplete: (stepId, result) => {
      console.log(`Step ${stepId} completed:`, result);
    },
    onWorkflowComplete: (results) => {
      console.log("Workflow completed with results:", results);
      onWorkflowComplete?.(results);
    },
  });

  // Update AI assistant context when campaign data changes
  useEffect(() => {
    console.log("Setting ads campaign context with data:", {
      merchantId,
      merchantName,
      offerId,
      campaignName,
      campaignDescription,
      startDate,
      endDate,
      campaignWeight,
      mediaTypes,
      locations,
      budget,
    });

    dispatch(
      setAdsCampaignContext({
        merchantId,
        merchantName,
        offerId,
        campaignName,
        campaignDescription,
        startDate,
        endDate,
        campaignWeight,
        mediaTypes,
        locations,
        budget,
      })
    );
  }, [
    dispatch,
    merchantId,
    merchantName,
    offerId,
    campaignName,
    campaignDescription,
    startDate,
    endDate,
    campaignWeight,
    mediaTypes,
    locations,
    budget,
  ]);

  // Handle AI option selection from the chat interface
  const handleOptionSelected = (optionId: string) => {
    console.log("Option selected:", optionId);

    // Handle different AI suggestions/commands
    if (optionId === "run_workflow") {
      setActiveTab("workflow");
      workflow.simulateWorkflowProgress();
      return;
    }

    // Handle apply_updates command for campaign updates
    if (optionId.startsWith("apply_updates:")) {
      dispatch(setIsGenerating(true));

      try {
        // Extract the JSON payload from the option ID
        const updatesJson = optionId.replace("apply_updates:", "");
        const updates = JSON.parse(updatesJson);

        console.log("Parsed updates:", updates);

        // Dispatch action to update the campaign in Redux store
        dispatch(
          applyAICampaignUpdate({
            merchantId: updates.merchantId,
            merchantName: updates.merchantName,
            offerId: updates.offerId,
            campaignName: updates.campaignName,
            campaignDescription: updates.campaignDescription,
            startDate: updates.startDate
              ? new Date(updates.startDate)
              : undefined,
            endDate: updates.endDate ? new Date(updates.endDate) : undefined,
            campaignWeight: updates.campaignWeight,
            mediaTypes: updates.mediaTypes,
            locations: updates.locations,
            budget: updates.budget,
            costPerActivation: updates.costPerActivation,
            costPerRedemption: updates.costPerRedemption,
          })
        );

        // Set last generated for UI feedback
        dispatch(setLastGenerated("complete"));

        // Add confirmation message
        dispatch(
          addMessage({
            type: "system",
            content: "✅ Campaign updated successfully!",
            severity: "success",
          })
        );

        setTimeout(() => {
          dispatch(setIsGenerating(false));
        }, 800);
      } catch (error) {
        console.error("Error applying updates:", error);
        dispatch(setIsGenerating(false));

        // Add error message
        dispatch(
          addMessage({
            type: "system",
            content: "❌ Failed to update campaign settings.",
            severity: "error",
          })
        );
      }
    }

    // Handle start_workflow command
    if (optionId === "start_workflow") {
      setActiveTab("workflow");
      workflow.startWorkflow();
    }

    // Otherwise, pass to the original handler
    if (
      onOptionSelected &&
      !optionId.startsWith("apply_updates:") &&
      optionId !== "run_workflow" &&
      optionId !== "start_workflow"
    ) {
      onOptionSelected(optionId);
    }
  };

  // Additional handler for magic generate button
  const handleMagicGenerate = () => {
    console.log("Magic generate button clicked");
    dispatch(magicGenerate());
  };

  // Watch for completed steps and react to them
  useEffect(() => {
    if (workflow.isWorkflowComplete) {
      // Apply the workflow results to the campaign
      onWorkflowComplete?.(workflow.stepResults);
    }
  }, [workflow.isWorkflowComplete, workflow.stepResults, onWorkflowComplete]);

  // Handle expanding a step for more details
  const handleExpandStep = (stepId: string) => {
    console.log(`Expanded step: ${stepId}`);
  };

  // Handle manual workflow run button
  const handleRunWorkflow = () => {
    workflow.simulateWorkflowProgress();
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Panel Header with tabs */}
      <div className="flex-shrink-0 border-b flex flex-col">
        <div className="p-3 flex items-center justify-between">
          <div className="font-semibold flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <span>AI Campaign Assistant</span>
          </div>
        </div>

        <Tabs
          defaultValue="chat"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "chat" | "workflow")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-0 rounded-none">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="workflow"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <LightBulbIcon className="h-4 w-4 mr-1" />
              Workflow
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "chat" ? (
          <div className="h-full">
            <LLMAIAssistant
              onOptionSelected={handleOptionSelected}
              className="h-full border-none px-0"
              noHeader
              initialMessage="I'm your campaign creation assistant. I can help you create effective ad campaigns based on your goals. What type of campaign would you like to create?"
              showMagicButton={true}
              magicButtonText="Generate Campaign"
              magicButtonHandler={handleMagicGenerate}
              contextId="adsCampaignContext"
            />
            <div className="absolute bottom-14 right-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-9 w-9 p-0 bg-white shadow-md"
                onClick={() => setActiveTab("workflow")}
                title="Show AI Workflow"
              >
                <LightBulbIcon className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 h-full overflow-auto">
            <AIWorkflowUI
              steps={workflow.steps}
              isRunning={workflow.isRunning}
              onExpandStep={handleExpandStep}
              onRunWorkflow={handleRunWorkflow}
            />

            {workflow.isWorkflowComplete && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-sm">
                <div className="font-medium text-green-800 flex items-center">
                  <SparklesIcon className="h-4 w-4 mr-1 text-green-600" />
                  Workflow Complete!
                </div>
                <p className="text-green-600 text-xs mt-1">
                  The AI has completed the campaign automation. Your campaign
                  configuration has been updated.
                </p>
                <Button
                  className="mt-3 w-full"
                  size="sm"
                  variant="outline"
                  onClick={() => workflow.resetWorkflow()}
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
  );
}
