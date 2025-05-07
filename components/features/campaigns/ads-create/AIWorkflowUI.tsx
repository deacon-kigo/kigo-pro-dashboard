"use client";

import React, { useState } from "react";
import {
  CheckCircleIcon,
  PlusIcon,
  ArrowRightIcon,
  CpuChipIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  PaintBrushIcon,
  UsersIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { motion } from "framer-motion";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "completed" | "error";
  type: "webflow" | "notion" | "ai";
}

export interface AIWorkflowUIProps {
  steps: WorkflowStep[];
  className?: string;
  onExpandStep?: (stepId: string) => void;
  onRunWorkflow?: () => void;
  isRunning?: boolean;
}

export function AIWorkflowUI({
  steps,
  className,
  onExpandStep,
  onRunWorkflow,
  isRunning = false,
}: AIWorkflowUIProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    onExpandStep?.(stepId);
  };

  // Get appropriate icon for step status
  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return (
          <div className="rounded-full bg-green-100 p-1">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>
        );
      case "active":
        return (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-full bg-blue-100 p-1"
          >
            <CpuChipIcon className="h-4 w-4 text-blue-500" />
          </motion.div>
        );
      case "error":
        return (
          <div className="rounded-full bg-red-100 p-1">
            <span className="h-4 w-4 text-red-500 flex items-center justify-center font-bold">
              !
            </span>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-gray-100 p-1">
            <span className="h-4 w-4 text-gray-400 flex items-center justify-center">
              •
            </span>
          </div>
        );
    }
  };

  // Get icon for service type
  const getServiceIcon = (
    type: WorkflowStep["type"],
    icon: React.ReactNode
  ) => {
    if (icon) return icon;

    switch (type) {
      case "webflow":
        return <span className="text-blue-500 font-bold">W</span>;
      case "notion":
        return <span className="font-bold">N</span>;
      case "ai":
        return <CpuChipIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <CpuChipIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 pb-2", className)}>
      <div className="px-3 py-2 bg-gray-50 rounded-md mb-1 -mt-1">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CpuChipIcon className="h-4 w-4 text-primary" />
          AI Workflow
          <span className="text-xs font-normal text-gray-500 ml-auto">
            {steps.filter((s) => s.status === "completed").length}/
            {steps.length} steps
          </span>
        </h3>
      </div>

      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={cn(
              "relative flex items-start border rounded-md p-2 cursor-pointer transition-all",
              expandedStep === step.id
                ? "border-primary bg-primary/5"
                : "border-transparent hover:border-gray-200 hover:bg-gray-50",
              step.status === "active" && "border-primary/30 bg-blue-50/30",
              step.status === "completed" && "border-green-100"
            )}
            onClick={() => handleStepClick(step.id)}
          >
            {/* Step number with status indicator */}
            <div className="flex-shrink-0 mr-3 flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold",
                  step.status === "active"
                    ? "bg-blue-100 text-blue-600"
                    : step.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                )}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
              )}
            </div>

            {/* Service icon */}
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-md",
                  step.type === "webflow"
                    ? "bg-blue-100"
                    : step.type === "notion"
                      ? "bg-gray-100"
                      : "bg-purple-100"
                )}
              >
                {getServiceIcon(step.type, step.icon)}
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-gray-500 truncate">
                {step.description}
              </p>
            </div>

            {/* Status indicator */}
            <div className="flex-shrink-0 ml-2 mt-1">
              {getStatusIcon(step.status)}
            </div>
          </div>

          {/* Expanded step details */}
          {expandedStep === step.id && (
            <div className="ml-12 pl-9 pr-2 py-2 text-xs text-gray-600 border-l border-dashed border-gray-200">
              <p className="mb-2">{step.description}</p>
              {step.status === "completed" && (
                <p className="text-green-600">Completed</p>
              )}
              {step.status === "active" && (
                <p className="text-blue-600">Processing...</p>
              )}
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Action button */}
      <div className="mt-2 mx-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onRunWorkflow}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="mr-1"
              >
                <CpuChipIcon className="h-4 w-4" />
              </motion.div>
              Running Workflow...
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-1" />
              Run AI Workflow
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Define default workflow steps for campaign creation
export const defaultCampaignWorkflowSteps: WorkflowStep[] = [
  {
    id: "analyze-requirements",
    title: "Analyze Campaign Requirements",
    description: "AI analyzes user requirements to understand campaign goals",
    icon: <DocumentTextIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
  },
  {
    id: "generate-targeting",
    title: "Generate Audience Targeting",
    description: "Identify optimal audience segments based on campaign goals",
    icon: <UsersIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
  },
  {
    id: "location-targeting",
    title: "Determine Location Targeting",
    description: "Select optimal geographic locations for the campaign",
    icon: <MapPinIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
  },
  {
    id: "design-creative",
    title: "Design Creative Recommendations",
    description: "Generate creative direction and asset specifications",
    icon: <PaintBrushIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
  },
  {
    id: "generate-campaign",
    title: "Generate Campaign Configuration",
    description: "Create final campaign settings based on all analyses",
    icon: <PaperAirplaneIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
  },
];
