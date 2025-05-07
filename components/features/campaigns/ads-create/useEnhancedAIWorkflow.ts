"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  EnhancedWorkflowStep,
  enhancedCampaignWorkflowSteps,
} from "./EnhancedAIWorkflowPanel";

export interface UseEnhancedAIWorkflowOptions {
  initialSteps?: EnhancedWorkflowStep[];
  onStepComplete?: (stepId: string, result: any) => void;
  onWorkflowComplete?: (results: Record<string, any>) => void;
  onStepError?: (stepId: string, error: any) => void;
  onFormUpdate?: (updates: Record<string, any>) => void;
}

export function useEnhancedAIWorkflow({
  initialSteps = enhancedCampaignWorkflowSteps,
  onStepComplete,
  onWorkflowComplete,
  onStepError,
  onFormUpdate,
}: UseEnhancedAIWorkflowOptions = {}) {
  const [steps, setSteps] = useState<EnhancedWorkflowStep[]>(
    initialSteps.map((step) => ({ ...step }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const [formState, setFormState] = useState<Record<string, any>>({});

  // Timer reference for step progress simulation
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the workflow
  const resetWorkflow = useCallback(() => {
    // Clear any running timers
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setSteps(
      initialSteps.map((step) => ({
        ...step,
        status: "pending",
        progress: undefined,
        aiActions: [],
        output: undefined,
        error: undefined,
      }))
    );
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepIndex(-1);
    setStepResults({});
    setIsWorkflowComplete(false);
  }, [initialSteps]);

  // Start the workflow
  const startWorkflow = useCallback(() => {
    if (isRunning) return;

    resetWorkflow();
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Update the first step to active and set start time
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === 0
          ? {
              ...step,
              status: "active",
              startTime: Date.now(),
              progress: 0,
            }
          : step
      )
    );
  }, [isRunning, resetWorkflow]);

  // Pause the workflow
  const pauseWorkflow = useCallback(() => {
    if (!isRunning || isWorkflowComplete) return;

    setIsPaused(true);

    // Clear any running progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Add a pause action to the current step
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              isPaused: true,
              aiActions: [
                ...(step.aiActions || []),
                {
                  id: `pause-${Date.now()}`,
                  description: "Workflow paused by user",
                  timestamp: Date.now(),
                },
              ],
            }
          : step
      )
    );
  }, [isRunning, isWorkflowComplete, currentStepIndex]);

  // Resume the workflow
  const resumeWorkflow = useCallback(() => {
    if (!isRunning || !isPaused || isWorkflowComplete) return;

    setIsPaused(false);

    // Add a resume action to the current step
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              isPaused: false,
              aiActions: [
                ...(step.aiActions || []),
                {
                  id: `resume-${Date.now()}`,
                  description: "Workflow resumed by user",
                  timestamp: Date.now(),
                },
              ],
            }
          : step
      )
    );

    // Restart progress simulation
    simulateStepProgress(currentStepIndex);
  }, [isRunning, isPaused, isWorkflowComplete, currentStepIndex]);

  // Cancel the workflow
  const cancelWorkflow = useCallback(() => {
    if (!isRunning) return;

    // Clear any running timers
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Update the current step with a cancellation
    if (currentStepIndex >= 0) {
      setSteps((prevSteps) =>
        prevSteps.map((step, idx) =>
          idx === currentStepIndex
            ? {
                ...step,
                status: "error",
                error: {
                  message: "Step cancelled by user",
                  code: "USER_CANCELLED",
                  recoverable: true,
                },
                aiActions: [
                  ...(step.aiActions || []),
                  {
                    id: `cancel-${Date.now()}`,
                    description: "Operation cancelled by user",
                    timestamp: Date.now(),
                  },
                ],
              }
            : step
        )
      );
    }

    setIsRunning(false);
    setIsPaused(false);
  }, [isRunning, currentStepIndex]);

  // Update a step's status
  const updateStepStatus = useCallback(
    (stepId: string, status: EnhancedWorkflowStep["status"]) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, status } : step
        )
      );
    },
    []
  );

  // Update a step's progress
  const updateStepProgress = useCallback((stepId: string, progress: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, progress } : step
      )
    );
  }, []);

  // Add an action to a step
  const addStepAction = useCallback((stepId: string, description: string) => {
    const actionId = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              aiActions: [
                ...(step.aiActions || []),
                {
                  id: actionId,
                  description,
                  timestamp: Date.now(),
                },
              ],
            }
          : step
      )
    );

    return actionId;
  }, []);

  // Edit step parameters
  const editStepParams = useCallback(
    (stepId: string, params: Record<string, any>) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                params: {
                  ...step.params,
                  ...params,
                },
                aiActions: [
                  ...(step.aiActions || []),
                  {
                    id: `edit-params-${Date.now()}`,
                    description: "Parameters updated by user",
                    timestamp: Date.now(),
                  },
                ],
              }
            : step
        )
      );
    },
    []
  );

  // Skip the current step
  const skipCurrentStep = useCallback(() => {
    if (!isRunning || currentStepIndex < 0 || currentStepIndex >= steps.length)
      return;

    // Clear any running progress interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    const currentStep = steps[currentStepIndex];

    // Mark current step as skipped (using completed status with a skip action)
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              status: "completed",
              progress: 100,
              endTime: Date.now(),
              aiActions: [
                ...(step.aiActions || []),
                {
                  id: `skip-${Date.now()}`,
                  description: "Step skipped by user",
                  timestamp: Date.now(),
                },
              ],
            }
          : step
      )
    );

    // Save a default result for the skipped step
    setStepResults((prev) => ({
      ...prev,
      [currentStep.id]: { skipped: true, timestamp: Date.now() },
    }));

    // Move to the next step
    moveToNextStep();
  }, [isRunning, currentStepIndex, steps]);

  // Retry the current step
  const retryCurrentStep = useCallback(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) return;

    const currentStep = steps[currentStepIndex];

    // Reset the current step
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === currentStepIndex
          ? {
              ...step,
              status: "active",
              progress: 0,
              error: undefined,
              startTime: Date.now(),
              endTime: undefined,
              aiActions: [
                ...(step.aiActions || []),
                {
                  id: `retry-${Date.now()}`,
                  description: "Step retried by user",
                  timestamp: Date.now(),
                },
              ],
            }
          : step
      )
    );

    // Remove any previous results for this step
    setStepResults((prev) => {
      const { [currentStep.id]: _, ...rest } = prev;
      return rest;
    });

    // Restart the workflow if it wasn't running
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    }

    // Restart progress simulation
    simulateStepProgress(currentStepIndex);
  }, [currentStepIndex, steps, isRunning]);

  // Complete the current step and move to the next
  const completeCurrentStep = useCallback(
    (result: any = {}) => {
      if (
        !isRunning ||
        currentStepIndex < 0 ||
        currentStepIndex >= steps.length
      )
        return;

      const currentStep = steps[currentStepIndex];

      // Clear any running progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // Mark current step as completed
      setSteps((prevSteps) =>
        prevSteps.map((step, idx) =>
          idx === currentStepIndex
            ? {
                ...step,
                status: "completed",
                progress: 100,
                endTime: Date.now(),
                output: {
                  data: result,
                  metadata: {
                    processingTime: step.startTime
                      ? Date.now() - step.startTime
                      : undefined,
                    confidence: Math.random() * 0.3 + 0.7, // Simulated confidence between 0.7 and 1.0
                  },
                },
                aiActions: [
                  ...(step.aiActions || []),
                  {
                    id: `complete-${Date.now()}`,
                    description: "Processing completed successfully",
                    timestamp: Date.now(),
                  },
                ],
              }
            : step
        )
      );

      // Save the step result
      const newResults = {
        ...stepResults,
        [currentStep.id]: result,
      };

      setStepResults(newResults);

      // Call the onStepComplete callback if provided
      onStepComplete?.(currentStep.id, result);

      // Apply form updates if result contains form data
      if (result.formUpdates) {
        updateFormState(result.formUpdates);
      }

      // Move to the next step
      moveToNextStep();
    },
    [isRunning, currentStepIndex, steps, stepResults, onStepComplete]
  );

  // Helper function to move to the next step
  const moveToNextStep = useCallback(() => {
    // Check if this was the last step
    if (currentStepIndex === steps.length - 1) {
      setIsRunning(false);
      setIsWorkflowComplete(true);

      // Call completion handler with all results
      onWorkflowComplete?.(stepResults);
    } else {
      // Move to the next step
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      // Update the next step to active
      setSteps((prevSteps) =>
        prevSteps.map((step, idx) =>
          idx === nextIndex
            ? {
                ...step,
                status: "active",
                startTime: Date.now(),
                progress: 0,
              }
            : step
        )
      );

      // Start progress simulation for the next step
      simulateStepProgress(nextIndex);
    }
  }, [currentStepIndex, steps.length, stepResults, onWorkflowComplete]);

  // Set a step to error state
  const setStepError = useCallback(
    (stepId: string, error: any = {}) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                status: "error",
                error: {
                  message:
                    error.message || "An error occurred during processing",
                  code: error.code,
                  recoverable: error.recoverable !== false,
                },
                aiActions: [
                  ...(step.aiActions || []),
                  {
                    id: `error-${Date.now()}`,
                    description: `Error: ${error.message || "Processing failed"}`,
                    timestamp: Date.now(),
                  },
                ],
              }
            : step
        )
      );

      onStepError?.(stepId, error);

      // Pause the workflow on error
      setIsPaused(true);

      // Clear any running progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    },
    [onStepError]
  );

  // Update form state
  const updateFormState = useCallback(
    (updates: Record<string, any>) => {
      setFormState((prev) => {
        const newState = {
          ...prev,
          ...updates,
        };

        // Notify about form updates
        onFormUpdate?.(newState);

        return newState;
      });
    },
    [onFormUpdate]
  );

  // Simulate a step's progress
  const simulateStepProgress = useCallback(
    (stepIndex: number) => {
      // Clear any existing intervals
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Don't start simulation if paused
      if (isPaused) return;

      // Initial progress is 0 (already set when marking step as active)

      // Simulate progress updates
      progressIntervalRef.current = setInterval(() => {
        setSteps((prevSteps) => {
          // Find the current step
          const step = prevSteps[stepIndex];
          if (!step || step.status !== "active") {
            // Stop interval if step is no longer active
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return prevSteps;
          }

          // Calculate new progress
          const currentProgress = step.progress || 0;
          const increment = Math.random() * 5 + 1; // Random increment between 1-6%
          const newProgress = Math.min(95, currentProgress + increment); // Cap at 95%

          // Add action at certain milestones
          let newActions = [...(step.aiActions || [])];

          if (currentProgress < 25 && newProgress >= 25) {
            newActions.push({
              id: `progress-25-${Date.now()}`,
              description: "25% complete: Gathering data...",
              timestamp: Date.now(),
            });
          } else if (currentProgress < 50 && newProgress >= 50) {
            newActions.push({
              id: `progress-50-${Date.now()}`,
              description: "50% complete: Processing information...",
              timestamp: Date.now(),
            });
          } else if (currentProgress < 75 && newProgress >= 75) {
            newActions.push({
              id: `progress-75-${Date.now()}`,
              description: "75% complete: Finalizing results...",
              timestamp: Date.now(),
            });
          }

          return prevSteps.map((s, idx) =>
            idx === stepIndex
              ? { ...s, progress: newProgress, aiActions: newActions }
              : s
          );
        });
      }, 500);

      // Simulate step completion after random duration (unless it's paused/cancelled)
      const stepDuration = Math.floor(Math.random() * 3000) + 5000; // 5-8 seconds

      progressTimerRef.current = setTimeout(() => {
        // Check if still running and not paused
        if (isRunning && !isPaused) {
          // Generate a result based on step ID
          const step = steps[stepIndex];
          let result: Record<string, any> = {};

          switch (step.id) {
            case "analyze-requirements":
              result = {
                audienceSize: Math.floor(Math.random() * 100000) + 50000,
                businessType: step.params?.businessType || "Retail",
                campaignGoals:
                  step.params?.campaignGoals || "Awareness, Traffic",
                recommendedChannels: ["Display", "Social", "Search"],
                formUpdates: {
                  campaignName: "Q2 Summer Promotion",
                  campaignDescription:
                    "Summer promotional campaign targeting existing customers",
                  campaignWeight: "medium",
                },
              };
              break;

            case "generate-targeting":
              result = {
                demographics: {
                  ageGroups: ["25-34", "35-44"],
                  income: ["middle", "upper-middle"],
                  education: ["college", "graduate"],
                },
                interests: ["Shopping", "Technology", "Travel"],
                behaviors: [
                  "Recent purchasers",
                  "Brand loyalists",
                  "Deal seekers",
                ],
                formUpdates: {
                  targetAudience:
                    "Young professionals and established families",
                  interestCategories: ["Shopping", "Technology", "Travel"],
                },
              };
              break;

            case "location-targeting":
              result = {
                recommendedRegions: [
                  "California",
                  "New York",
                  "Texas",
                  "Florida",
                ],
                demographicMatch: 87,
                reachEstimate: 2.4,
                formUpdates: {
                  locations: [
                    { type: "state", value: "California" },
                    { type: "state", value: "New York" },
                    { type: "state", value: "Texas" },
                  ],
                },
              };
              break;

            case "design-creative":
              result = {
                recommendedColors: {
                  primary: "#4F46E5",
                  secondary: "#F97316",
                  accent: "#06B6D4",
                },
                imageStyles: ["Lifestyle", "Product-focused"],
                copyTone: "Professional with friendly approach",
                callToAction: "Shop Now",
                formUpdates: {
                  mediaTypes: ["Display Banner", "Social Media"],
                },
              };
              break;

            case "generate-campaign":
              result = {
                budgetAllocation: {
                  search: 40,
                  display: 30,
                  social: 30,
                },
                schedulingRecommendation: {
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                  dayparting: ["Evenings", "Weekends"],
                },
                projectedMetrics: {
                  impressions: 1200000,
                  clicks: 24000,
                  conversions: 960,
                },
                formUpdates: {
                  budget: "5000",
                  startDate: new Date(),
                  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
              };
              break;

            default:
              result = {
                status: "completed",
                timestamp: Date.now(),
              };
          }

          // Complete the step with the result
          completeCurrentStep(result);
        }
      }, stepDuration);
    },
    [steps, isRunning, isPaused, completeCurrentStep]
  );

  // Simulate the workflow progress (for demo purposes)
  const simulateWorkflowProgress = useCallback(() => {
    startWorkflow();
  }, [startWorkflow]);

  // Get a specific step by ID
  const getStepById = useCallback(
    (stepId: string) => {
      return steps.find((step) => step.id === stepId);
    },
    [steps]
  );

  // Get the current active step
  const getCurrentStep = useCallback(() => {
    return currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;
  }, [currentStepIndex, steps]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
    };
  }, []);

  return {
    steps,
    isRunning,
    isPaused,
    currentStepIndex,
    stepResults,
    isWorkflowComplete,
    formState,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    resetWorkflow,
    completeCurrentStep,
    updateStepStatus,
    updateStepProgress,
    addStepAction,
    editStepParams,
    skipCurrentStep,
    retryCurrentStep,
    setStepError,
    updateFormState,
    getStepById,
    getCurrentStep,
    simulateWorkflowProgress,
  };
}
