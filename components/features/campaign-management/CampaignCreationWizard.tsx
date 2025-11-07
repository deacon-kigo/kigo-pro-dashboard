"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast";
import {
  DocumentTextIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  RectangleGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog/AlertDialog";
import BasicInfoStep from "./steps/BasicInfoStep";
import ConfigurationStep from "./steps/ConfigurationStep";
import ReviewStep from "./steps/ReviewStep";

/**
 * Campaign Creation Wizard
 *
 * Multi-step wizard for creating campaigns following the BRD
 * Steps: Basic Info → Configuration → Review
 */

export default function CampaignCreationWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<
    "basic" | "configuration" | "review"
  >("basic");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form data based on CampaignManagement interface
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    name: "",
    partner_id: "",
    partner_name: "",
    program_id: "",
    program_name: "",
    type: "promotional" as "promotional" | "targeted" | "seasonal",
    description: "",

    // Configuration (Step 2)
    start_date: "",
    end_date: "",
    active: true,
    auto_activate: false,
    auto_deactivate: false,
  });

  const handleBackToDashboard = () => {
    router.push("/campaign-management");
  };

  const handleFormUpdate = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    // Navigate to next step
    if (currentStep === "basic") {
      setCurrentStep("configuration");
    } else if (currentStep === "configuration") {
      setCurrentStep("review");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "review") {
      setCurrentStep("configuration");
    } else if (currentStep === "configuration") {
      setCurrentStep("basic");
    }
  };

  const handleSubmitClick = () => {
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmedCreate = async () => {
    setShowConfirmDialog(false);
    setIsCreating(true);

    try {
      // TODO: Replace with actual API call
      console.log("Campaign Created:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast({
        title: formData.active
          ? "🎯 Campaign Created & Activated"
          : "🎯 Campaign Created",
        description: `Campaign "${formData.name}" has been successfully created${formData.active ? " and is now active" : ""}`,
        className: "!bg-green-100 !border-green-300 !text-green-800",
      });

      // Encode campaign data to pass to list page
      const newCampaignData = encodeURIComponent(
        JSON.stringify({
          id: Date.now().toString(), // Temporary ID
          ...formData,
          status: formData.active ? "active" : "draft",
          has_products: false,
          created_at: new Date().toISOString(),
        })
      );

      // Navigate with success parameter after a brief delay
      setTimeout(() => {
        router.push(
          `/campaign-management?success=created&newCampaign=${newCampaignData}`
        );
      }, 1000);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const stepConfig = [
    {
      id: "basic",
      number: 1,
      label: "Details",
      icon: DocumentTextIcon,
      description: "Identity & location",
    },
    {
      id: "configuration",
      number: 2,
      label: "Schedule",
      icon: Cog6ToothIcon,
      description: "Dates & activation",
    },
    {
      id: "review",
      number: 3,
      label: "Review",
      icon: CheckCircleIcon,
      description: "Confirm & create",
    },
  ];

  const currentStepNumber =
    stepConfig.find((s) => s.id === currentStep)?.number || 1;

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex">
        {/* Vertical Stepper */}
        <div className="w-20 flex-shrink-0">
          <div className="h-full bg-white rounded-l-lg border border-r-0 border-gray-200 shadow-sm py-6 px-3">
            <Stepper
              orientation="vertical"
              value={currentStepNumber}
              onValueChange={(step) => {
                const stepId = stepConfig.find((s) => s.number === step)?.id;
                if (stepId) setCurrentStep(stepId as any);
              }}
              className="gap-4"
            >
              {stepConfig.map((step) => (
                <StepperItem
                  key={step.id}
                  step={step.number}
                  completed={completedSteps.includes(step.id)}
                >
                  <StepperTrigger className="flex flex-col items-center gap-2 w-full">
                    <StepperIndicator />
                    <StepperTitle className="text-xs text-center">
                      {step.label}
                    </StepperTitle>
                  </StepperTrigger>
                  {step.number < stepConfig.length && <StepperSeparator />}
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="h-full">
            <div className="w-full h-full flex flex-col">
              <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md rounded-l-none">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
                  <div className="flex items-center">
                    <RectangleGroupIcon className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <h3 className="font-medium">
                        {currentStep === "basic" && "Campaign Details"}
                        {currentStep === "configuration" &&
                          "Schedule & Activation"}
                        {currentStep === "review" && "Review & Create"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentStep === "basic" &&
                          "Define your campaign identity and location"}
                        {currentStep === "configuration" &&
                          "Set campaign schedule and automation"}
                        {currentStep === "review" &&
                          "Review and create campaign"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {currentStep === "basic" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToDashboard}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                      >
                        ← Previous
                      </Button>
                    )}
                    {currentStep === "review" ? (
                      <Button
                        className="flex items-center gap-1"
                        size="sm"
                        onClick={handleSubmitClick}
                        disabled={isCreating}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        {isCreating ? "Creating..." : "Create Campaign"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        Next Step →
                      </Button>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-auto">
                  <div className="p-6">
                    {currentStep === "basic" && (
                      <BasicInfoStep
                        formData={formData}
                        onUpdate={handleFormUpdate}
                        onNext={handleNext}
                      />
                    )}
                    {currentStep === "configuration" && (
                      <ConfigurationStep
                        formData={formData}
                        onUpdate={handleFormUpdate}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                      />
                    )}
                    {currentStep === "review" && (
                      <ReviewStep
                        formData={formData}
                        onSubmit={handleSubmitClick}
                        onPrevious={handlePrevious}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Campaign Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create the campaign "{formData.name}"?
              {formData.active
                ? " The campaign will be activated immediately."
                : " The campaign will be created in draft status."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedCreate}>
              Create Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
