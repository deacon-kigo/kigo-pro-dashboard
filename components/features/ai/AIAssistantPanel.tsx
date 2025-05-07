"use client";

import * as React from "react";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  AIMessage,
  addMessage,
  setIsProcessing,
  magicGenerate,
} from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PaperAirplaneIcon,
  LightBulbIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import DemoAIAssistant from "./DemoAIAssistant";
import LLMAIAssistant from "./LLMAIAssistant";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { cn } from "@/lib/utils";

// Import workflow components directly
import { AIWorkflowUI } from "@/components/features/campaigns/ads-create/AIWorkflowUI";
import { WorkflowStep } from "@/components/features/campaigns/ads-create/AIWorkflowUI";

// Define types locally (Consider moving to a shared types file later)
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

interface ResponseOption {
  text: string;
  value: string;
}

interface Attachment {
  type: "image" | "chart" | "file";
  url: string;
  title: string;
  description?: string;
}

interface AIAssistantPanelProps {
  onOptionSelected: (optionId: string) => void;
  onSend?: () => void;
  className?: string;
  title: string;
  description?: string;
  requiredCriteriaTypes?: string[];
  noHeader?: boolean;
  showWorkflowUI?: boolean;
  onWorkflowComplete?: (results: Record<string, any>) => void;
}

interface ChatMessageProps {
  key?: string;
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
  applyInstantFilter: () => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onOptionSelected,
  onSend = () => {},
  className = "",
  title,
  description,
  requiredCriteriaTypes = [],
  noHeader = false,
  showWorkflowUI = false,
  onWorkflowComplete,
}) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = React.useState<"chat" | "workflow">("chat");

  // State for workflow simulation
  const [workflowSteps, setWorkflowSteps] = React.useState<WorkflowStep[]>([]);
  const [isWorkflowRunning, setIsWorkflowRunning] = React.useState(false);
  const [isWorkflowComplete, setIsWorkflowComplete] = React.useState(false);

  // Load workflow hook and steps once when component mounts
  React.useEffect(() => {
    if (showWorkflowUI) {
      // Dynamically import workflow utilities
      import("@/components/features/campaigns/ads-create/AIWorkflowUI").then(
        ({ defaultCampaignWorkflowSteps }) => {
          setWorkflowSteps(
            defaultCampaignWorkflowSteps.map((step) => ({ ...step }))
          );
        }
      );
    }
  }, [showWorkflowUI]);

  // Simulate workflow progress
  const simulateWorkflowProgress = React.useCallback(() => {
    if (!showWorkflowUI || isWorkflowRunning) return;

    setIsWorkflowRunning(true);
    setIsWorkflowComplete(false);

    // Reset steps to pending
    setWorkflowSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" }))
    );

    // Simulate completion of each step with delays
    const stepDelays = [2000, 3000, 2500, 3500, 2000];

    // Set first step to active
    setTimeout(() => {
      setWorkflowSteps((prev) =>
        prev.map((step, idx) =>
          idx === 0 ? { ...step, status: "active" } : step
        )
      );
    }, 100);

    // Process each step
    let totalDelay = 0;
    workflowSteps.forEach((step, index) => {
      totalDelay += stepDelays[index] || 2000;

      setTimeout(() => {
        // Mark current step as completed
        setWorkflowSteps((prev) =>
          prev.map((s, idx) => {
            if (idx === index) {
              return { ...s, status: "completed" };
            } else if (idx === index + 1 && idx < prev.length) {
              return { ...s, status: "active" };
            }
            return s;
          })
        );

        // Check if this is the last step
        if (index === workflowSteps.length - 1) {
          setIsWorkflowRunning(false);
          setIsWorkflowComplete(true);

          // Call completion handler with results
          const results = workflowSteps.reduce(
            (acc, step) => {
              acc[step.id] = {
                completed: true,
                simulatedResult: `Result from ${step.title}`,
              };
              return acc;
            },
            {} as Record<string, any>
          );

          onWorkflowComplete?.(results);
        }
      }, totalDelay);
    });
  }, [workflowSteps, isWorkflowRunning, showWorkflowUI, onWorkflowComplete]);

  // Reset workflow
  const resetWorkflow = React.useCallback(() => {
    setWorkflowSteps((prev) =>
      prev.map((step) => ({ ...step, status: "pending" }))
    );
    setIsWorkflowRunning(false);
    setIsWorkflowComplete(false);
  }, []);

  // Handle workflow-related options
  const handleExtendedOptionSelected = (optionId: string) => {
    // If optionId is related to running the workflow
    if (showWorkflowUI && optionId === "run_workflow") {
      setActiveTab("workflow");
      simulateWorkflowProgress();
      return;
    }

    // Otherwise, pass to the original handler
    onOptionSelected(optionId);
  };

  // Handle expanding a step for more details
  const handleExpandStep = (stepId: string) => {
    console.log(`Expanded step: ${stepId}`);
  };

  // Determine mode
  const isProductFilterMode = pathname.includes("/product-filters");
  const isAdsCampaignMode = pathname.includes("/campaign-manager/ads-create");

  // Get initial message based on mode
  const getInitialMessage = () => {
    if (isProductFilterMode) {
      return "Hi! I'm your AI filter assistant. I can help you create product filters by suggesting criteria based on what you're looking for. What kind of offers would you like to filter?";
    }
    if (isAdsCampaignMode) {
      return "I'm your campaign creation assistant. I can help you create effective ad campaigns based on your goals. What type of campaign would you like to create?";
    }
    return "Hello! I'm your AI assistant. How can I help you today?";
  };

  // Determine appropriate context ID
  const getContextId = () => {
    if (isProductFilterMode) return "productFilterContext";
    if (isAdsCampaignMode) return "adsCampaignContext";
    return undefined;
  };

  // Get appropriate magic button text
  const getMagicButtonText = () => {
    if (isProductFilterMode) return "Generate Filter";
    if (isAdsCampaignMode) return "Generate Campaign";
    return "Generate";
  };

  // Render the assistant with optional workflow UI
  const renderAssistant = () => {
    const assistantComponent =
      isProductFilterMode || isAdsCampaignMode ? (
        <LLMAIAssistant
          onOptionSelected={handleExtendedOptionSelected}
          className={className}
          title={title}
          description={description}
          initialMessage={getInitialMessage()}
          showMagicButton={true}
          magicButtonText={getMagicButtonText()}
          contextId={getContextId()}
          noHeader={noHeader || (showWorkflowUI && activeTab === "workflow")}
        />
      ) : (
        <DemoAIAssistant
          onOptionSelected={(optionId) => {
            handleExtendedOptionSelected(optionId);
            if (onSend) onSend();
          }}
          className={className}
          title={title}
          description={description}
          noHeader={noHeader || (showWorkflowUI && activeTab === "workflow")}
        />
      );

    if (!showWorkflowUI) {
      return assistantComponent;
    }

    return (
      <div className={cn("h-full flex flex-col", className)}>
        {/* Panel Header with tabs */}
        <div className="flex-shrink-0 border-b flex flex-col">
          {!noHeader && (
            <div className="p-3 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                <span>{title || "AI Assistant"}</span>
              </div>
            </div>
          )}

          <Tabs
            defaultValue="chat"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "chat" | "workflow")
            }
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
              {assistantComponent}
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
              {workflowSteps.length > 0 && (
                <>
                  <AIWorkflowUI
                    steps={workflowSteps}
                    isRunning={isWorkflowRunning}
                    onExpandStep={handleExpandStep}
                    onRunWorkflow={simulateWorkflowProgress}
                  />

                  {isWorkflowComplete && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-sm">
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
                        onClick={resetWorkflow}
                      >
                        <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
                        Reset Workflow
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderAssistant();
};

export default AIAssistantPanel;
