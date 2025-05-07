import { Middleware, AnyAction } from "redux";
import {
  addMessage,
  setIsProcessing,
  setError,
  AIMessage,
} from "../slices/ai-assistantSlice";
import { createChatService } from "@/services/ai/chat";
import {
  createProductFilterCriteriaTool,
  createAutoFilterGeneratorTool,
  createFilterConversationGuideTool,
  createCampaignGeneratorTool,
  createCampaignAnalysisTool,
} from "@/services/ai/tools";
import { RootState } from "../store";
import {
  selectFilterName,
  selectQueryViewName,
  selectDescription,
  selectExpiryDate,
  selectCriteria,
  selectCompleteFilterContext,
} from "../selectors/productFilterSelectors";
import { selectCompleteCampaignContext } from "../selectors/adsCampaignSelectors";

// Define action types for type checking
interface AddMessageAction extends AnyAction {
  type: "aiAssistant/addMessage";
  payload: {
    type: string;
    content: string;
  };
}

interface OptionSelectedAction extends AnyAction {
  type: "aiAssistant/optionSelected";
  payload: string;
}

interface MagicGenerateAction extends AnyAction {
  type: "aiAssistant/magicGenerate";
}

// Type guard for actions
function isAddMessageAction(action: AnyAction): action is AddMessageAction {
  return action.type === "aiAssistant/addMessage";
}

function isOptionSelectedAction(
  action: AnyAction
): action is OptionSelectedAction {
  return action.type === "aiAssistant/optionSelected";
}

function isMagicGenerateAction(
  action: AnyAction
): action is MagicGenerateAction {
  return action.type === "aiAssistant/magicGenerate";
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

// Handle specific option IDs and generate responses
const handleOptionSelected = async (
  optionId: string,
  filterName?: string,
  filterDescription?: string
): Promise<AIResponse> => {
  // For product filter context
  if (optionId === "explain_criteria_types") {
    return {
      content: `
There are two types of criteria for product filters:

**Required Criteria Types:**
- **MerchantKeyword**: Keywords that identify merchants (e.g., "pizza", "coffee", "auto")
- **MerchantName**: Specific merchant names (e.g., "Papa John's", "Starbucks")
- **OfferCommodity**: The primary product or service category (e.g., "food", "clothing")
- **OfferKeyword**: Keywords that identify specific offers (e.g., "discount", "BOGO")

**Optional Criteria Types:**
- **Client**: Specific client identifiers
- **MerchantId**: Unique merchant identifiers
- **OfferCategory**: Secondary categorization (e.g., "fast food", "casual dining")
- **OfferExpiry**: When the offer expires
- **OfferId**: Unique offer identifiers
- **OfferRedemptionControlLimit**: Limits on redemption
- **OfferRedemptionType**: How offers are redeemed
- **OfferType**: The type of offer (e.g., "coupon", "discount")

All required criteria types must be included for a valid product filter.`,
      responseOptions: [
        {
          text: "Let's start building a filter",
          value: "start_filter_creation",
        },
        {
          text: "Give me examples for this filter",
          value: "suggest_examples_for_filter",
        },
        {
          text: "Help me choose values for required criteria",
          value: "help_required_criteria",
        },
      ],
    };
  } else if (optionId === "start_filter_creation") {
    // Start the guided filter creation process
    return {
      content:
        "Let's create your filter step by step. What type of filter would you like to build?",
      responseOptions: [
        {
          text: "Restaurant/Food filter",
          value: "start_restaurant_filter",
        },
        {
          text: "Retail/Shopping filter",
          value: "start_retail_filter",
        },
        {
          text: "Entertainment filter",
          value: "start_entertainment_filter",
        },
        {
          text: "Other (I'll describe it)",
          value: "custom_filter_description",
        },
      ],
    };
  } else if (optionId === "start_restaurant_filter") {
    // Start with a restaurant filter template
    return {
      content:
        "Let's build a restaurant filter. For required criteria, I recommend the following values:",
      responseOptions: [
        {
          text: "Use 'Restaurant' as merchant keyword",
          value: createOptionId("suggest_criteria", {
            type: "MerchantKeyword",
            value: "Restaurant",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
        {
          text: "Use 'Dining' as offer commodity",
          value: createOptionId("suggest_criteria", {
            type: "OfferCommodity",
            value: "Dining",
            rule: "equals",
            and_or: "AND",
            isRequired: true,
          }),
        },
        {
          text: "Add more criteria options",
          value: "show_more_restaurant_criteria",
        },
      ],
    };
  } else if (optionId === "start_retail_filter") {
    // Start with a retail filter template
    return {
      content:
        "Let's build a retail/shopping filter. For required criteria, I recommend the following values:",
      responseOptions: [
        {
          text: "Use 'Retail' as merchant keyword",
          value: createOptionId("suggest_criteria", {
            type: "MerchantKeyword",
            value: "Retail",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
        {
          text: "Use 'Shopping' as offer commodity",
          value: createOptionId("suggest_criteria", {
            type: "OfferCommodity",
            value: "Shopping",
            rule: "equals",
            and_or: "AND",
            isRequired: true,
          }),
        },
        {
          text: "Add more criteria options",
          value: "show_more_retail_criteria",
        },
      ],
    };
  } else if (optionId === "magic_generate_intro") {
    return {
      content:
        "The auto-generate feature will create a complete filter based on the information you've provided so far. It's perfect for quickly creating filters with all required criteria.",
      responseOptions: [
        {
          text: "Auto-generate my filter now",
          value: "trigger_magic_generate",
        },
        {
          text: "I'd rather build step-by-step",
          value: "start_filter_creation",
        },
      ],
    };
  } else if (optionId === "next_criteria_step") {
    return {
      content:
        "Great progress! Let's continue building your filter. Which criteria would you like to add next?",
      responseOptions: [
        {
          text: "Add merchant name criteria",
          value: "add_merchant_name",
        },
        {
          text: "Add offer keyword criteria",
          value: "add_offer_keyword",
        },
        {
          text: "Complete my filter",
          value: "complete_filter_flow",
        },
      ],
    };
  } else if (optionId === "add_merchant_name") {
    return {
      content: "Please select a merchant name option for your filter:",
      responseOptions: [
        {
          text: "Use 'Local Eateries' as merchant name",
          value: createOptionId("suggest_criteria", {
            type: "MerchantName",
            value: "Local Eateries",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
        {
          text: "Use 'Chain Restaurants' as merchant name",
          value: createOptionId("suggest_criteria", {
            type: "MerchantName",
            value: "Chain Restaurants",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
      ],
    };
  } else if (optionId === "add_offer_keyword") {
    return {
      content: "Please select an offer keyword option for your filter:",
      responseOptions: [
        {
          text: "Use 'Discount' as offer keyword",
          value: createOptionId("suggest_criteria", {
            type: "OfferKeyword",
            value: "Discount",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
        {
          text: "Use 'Special' as offer keyword",
          value: createOptionId("suggest_criteria", {
            type: "OfferKeyword",
            value: "Special",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          }),
        },
      ],
    };
  } else if (optionId === "complete_filter_flow") {
    return {
      content:
        "You've selected all the required criteria for your filter. Would you like to finalize it now?",
      responseOptions: [
        {
          text: "Yes, create this filter",
          value: "confirm_complete_filter",
        },
        {
          text: "No, I want to make changes",
          value: "modify_filter",
        },
      ],
    };
  } else if (optionId === "explain_criteria_values") {
    return {
      content: `
When choosing criteria values, consider these guidelines:

1. **Be specific but not too narrow**: Values like "pizza" are better than "food" (too broad) or "pepperoni pizza" (too narrow)

2. **Use common terminology**: Use industry-standard terms that merchants and consumers would use

3. **Consider variations**: Think about different ways people might describe the same thing

4. **Be consistent**: Use similar patterns for similar types of criteria

5. **For merchant keywords**: Use categories like "dining", "retail", "entertainment"

6. **For merchant names**: Use official business names without variations

7. **For offer commodities**: Use broad product categories like "food", "apparel", "electronics"

8. **For offer keywords**: Use terms like "discount", "free", "bogo", "limited-time"

Would you like me to suggest specific values for your filter?`,
      responseOptions: [
        {
          text: "Yes, suggest values for " + (filterName || "this filter"),
          value: "suggest_values",
        },
        {
          text: "Show me an example of a complete filter",
          value: "show_example_filter",
        },
      ],
    };
  } else if (optionId === "best_practices") {
    return {
      content: `
# Best Practices for Product Filters

1. **Clear naming**: Give your filter a descriptive name that clearly indicates its purpose

2. **Include all required criteria**: Ensure all 4 required criteria types are included

3. **Balance precision and recall**: Too specific means missed offers, too broad means irrelevant offers

4. **Test your filter**: Validate that it captures the intended offers

5. **Document your decisions**: Add good descriptions to help others understand the filter's purpose

6. **Use appropriate operators**: 
   - "equals" for exact matches
   - "contains" for partial matches
   - "startsWith"/"endsWith" for prefix/suffix matches

7. **Consider expiry dates**: Set appropriate expiration for seasonal or temporary filters

8. **Reuse successful patterns**: When a filter works well, use similar criteria for related filters

Would you like more specific guidance based on what you're trying to build?`,
      responseOptions: [
        {
          text: "Help me with my criteria selection",
          value: "help_criteria_selection",
        },
        {
          text: "Show me an example of a great filter",
          value: "show_great_filter_example",
        },
      ],
    };
  } else if (optionId === "suggest_values") {
    // Use the product filter criteria tool to generate suggestions
    try {
      const tool = createProductFilterCriteriaTool();

      // Suggest criteria for MerchantKeyword
      const merchantKeywordResult = await tool.invoke({
        filterName: filterName || "Product Filter",
        filterType: "MerchantKeyword",
        description: filterDescription || "",
      });

      const merchantNameResult = await tool.invoke({
        filterName: filterName || "Product Filter",
        filterType: "MerchantName",
        description: filterDescription || "",
      });

      // Parse results
      const keywordSuggestion = JSON.parse(merchantKeywordResult);
      const nameSuggestion = JSON.parse(merchantNameResult);

      return {
        content: `
Based on ${filterName ? `"${filterName}"` : "your filter"}, here are some suggested values:

**MerchantKeyword**: "${keywordSuggestion.value}" (using ${keywordSuggestion.operator})
**MerchantName**: "${nameSuggestion.value}" (using ${nameSuggestion.operator})

Would you like to use any of these suggestions?`,
        responseOptions: [
          {
            text: `Use "${keywordSuggestion.value}" for MerchantKeyword`,
            value: createOptionId("suggest_criteria", {
              type: "MerchantKeyword",
              value: keywordSuggestion.value,
              operator: keywordSuggestion.operator,
            }),
          },
          {
            text: `Use "${nameSuggestion.value}" for MerchantName`,
            value: createOptionId("suggest_criteria", {
              type: "MerchantName",
              value: nameSuggestion.value,
              operator: nameSuggestion.operator,
            }),
          },
          {
            text: "Suggest values for other criteria types",
            value: "suggest_more_values",
          },
        ],
      };
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return {
        content:
          "I'm sorry, I encountered an error generating suggestions. Please try again or enter your own values.",
        severity: "error",
      };
    }
  } else if (optionId === "confirm_complete_filter") {
    // Get state from selector inside the middleware execution
    try {
      // Create a final filter from all collected criteria
      const criteriaToAdd = [
        {
          type: "MerchantKeyword",
          value: "Restaurant",
          rule: "contains",
          and_or: "OR",
          isRequired: true,
        },
        {
          type: "MerchantName",
          value: "Local Eateries",
          rule: "contains",
          and_or: "OR",
          isRequired: true,
        },
        {
          type: "OfferCommodity",
          value: "Dining",
          rule: "equals",
          and_or: "AND",
          isRequired: true,
        },
        {
          type: "OfferKeyword",
          value: "Discount",
          rule: "contains",
          and_or: "OR",
          isRequired: true,
        },
      ];

      const filterNameSuggestion = filterName || "Complete Restaurant Filter";

      // Return the options to apply the complete filter
      return {
        content:
          "Great! I've prepared a complete filter with all required criteria. Ready to finalize it?",
        responseOptions: [
          {
            text: "Yes, create this filter",
            value: `apply_updates:${JSON.stringify({
              criteriaToAdd,
              filterName: filterNameSuggestion,
              queryViewName: "RestaurantDiningView",
              expiryDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            })}`,
          },
          {
            text: "No, I need to make changes first",
            value: "modify_filter",
          },
        ],
      };
    } catch (error) {
      console.error("Error creating complete filter:", error);
      return {
        content:
          "I encountered an error while finalizing your filter. Let's take a step back.",
        responseOptions: [
          {
            text: "Start over",
            value: "start_filter_creation",
          },
          {
            text: "Try using auto-generate instead",
            value: "trigger_magic_generate",
          },
        ],
        severity: "error",
      };
    }
  } else if (optionId === "modify_filter") {
    return {
      content: "What would you like to change about your filter?",
      responseOptions: [
        {
          text: "Change merchant keyword criteria",
          value: "modify_merchant_keyword",
        },
        {
          text: "Change merchant name criteria",
          value: "modify_merchant_name",
        },
        {
          text: "Change offer commodity criteria",
          value: "modify_offer_commodity",
        },
        {
          text: "Change offer keyword criteria",
          value: "modify_offer_keyword",
        },
      ],
    };
  }

  // Default response for unknown option IDs
  return {
    content:
      "I'm not sure how to help with that specific request. Can you tell me more about what you're trying to do with your product filter?",
  };
};

// AI middleware that handles AI operations
const aiAssistantMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    const result = next(action);

    if (isAddMessageAction(action) && action.payload.type === "user") {
      const state = store.getState() as RootState;
      const contextId = state.aiAssistant.contextId;
      const currentMessage = action.payload.content;

      console.log("AI Assistant received message:", {
        message: currentMessage,
        contextId,
        state: {
          campaignContext: state.aiAssistant.campaignContext,
          currentCriteria: state.aiAssistant.currentCriteria,
        },
      });

      // Mark as processing
      store.dispatch(setIsProcessing(true));

      try {
        // Process based on context
        if (contextId === "productFilterContext") {
          // Get filter context from state
          const filterContext = selectCompleteFilterContext(state);

          // Simulate AI response for now
          setTimeout(() => {
            // Get response based on message content
            const simResponse = simulateProductFilterResponse(
              currentMessage,
              filterContext
            );

            store.dispatch(
              addMessage({
                type: "ai",
                content: simResponse.content,
                responseOptions: simResponse.responseOptions,
                severity: simResponse.severity,
              })
            );

            store.dispatch(setIsProcessing(false));
          }, 1200);
        } else if (contextId === "adsCampaignContext") {
          // Get campaign context from state
          const campaignContext = selectCompleteCampaignContext(state);

          try {
            // Extract campaign type and intent from message
            const campaignType = extractCampaignTypeFromMessage(currentMessage);

            // Use the campaign generator LangChain tool
            const campaignGeneratorTool = createCampaignGeneratorTool();

            // Prepare input for the tool
            const toolInput = JSON.stringify({
              campaignType,
              description: currentMessage,
              currentContext: campaignContext,
            });

            console.log("Calling campaign generator with:", toolInput);

            // Call the LangChain tool
            const result = await campaignGeneratorTool.invoke(toolInput);
            const campaignSuggestion = JSON.parse(result);

            console.log("Campaign generator result:", campaignSuggestion);

            // Check for errors in the response
            if (campaignSuggestion.error) {
              store.dispatch(
                addMessage({
                  type: "ai",
                  content: `I encountered an issue while creating your campaign: ${campaignSuggestion.error}. Can you provide more details about what you're looking for?`,
                  severity: "error",
                })
              );
            } else {
              // Format locations properly for the UI
              const formattedLocations = campaignSuggestion.locations.map(
                (loc) => ({
                  type: loc.type,
                  value: loc.value,
                })
              );

              // Send response with campaign suggestion
              store.dispatch(
                addMessage({
                  type: "ai",
                  content: `I've generated a campaign based on your request! Here's what I came up with:
                  
**${campaignSuggestion.campaignName}**
${campaignSuggestion.campaignDescription}

Would you like me to apply these settings to your campaign form?`,
                  responseOptions: [
                    {
                      text: "Apply these settings",
                      value: `apply_updates:${JSON.stringify({
                        ...campaignSuggestion,
                        locations: formattedLocations,
                      })}`,
                    },
                    {
                      text: "Start step-by-step workflow instead",
                      value: "start_workflow",
                    },
                    {
                      text: "No thanks, I'll continue manually",
                      value: "cancel_generation",
                    },
                  ],
                })
              );
            }
          } catch (error) {
            console.error("Error processing campaign generator:", error);

            // Fallback to simulated response if LangChain fails
            const simResponse = simulateAdsCampaignResponse(
              currentMessage,
              campaignContext
            );

            store.dispatch(
              addMessage({
                type: "ai",
                content: simResponse.content,
                responseOptions: simResponse.responseOptions,
                severity: simResponse.severity,
              })
            );
          } finally {
            // Always turn off processing state
            store.dispatch(setIsProcessing(false));
          }
        } else {
          // Default demo chat flow without context
          setTimeout(() => {
            store.dispatch(
              addMessage({
                type: "ai",
                content: getDemoResponse(currentMessage),
                responseOptions: getDefaultOptions(),
              })
            );
            store.dispatch(setIsProcessing(false));
          }, 800);
        }
      } catch (error) {
        console.error("AI Assistant Error:", error);
        store.dispatch(
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          )
        );
        store.dispatch(setIsProcessing(false));
      }
    } else if (isMagicGenerateAction(action)) {
      const state = store.getState() as RootState;
      const contextId = state.aiAssistant.contextId;

      if (contextId === "productFilterContext") {
        // Handle magic generate for product filters
        // ... existing product filter magic generate code ...
      } else if (contextId === "adsCampaignContext") {
        // Handle magic generate for campaign context
        const campaignContext = selectCompleteCampaignContext(state);

        store.dispatch(setIsProcessing(true));

        try {
          // Use the campaign generator LangChain tool
          const campaignGeneratorTool = createCampaignGeneratorTool();

          // Prepare input for the tool
          const toolInput = JSON.stringify({
            campaignType: "general",
            description:
              "Create an optimized campaign based on the current context",
            currentContext: campaignContext,
          });

          // Call the LangChain tool
          const result = await campaignGeneratorTool.invoke(toolInput);
          const generatedCampaign = JSON.parse(result);

          // Check for errors in the response
          if (generatedCampaign.error) {
            store.dispatch(
              addMessage({
                type: "ai",
                content: `I encountered an issue while creating your campaign: ${generatedCampaign.error}. Let's try creating your campaign step by step instead.`,
                responseOptions: [
                  {
                    text: "Start step-by-step workflow",
                    value: "start_workflow",
                  },
                ],
                severity: "error",
              })
            );
          } else {
            // Format locations properly for the UI
            const formattedLocations =
              generatedCampaign.locations?.map((loc) => ({
                type: loc.type,
                value: loc.value,
              })) || [];

            // Send response with campaign suggestion
            store.dispatch(
              addMessage({
                type: "ai",
                content: `I've generated a complete campaign for you! Here's what I created:
                
**${generatedCampaign.campaignName}**
${generatedCampaign.campaignDescription}

Would you like me to apply these settings to your campaign form?`,
                responseOptions: [
                  {
                    text: "Apply these settings",
                    value: `apply_updates:${JSON.stringify({
                      ...generatedCampaign,
                      locations: formattedLocations,
                    })}`,
                  },
                  {
                    text: "Start step-by-step workflow instead",
                    value: "start_workflow",
                  },
                  {
                    text: "No thanks, I'll continue manually",
                    value: "cancel_generation",
                  },
                ],
              })
            );
          }
        } catch (error) {
          console.error("Error with campaign generator:", error);

          // Fallback to simulated generation
          const generatedCampaign = generateAdsCampaign(campaignContext);

          store.dispatch(
            addMessage({
              type: "ai",
              content:
                "I've generated a campaign based on your specifications! Would you like me to apply these settings?",
              responseOptions: [
                {
                  text: "Apply these settings",
                  value: `apply_updates:${JSON.stringify(generatedCampaign)}`,
                },
                {
                  text: "Start step-by-step workflow",
                  value: "start_workflow",
                },
                {
                  text: "No thanks, I'll continue manually",
                  value: "cancel_generation",
                },
              ],
            })
          );
        } finally {
          store.dispatch(setIsProcessing(false));
        }
      }
    }

    return result;
  };

// Helper function to extract campaign type from user message
function extractCampaignTypeFromMessage(message: string): string {
  const messageLC = message.toLowerCase();

  // Check for common campaign types
  if (
    messageLC.includes("coffee") ||
    messageLC.includes("cafe") ||
    messageLC.includes("beverage")
  ) {
    return "coffee";
  }

  if (
    messageLC.includes("retail") ||
    messageLC.includes("shop") ||
    messageLC.includes("store")
  ) {
    return "retail";
  }

  if (
    messageLC.includes("restaurant") ||
    messageLC.includes("food") ||
    messageLC.includes("dining")
  ) {
    return "restaurant";
  }

  if (
    messageLC.includes("travel") ||
    messageLC.includes("vacation") ||
    messageLC.includes("tourism")
  ) {
    return "travel";
  }

  if (
    messageLC.includes("entertainment") ||
    messageLC.includes("movie") ||
    messageLC.includes("theater")
  ) {
    return "entertainment";
  }

  // Default to general if no specific type is found
  return "general";
}

// Simulate AI response for ads campaign context
function simulateAdsCampaignResponse(
  message: string,
  context: any
): AIResponse {
  console.log("Simulating ads campaign response for:", message);

  const messageLC = message.toLowerCase();
  // Check for coffee-related campaign request with typo tolerance
  if (
    messageLC.includes("coffe") ||
    messageLC.includes("coffee") ||
    messageLC.includes("cafe") ||
    messageLC.includes("treat")
  ) {
    console.log("Coffee/treat campaign detected in message");
    return {
      content:
        "I can help you create a coffee and treat campaign! Would you like me to suggest a campaign configuration based on this theme?",
      responseOptions: [
        {
          text: "Yes, generate a coffee campaign",
          value: `apply_updates:${JSON.stringify({
            merchantId: "12345",
            merchantName: "Coffee Express Inc.",
            campaignName: "Coffee & Treats Special",
            campaignDescription:
              "Campaign for coffee shops and bakeries offering deals on beverages and pastries",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            campaignWeight: "medium",
            mediaTypes: ["Display Banner", "Social Media"],
            locations: [
              { type: "state", value: "CA" },
              { type: "state", value: "NY" },
            ],
            budget: "5000",
          })}`,
        },
        {
          text: "Start step-by-step workflow",
          value: "start_workflow",
        },
        {
          text: "No thanks, I'll continue manually",
          value: "cancel_generation",
        },
      ],
    };
  }

  // Check for retail campaign request
  if (
    message.toLowerCase().includes("retail") ||
    message.toLowerCase().includes("shop")
  ) {
    return {
      content:
        "I can help you create a retail shopping campaign! Would you like me to suggest a campaign configuration?",
      responseOptions: [
        {
          text: "Yes, generate a retail campaign",
          value: `apply_updates:${JSON.stringify({
            merchantId: "67890",
            merchantName: "Global Retail Partners",
            campaignName: "Seasonal Shopping Spree",
            campaignDescription:
              "Campaign targeting retail shoppers with seasonal discounts and promotions",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 60 * 24 * 60 * 60 * 1000
            ).toISOString(),
            campaignWeight: "large",
            mediaTypes: ["Display Banner", "Video", "Native"],
            locations: [
              { type: "msa", value: "New York-Newark-Jersey City" },
              { type: "msa", value: "Los Angeles-Long Beach-Anaheim" },
            ],
            budget: "10000",
          })}`,
        },
        {
          text: "Start step-by-step workflow",
          value: "start_workflow",
        },
        {
          text: "No thanks, I'll continue manually",
          value: "cancel_generation",
        },
      ],
    };
  }

  // Default response
  return {
    content:
      "I'm your campaign creation assistant. Tell me about the campaign you want to create, or ask me to help you build one step by step.",
    responseOptions: [
      {
        text: "Create a coffee shop campaign",
        value: "coffee_campaign",
      },
      {
        text: "Create a retail shopping campaign",
        value: "retail_campaign",
      },
      {
        text: "Start the workflow",
        value: "start_workflow",
      },
    ],
  };
}

// Generate ads campaign based on context
function generateAdsCampaign(context: any) {
  // If we already have partial campaign data, use it as a base
  const campaign = {
    merchantId: context.merchantId || "12345",
    merchantName: context.merchantName || "Sample Merchant",
    campaignName: context.campaignName || "AI Generated Campaign",
    campaignDescription:
      context.campaignDescription ||
      "This campaign was automatically generated based on your requirements",
    startDate: context.startDate || new Date().toISOString(),
    endDate:
      context.endDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    campaignWeight: context.campaignWeight || "medium",
    mediaTypes:
      context.mediaTypes?.length > 0
        ? context.mediaTypes
        : ["Display Banner", "Social Media"],
    locations:
      context.locations?.length > 0
        ? context.locations
        : [{ type: "state", value: "CA" }],
    budget: context.budget || "5000",
  };

  return campaign;
}

// Simulate AI response for product filter context
function simulateProductFilterResponse(
  message: string,
  context: any
): AIResponse {
  // Default response for product filter context
  return {
    content:
      "I'm your product filter assistant. Tell me what kind of filter you'd like to create.",
    responseOptions: [
      {
        text: "Explain criteria types",
        value: "explain_criteria_types",
      },
      {
        text: "Start creating a filter",
        value: "start_filter_creation",
      },
      {
        text: "Auto-generate a filter",
        value: "magic_generate_intro",
      },
    ],
  };
}

// Get default demo response
function getDemoResponse(message: string): string {
  // Simple demo response
  return "I'm your AI assistant. How can I help you with your campaigns today?";
}

// Get default options
function getDefaultOptions(): ResponseOption[] {
  return [
    {
      text: "Create a campaign",
      value: "create_campaign",
    },
    {
      text: "Help me with product filters",
      value: "help_product_filters",
    },
    {
      text: "Show me campaign analytics",
      value: "show_analytics",
    },
  ];
}

export default aiAssistantMiddleware;
