import { DynamicTool } from "@langchain/core/tools";
import { getDefaultModel } from "./config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { type RunnableConfig } from "@langchain/core/runnables";

// Define input types for better type safety
interface ProductFilterCriteriaInput {
  filterName: string;
  filterType: string;
  description?: string;
}

interface FilterNameSuggestionInput {
  description: string;
  criteria?: Array<{ type: string; value: string }>;
}

interface FilterAnalysisInput {
  filterName: string;
  criteria: Array<{ type: string; value: string; operator: string }>;
}

// New interface for filter criterion
interface FilterCriterion {
  type: string;
  value: string;
  rule: string;
  and_or?: string;
  isRequired?: boolean;
}

// Tool for generating product filter criteria
export const createProductFilterCriteriaTool = () => {
  return new DynamicTool({
    name: "product_filter_generator",
    description:
      "Generates appropriate criteria for product filters based on filter name and type. Input must be a JSON string with keys: filterName (string), filterType (string), description (string, optional).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const {
          filterName,
          filterType,
          description = "",
        }: ProductFilterCriteriaInput = JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.2 });

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Generate appropriate filter criteria for a product filter.
          
          Filter Name: {filterName}
          Filter Type: {filterType}
          Description: {description}
          
          Return a JSON object with the following structure:
          {
            "value": "The appropriate value for this filter type",
            "operator": "The appropriate operator (equals, contains, startsWith, endsWith)"
          }
          
          Make the suggestions realistic and relevant to the filter type.
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          filterName,
          filterType,
          description,
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in product filter generator tool:", error);
        return JSON.stringify({
          error: "Failed to generate filter criteria",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
};

// Tool for generating product filter names
export const createFilterNameSuggestionTool = () => {
  return new DynamicTool({
    name: "filter_name_suggester",
    description:
      "Suggests appropriate names for product filters based on description or criteria. Input must be a JSON string with keys: description (string), criteria (array of {type: string, value: string}, optional).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const { description, criteria = [] }: FilterNameSuggestionInput =
          JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.7 });

        const criteriaString =
          criteria.length > 0
            ? criteria.map((c) => `${c.type}: ${c.value}`).join("\n")
            : "No criteria provided";

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Suggest 5 appropriate names for a product filter with the following details:
          
          Description: {description}
          
          Criteria:
          {criteriaString}
          
          Return a JSON array of strings, each being a suggested name.
          The names should be clear, concise, and descriptive of the filter's purpose.
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          description,
          criteriaString,
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in filter name suggestion tool:", error);
        return JSON.stringify({
          error: "Failed to generate filter name suggestions",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
};

// Tool for analyzing product filter criteria
export const createFilterAnalysisTool = () => {
  return new DynamicTool({
    name: "filter_criteria_analyzer",
    description:
      "Analyzes product filter criteria for completeness and effectiveness. Input must be a JSON string with keys: criteria (array of {type: string, value: string, rule: string}).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const { criteria }: { criteria: Array<FilterCriterion> } =
          JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.2 });

        const criteriaString = criteria
          .map((c) => `Type: ${c.type}, Value: ${c.value}, Rule: ${c.rule}`)
          .join("\n");

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Analyze the following product filter criteria for completeness and effectiveness:
          
          {criteriaString}
          
          Consider the following in your analysis:
          1. Are all required criteria types present? (MerchantKeyword, MerchantName, OfferCommodity, OfferKeyword)
          2. Are the values appropriate and specific enough for their types?
          3. Are the operators (equals, contains, etc.) appropriate for their values?
          
          Return a JSON object with the following structure:
          {
            "isComplete": true/false,
            "isMissingRequired": [array of missing required criteria types],
            "suggestedImprovements": [array of improvement suggestions],
            "effectiveness": "high"/"medium"/"low",
            "analysis": "brief analysis"
          }
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          criteriaString,
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in filter criteria analyzer tool:", error);
        return JSON.stringify({
          error: "Failed to analyze filter criteria",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
};

// Tool for auto-generating complete product filters based on context
export const createAutoFilterGeneratorTool = () => {
  return new DynamicTool({
    name: "auto_filter_generator",
    description:
      "Automatically generates a complete product filter based on conversation context and existing criteria. Input must be a JSON string with keys: filterName (string, optional), filterDescription (string, optional), currentCriteria (array of existing criteria, optional), conversationHistory (array of message objects).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const {
          filterName = "",
          filterDescription = "",
          currentCriteria = [],
          conversationHistory = [],
        } = JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.4 });

        // Format the conversation history for the prompt
        const conversationString = conversationHistory
          .map(
            (msg: any) =>
              `${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n");

        // Format current criteria
        const currentCriteriaString =
          currentCriteria.length > 0
            ? currentCriteria
                .map(
                  (c: any) =>
                    `Type: ${c.type}, Value: ${c.value}, Rule: ${c.rule || "equals"}`
                )
                .join("\n")
            : "No criteria set yet.";

        const requiredTypes = [
          "MerchantKeyword",
          "MerchantName",
          "OfferCommodity",
          "OfferKeyword",
        ];

        // Check which required criteria are missing
        const missingRequiredTypes = requiredTypes.filter(
          (type) => !currentCriteria.some((c: any) => c.type === type)
        );

        const missingTypesString =
          missingRequiredTypes.length > 0
            ? missingRequiredTypes.join(", ")
            : "None";

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          You are a product filter generation specialist who can create appropriate filter criteria.
          
          Current Context:
          Filter Name: {filterName}
          Filter Description: {filterDescription}
          
          Current Criteria:
          {currentCriteriaString}
          
          Conversation History:
          {conversationString}
          
          Required Criteria Types:
          {requiredTypesString}
          
          Missing Required Types:
          {missingTypesString}
          
          Your task:
          1. Generate appropriate criteria for all missing required types
          2. If criteria already exist, use them as context to generate coherent additional criteria
          3. Generate values that are specific but not too narrow
          
          Return a JSON object with this structure:
          {
            "criteriaToAdd": [
              {
                "type": "string - criteria type",
                "value": "string - appropriate value",
                "rule": "string - operator (equals, contains, startsWith, endsWith)",
                "and_or": "string - AND or OR",
                "isRequired": boolean
              }
            ],
            "suggestedName": "string - suggested filter name if none exists",
            "explanation": "string - brief explanation of the generated filter"
          }
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          filterName: filterName || "Not set",
          filterDescription: filterDescription || "Not set",
          currentCriteriaString,
          conversationString,
          requiredTypesString: requiredTypes.join(", "),
          missingTypesString,
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in auto filter generator tool:", error);
        return JSON.stringify({
          error: "Failed to generate automatic filter",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
};

// Tool for conversational filter creation guidance
export const createFilterConversationGuideTool = () => {
  return new DynamicTool({
    name: "filter_conversation_guide",
    description:
      "Guides users through creating product filters with a conversational approach. Input must be a JSON string with keys: userMessage (string), conversationHistory (array of message objects), currentCriteria (array of existing criteria, optional), filterContext (object containing form state, optional).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const {
          userMessage = "",
          conversationHistory = [],
          currentCriteria = [],
          filterContext = null,
        } = JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.4 });

        // Format the conversation history for the prompt
        const conversationString = conversationHistory
          .map(
            (msg: any) =>
              `${msg.type === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n");

        // Get criteria from filter context if available, otherwise use currentCriteria
        const criteriaToUse = filterContext?.currentCriteria || currentCriteria;

        // Format current criteria
        const currentCriteriaString =
          criteriaToUse.length > 0
            ? criteriaToUse
                .map(
                  (c: any) =>
                    `Type: ${c.type}, Value: ${c.value}, Rule: ${c.rule || "equals"}`
                )
                .join("\n")
            : "No criteria set yet.";

        // Format form state if available
        const formStateString = filterContext
          ? `
          Filter Name: ${filterContext.filterName || "Not set"}
          Query View Name: ${filterContext.queryViewName || "Not set"}
          Description: ${filterContext.description || "Not set"}
          Expiry Date: ${
            filterContext.expiryDate
              ? filterContext.expiryDate instanceof Date
                ? filterContext.expiryDate.toLocaleDateString()
                : new Date(filterContext.expiryDate).toLocaleDateString()
              : "Not set"
          }
          `
          : "Form state not available";

        const requiredTypes = [
          "MerchantKeyword",
          "MerchantName",
          "OfferCommodity",
          "OfferKeyword",
        ];

        // Check which required criteria are missing
        const missingRequiredTypes = requiredTypes.filter(
          (type) => !criteriaToUse.some((c: any) => c.type === type)
        );

        // Identify the current step in the filter creation process
        const currentStep = determineCurrentStep(
          criteriaToUse,
          userMessage.toLowerCase()
        );

        // Define standard responses based on identified step
        const stepResponse = generateStepResponse(
          currentStep,
          missingRequiredTypes
        );

        // Skip the LLM call for natural language understanding
        // Return a structured response directly
        return JSON.stringify({
          responseMessage: stepResponse.message,
          responseOptions: stepResponse.options,
          actionType: stepResponse.actionType,
          criteriaToAdd: stepResponse.criteriaToAdd || [],
        });
      } catch (error) {
        console.error("Error in filter conversation guide tool:", error);
        return JSON.stringify({
          error: "Failed to process conversation",
          details: error instanceof Error ? error.message : String(error),
          responseMessage:
            "I'm sorry, I encountered an error processing your request. Let's try a different approach.",
          responseOptions: [
            {
              text: "Start building a filter",
              value: "start_filter_creation",
            },
            {
              text: "Use auto-generate instead",
              value: "trigger_magic_generate",
            },
          ],
          actionType: "provide_info",
        });
      }
    },
  });
};

// Helper function to determine which step in the filter creation process we're at
function determineCurrentStep(currentCriteria: any[], userMessage: string) {
  // Count how many required criteria types we already have
  const criteriaTypes = currentCriteria.map((c) => c.type);
  const hasKeyword = criteriaTypes.includes("MerchantKeyword");
  const hasName = criteriaTypes.includes("MerchantName");
  const hasCommodity = criteriaTypes.includes("OfferCommodity");
  const hasOfferKeyword = criteriaTypes.includes("OfferKeyword");

  const completedCount = [
    hasKeyword,
    hasName,
    hasCommodity,
    hasOfferKeyword,
  ].filter(Boolean).length;

  // Check if user message indicates a specific filter category
  if (
    userMessage.includes("restaurant") ||
    userMessage.includes("food") ||
    userMessage.includes("dining")
  ) {
    return "FOOD_FILTER";
  } else if (
    userMessage.includes("shopping") ||
    userMessage.includes("retail")
  ) {
    return "RETAIL_FILTER";
  } else if (userMessage.includes("entertainment")) {
    return "ENTERTAINMENT_FILTER";
  }

  // Otherwise use progress-based steps
  if (completedCount === 0) {
    return "START";
  } else if (completedCount === 4) {
    return "COMPLETE";
  } else {
    // Return which criteria type is missing next
    if (!hasKeyword) return "NEED_MERCHANT_KEYWORD";
    if (!hasName) return "NEED_MERCHANT_NAME";
    if (!hasCommodity) return "NEED_OFFER_COMMODITY";
    if (!hasOfferKeyword) return "NEED_OFFER_KEYWORD";
    return "PARTIAL";
  }
}

// Helper function to generate structured responses for each step
function generateStepResponse(
  step: string,
  missingTypes: string[]
): {
  message: string;
  options: Array<{ text: string; value: string }>;
  actionType: string;
  criteriaToAdd?: Array<any>;
} {
  switch (step) {
    case "START":
      return {
        message:
          "Let's build your filter. What type of filter are you interested in creating?",
        options: [
          { text: "Restaurant/Food filter", value: "start_restaurant_filter" },
          { text: "Shopping/Retail filter", value: "start_retail_filter" },
          { text: "Entertainment filter", value: "start_entertainment_filter" },
        ],
        actionType: "ask_question",
      };

    case "FOOD_FILTER":
      return {
        message:
          "Let's create a restaurant filter. Please select the options you want to include:",
        options: [
          {
            text: "Add 'Restaurant' as merchant keyword",
            value:
              'suggest_criteria:{"type":"MerchantKeyword","value":"Restaurant","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Dining' as offer commodity",
            value:
              'suggest_criteria:{"type":"OfferCommodity","value":"Dining","rule":"equals","and_or":"AND","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "RETAIL_FILTER":
      return {
        message:
          "Let's create a shopping filter. Please select the options you want to include:",
        options: [
          {
            text: "Add 'Retail' as merchant keyword",
            value:
              'suggest_criteria:{"type":"MerchantKeyword","value":"Retail","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Shopping' as offer commodity",
            value:
              'suggest_criteria:{"type":"OfferCommodity","value":"Shopping","rule":"equals","and_or":"AND","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "NEED_MERCHANT_KEYWORD":
      return {
        message: "Select a merchant keyword for your filter:",
        options: [
          {
            text: "Add 'Restaurant' as merchant keyword",
            value:
              'suggest_criteria:{"type":"MerchantKeyword","value":"Restaurant","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Retail' as merchant keyword",
            value:
              'suggest_criteria:{"type":"MerchantKeyword","value":"Retail","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Entertainment' as merchant keyword",
            value:
              'suggest_criteria:{"type":"MerchantKeyword","value":"Entertainment","rule":"contains","and_or":"OR","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "NEED_MERCHANT_NAME":
      return {
        message: "Select a merchant name for your filter:",
        options: [
          {
            text: "Add 'Local Business' as merchant name",
            value:
              'suggest_criteria:{"type":"MerchantName","value":"Local Business","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Chain Stores' as merchant name",
            value:
              'suggest_criteria:{"type":"MerchantName","value":"Chain Stores","rule":"contains","and_or":"OR","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "NEED_OFFER_COMMODITY":
      return {
        message: "Select an offer commodity for your filter:",
        options: [
          {
            text: "Add 'Food' as offer commodity",
            value:
              'suggest_criteria:{"type":"OfferCommodity","value":"Food","rule":"equals","and_or":"AND","isRequired":true}',
          },
          {
            text: "Add 'Merchandise' as offer commodity",
            value:
              'suggest_criteria:{"type":"OfferCommodity","value":"Merchandise","rule":"equals","and_or":"AND","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "NEED_OFFER_KEYWORD":
      return {
        message: "Select an offer keyword for your filter:",
        options: [
          {
            text: "Add 'Discount' as offer keyword",
            value:
              'suggest_criteria:{"type":"OfferKeyword","value":"Discount","rule":"contains","and_or":"OR","isRequired":true}',
          },
          {
            text: "Add 'Special' as offer keyword",
            value:
              'suggest_criteria:{"type":"OfferKeyword","value":"Special","rule":"contains","and_or":"OR","isRequired":true}',
          },
        ],
        actionType: "suggest_criteria",
      };

    case "COMPLETE":
      return {
        message:
          "You've selected all required criteria. Would you like to finalize your filter?",
        options: [
          { text: "Yes, finalize filter", value: "confirm_complete_filter" },
          { text: "No, I want to make changes", value: "modify_filter" },
        ],
        actionType: "complete_filter",
      };

    case "PARTIAL":
      // Create a message that specifically mentions missing criteria
      return {
        message: `Your filter still needs the following criteria: ${missingTypes.join(", ")}. Let's add them:`,
        options: [
          { text: "Continue adding criteria", value: "next_criteria_step" },
          {
            text: "Auto-generate missing criteria",
            value: "trigger_magic_generate",
          },
        ],
        actionType: "suggest_criteria",
      };

    default:
      return {
        message:
          "Let's continue building your filter. What would you like to do next?",
        options: [
          { text: "Start with a template", value: "start_filter_creation" },
          { text: "Auto-generate a filter", value: "trigger_magic_generate" },
        ],
        actionType: "ask_question",
      };
  }
}
