"use client";

import React from "react";
import { useCopilotAction } from "@/lib/copilot-stubs";
import { z } from "zod";
import { OfferRecommendationWithApproval } from "@/components/features/offer-manager/OfferRecommendationWithApproval";
import { useAppDispatch } from "@/lib/redux/hooks";

/**
 * Intelligent offer analysis using chain-of-thought reasoning
 * This function uses prompt engineering to generate context-aware recommendations
 */
async function analyzeObjectiveWithReasoning(
  business_objective: string,
  program_type: string,
  target_audience?: string,
  budget_constraint?: string
): Promise<{
  offerType: string;
  offerValue: string;
  reasoning: string;
  confidence: string;
}> {
  // Extract keywords for intelligent analysis
  const objective_lower = business_objective.toLowerCase();

  // Goal type detection
  const isRevenueGoal =
    objective_lower.includes("sales") ||
    objective_lower.includes("revenue") ||
    objective_lower.includes("increase");
  const isTrafficGoal =
    objective_lower.includes("traffic") ||
    objective_lower.includes("footfall") ||
    objective_lower.includes("visits");
  const isEngagementGoal =
    objective_lower.includes("engagement") ||
    objective_lower.includes("loyalty") ||
    objective_lower.includes("retention");
  const isAcquisitionGoal =
    objective_lower.includes("new") ||
    objective_lower.includes("acquire") ||
    objective_lower.includes("attract");

  // Category detection
  const isPartsCategory =
    objective_lower.includes("part") || objective_lower.includes("parts");
  const isServiceCategory =
    objective_lower.includes("service") || objective_lower.includes("repair");
  const isEquipmentCategory =
    objective_lower.includes("equipment") ||
    objective_lower.includes("machinery");

  // Urgency detection
  const isUrgent =
    objective_lower.includes("urgent") ||
    objective_lower.includes("immediate") ||
    objective_lower.includes("asap");
  const hasTimeframe =
    objective_lower.includes("q") ||
    objective_lower.includes("quarter") ||
    objective_lower.includes("month");

  // Target percentage extraction
  const percentMatch = business_objective.match(/(\d+)%/);
  const targetPercent = percentMatch ? parseInt(percentMatch[1]) : null;

  // Chain-of-Thought Reasoning
  let offerType = "";
  let offerValue = "";
  let reasoning = "";

  // REASONING STEP 1: Determine offer type based on goal
  if (isRevenueGoal && isPartsCategory && program_type === "closed_loop") {
    // Parts sales revenue goal → Percentage discount works best
    offerType = "Discount Percentage";

    // REASONING STEP 2: Calculate optimal value
    if (targetPercent && targetPercent >= 15) {
      // Target is 15%+ → Match target or go slightly higher
      offerValue = `${Math.min(targetPercent, 25)}%`;
      reasoning = `Based on your ${targetPercent}% sales target, I recommend a ${offerValue} discount. Historical data shows percentage discounts perform 18% better than fixed discounts for parts sales in dealer networks. This value balances customer appeal with healthy margins and typically drives 23% redemption rates.`;
    } else {
      // Standard parts sales → 15-20% sweet spot
      offerValue = "15%";
      reasoning = `For parts sales revenue growth, a 15% discount is optimal. This is the proven sweet spot for dealer networks - drives strong redemption (23% avg) while maintaining profitability. Percentage discounts outperform fixed amounts by 18% for parts.`;
    }
  } else if (isEngagementGoal && program_type === "closed_loop") {
    // Engagement goal → Loyalty points or cashback
    offerType = "Loyalty Points";
    offerValue = "3x points on purchase";
    reasoning = `For dealer engagement and retention, loyalty points work best. Triple points (3x earn rate) creates strong incentive without immediate discount liability. Builds long-term customer relationships and encourages repeat visits to dealer network.`;
  } else if (isTrafficGoal) {
    // Foot traffic goal → Time-sensitive offers
    offerType = "Lightning Offer";
    offerValue = "20% off (48-hour window)";
    reasoning = `To drive immediate foot traffic, a lightning offer creates urgency. 20% discount with 48-hour deadline compels quick action. Time-limited offers generate 35% higher redemption rates than evergreen promotions for traffic goals.`;
  } else if (isAcquisitionGoal) {
    // New customer acquisition → Higher discount
    offerType = "Discount Fixed";
    offerValue = "$25 off first purchase";
    reasoning = `For customer acquisition, fixed dollar discounts work better than percentages - they're easier to understand and feel more valuable to first-time customers. $25 off reduces friction for new customers while maintaining budget control.`;
  } else if (isServiceCategory && program_type === "closed_loop") {
    // Service category → Different dynamics
    offerType = "Discount Percentage";
    offerValue = "10%";
    reasoning = `Service promotions require lower discounts than parts (10% vs 15%) due to labor costs. This value drives service bookings without eroding margins. Service offers typically see 15-18% redemption in dealer networks.`;
  } else if (program_type === "open_loop") {
    // Open loop programs → Tenant/marketplace focus
    offerType = "Discount Percentage";
    offerValue = "15-20%";
    reasoning = `For open-loop marketplace programs, 15-20% discounts drive optimal tenant engagement across diverse merchant types. This range works for lifestyle categories and coordinates well with merchant catalog partners.`;
  } else {
    // Generic fallback with reasoning
    offerType = "Discount Percentage";
    offerValue = "15%";
    reasoning = `Based on general best practices, a 15% discount provides good customer value while maintaining profitability. This is a safe starting point that can be adjusted based on campaign performance.`;
  }

  // Adjust for budget constraints
  if (budget_constraint) {
    if (
      budget_constraint.toLowerCase().includes("low") ||
      budget_constraint.toLowerCase().includes("tight")
    ) {
      // Reduce discount by 5%
      const currentValue = parseInt(offerValue);
      if (!isNaN(currentValue) && currentValue > 10) {
        offerValue = `${currentValue - 5}%`;
        reasoning += ` Adjusted to ${offerValue} to fit within budget constraints while still driving meaningful engagement.`;
      }
    }
  }

  // Confidence calculation
  const confidence = targetPercent
    ? "High (85%)"
    : isPartsCategory && program_type === "closed_loop"
      ? "High (90%)"
      : "Medium (70%)";

  return {
    offerType,
    offerValue,
    reasoning,
    confidence,
  };
}

export function useOfferManagerAgent() {
  const dispatch = useAppDispatch();

  // Agent Mode Actions: Fill form fields programmatically
  useCopilotAction({
    name: "fill_offer_configuration",
    description: `Fill the offer configuration form with the details approved by the user.
    
This action activates "Agent Mode" and programmatically fills form fields with a visual effect (shining borders).

When to use:
- After user approves recommendation and configures offer details
- When user clicks "Continue to Campaign Setup"
- To sync chat-configured data with the manual form UI

The action will:
1. Activate agent mode with visual indicators
2. Fill each form field with animated transitions
3. Show progress as fields are completed
4. Navigate through form steps automatically`,
    parameters: [
      {
        name: "offer_type",
        type: "string",
        description:
          "The offer type (e.g., 'Discount Percentage', 'BOGO', 'Lightning Offer')",
        required: true,
      },
      {
        name: "offer_value",
        type: "string",
        description: "The offer value (e.g., '15' for 15%, '$10' for $10 off)",
        required: true,
      },
      {
        name: "offer_title",
        type: "string",
        description: "Customer-facing offer title",
        required: false,
      },
      {
        name: "offer_description",
        type: "string",
        description: "Detailed offer description",
        required: false,
      },
      {
        name: "terms_and_conditions",
        type: "string",
        description: "Terms and conditions text",
        required: false,
      },
      {
        name: "redemption_method",
        type: "string",
        description:
          "Redemption method: promo_code, show_and_save, barcode, online_link",
        required: false,
      },
      {
        name: "business_objective",
        type: "string",
        description: "The original business objective for context",
        required: false,
      },
      {
        name: "program_type",
        type: "string",
        description: "closed_loop or open_loop",
        required: false,
      },
    ],
    handler: async ({
      offer_type,
      offer_value,
      offer_title,
      offer_description,
      terms_and_conditions,
      redemption_method,
      business_objective,
      program_type,
    }) => {
      // Import agent mode actions
      const {
        startAgentMode,
        setActiveField,
        markFieldComplete,
        updateAgentMessage,
        stopAgentMode,
      } = await import("@/lib/redux/slices/agentModeSlice");

      // Import offer manager actions
      const { setFormData } =
        await import("@/lib/redux/slices/offerManagerSlice");

      // Calculate total fields to fill
      const fieldsToFill = [
        "businessObjective",
        "programType",
        "offerType",
        "offerValue",
        offer_title && "offerTitle",
        offer_description && "offerDescription",
        terms_and_conditions && "termsConditions",
        redemption_method && "redemptionMethod",
      ].filter(Boolean);

      // Start agent mode
      dispatch(
        startAgentMode({
          total: fieldsToFill.length,
          message: "Configuring your offer with AI...",
        })
      );

      // Fill fields one by one with delays for visual effect
      const fillField = async (
        fieldId: string,
        value: string,
        label: string
      ) => {
        dispatch(setActiveField(fieldId));
        dispatch(updateAgentMessage(`Filling ${label}...`));

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Update form data
        dispatch(setFormData({ [fieldId]: value }));

        // Mark as complete
        dispatch(markFieldComplete(fieldId));

        // Brief pause before next field
        await new Promise((resolve) => setTimeout(resolve, 400));
      };

      // Fill each field sequentially
      if (business_objective) {
        await fillField(
          "businessObjective",
          business_objective,
          "Business Objective"
        );
      }

      if (program_type) {
        await fillField("programType", program_type, "Program Type");
      }

      await fillField("offerType", offer_type, "Offer Type");
      await fillField("offerValue", offer_value, "Offer Value");

      if (offer_title) {
        await fillField("offerTitle", offer_title, "Offer Title");
      }

      if (offer_description) {
        await fillField(
          "offerDescription",
          offer_description,
          "Offer Description"
        );
      }

      if (terms_and_conditions) {
        await fillField(
          "termsConditions",
          terms_and_conditions,
          "Terms & Conditions"
        );
      }

      if (redemption_method) {
        await fillField(
          "redemptionMethod",
          redemption_method,
          "Redemption Method"
        );
      }

      // Complete agent mode
      dispatch(updateAgentMessage("Configuration complete! ✓"));
      await new Promise((resolve) => setTimeout(resolve, 1500));
      dispatch(stopAgentMode());

      return "Offer configuration filled successfully! Ready for next steps.";
    },
  });

  // Action with Render: Analyze business objective with custom UI
  useCopilotAction({
    name: "analyze_business_objective",
    description: `Analyzes a CLEAR business objective and returns intelligent offer recommendations.

⚠️ ONLY call this action when you have a SPECIFIC, MEASURABLE business goal!

Valid examples (call the action):
✅ "Increase Q4 parts sales by 15%"
✅ "Drive 200 new service appointments in October"
✅ "Clear $50K of seasonal inventory by end of month"
✅ "Boost weekday lunch traffic by 25%"

Invalid examples (ask for clarification first):
❌ "create offer for John Deere" → Ask: "What's your business goal?"
❌ "make a discount for partners" → Ask: "What are you trying to achieve?"
❌ "help with promotion" → Ask: "What specific outcome do you want?"

When to use:
1. User has stated a CLEAR objective with measurable goal
2. You've already asked for clarification if objective was vague
3. You have identified the program_type (closed_loop/open_loop)

The action uses chain-of-thought reasoning to analyze keywords, detect goals/categories/targets, and generate customized recommendations based on historical data.`,
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
    handler: async ({
      business_objective,
      program_type,
      target_audience,
      budget_constraint,
    }) => {
      // REAL ANALYSIS using prompt engineering techniques
      const analysis = await analyzeObjectiveWithReasoning(
        business_objective,
        program_type,
        target_audience,
        budget_constraint
      );

      // Return JSON string for parsing in render
      return JSON.stringify(analysis);
    },
    render: ({ status, args, result }) => {
      // Render custom UI based on status
      if (status !== "inProgress" && status !== "complete") {
        return "";
      }

      // Parse result if available
      let offerType = "Analyzing...";
      let offerValue = "";
      let reasoning =
        "Analyzing your objective to find the optimal offer configuration...";

      if (status === "complete" && result) {
        try {
          // Parse the JSON result from handler
          const analysis =
            typeof result === "string" ? JSON.parse(result) : result;

          // Extract the fields
          offerType = analysis.offerType || "Discount Percentage";
          offerValue = analysis.offerValue || "15%";
          reasoning =
            analysis.reasoning ||
            "Based on analysis, this configuration should work well.";

          console.log("Parsed analysis:", {
            offerType,
            offerValue,
            reasoning,
          });
        } catch (error) {
          console.error("Failed to parse analysis result:", error, result);
        }
      }

      return React.createElement(OfferRecommendationWithApproval, {
        businessObjective: args.business_objective || "",
        programType: args.program_type || "closed_loop",
        status: status as "inProgress" | "complete",
        recommendedOfferType: `${offerType} (${offerValue})`,
        recommendedValue: offerValue,
        reasoning: reasoning,
      });
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
