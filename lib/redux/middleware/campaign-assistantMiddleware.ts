import { Middleware, AnyAction } from "redux";
import {
  addMessage,
  setIsProcessing,
  setError,
  AIMessage,
  analyzeCampaignData,
  setCampaignAnalysis,
  generateAdSuggestion,
  generateBudgetRecommendation,
  generateTargetingSuggestion,
} from "../slices/ai-assistantSlice";
import { createChatService } from "@/services/ai/chat";
import {
  createAdContentGeneratorTool,
  createBudgetRecommendationTool,
  createTargetingRecommendationTool,
  createCampaignAnalysisTool,
  createCampaignConversationGuideTool,
} from "@/services/ai/tools";
import { RootState } from "../store";
import {
  applyCampaignUpdate,
} from "../slices/campaignSlice";

// Define action types for type checking
interface AddMessageAction extends AnyAction {
  type: "aiAssistant/addMessage";
  payload: {
    type: string;
    content: string;
  };
}

interface AnalyzeCampaignAction extends AnyAction {
  type: "aiAssistant/analyzeCampaignData";
}

interface GenerateAdSuggestionAction extends AnyAction {
  type: "aiAssistant/generateAdSuggestion";
  payload: {
    targetAudience?: string;
    campaignGoal?: string;
    productType?: string;
  };
}

interface GenerateTargetingSuggestionAction extends AnyAction {
  type: "aiAssistant/generateTargetingSuggestion";
}

interface GenerateBudgetRecommendationAction extends AnyAction {
  type: "aiAssistant/generateBudgetRecommendation";
}

// Type guard for actions
function isAddMessageAction(action: AnyAction): action is AddMessageAction {
  return action.type === "aiAssistant/addMessage";
}

function isAnalyzeCampaignAction(action: AnyAction): action is AnalyzeCampaignAction {
  return action.type === "aiAssistant/analyzeCampaignData";
}

function isGenerateAdSuggestionAction(action: AnyAction): action is GenerateAdSuggestionAction {
  return action.type === "aiAssistant/generateAdSuggestion";
}

function isGenerateTargetingSuggestionAction(action: AnyAction): action is GenerateTargetingSuggestionAction {
  return action.type === "aiAssistant/generateTargetingSuggestion";
}

function isGenerateBudgetRecommendationAction(action: AnyAction): action is GenerateBudgetRecommendationAction {
  return action.type === "aiAssistant/generateBudgetRecommendation";
}

// Type for response options
interface ResponseOption {
  text: string;
  value: string;
}

// Type for AI response
interface AIResponse {
  content: string;
  responseOptions?: ResponseOption[];
  severity?: "info" | "warning" | "success" | "error";
}

// Helper to create a unique option ID that encodes data
const createOptionId = (prefix: string, data: any) => {
  if (typeof data === "string") {
    return `${prefix}:${data}`;
  }
  return `${prefix}:${JSON.stringify(data)}`;
};

// Handle specific campaign-related option IDs and generate responses
const handleCampaignOptionSelected = async (
  optionId: string,
  campaignContext?: any
): Promise<AIResponse> => {
  // Campaign targeting options
  if (optionId === "suggest_targeting_options") {
    return {
      content: `
Let me help you with targeting options for your campaign.

You can target your campaign based on:

1. **Demographics**:
   - Age range (e.g., 18-34, 35-54, 55+)
   - Gender (Male, Female, All)

2. **Geography**:
   - States (e.g., California, New York)
   - Metropolitan areas (e.g., San Francisco, Boston)
   - Zip codes for local targeting

3. **Campaign Weight**:
   - Small (focused, niche targeting)
   - Medium (balanced approach)
   - Large (broad reach)

What kind of audience would you like to reach with this campaign?`,
      responseOptions: [
        {
          text: "Young adults (18-34)",
          value: createOptionId("suggest_targeting", {
            ageRange: [18, 34],
            campaignWeight: "medium",
          }),
        },
        {
          text: "Middle-aged adults (35-54)",
          value: createOptionId("suggest_targeting", {
            ageRange: [35, 54],
            campaignWeight: "medium",
          }),
        },
        {
          text: "Broad audience (all ages)",
          value: createOptionId("suggest_targeting", {
            ageRange: [18, 65],
            campaignWeight: "large",
          }),
        },
        {
          text: "I want to customize targeting",
          value: "customize_targeting",
        },
      ],
    };
  } else if (optionId === "customize_targeting") {
    return {
      content: "Let's customize your targeting. What specific audience are you trying to reach?",
      responseOptions: [
        {
          text: "Target by demographics",
          value: "target_demographics",
        },
        {
          text: "Target by geography",
          value: "target_geography",
        },
        {
          text: "Target by campaign weight",
          value: "target_weight",
        },
      ],
    };
  } else if (optionId === "target_demographics") {
    return {
      content: "What demographic group would you like to target?",
      responseOptions: [
        {
          text: "Young adults (18-34)",
          value: createOptionId("suggest_targeting", {
            ageRange: [18, 34],
          }),
        },
        {
          text: "Middle-aged adults (35-54)",
          value: createOptionId("suggest_targeting", {
            ageRange: [35, 54],
          }),
        },
        {
          text: "Older adults (55+)",
          value: createOptionId("suggest_targeting", {
            ageRange: [55, 80],
          }),
        },
        {
          text: "Male audience",
          value: createOptionId("suggest_targeting", {
            gender: ["male"],
          }),
        },
        {
          text: "Female audience",
          value: createOptionId("suggest_targeting", {
            gender: ["female"],
          }),
        },
      ],
    };
  }
  
  // Campaign budget options
  else if (optionId === "suggest_budget_options") {
    return {
      content: `
Let me help you with budget options for your campaign.

Your budget will depend on several factors:

1. **Campaign Goal**:
   - Awareness (typically requires larger reach)
   - Conversion (more focused, can be more efficient)
   - Retention (targeting existing customers)

2. **Campaign Duration**:
   - Short-term (1-2 weeks)
   - Medium-term (1-3 months)
   - Long-term (3+ months)

3. **Target Audience Size**:
   - Small (niche audience)
   - Medium (specific demographic)
   - Large (broad audience)

What is your primary goal for this campaign?`,
      responseOptions: [
        {
          text: "Brand awareness",
          value: createOptionId("suggest_budget", {
            campaignGoal: "awareness",
            audienceSize: 100000,
            campaignDuration: 30,
          }),
        },
        {
          text: "Drive conversions/sales",
          value: createOptionId("suggest_budget", {
            campaignGoal: "conversion",
            audienceSize: 50000,
            campaignDuration: 30,
          }),
        },
        {
          text: "Customer retention",
          value: createOptionId("suggest_budget", {
            campaignGoal: "retention",
            audienceSize: 25000,
            campaignDuration: 30,
          }),
        },
        {
          text: "I want to customize my budget",
          value: "customize_budget",
        },
      ],
    };
  } else if (optionId === "customize_budget") {
    return {
      content: "Let's customize your budget. What specific aspects would you like to adjust?",
      responseOptions: [
        {
          text: "Set specific budget amount",
          value: "set_budget_amount",
        },
        {
          text: "Adjust campaign duration",
          value: "adjust_duration",
        },
        {
          text: "Get budget recommendations",
          value: "get_budget_recommendations",
        },
      ],
    };
  } else if (optionId === "set_budget_amount") {
    return {
      content: "What budget range are you considering for this campaign?",
      responseOptions: [
        {
          text: "Small budget ($1,000-$3,000)",
          value: createOptionId("suggest_budget", {
            maxBudget: 2000,
          }),
        },
        {
          text: "Medium budget ($3,000-$7,000)",
          value: createOptionId("suggest_budget", {
            maxBudget: 5000,
          }),
        },
        {
          text: "Large budget ($7,000-$15,000)",
          value: createOptionId("suggest_budget", {
            maxBudget: 10000,
          }),
        },
      ],
    };
  }
  
  // Ad content options
  else if (optionId === "suggest_ad_content_options") {
    return {
      content: `
Let me help you with ad content for your campaign.

Effective ad content depends on:

1. **Campaign Goal**:
   - Awareness (focus on brand and unique selling points)
   - Conversion (focus on offers and calls-to-action)
   - Retention (focus on loyalty and exclusive benefits)

2. **Target Audience**:
   - Demographics influence messaging tone and style
   - Interests determine which benefits to highlight

3. **Product/Service Type**:
   - Different industries have different effective approaches

What type of product or service are you advertising?`,
      responseOptions: [
        {
          text: "Food & Dining",
          value: createOptionId("suggest_ad_content", {
            productType: "restaurant",
            campaignGoal: "awareness",
            targetAudience: "local diners",
          }),
        },
        {
          text: "Retail & Shopping",
          value: createOptionId("suggest_ad_content", {
            productType: "retail",
            campaignGoal: "conversion",
            targetAudience: "shoppers",
          }),
        },
        {
          text: "Technology",
          value: createOptionId("suggest_ad_content", {
            productType: "technology",
            campaignGoal: "awareness",
            targetAudience: "tech enthusiasts",
          }),
        },
        {
          text: "I want to customize my ad content",
          value: "customize_ad_content",
        },
      ],
    };
  } else if (optionId === "customize_ad_content") {
    return {
      content: "Let's customize your ad content. What specific aspects would you like to focus on?",
      responseOptions: [
        {
          text: "Generate headline ideas",
          value: "generate_headlines",
        },
        {
          text: "Suggest media types",
          value: "suggest_media_types",
        },
        {
          text: "Complete ad creation",
          value: "complete_ad_creation",
        },
      ],
    };
  } else if (optionId === "generate_headlines") {
    return {
      content: "What is the main goal of your headlines?",
      responseOptions: [
        {
          text: "Build brand awareness",
          value: createOptionId("suggest_ad_content", {
            campaignGoal: "awareness",
            targetAudience: "general audience",
            productType: "your product",
          }),
        },
        {
          text: "Drive sales/conversions",
          value: createOptionId("suggest_ad_content", {
            campaignGoal: "conversion",
            targetAudience: "potential customers",
            productType: "your product",
          }),
        },
        {
          text: "Promote special offers",
          value: createOptionId("suggest_ad_content", {
            campaignGoal: "promotion",
            targetAudience: "deal seekers",
            productType: "your product",
          }),
        },
      ],
    };
  }
  
  // Campaign analysis options
  else if (optionId === "analyze_campaign") {
    if (!campaignContext) {
      return {
        content: "I need more information about your campaign to provide analysis. Can you tell me more about your targeting, budget, and ad content?",
        severity: "warning",
      };
    }
    
    return {
      content: "I'll analyze your current campaign settings. What specific aspects would you like me to focus on?",
      responseOptions: [
        {
          text: "Overall performance prediction",
          value: "analyze_performance",
        },
        {
          text: "Targeting optimization",
          value: "analyze_targeting",
        },
        {
          text: "Budget efficiency",
          value: "analyze_budget",
        },
        {
          text: "Ad content effectiveness",
          value: "analyze_content",
        },
      ],
    };
  }
  
  // Default response for unknown option IDs
  return {
    content:
      "I'm not sure how to help with that specific request. Can you tell me more about what you're trying to do with your campaign?",
  };
};

const campaignAssistantMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    // First pass the action to the next middleware
    const result = next(action);

    // Get current state
    const state = store.getState();

    // Handle user message submissions
    if (isAddMessageAction(action) && action.payload.type === "user" && state.aiAssistant.contextId === "campaignContext") {
      const userMessage = action.payload.content;

      // Set processing state
      store.dispatch(setIsProcessing(true));

      try {
        // Use campaign conversation guide tool
        const conversationGuideTool = createCampaignConversationGuideTool();

        // Prepare context for the tool
        const conversationHistory = state.aiAssistant.messages;
        const campaignContext = state.aiAssistant.campaignContext || {};

        // Convert campaign context to a format the tool can process
        const campaignContextForTool = {
          ...campaignContext,
          currentStep: state.campaign?.currentStep,
        };

        // Invoke the tool with complete context
        const toolResponse = await conversationGuideTool.invoke(
          JSON.stringify({
            userMessage,
            conversationHistory,
            campaignContext: campaignContextForTool,
          })
        );

        // Parse the response
        const response = JSON.parse(toolResponse);

        if (response.error) {
          // Handle error
          store.dispatch(
            addMessage({
              type: "ai",
              content: `I encountered an error: ${response.details || "Unknown error"}`,
              severity: "error",
            })
          );
        } else {
          // Add AI response with options
          store.dispatch(
            addMessage({
              type: "ai",
              content: response.responseMessage,
              responseOptions: response.responseOptions || [],
            })
          );

          // If there is targeting to add
          if (response.actionType === "suggest_targeting" && response.targetingToAdd) {
            // Create payload for updating targeting
            store.dispatch(
              applyCampaignUpdate({
                targeting: response.targetingToAdd,
              })
            );
          }

          // If there is budget to add
          if (response.actionType === "suggest_budget" && response.budgetToAdd) {
            // Create payload for updating budget
            store.dispatch(
              applyCampaignUpdate({
                budget: response.budgetToAdd,
              })
            );
          }

          // If there is ad content to add
          if (response.actionType === "suggest_ad_content" && response.adContentToAdd) {
            // Process this based on your ad content model
            if (response.adContentToAdd.headlines && response.adContentToAdd.headlines.length > 0) {
              // Add a follow-up message with the generated headlines
              store.dispatch(
                addMessage({
                  type: "ai",
                  content: "I've generated some headline ideas based on your campaign goals. Would you like to use any of these?",
                  responseOptions: response.adContentToAdd.headlines.map((headline: string) => ({
                    text: headline,
                    value: `use_headline:${headline}`,
                  })),
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Error in campaign AI assistant middleware:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );

        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error processing your request. Please try again.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    // Handle campaign analysis action
    if (isAnalyzeCampaignAction(action)) {
      store.dispatch(setIsProcessing(true));

      try {
        // Get campaign data from state
        const campaignData = state.campaign?.formData || {};
        
        // Use the campaign analysis tool
        const analysisTool = createCampaignAnalysisTool();
        
        // Add user message showing the action
        store.dispatch(
          addMessage({
            type: "user",
            content: "Can you analyze my campaign and suggest improvements?",
          })
        );
        
        // Invoke the tool
        const toolResponse = await analysisTool.invoke(
          JSON.stringify(campaignData)
        );
        
        // Parse the response
        const response = JSON.parse(toolResponse);
        
        if (response.error) {
          // Handle error
          store.dispatch(
            addMessage({
              type: "ai",
              content: `I encountered an error while analyzing the campaign: ${response.details}`,
              severity: "error",
            })
          );
        } else {
          // Store analysis in the state
          store.dispatch(setCampaignAnalysis({
            impressionRate: response.impressionRate,
            conversionRate: response.conversionRate,
            recommendedBudget: response.recommendedBudget,
            audienceInsight: response.audienceInsight,
            performancePrediction: response.performancePrediction,
          }));
          
          // Add AI response with the analysis
          store.dispatch(
            addMessage({
              type: "ai",
              content: `
## Campaign Analysis

${response.audienceInsight}

${response.performancePrediction}

### Suggested Improvements:
${response.suggestedImprovements.map((improvement: string) => `- ${improvement}`).join('\n')}

Would you like me to help optimize any specific aspect of your campaign?`,
              responseOptions: [
                {
                  text: "Improve targeting",
                  value: "improve_targeting",
                },
                {
                  text: "Optimize budget",
                  value: "optimize_budget",
                },
                {
                  text: "Enhance ad content",
                  value: "enhance_ad_content",
                },
              ],
            })
          );
        }
      } catch (error) {
        console.error("Error in campaign analysis:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );
        
        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error analyzing your campaign. Please try again.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    // Handle ad suggestion action
    if (isGenerateAdSuggestionAction(action)) {
      store.dispatch(setIsProcessing(true));

      try {
        const { targetAudience = "general audience", campaignGoal = "awareness", productType = "your product" } = action.payload;
        
        // Use the ad content generator tool
        const adGeneratorTool = createAdContentGeneratorTool();
        
        // Add user message showing the action
        store.dispatch(
          addMessage({
            type: "user",
            content: "Can you suggest some ad headlines for my campaign?",
          })
        );
        
        // Invoke the tool
        const toolResponse = await adGeneratorTool.invoke(
          JSON.stringify({
            campaignGoal,
            targetAudience,
            productType,
          })
        );
        
        // Parse the response
        const headlineOptions = JSON.parse(toolResponse);
        
        if (Array.isArray(headlineOptions) && headlineOptions.length > 0) {
          // Add AI response with the suggestions
          store.dispatch(
            addMessage({
              type: "ai",
              content: `
I've generated some headline ideas for your ${campaignGoal} campaign targeting ${targetAudience}:

${headlineOptions.map((headline: string, index: number) => `${index + 1}. "${headline}"`).join('\n')}

Would you like to use any of these headlines for your ad?`,
              responseOptions: headlineOptions.map((headline: string) => ({
                text: `Use: "${headline}"`,
                value: `use_headline:${headline}`,
              })),
            })
          );
        } else {
          // Handle error or empty response
          store.dispatch(
            addMessage({
              type: "ai",
              content: "I wasn't able to generate headline suggestions. Let's try a different approach.",
              severity: "warning",
            })
          );
        }
      } catch (error) {
        console.error("Error generating ad suggestions:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );
        
        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error generating ad suggestions. Please try again.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    // Handle targeting suggestion action
    if (isGenerateTargetingSuggestionAction(action)) {
      store.dispatch(setIsProcessing(true));

      try {
        // Get relevant data from state
        const basicInfo = state.campaign?.formData?.basicInfo || {};
        const productType = basicInfo.campaignType || "general";
        const campaignGoal = basicInfo.description?.includes("awareness") ? "awareness" : "conversion";
        
        // Use the targeting recommendation tool
        const targetingTool = createTargetingRecommendationTool();
        
        // Add user message showing the action
        store.dispatch(
          addMessage({
            type: "user",
            content: "Can you suggest targeting options for my campaign?",
          })
        );
        
        // Invoke the tool
        const toolResponse = await targetingTool.invoke(
          JSON.stringify({
            productType,
            campaignGoal,
          })
        );
        
        // Parse the response
        const targetingRecommendation = JSON.parse(toolResponse);
        
        if (targetingRecommendation?.ageRange && targetingRecommendation?.gender) {
          // Format the recommendation
          const ageRangeText = `${targetingRecommendation.ageRange[0]}-${targetingRecommendation.ageRange[1]}`;
          const genderText = targetingRecommendation.gender.join(", ");
          const locationsText = targetingRecommendation.locations.join(", ");
          const interestsText = targetingRecommendation.interestCategories.join(", ");
          
          // Add AI response with the suggestions
          store.dispatch(
            addMessage({
              type: "ai",
              content: `
Based on your ${campaignGoal} campaign for ${productType}, I recommend the following targeting:

- **Age Range:** ${ageRangeText}
- **Gender:** ${genderText}
- **Locations:** ${locationsText}
- **Interest Categories:** ${interestsText}

Would you like me to apply these targeting settings to your campaign?`,
              responseOptions: [
                {
                  text: "Yes, apply these settings",
                  value: createOptionId("apply_targeting", targetingRecommendation),
                },
                {
                  text: "No, I'll adjust manually",
                  value: "manual_targeting",
                },
                {
                  text: "Show more targeting options",
                  value: "more_targeting_options",
                },
              ],
            })
          );
        } else {
          // Handle error or invalid response
          store.dispatch(
            addMessage({
              type: "ai",
              content: "I wasn't able to generate targeting recommendations. Let's try a different approach.",
              severity: "warning",
            })
          );
        }
      } catch (error) {
        console.error("Error generating targeting suggestions:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );
        
        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error generating targeting suggestions. Please try again.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    // Handle budget recommendation action
    if (isGenerateBudgetRecommendationAction(action)) {
      store.dispatch(setIsProcessing(true));

      try {
        // Get relevant data from state
        const basicInfo = state.campaign?.formData?.basicInfo || {};
        const campaignGoal = basicInfo.description?.includes("awareness") ? "awareness" : "conversion";
        
        // Use default values or extract from state
        const audienceSize = 100000; // Default value
        const campaignDuration = 30; // Default 30 days
        
        // Use the budget recommendation tool
        const budgetTool = createBudgetRecommendationTool();
        
        // Add user message showing the action
        store.dispatch(
          addMessage({
            type: "user",
            content: "Can you recommend a budget for my campaign?",
          })
        );
        
        // Invoke the tool
        const toolResponse = await budgetTool.invoke(
          JSON.stringify({
            audienceSize,
            campaignDuration,
            campaignGoal,
          })
        );
        
        // Parse the response
        const budgetRecommendation = JSON.parse(toolResponse);
        
        if (budgetRecommendation?.recommendedBudget) {
          // Format numbers for display
          const formattedBudget = budgetRecommendation.recommendedBudget.toLocaleString();
          const formattedImpressions = budgetRecommendation.estimatedImpressions.toLocaleString();
          const formattedClicks = budgetRecommendation.estimatedClicks.toLocaleString();
          
          // Add AI response with the suggestions
          store.dispatch(
            addMessage({
              type: "ai",
              content: `
Based on your campaign goals, I recommend the following budget:

- **Recommended Budget:** $${formattedBudget}
- **CPM Rate:** $${budgetRecommendation.cpmRate.toFixed(2)}
- **Estimated CPC:** $${budgetRecommendation.estimatedCPC.toFixed(2)}
- **Estimated Impressions:** ${formattedImpressions}
- **Estimated Clicks:** ${formattedClicks}

${budgetRecommendation.budgetRationale}

Would you like me to apply this budget to your campaign?`,
              responseOptions: [
                {
                  text: "Yes, apply this budget",
                  value: createOptionId("apply_budget", {
                    maxBudget: budgetRecommendation.recommendedBudget,
                    estimatedReach: budgetRecommendation.estimatedImpressions,
                  }),
                },
                {
                  text: "No, I'll set my own budget",
                  value: "manual_budget",
                },
                {
                  text: "Show lower budget option",
                  value: "lower_budget_option",
                },
                {
                  text: "Show higher budget option",
                  value: "higher_budget_option",
                },
              ],
            })
          );
        } else {
          // Handle error or invalid response
          store.dispatch(
            addMessage({
              type: "ai",
              content: "I wasn't able to generate budget recommendations. Let's try a different approach.",
              severity: "warning",
            })
          );
        }
      } catch (error) {
        console.error("Error generating budget recommendations:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );
        
        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error generating budget recommendations. Please try again.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    return result;
  };

export default campaignAssistantMiddleware; 