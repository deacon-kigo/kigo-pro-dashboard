/**
 * Structured Response Templates with Variable Interpolation
 *
 * This module provides a template system for AI agent responses that supports:
 * - Variable substitution using {{variable}} syntax
 * - Structured output formatting
 * - Context-aware response generation
 * - Consistent formatting across all agents
 */

export interface ResponseTemplate {
  id: string;
  title: string;
  template: string;
  variables: Record<string, string | number | boolean>;
  context?: Record<string, any>;
  actions?: ActionTemplate[];
}

export interface ActionTemplate {
  type: "navigation" | "approval" | "suggestion" | "form_fill";
  action: string;
  parameters: Record<string, any>;
  followUp?: ActionTemplate;
}

export interface ResponseContext {
  user: {
    role: string;
    currentPage: string;
    sessionId: string;
  };
  campaign?: {
    name?: string;
    budget?: number;
    merchant?: string;
    ads?: any[];
  };
  ui: {
    isLoading: boolean;
    activeModal?: string;
  };
}

/**
 * Template interpolation utility
 */
export function interpolateTemplate(
  template: string,
  variables: Record<string, any>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

/**
 * Generate structured response from template
 */
export function generateStructuredResponse(
  templateId: string,
  variables: Record<string, any>,
  context: ResponseContext
): ResponseTemplate {
  const template = RESPONSE_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return {
    ...template,
    template: interpolateTemplate(template.template, variables),
    variables,
    context,
  };
}

/**
 * Pre-defined response templates
 */
export const RESPONSE_TEMPLATES: Record<
  string,
  Omit<ResponseTemplate, "variables" | "context">
> = {
  // Navigation Templates
  navigation_to_ad_creation: {
    id: "navigation_to_ad_creation",
    title: "Navigate to Ad Creation",
    template: `I'd be happy to help you create an ad! Let me take you to the ad creation page where we can build your {{adType}} ad together step by step.

I'll navigate you there and then show you some helpful suggestions for getting started with {{merchant}} ads.`,
    actions: [
      {
        type: "navigation",
        action: "navigateToPageAndPerform",
        parameters: {
          destination: "/campaign-manager/ads-create",
          intent: "create_ad",
          context: "{{navigationContext}}",
          preActions: "",
          postActions: "",
        },
        followUp: {
          type: "suggestion",
          action: "showPostResponseSuggestions",
          parameters: {
            context: "ad_creation",
          },
        },
      },
    ],
  },

  navigation_to_analytics: {
    id: "navigation_to_analytics",
    title: "Navigate to Analytics",
    template: `Let me take you to the analytics dashboard where you can view {{metricType}} metrics and insights.

You'll be able to see performance data for {{timeRange}} and export reports as needed.`,
    actions: [
      {
        type: "navigation",
        action: "navigateToPageAndPerform",
        parameters: {
          destination: "/analytics",
          intent: "view_analytics",
          context: "{{navigationContext}}",
        },
        followUp: {
          type: "suggestion",
          action: "showPostResponseSuggestions",
          parameters: {
            context: "analytics",
          },
        },
      },
    ],
  },

  // Ad Creation Templates
  ad_creation_help: {
    id: "ad_creation_help",
    title: "Ad Creation Assistance",
    template: `I'm here to help you create an amazing ad! To get started, I'll need:

1. **Ad Name** - What would you like to call this ad?
2. **Merchant** - Which business is this for? ({{availableMerchants}})
3. **Offer** - What promotion or offer will you feature?
4. **Media Type** - Will you use images, video, or both?
5. **Costs** - Cost per activation and redemption

{{currentProgress}}

Just provide any of these details and I'll guide you through the rest!`,
    actions: [
      {
        type: "suggestion",
        action: "showContextSuggestions",
        parameters: {
          category: "creation",
        },
      },
    ],
  },

  ad_preview: {
    id: "ad_preview",
    title: "Ad Preview",
    template: `Perfect! Here's a preview of your {{adName}} ad:

**Ad Name:** {{adName}}
**Merchant:** {{merchant}}
**Offer:** {{offer}}
**Media Type:** {{mediaType}}
**Cost per Activation:** ${{ costPerActivation }}
**Cost per Redemption:** ${{ costPerRedemption }}

Does this look good? {{approvalPrompt}}`,
    actions: [
      {
        type: "approval",
        action: "startApprovalWorkflow",
        parameters: {
          workflowType: "ad_creation",
          title: "Review Ad: {{adName}}",
          description: "Please review the ad details before creation",
          items: "{{approvalItems}}",
        },
      },
    ],
  },

  // Error Templates
  error_general: {
    id: "error_general",
    title: "General Error",
    template: `I apologize, but I encountered an error while {{errorContext}}. 

Error: {{errorMessage}}

Please try again or let me know how I can help you differently.`,
    actions: [
      {
        type: "suggestion",
        action: "showContextSuggestions",
        parameters: {
          category: "guidance",
        },
      },
    ],
  },

  // Success Templates
  success_ad_created: {
    id: "success_ad_created",
    title: "Ad Creation Success",
    template: `🎉 Excellent! I've successfully created your ad "{{adName}}" for {{merchant}}!

Your ad has been added to your campaigns and is ready to go. You can now:
• Preview how it will look to customers
• Set up additional targeting options  
• Launch it when you're ready

{{nextStepsPrompt}}`,
    actions: [
      {
        type: "suggestion",
        action: "showPostResponseSuggestions",
        parameters: {
          context: "ad_creation_complete",
          customSuggestions: "{{customSuggestions}}",
        },
      },
    ],
  },
};

/**
 * Quick template helpers for common scenarios
 */
export const Templates = {
  // Navigation helpers
  navigateToAdCreation: (
    variables: { merchant?: string; adType?: string } = {}
  ) =>
    generateStructuredResponse(
      "navigation_to_ad_creation",
      {
        adType: variables.adType || "new",
        merchant: variables.merchant || "your chosen merchant",
        navigationContext: JSON.stringify({
          source: "template_navigation",
          userIntent: "ad_creation",
        }),
      },
      {} as ResponseContext
    ),

  navigateToAnalytics: (
    variables: { metricType?: string; timeRange?: string } = {}
  ) =>
    generateStructuredResponse(
      "navigation_to_analytics",
      {
        metricType: variables.metricType || "campaign",
        timeRange: variables.timeRange || "the last 30 days",
        navigationContext: JSON.stringify({
          source: "template_navigation",
          userIntent: "view_analytics",
        }),
      },
      {} as ResponseContext
    ),

  // Ad creation helpers
  showAdHelp: (
    variables: { availableMerchants?: string; currentProgress?: string } = {}
  ) =>
    generateStructuredResponse(
      "ad_creation_help",
      {
        availableMerchants:
          variables.availableMerchants || "McDonald's, Starbucks, Target",
        currentProgress:
          variables.currentProgress || "Let's start with the basics:",
      },
      {} as ResponseContext
    ),

  showAdPreview: (variables: {
    adName: string;
    merchant: string;
    offer: string;
    mediaType: string;
    costPerActivation: number;
    costPerRedemption: number;
  }) =>
    generateStructuredResponse(
      "ad_preview",
      {
        adName: variables.adName,
        merchant: variables.merchant,
        offer: variables.offer,
        mediaType: variables.mediaType,
        costPerActivation: variables.costPerActivation,
        costPerRedemption: variables.costPerRedemption,
        approvalPrompt:
          "Say 'create it' to proceed or 'modify' to make changes!",
        approvalItems: JSON.stringify([
          {
            id: "ad_details",
            type: "ad",
            title: `Create ad "${variables.adName}"`,
            description: `Ad for ${variables.merchant} with offer: ${variables.offer}`,
            data: variables,
            status: "pending",
          },
        ]),
      },
      {} as ResponseContext
    ),

  // Success helpers
  adCreated: (variables: { adName: string; merchant: string }) =>
    generateStructuredResponse(
      "success_ad_created",
      {
        ...variables,
        nextStepsPrompt:
          "Is there anything else you'd like to do with this ad or would you like to create another one?",
        customSuggestions: JSON.stringify([
          { title: "Preview ad", category: "quick_action" },
          { title: "Create another ad", category: "creation" },
          { title: "View all ads", category: "navigation" },
        ]),
      },
      {} as ResponseContext
    ),

  // Error helpers
  error: (variables: { errorContext: string; errorMessage: string }) =>
    generateStructuredResponse(
      "error_general",
      variables,
      {} as ResponseContext
    ),
};
