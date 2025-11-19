"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StreamingText } from "@/components/ui/streaming-text";
import {
  SparklesIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";

export interface AIEnhancement {
  id: string;
  label: string;
  description?: string;
  autoPopulate?: string; // Field name to auto-populate in parent form
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AIEnhancementResult {
  id: string;
  content: string;
  confidence?: number;
}

interface AIContentEnhancerProps {
  // Context inputs for AI generation
  context: Record<string, any>;

  // Enhancements to generate
  enhancements: AIEnhancement[];

  // Callback when AI generates content
  onGenerated?: (results: AIEnhancementResult[]) => void;

  // Callback when user applies an enhancement
  onApply?: (enhancementId: string, content: string) => void;

  // Custom generation function (if not using default)
  generateFunction?: (
    context: Record<string, any>,
    enhancementId: string
  ) => Promise<string>;

  // Auto-generate when context changes
  autoGenerate?: boolean;

  // Streaming enabled
  streaming?: boolean;

  // Custom className
  className?: string;
}

export function AIContentEnhancer({
  context,
  enhancements,
  onGenerated,
  onApply,
  generateFunction,
  autoGenerate = true,
  streaming = true,
  className = "",
}: AIContentEnhancerProps) {
  const [generatedContent, setGeneratedContent] = useState<
    Record<string, string>
  >({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [appliedEnhancements, setAppliedEnhancements] = useState<Set<string>>(
    new Set()
  );
  const [editableContent, setEditableContent] = useState<
    Record<string, string>
  >({});

  // Auto-generate when context changes
  useEffect(() => {
    if (autoGenerate && Object.keys(context).length > 0) {
      // Debounce to avoid excessive generation
      const timer = setTimeout(() => {
        handleGenerateAll();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [context, autoGenerate]);

  const handleGenerate = async (enhancementId: string) => {
    setIsGenerating((prev) => ({ ...prev, [enhancementId]: true }));

    try {
      let content: string;

      if (generateFunction) {
        content = await generateFunction(context, enhancementId);
      } else {
        // Default mock generation (replace with actual AI call)
        content = await mockGenerate(enhancementId, context);
      }

      setGeneratedContent((prev) => ({ ...prev, [enhancementId]: content }));
      setEditableContent((prev) => ({ ...prev, [enhancementId]: content }));
    } catch (error) {
      console.error(`Error generating ${enhancementId}:`, error);
    } finally {
      setIsGenerating((prev) => ({ ...prev, [enhancementId]: false }));
    }
  };

  const handleGenerateAll = () => {
    enhancements.forEach((enhancement) => {
      handleGenerate(enhancement.id);
    });
  };

  const handleApply = (enhancementId: string) => {
    const content =
      editableContent[enhancementId] || generatedContent[enhancementId];

    if (onApply) {
      onApply(enhancementId, content);
    }

    setAppliedEnhancements((prev) => new Set(prev).add(enhancementId));

    // Auto-populate if specified
    const enhancement = enhancements.find((e) => e.id === enhancementId);
    if (enhancement?.autoPopulate && onGenerated) {
      onGenerated([{ id: enhancementId, content }]);
    }
  };

  const handleEdit = (enhancementId: string, newContent: string) => {
    setEditableContent((prev) => ({ ...prev, [enhancementId]: newContent }));
  };

  // Mock generation function (replace with actual AI)
  const mockGenerate = async (
    enhancementId: string,
    ctx: Record<string, any>
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const templates: Record<string, string> = {
      brand_narrative: `${ctx.merchantName || "This brand"} delivers exceptional value through ${ctx.offerType || "innovative offerings"}. ${ctx.description || "Experience quality and service that exceeds expectations."}.`,
      merchant_narrative: `As a trusted leader in the industry, ${ctx.merchantName || "our merchant"} combines expertise with customer-first values to create memorable experiences.`,
      offer_narrative: `${ctx.description || "This exclusive offer"} provides outstanding value for ${ctx.merchantName || "our"} customers. Don't miss this limited-time opportunity.`,
      categories: `retail,shopping,lifestyle,${ctx.offerType?.toLowerCase() || "deals"}`,
      keywords: `${ctx.merchantName?.toLowerCase() || "merchant"},${ctx.offerType?.toLowerCase() || "offer"},discount,savings,deal`,
    };

    return templates[enhancementId] || "Generated content";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-700 flex items-center">
          <SparklesIcon className="h-4 w-4 mr-1.5 text-primary" />
          AI Content Enhancement
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateAll}
          disabled={Object.values(isGenerating).some((v) => v)}
          className="text-xs"
        >
          <ArrowPathIcon className="h-3 w-3 mr-1" />
          Regenerate All
        </Button>
      </div>

      {enhancements.map((enhancement) => {
        const isGeneratingThis = isGenerating[enhancement.id];
        const content = generatedContent[enhancement.id];
        const editContent = editableContent[enhancement.id] || content;
        const isApplied = appliedEnhancements.has(enhancement.id);

        return (
          <Card key={enhancement.id} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-medium text-slate-800">
                    {enhancement.label}
                  </h5>
                  {isApplied && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Applied
                    </Badge>
                  )}
                </div>
                {enhancement.description && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {enhancement.description}
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isGeneratingThis && !content && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}

            {/* Generated Content */}
            {content && (
              <div className="space-y-2">
                {streaming && isGeneratingThis ? (
                  <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded border">
                    <StreamingText
                      text={content}
                      speed={20}
                      showCursor={true}
                    />
                  </div>
                ) : (
                  <Textarea
                    value={editContent}
                    onChange={(e) => handleEdit(enhancement.id, e.target.value)}
                    className="text-sm min-h-[80px] bg-slate-50"
                    placeholder="AI-generated content will appear here..."
                  />
                )}

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerate(enhancement.id)}
                    disabled={isGeneratingThis}
                    className="text-xs"
                  >
                    <ArrowPathIcon className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApply(enhancement.id)}
                    disabled={isGeneratingThis}
                    className="text-xs"
                  >
                    {enhancement.autoPopulate ? "Apply to Form" : "Copy"}
                  </Button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!content && !isGeneratingThis && (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500 mb-2">
                  Fill in form details to generate AI content
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGenerate(enhancement.id)}
                  className="text-xs"
                >
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Generate Now
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default AIContentEnhancer;
