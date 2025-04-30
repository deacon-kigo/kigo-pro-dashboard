import { Middleware } from "redux";
import {
  addMessage,
  setIsProcessing,
  setError,
} from "../slices/ai-assistantSlice";
import { createChatService } from "@/services/ai/chat";
import { createProductFilterCriteriaTool } from "@/services/ai/tools";

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
) => {
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

const aiAssistantMiddleware: Middleware =
  (store) => (next) => async (action) => {
    // First pass the action to the next middleware
    const result = next(action);

    // Get current state
    const state = store.getState();

    // Handle user message submissions
    if (
      action.type === "aiAssistant/addMessage" &&
      action.payload.type === "user"
    ) {
      const userMessage = action.payload.content;
      const systemPrompt = state.aiAssistant.systemPrompt;

      // Set processing state
      store.dispatch(setIsProcessing(true));

      try {
        // Create chat service with the current system prompt
        const chatService = createChatService(systemPrompt);

        // Send message and get response
        const response = await chatService.sendMessage(userMessage);

        // Add AI response to the store
        store.dispatch(
          addMessage({
            type: "ai",
            content: response,
            // For product filters, add some helpful response options
            responseOptions:
              state.aiAssistant.systemPrompt === "PRODUCT_FILTER_ASSISTANT"
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
    if (action.type === "aiAssistant/optionSelected") {
      const optionId = action.payload;

      // Get current filter name and description from state if available
      const filterName = state.productFilter?.filterName;
      const filterDescription = state.productFilter?.description;

      store.dispatch(setIsProcessing(true));

      try {
        // Add user message showing the selected option
        const selectedOption = state.aiAssistant.messages
          .flatMap((msg) => msg.responseOptions || [])
          .find((option) => option.value === optionId);

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

    return result;
  };

export default aiAssistantMiddleware;
