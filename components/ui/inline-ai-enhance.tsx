"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SparklesIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ShineBorder } from "@/components/ui/shine-border";
import { useCopilotAction, useCopilotReadable } from "@/lib/copilot-stubs";

interface InlineAIEnhanceProps {
  /**
   * The field name to enhance (e.g., "offerName", "description")
   */
  fieldName: string;

  /**
   * Label to display (e.g., "Brand Narrative", "Offer Description")
   */
  label: string;

  /**
   * Context data for AI generation
   */
  context: Record<string, any>;

  /**
   * Prompt template for AI generation
   */
  promptTemplate: string;

  /**
   * Auto-generate on context change
   */
  autoGenerate?: boolean;

  /**
   * Callback when content is generated
   */
  onGenerated?: (content: string) => void;
}

/**
 * Substitute variables in prompt template
 */
function substituteVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || "");
  });
  return result;
}

/**
 * Inline AI Enhancement Component
 *
 * Always-visible text area that displays AI-generated content.
 * Auto-generates live as users fill in form fields.
 */
export function InlineAIEnhance({
  fieldName,
  label,
  context,
  promptTemplate,
  autoGenerate = true,
  onGenerated,
}: InlineAIEnhanceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [displayedContent, setDisplayedContent] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [localValue, setLocalValue] = useState<string>(""); // For immediate UI updates
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const previousContextRef = useRef<string>("");
  const actionNameRef = useRef(`generate_${fieldName}_${Date.now()}`);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Make context readable to CopilotKit
  useCopilotReadable({
    description: `Context for ${label} generation`,
    value: context,
  });

  // Register CopilotKit action for AI generation
  useCopilotAction({
    name: actionNameRef.current,
    description: `Generate ${label} based on offer context`,
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Name of the merchant/brand",
        required: false,
      },
      {
        name: "offerType",
        type: "string",
        description: "Type of offer",
        required: false,
      },
      {
        name: "offerTitle",
        type: "string",
        description: "Title of the offer",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "Offer description",
        required: false,
      },
    ],
    handler: async ({ merchantName, offerType, offerTitle, description }) => {
      // This handler returns the prompt for the LLM
      const prompt = substituteVariables(promptTemplate, {
        merchantName: merchantName || "",
        offerType: offerType || "",
        offerTitle: offerTitle || "",
        description: description || "",
      });

      return prompt;
    },
  });

  // Sync localValue with editedContent when content is generated
  useEffect(() => {
    setLocalValue(editedContent);
  }, [editedContent]);

  // Streaming effect - character by character display
  useEffect(() => {
    if (!generatedContent || displayedContent === generatedContent) return;

    const timer = setTimeout(() => {
      setDisplayedContent(
        generatedContent.slice(0, displayedContent.length + 3)
      );
    }, 15); // 15ms per 3 characters for smooth streaming

    return () => clearTimeout(timer);
  }, [generatedContent, displayedContent]);

  // Auto-generate when context changes (debounced)
  useEffect(() => {
    if (!autoGenerate || !context || Object.keys(context).length === 0) return;

    const contextString = JSON.stringify(context);
    if (contextString === previousContextRef.current) return;

    // Check if we have enough context
    const hasEnoughContext =
      context.merchantName && (context.offerTitle || context.description);
    if (!hasEnoughContext) return;

    const timer = setTimeout(() => {
      setShouldGenerate(true);
      previousContextRef.current = contextString;
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [JSON.stringify(context), autoGenerate]);

  // Trigger generation when shouldGenerate flag is set
  useEffect(() => {
    if (shouldGenerate) {
      handleGenerate();
      setShouldGenerate(false);
    }
  }, [shouldGenerate]);

  // Debounced handler for textarea changes (fixes INP performance issue)
  const handleTextareaChange = (value: string) => {
    // Update local value immediately for responsive UI
    setLocalValue(value);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state update to avoid blocking main thread
    debounceTimerRef.current = setTimeout(() => {
      setEditedContent(value);
    }, 150); // 150ms debounce - balances responsiveness and performance
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleGenerate = async () => {
    // Check if we have enough context
    const hasEnoughContext =
      context.merchantName && (context.offerTitle || context.description);
    if (!hasEnoughContext) {
      const message =
        "Fill in merchant name and offer details above to generate AI content...";
      setGeneratedContent(message);
      setDisplayedContent(message);
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");
    setDisplayedContent("");

    try {
      // Simulate LLM response for now
      // In production, this would be triggered via CopilotKit's chat interface
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Build the prompt with substituted variables
      const prompt = substituteVariables(promptTemplate, {
        merchantName: context.merchantName || "",
        offerType: context.offerType || "",
        offerTitle: context.offerTitle || "",
        description: context.description || "",
      });

      // For now, generate a mock response
      // TODO: Integrate with actual CopilotKit LLM response
      const mockResponse = generateMockResponse(label, context);

      setGeneratedContent(mockResponse);
      setEditedContent(mockResponse); // Initialize editable content
      onGenerated?.(mockResponse);
    } catch (error) {
      console.error("AI generation error:", error);
      const errorMsg =
        "Error generating AI content. Please try again or check your CopilotKit configuration.";
      setGeneratedContent(errorMsg);
      setDisplayedContent(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="mt-3 rounded-lg border border-blue-100 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #EFF6FF, #F0F9FF)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-100/50">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4" style={{ color: "#328FE5" }} />
          <span className="text-sm font-medium" style={{ color: "#1E3A8A" }}>
            {label}
          </span>
          {isGenerating && (
            <span
              className="text-xs animate-pulse"
              style={{ color: "#328FE5" }}
            >
              Generating...
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="h-7 px-2 text-xs"
          style={{ color: "#64748B" }}
          title="Regenerate AI content"
        >
          <ArrowPathIcon
            className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {isGenerating && !displayedContent ? (
          <div className="space-y-2">
            <Skeleton
              className="h-3 w-full"
              style={{ backgroundColor: "#DBEAFE" }}
            />
            <Skeleton
              className="h-3 w-5/6"
              style={{ backgroundColor: "#DBEAFE" }}
            />
            <Skeleton
              className="h-3 w-4/6"
              style={{ backgroundColor: "#DBEAFE" }}
            />
          </div>
        ) : displayedContent ? (
          <div className="space-y-3">
            <ShineBorder
              isActive={displayedContent && !isGenerating}
              simulateLoading={false}
              borderWidth={2}
            >
              <Textarea
                value={localValue}
                onChange={(e) => handleTextareaChange(e.target.value)}
                className="min-h-[80px] text-sm bg-white resize-none border-blue-200 focus:border-blue-400 focus:ring-1"
                style={{
                  borderColor: "#BFDBFE",
                  color: "#1F2937",
                }}
                placeholder="AI-generated content will appear here..."
              />
            </ShineBorder>

            {/* Apply Button */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs" style={{ color: "#64748B" }}>
                🤖 AI-enhanced • Edit and apply to form
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => onGenerated?.(editedContent)}
                className="text-xs"
              >
                <CheckIcon className="h-3.5 w-3.5 mr-1" />
                Apply to Form
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="min-h-[60px] text-sm italic flex items-center justify-center border border-dashed rounded-md"
            style={{ borderColor: "#BFDBFE", color: "#9CA3AF" }}
          >
            AI-generated content will appear here as you fill in the form
            above...
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Generate mock AI response based on context
 * This simulates what the LLM would return
 */
function generateMockResponse(label: string, context: any): string {
  const { merchantName, offerType, offerTitle, description } = context;

  if (label === "Brand Narrative") {
    return `${merchantName} is a leading provider in the industry, known for exceptional quality and customer service. With their exclusive ${offerTitle} promotion, they continue to demonstrate their commitment to delivering outstanding value to customers while maintaining the highest standards of excellence.`;
  }

  if (label === "Offer Narrative") {
    return `Experience the incredible value of ${offerTitle} at ${merchantName}. This exclusive offer provides customers with exceptional savings while enjoying premium ${offerType === "percent_off" ? "percentage-based" : ""} benefits. Don't miss this limited-time opportunity to save big on quality products and services.`;
  }

  if (label === "AI-Suggested Categories") {
    return "food & dining,retail,services,entertainment";
  }

  if (label === "AI-Suggested Keywords") {
    return `${merchantName?.toLowerCase()},${offerType},discount,savings,deal,promotion,exclusive,limited time`;
  }

  return `AI-generated ${label.toLowerCase()} for ${merchantName}: ${description}`;
}
