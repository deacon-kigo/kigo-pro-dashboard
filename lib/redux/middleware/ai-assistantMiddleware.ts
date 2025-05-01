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
} from "@/services/ai/tools";
import { RootState } from "../store";

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
          text: "Give me examples for this filter",
          value: "suggest_examples_for_filter",
        },
        {
          text: "Help me choose values for required criteria",
          value: "help_required_criteria",
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
  }

  // Default response for unknown option IDs
  return {
    content:
      "I'm not sure how to help with that specific request. Can you tell me more about what you're trying to do with your product filter?",
  };
};

// Extend RootState with productFilter
interface ExtendedState extends RootState {
  productFilter?: {
    filterName?: string;
    description?: string;
  };
}

const aiAssistantMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    // First pass the action to the next middleware
    const result = next(action);

    // Get current state
    const state = store.getState() as ExtendedState;

    // Handle user message submissions
    if (isAddMessageAction(action) && action.payload.type === "user") {
      const userMessage = action.payload.content;
      const systemPrompt = state.aiAssistant.systemPrompt;

      // Set processing state
      store.dispatch(setIsProcessing(true));

      try {
        // Check if we're in product filter mode based on context
        if (state.aiAssistant.contextId === "productFilterContext") {
          // Use conversational filter guide for product filter mode
          const conversationGuideTool = createFilterConversationGuideTool();

          // Prepare context for the tool
          const conversationHistory = state.aiAssistant.messages;
          const currentCriteria = state.aiAssistant.currentCriteria || [];

          // Invoke the tool
          const toolResponse = await conversationGuideTool.invoke(
            JSON.stringify({
              userMessage,
              conversationHistory,
              currentCriteria,
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

            // If there are criteria to add immediately
            if (
              response.actionType === "suggest_criteria" ||
              response.actionType === "complete_filter"
            ) {
              if (response.criteriaToAdd && response.criteriaToAdd.length > 0) {
                // Create payload for applying updates
                const updatePayload = {
                  criteriaToAdd: response.criteriaToAdd,
                };

                // Add a follow-up message with options to apply
                store.dispatch(
                  addMessage({
                    type: "ai",
                    content:
                      "I've identified some criteria based on our conversation. Would you like me to apply these to your filter?",
                    responseOptions: [
                      {
                        text: "Yes, apply these criteria",
                        value: `apply_updates:${JSON.stringify(updatePayload)}`,
                      },
                      {
                        text: "No, let me adjust manually",
                        value: "cancel_generate",
                      },
                    ],
                  })
                );
              }
            }
          }
        } else {
          // For non-product filter modes, use the standard chat service
          const chatService = createChatService(systemPrompt);
          const response = await chatService.sendMessage(userMessage);

          // Add AI response to the store
          store.dispatch(
            addMessage({
              type: "ai",
              content: response,
              responseOptions:
                systemPrompt === "PRODUCT_FILTER_ASSISTANT"
                  ? [
                      {
                        text: "What criteria types should I include?",
                        value: "explain_criteria_types",
                      },
                      {
                        text: "How do I choose good values?",
                        value: "explain_criteria_values",
                      },
                    ]
                  : undefined,
            })
          );
        }
      } catch (error) {
        console.error("Error in AI assistant middleware:", error);
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

    // Handle option selection
    if (isOptionSelectedAction(action)) {
      const optionId = action.payload;

      // Get current filter name and description from state if available
      const filterName = state.productFilter?.filterName;
      const filterDescription = state.productFilter?.description;

      store.dispatch(setIsProcessing(true));

      try {
        // Add user message showing the selected option
        const selectedOption = state.aiAssistant.messages
          .flatMap((msg: AIMessage) => msg.responseOptions || [])
          .find((option: ResponseOption) => option.value === optionId);

        if (selectedOption) {
          store.dispatch(
            addMessage({
              type: "user",
              content: selectedOption.text,
            })
          );
        }

        // Handle the option
        const response = await handleOptionSelected(
          optionId,
          filterName,
          filterDescription
        );

        // Add AI response
        store.dispatch(
          addMessage({
            type: "ai",
            content: response.content,
            responseOptions: response.responseOptions,
            severity: response.severity,
          })
        );
      } catch (error) {
        console.error("Error handling option selection:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );

        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error processing that option. Please try something else.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    // Handle magic generation
    if (isMagicGenerateAction(action)) {
      // Set processing state
      store.dispatch(setIsProcessing(true));

      try {
        // Add user message showing the action
        store.dispatch(
          addMessage({
            type: "user",
            content: "Generate product filters based on my requirements",
          })
        );

        // Create auto filter generator tool
        const autoGeneratorTool = createAutoFilterGeneratorTool();

        // Get current context from state
        const filterName = state.productFilter?.filterName || "";
        const filterDescription = state.productFilter?.description || "";
        const currentCriteria = state.aiAssistant.currentCriteria || [];
        const conversationHistory = state.aiAssistant.messages;

        // Invoke the tool
        const toolResponse = await autoGeneratorTool.invoke(
          JSON.stringify({
            filterName,
            filterDescription,
            currentCriteria,
            conversationHistory,
          })
        );

        // Parse the response
        const response = JSON.parse(toolResponse);

        if (response.error) {
          // Handle error
          store.dispatch(
            addMessage({
              type: "ai",
              content: `I encountered an error while generating filters: ${response.details}`,
              severity: "error",
            })
          );
        } else {
          // Create explanation content
          const explanation =
            response.explanation ||
            "I've analyzed your requirements and generated appropriate filter criteria.";
          const missingTypes = response.criteriaToAdd
            .map((c: any) => c.type)
            .join(", ");

          const content = `
${explanation}

I'm ready to add the following criteria: ${missingTypes}

Would you like me to apply these updates to your filter?`;

          // Add AI response with option to apply
          store.dispatch(
            addMessage({
              type: "ai",
              content,
              responseOptions: [
                {
                  text: "Yes, apply these updates",
                  value: `apply_updates:${JSON.stringify({
                    criteriaToAdd: response.criteriaToAdd,
                    filterName:
                      response.suggestedName && !filterName
                        ? response.suggestedName
                        : undefined,
                  })}`,
                },
                {
                  text: "No, let me adjust manually",
                  value: "cancel_generate",
                },
              ],
            })
          );
        }
      } catch (error) {
        console.error("Error in magic filter generation:", error);
        store.dispatch(
          setError(error instanceof Error ? error.message : "Unknown error")
        );

        // Add error message
        store.dispatch(
          addMessage({
            type: "ai",
            content:
              "Sorry, I encountered an error generating the filter. Please try describing your requirements in more detail.",
            severity: "error",
          })
        );
      } finally {
        store.dispatch(setIsProcessing(false));
      }
    }

    return result;
  };

export default aiAssistantMiddleware;
