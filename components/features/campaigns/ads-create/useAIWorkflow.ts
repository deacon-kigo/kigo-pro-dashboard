"use client";

import { useState, useCallback, useEffect } from "react";
import { WorkflowStep, defaultCampaignWorkflowSteps } from "./AIWorkflowUI";

export interface UseAIWorkflowOptions {
  initialSteps?: WorkflowStep[];
  onStepComplete?: (stepId: string, result: any) => void;
  onWorkflowComplete?: (results: Record<string, any>) => void;
}

export function useAIWorkflow({
  initialSteps = defaultCampaignWorkflowSteps,
  onStepComplete,
  onWorkflowComplete,
}: UseAIWorkflowOptions = {}) {
  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialSteps.map((step) => ({ ...step }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [stepResults, setStepResults] = useState<Record<string, any>>({});
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);

  // Reset the workflow
  const resetWorkflow = useCallback(() => {
    setSteps(initialSteps.map((step) => ({ ...step, status: "pending" })));
    setIsRunning(false);
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

    // Update the first step to active
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) =>
        idx === 0 ? { ...step, status: "active" } : step
      )
    );
  }, [isRunning, resetWorkflow]);

  // Update a step's status
  const updateStepStatus = useCallback(
    (stepId: string, status: WorkflowStep["status"]) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === stepId ? { ...step, status } : step
        )
      );
    },
    []
  );

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

      // Mark current step as completed
      updateStepStatus(currentStep.id, "completed");

      // Save the step result
      setStepResults((prev) => ({
        ...prev,
        [currentStep.id]: result,
      }));

      // Call the onStepComplete callback if provided
      onStepComplete?.(currentStep.id, result);

      // Check if this was the last step
      if (currentStepIndex === steps.length - 1) {
        setIsRunning(false);
        setIsWorkflowComplete(true);
        onWorkflowComplete?.(stepResults);
      } else {
        // Move to the next step
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);

        // Update the next step to active
        updateStepStatus(steps[nextIndex].id, "active");
      }
    },
    [
      isRunning,
      currentStepIndex,
      steps,
      updateStepStatus,
      stepResults,
      onStepComplete,
      onWorkflowComplete,
    ]
  );

  // Simulate the workflow progress (for demo purposes)
  const simulateWorkflowProgress = useCallback(() => {
    startWorkflow();

    // Simulate completion of each step with delays
    const stepDelays = [2000, 3000, 2500, 3500, 2000];

    stepDelays.forEach((delay, index) => {
      setTimeout(
        () => {
          if (index < steps.length) {
            completeCurrentStep({
              simulatedResult: `Result from step ${index + 1}`,
            });
          }
        },
        stepDelays.slice(0, index).reduce((sum, d) => sum + d, 0)
      );
    });
  }, [startWorkflow, completeCurrentStep, steps.length]);

  // Set a step to error state
  const setStepError = useCallback(
    (stepId: string, error: any = {}) => {
      updateStepStatus(stepId, "error");
      setIsRunning(false);
    },
    [updateStepStatus]
  );

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

  return {
    steps,
    isRunning,
    currentStepIndex,
    stepResults,
    isWorkflowComplete,
    startWorkflow,
    resetWorkflow,
    completeCurrentStep,
    updateStepStatus,
    setStepError,
    getStepById,
    getCurrentStep,
    simulateWorkflowProgress,
  };
}

export default useAIWorkflow;
