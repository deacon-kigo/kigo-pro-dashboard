"use client";

import React from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { z } from "zod";
import { ThinkingSteps } from "@/components/features/offer-manager/ThinkingSteps";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export function useOfferManagerAgent() {
  // Action with Render: Analyze business objective with custom UI
  useCopilotAction({
    name: "analyze_business_objective",
    description:
      "Analyzes the merchant's business objective and displays thinking steps with recommendations. Use this FIRST when user wants to create an offer.",
    parameters: [
      {
        name: "business_objective",
        type: "string",
        description:
          "The merchant's business goal (e.g., 'Increase Q4 parts sales by 15%', 'Drive foot traffic during slow hours', 'Acquire new customers')",
        required: true,
      },
      {
        name: "program_type",
        type: "string",
        description:
          "Program type: 'closed_loop' (John Deere) or 'open_loop' (Yardi)",
        required: true,
      },
      {
        name: "target_audience",
        type: "string",
        description:
          "Description of target audience (e.g., 'existing customers', 'new prospects', 'high-value members')",
        required: false,
      },
      {
        name: "budget_constraint",
        type: "string",
        description:
          "Budget constraints if any (e.g., '$10,000 total discount budget', '20% max discount')",
        required: false,
      },
    ],
    handler: async ({ business_objective, program_type }) => {
      // Simulate analysis
      return `Analyzed "${business_objective}" for ${program_type}. Recommendation: 15% discount.`;
    },
    render: ({ status, args }) => {
      // Render custom UI based on status
      if (status !== "inProgress" && status !== "complete") {
        return "";
      }
      const thinking_steps = [
        {
          id: "step-1",
          title: "Understanding Business Context",
          status:
            status === "complete"
              ? ("completed" as const)
              : ("in_progress" as const),
          reasoning: `Analyzing objective: "${args.business_objective}" for ${args.program_type} program`,
        },
        {
          id: "step-2",
          title: "Researching Historical Performance",
          status:
            status === "complete"
              ? ("completed" as const)
              : ("pending" as const),
          reasoning: "Reviewing similar campaigns to identify success patterns",
        },
        {
          id: "step-3",
          title: "Calculating Optimal Offer Value",
          status:
            status === "complete"
              ? ("completed" as const)
              : ("pending" as const),
          reasoning: "Running predictive models to find the sweet spot for ROI",
        },
      ];

      return React.createElement(
        "div",
        { className: "space-y-3 my-4" },
        React.createElement(ThinkingSteps, {
          steps: thinking_steps,
          currentPhase: "Analyzing your objective",
        }),
        status === "complete" &&
          React.createElement(
            Card,
            {
              className:
                "p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200",
            },
            React.createElement(
              "div",
              { className: "flex items-start gap-3" },
              React.createElement(
                "div",
                {
                  className:
                    "flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex-shrink-0",
                },
                React.createElement(CheckCircleIcon, {
                  className: "w-5 h-5 text-white",
                })
              ),
              React.createElement(
                "div",
                { className: "flex-1" },
                React.createElement(
                  "h4",
                  { className: "text-sm font-bold text-gray-900 mb-2" },
                  "💡 AI Recommendation"
                ),
                React.createElement(
                  "div",
                  { className: "mb-2" },
                  React.createElement(
                    "span",
                    { className: "text-xs text-gray-600" },
                    "Offer Type:"
                  ),
                  React.createElement(
                    "div",
                    { className: "text-sm font-semibold text-gray-900" },
                    "Discount Percentage (15% off)"
                  )
                ),
                React.createElement(
                  "div",
                  { className: "mt-3 p-3 bg-white/60 rounded-lg" },
                  React.createElement(
                    "div",
                    { className: "text-xs text-gray-700" },
                    "Based on historical data, a 15% discount drives optimal incremental revenue while maintaining healthy margins. This value converts 23% better than smaller discounts for this goal."
                  )
                )
              )
            )
          )
      );
    },
  });

  // Action: Validate offer configuration
  useCopilotAction({
    name: "validate_offer_configuration",
    description:
      "Validate the current offer configuration for compliance, feasibility, and best practices. Returns validation results and warnings.",
    parameters: [
      {
        name: "offer_data",
        type: "object",
        description: "Complete offer configuration to validate",
        required: true,
      },
    ],
    handler: async ({ offer_data }) => {
      const data = offer_data as any;
      const validations: Array<{
        field: string;
        status: string;
        message: string;
      }> = [];

      // Example validations
      if (!data.offerTitle || data.offerTitle.length < 10) {
        validations.push({
          field: "Offer Title",
          status: "invalid",
          message: "Title should be at least 10 characters for clarity",
        });
      }

      if (data.offerType && data.offerValue) {
        validations.push({
          field: "Offer Value",
          status: "valid",
          message: `${data.offerValue}${data.offerType === "percentage" ? "%" : "$"} discount is within acceptable range`,
        });
      }

      if (!data.termsConditions) {
        validations.push({
          field: "Terms & Conditions",
          status: "warning",
          message: "Consider adding clear terms to avoid customer confusion",
        });
      }

      return {
        validation_results: validations,
      };
    },
  });

  // Action: Generate promo codes
  useCopilotAction({
    name: "generate_promo_codes",
    description:
      "Generate unique promo codes for the offer based on program type and requirements",
    parameters: [
      {
        name: "code_type",
        type: "string",
        description:
          "'single' for one universal code, 'unique' for multiple unique codes",
        required: true,
      },
      {
        name: "program_type",
        type: "string",
        description: "'closed_loop' or 'open_loop'",
        required: true,
      },
      {
        name: "quantity",
        type: "number",
        description:
          "Number of unique codes to generate (if code_type is 'unique')",
        required: false,
      },
      {
        name: "prefix",
        type: "string",
        description:
          "Optional prefix for the codes (e.g., 'JD2025' for John Deere)",
        required: false,
      },
    ],
    handler: async ({ code_type, program_type, quantity, prefix }) => {
      const generateCode = () => {
        const prefixPart = prefix ? `${prefix}-` : "";
        const randomPart = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();
        return `${prefixPart}${randomPart}`;
      };

      if (code_type === "single") {
        return {
          codes: [generateCode()],
          message: "Generated 1 universal promo code",
        };
      } else {
        const codes = Array.from({ length: quantity || 100 }, () =>
          generateCode()
        );
        return {
          codes,
          message: `Generated ${codes.length} unique promo codes`,
        };
      }
    },
  });

  // Action: Recommend campaign timing
  useCopilotAction({
    name: "recommend_campaign_timing",
    description:
      "Analyze historical performance, seasonal trends, and competitive calendar to recommend optimal campaign timing",
    parameters: [
      {
        name: "offer_type",
        type: "string",
        description: "Type of offer being created",
        required: true,
      },
      {
        name: "program_type",
        type: "string",
        description: "'closed_loop' or 'open_loop'",
        required: true,
      },
      {
        name: "duration_preference",
        type: "string",
        description:
          "Preferred campaign duration (e.g., '1 week', '2 weeks', '1 month')",
        required: false,
      },
    ],
    handler: async ({ offer_type, program_type, duration_preference }) => {
      return {
        thinking_steps: [
          {
            id: "timing-1",
            title: "Analyzing Seasonal Patterns",
            status: "completed",
            reasoning: `Reviewing historical performance for ${offer_type} offers in ${program_type} programs`,
          },
          {
            id: "timing-2",
            title: "Checking Competitive Calendar",
            status: "completed",
            reasoning:
              "Identifying optimal windows to avoid campaign conflicts",
          },
        ],
        recommendations: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          reasoning:
            "Starting next week gives adequate preparation time, and a 2-week duration aligns with peak engagement periods for this offer type",
        },
      };
    },
  });

  // Action: Preview offer impact
  useCopilotAction({
    name: "preview_offer_impact",
    description:
      "Generate performance predictions and impact forecast for the configured offer",
    parameters: [
      {
        name: "offer_configuration",
        type: "object",
        description: "Complete offer configuration",
        required: true,
      },
    ],
    handler: async ({ offer_configuration }) => {
      return {
        thinking_steps: [
          {
            id: "impact-1",
            title: "Running Predictive Models",
            status: "completed",
            reasoning: "Analyzing similar campaigns to forecast performance",
          },
          {
            id: "impact-2",
            title: "Calculating Budget Impact",
            status: "completed",
            reasoning:
              "Projecting total discount liability and operational costs",
          },
        ],
        predictions: {
          estimated_redemptions: 1250,
          estimated_revenue_impact: "$18,500",
          roi_projection: "2.8x",
          confidence_level: "High (85%)",
          reasoning:
            "Based on 47 similar campaigns in your program, this configuration typically drives strong engagement with manageable costs",
        },
        requires_approval: true,
        pending_action: "launch_offer",
      };
    },
  });
}
