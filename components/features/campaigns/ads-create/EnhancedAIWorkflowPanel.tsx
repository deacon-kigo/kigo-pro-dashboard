"use client";

import React, { useState, useEffect, useRef } from "react";
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
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  XMarkIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
  ArrowPathIcon,
  LightBulbIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/dialog";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Badge } from "@/components/atoms/Badge";
import { Label } from "@/components/atoms/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { WorkflowStep as BaseWorkflowStep } from "./AIWorkflowUI";

export interface WorkflowStepOutput {
  data: Record<string, any>;
  metadata?: {
    processingTime?: number;
    confidence?: number;
    alternatives?: Array<{
      key: string;
      value: any;
      confidence: number;
    }>;
  };
}

export interface WorkflowStepError {
  message: string;
  code?: string;
  recoverable: boolean;
}

export interface WorkflowStepParams {
  [key: string]: any;
}

export interface EnhancedWorkflowStep extends BaseWorkflowStep {
  // Extended properties for enhanced workflow
  output?: WorkflowStepOutput;
  error?: WorkflowStepError;
  params?: WorkflowStepParams;
  isEditable?: boolean;
  isSkippable?: boolean;
  isPaused?: boolean;
  progress?: number; // Progress percentage (0-100)
  startTime?: number;
  endTime?: number;
  aiActions?: Array<{
    id: string;
    description: string;
    timestamp: number;
  }>;
  formState?: Record<string, any>; // Current form values affected by this step
}

export interface EnhancedAIWorkflowPanelProps {
  steps: EnhancedWorkflowStep[];
  className?: string;
  onExpandStep?: (stepId: string) => void;
  onRunWorkflow?: () => void;
  onPauseWorkflow?: () => void;
  onResumeWorkflow?: () => void;
  onCancelWorkflow?: () => void;
  onStepCancel?: (stepId: string) => void;
  onStepRetry?: (stepId: string) => void;
  onStepSkip?: (stepId: string) => void;
  onStepEdit?: (stepId: string, params: WorkflowStepParams) => void;
  onStepCustomAction?: (stepId: string, action: string, params?: any) => void;
  isRunning?: boolean;
  isPaused?: boolean;
  currentFormState?: Record<string, any>;
  readOnly?: boolean;
}

export function EnhancedAIWorkflowPanel({
  steps,
  className,
  onExpandStep,
  onRunWorkflow,
  onPauseWorkflow,
  onResumeWorkflow,
  onCancelWorkflow,
  onStepCancel,
  onStepRetry,
  onStepSkip,
  onStepEdit,
  onStepCustomAction,
  isRunning = false,
  isPaused = false,
  currentFormState = {},
  readOnly = false,
}: EnhancedAIWorkflowPanelProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editingParams, setEditingParams] = useState<WorkflowStepParams>({});
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});
  const [showParams, setShowParams] = useState<Record<string, boolean>>({});
  const [showOutput, setShowOutput] = useState<Record<string, boolean>>({});
  const [showFormState, setShowFormState] = useState(false);

  // Ref to track active running step element
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (isRunning && activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isRunning, steps]);

  // Handle step click to expand/collapse
  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    onExpandStep?.(stepId);
  };

  // Handle step edit button click
  const handleEditClick = (stepId: string, step: EnhancedWorkflowStep) => {
    setEditingStep(stepId);
    setEditingParams(step.params || {});
  };

  // Handle save of step parameter edits
  const handleSaveEdit = () => {
    if (editingStep && onStepEdit) {
      onStepEdit(editingStep, editingParams);
      setEditingStep(null);
    }
  };

  // Toggle visibility of internal AI actions for a step
  const toggleActions = (stepId: string) => {
    setShowActions((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Toggle visibility of step parameters
  const toggleParams = (stepId: string) => {
    setShowParams((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Toggle visibility of step output
  const toggleOutput = (stepId: string) => {
    setShowOutput((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Get appropriate icon for step status
  const getStatusIcon = (
    status: EnhancedWorkflowStep["status"],
    progress?: number
  ) => {
    switch (status) {
      case "completed":
        return (
          <div className="rounded-full bg-green-100 p-1">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>
        );
      case "active":
        if (typeof progress === "number" && progress < 100) {
          // Show progress percentage
          return (
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="rounded-full bg-blue-100 p-1"
              >
                <CpuChipIcon className="h-4 w-4 text-blue-500" />
              </motion.div>
              <div className="absolute -top-1 -right-1 text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {progress}%
              </div>
            </div>
          );
        }
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
    type: EnhancedWorkflowStep["type"],
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

  // Format time in ms to readable format
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  // Calculate step duration
  const getStepDuration = (step: EnhancedWorkflowStep): string | null => {
    if (step.startTime && step.endTime) {
      return formatTime(step.endTime - step.startTime);
    }
    if (step.startTime && step.status === "active") {
      return formatTime(Date.now() - step.startTime);
    }
    return null;
  };

  // Get active step
  const getActiveStep = () => {
    return steps.find((step) => step.status === "active");
  };

  return (
    <div
      className={cn("rounded-lg border border-slate-200 bg-white", className)}
    >
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-1 text-purple-500" />
            AI Workflow
          </h3>
          <p className="text-xs text-gray-500">
            {isRunning
              ? isPaused
                ? "Workflow paused"
                : "AI workflow running..."
              : "Automated campaign creation workflow"}
          </p>
        </div>

        {/* Top controls */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={() => setShowFormState(!showFormState)}
                >
                  {showFormState ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showFormState ? "Hide form state" : "Show form state"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Show current form state */}
      <AnimatePresence>
        {showFormState && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-medium text-slate-700">
                  Current Form State
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => setShowFormState(false)}
                >
                  <XMarkIcon className="h-3 w-3" />
                </Button>
              </div>
              <div className="bg-white rounded border border-slate-200 p-2 text-xs font-mono overflow-auto max-h-24">
                <pre className="text-xs">
                  {JSON.stringify(currentFormState, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow steps */}
      <div className="p-3 space-y-0.5 max-h-[400px] overflow-y-auto">
        {steps.map((step, index) => {
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";
          const hasError = step.status === "error";
          const duration = getStepDuration(step);

          return (
            <div
              key={step.id}
              ref={isActive ? activeStepRef : null}
              className={cn(
                "rounded-md transition-all duration-200 overflow-hidden",
                isActive && "bg-blue-50 border-blue-100 shadow-sm",
                hasError && "bg-red-50",
                isCompleted && "bg-white",
                expandedStep === step.id ? "mb-2" : "mb-1"
              )}
            >
              {/* Step header */}
              <div
                onClick={() => handleStepClick(step.id)}
                className={cn(
                  "flex items-start p-2 cursor-pointer hover:bg-slate-50",
                  isActive && "hover:bg-blue-100",
                  hasError && "hover:bg-red-100"
                )}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-8 bottom-0 w-px bg-slate-200 h-6" />
                )}

                {/* Step icon */}
                <div className="flex-shrink-0 mr-3 mt-0.5 relative">
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
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium flex items-center">
                        {step.title}
                        {duration && (
                          <span className="ml-2 text-xs text-gray-500 font-normal">
                            ({duration})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {step.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="flex-shrink-0 ml-2 mt-1">
                      {getStatusIcon(step.status, step.progress)}
                    </div>
                  </div>

                  {/* Step controls - only shown when step is active or has error */}
                  {!readOnly && (isActive || hasError) && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {step.isSkippable && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepSkip?.(step.id);
                          }}
                        >
                          <ArrowRightIcon className="h-3 w-3 mr-1" />
                          Skip
                        </Button>
                      )}

                      {step.isEditable && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(step.id, step);
                          }}
                        >
                          <PencilIcon className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}

                      {hasError && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepRetry?.(step.id);
                          }}
                        >
                          <ArrowPathIcon className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}

                      {isActive && !isPaused && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPauseWorkflow?.();
                          }}
                        >
                          <PauseIcon className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}

                      {isActive && isPaused && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResumeWorkflow?.();
                          }}
                        >
                          <PlayIcon className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}

                      {(isActive || hasError) && (
                        <Button
                          variant="outline"
                          size="xs"
                          className="h-6 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStepCancel?.(step.id);
                          }}
                        >
                          <XMarkIcon className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded step details */}
              <AnimatePresence>
                {expandedStep === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 text-xs">
                      {/* Step details accordion controls */}
                      <div className="flex flex-wrap gap-1 mb-2 mt-1">
                        {step.aiActions && step.aiActions.length > 0 && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-6 text-xs"
                            onClick={() => toggleActions(step.id)}
                          >
                            {showActions[step.id] ? (
                              <EyeSlashIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <EyeIcon className="h-3 w-3 mr-1" />
                            )}
                            {showActions[step.id]
                              ? "Hide Actions"
                              : "Show Actions"}
                          </Button>
                        )}

                        {step.params && Object.keys(step.params).length > 0 && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-6 text-xs"
                            onClick={() => toggleParams(step.id)}
                          >
                            {showParams[step.id] ? (
                              <EyeSlashIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <AdjustmentsHorizontalIcon className="h-3 w-3 mr-1" />
                            )}
                            {showParams[step.id]
                              ? "Hide Params"
                              : "Show Params"}
                          </Button>
                        )}

                        {step.output && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="h-6 text-xs"
                            onClick={() => toggleOutput(step.id)}
                          >
                            {showOutput[step.id] ? (
                              <EyeSlashIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <DocumentTextIcon className="h-3 w-3 mr-1" />
                            )}
                            {showOutput[step.id]
                              ? "Hide Output"
                              : "Show Output"}
                          </Button>
                        )}
                      </div>

                      {/* Step description */}
                      <div className="mb-2">
                        <p className="text-gray-600">{step.description}</p>
                      </div>

                      {/* Step error */}
                      {step.error && (
                        <div className="my-2 p-2 bg-red-50 border border-red-100 rounded text-red-600">
                          <div className="font-medium flex items-center">
                            <XMarkIcon className="h-3 w-3 mr-1" />
                            Error: {step.error.code || "Processing failed"}
                          </div>
                          <p>{step.error.message}</p>
                          {step.error.recoverable && (
                            <div className="mt-1 text-xs">
                              This error is recoverable. You can retry or skip
                              this step.
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Actions */}
                      <AnimatePresence>
                        {showActions[step.id] &&
                          step.aiActions &&
                          step.aiActions.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="my-2 border border-gray-100 rounded-md bg-gray-50 p-2">
                                <h5 className="font-medium mb-1 flex items-center">
                                  <CpuChipIcon className="h-3 w-3 mr-1 text-purple-500" />
                                  AI Actions
                                </h5>
                                <div className="space-y-1">
                                  {step.aiActions.map((action) => (
                                    <div
                                      key={action.id}
                                      className="flex items-start text-xs"
                                    >
                                      <div className="w-10 flex-shrink-0 text-gray-400">
                                        {new Date(
                                          action.timestamp
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                          hour12: false,
                                        })}
                                      </div>
                                      <div className="flex-1">
                                        {action.description}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>

                      {/* Step Parameters */}
                      <AnimatePresence>
                        {showParams[step.id] &&
                          step.params &&
                          Object.keys(step.params).length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="my-2 border border-gray-100 rounded-md bg-gray-50 p-2">
                                <h5 className="font-medium mb-1 flex items-center">
                                  <AdjustmentsHorizontalIcon className="h-3 w-3 mr-1 text-gray-500" />
                                  Parameters
                                </h5>
                                <div className="space-y-1">
                                  {Object.entries(step.params).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-start text-xs"
                                      >
                                        <div className="w-1/3 flex-shrink-0 text-gray-600 font-medium">
                                          {key}:
                                        </div>
                                        <div className="flex-1 break-all">
                                          {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value)}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                      </AnimatePresence>

                      {/* Step Output */}
                      <AnimatePresence>
                        {showOutput[step.id] && step.output && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="my-2 border border-gray-100 rounded-md bg-gray-50 p-2">
                              <h5 className="font-medium mb-1 flex items-center">
                                <DocumentTextIcon className="h-3 w-3 mr-1 text-gray-500" />
                                Output
                                {step.output.metadata?.confidence && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-[10px] h-4"
                                  >
                                    {(
                                      step.output.metadata.confidence * 100
                                    ).toFixed(0)}
                                    % confidence
                                  </Badge>
                                )}
                              </h5>
                              <div className="bg-white rounded border border-gray-200 p-2 overflow-auto max-h-32">
                                <pre className="text-xs whitespace-pre-wrap break-words">
                                  {JSON.stringify(step.output.data, null, 2)}
                                </pre>
                              </div>

                              {/* Alternative outputs */}
                              {step.output.metadata?.alternatives &&
                                step.output.metadata.alternatives.length >
                                  0 && (
                                  <div className="mt-2">
                                    <h6 className="text-xs font-medium mb-1 flex items-center">
                                      <InformationCircleIcon className="h-3 w-3 mr-1" />
                                      Alternative Results
                                    </h6>
                                    <div className="space-y-1">
                                      {step.output.metadata.alternatives.map(
                                        (alt, i) => (
                                          <div
                                            key={i}
                                            className="flex text-xs items-start"
                                          >
                                            <div className="w-1/4 flex-shrink-0">
                                              <Badge
                                                variant="outline"
                                                className="text-[10px]"
                                              >
                                                {(alt.confidence * 100).toFixed(
                                                  0
                                                )}
                                                %
                                              </Badge>
                                            </div>
                                            <div className="flex-1">
                                              <strong>{alt.key}:</strong>{" "}
                                              {typeof alt.value === "object"
                                                ? JSON.stringify(alt.value)
                                                : String(alt.value)}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Edit Step Parameter Dialog */}
      <Dialog
        open={editingStep !== null}
        onOpenChange={(open) => !open && setEditingStep(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Step Parameters</DialogTitle>
            <DialogDescription>
              Customize the parameters for this workflow step.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            {editingStep &&
              Object.entries(editingParams).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key} className="text-xs capitalize">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Label>

                  {typeof value === "boolean" ? (
                    <Select
                      value={value ? "true" : "false"}
                      onValueChange={(val) =>
                        setEditingParams({
                          ...editingParams,
                          [key]: val === "true",
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : typeof value === "number" ? (
                    <Input
                      id={key}
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setEditingParams({
                          ...editingParams,
                          [key]: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : typeof value === "string" && value.length > 50 ? (
                    <Textarea
                      id={key}
                      value={value}
                      onChange={(e) =>
                        setEditingParams({
                          ...editingParams,
                          [key]: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={key}
                      value={
                        typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)
                      }
                      onChange={(e) =>
                        setEditingParams({
                          ...editingParams,
                          [key]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStep(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow controls */}
      <div className="mt-2 mx-2 mb-2 space-y-2">
        {!isRunning ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onRunWorkflow}
            disabled={isRunning}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Run AI Workflow
          </Button>
        ) : (
          <div className="space-y-2">
            {isPaused ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onResumeWorkflow}
              >
                <PlayIcon className="h-4 w-4 mr-1" />
                Resume Workflow
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onPauseWorkflow}
              >
                <PauseIcon className="h-4 w-4 mr-1" />
                Pause Workflow
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={onCancelWorkflow}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Cancel Workflow
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Export default workflow steps for campaign creation
export const enhancedCampaignWorkflowSteps: EnhancedWorkflowStep[] = [
  {
    id: "analyze-requirements",
    title: "Analyze Campaign Requirements",
    description: "AI analyzes user requirements to understand campaign goals",
    icon: <DocumentTextIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
    isSkippable: true,
    isEditable: true,
    params: {
      targetAudience: "General",
      businessType: "Retail",
      campaignGoals: "Awareness, Traffic",
      budget: 1000,
    },
  },
  {
    id: "generate-targeting",
    title: "Generate Audience Targeting",
    description: "Identify optimal audience segments based on campaign goals",
    icon: <UsersIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
    isSkippable: true,
    isEditable: true,
    params: {
      ageRange: "25-54",
      interests: ["Shopping", "Technology"],
      behaviors: ["Recent purchasers", "Deal seekers"],
    },
  },
  {
    id: "location-targeting",
    title: "Determine Location Targeting",
    description: "Select optimal geographic locations for the campaign",
    icon: <MapPinIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
    isSkippable: true,
    isEditable: true,
    params: {
      countries: ["United States"],
      regions: ["California", "New York", "Texas"],
      radius: 50,
    },
  },
  {
    id: "design-creative",
    title: "Design Creative Recommendations",
    description: "Generate creative direction and asset specifications",
    icon: <PaintBrushIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
    isSkippable: true,
    isEditable: true,
    params: {
      primaryColor: "#4F46E5",
      secondaryColor: "#F97316",
      toneOfVoice: "Professional, Friendly",
      imageStyle: "Lifestyle",
    },
  },
  {
    id: "generate-campaign",
    title: "Generate Campaign Configuration",
    description: "Create final campaign settings based on all analyses",
    icon: <PaperAirplaneIcon className="h-5 w-5 text-purple-500" />,
    status: "pending",
    type: "ai",
    isSkippable: false,
    isEditable: true,
    params: {
      budgetAllocation: {
        search: 40,
        display: 30,
        social: 30,
      },
      bidStrategy: "Maximize conversions",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  },
];
