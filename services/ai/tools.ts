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

        const model = getDefaultModel({ temperature: 0.7 });

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

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          You are an AI assistant helping users create product filters in a conversational way.
          
          Current Form State:
          {formStateString}
          
          Current Conversation:
          {conversationString}
          
          User's Latest Message:
          {userMessage}
          
          Current Filter Criteria:
          {currentCriteriaString}
          
          Required Criteria Types Still Needed:
          {missingRequiredTypes}
          
          Your task is to guide the user through creating a product filter by:
          1. Identifying what the user wants to filter (e.g., restaurants, retail offers)
          2. Asking clarifying questions to gather missing required information
          3. Suggesting specific values based on the conversation
          4. Moving the conversation forward toward completion
          
          When you have enough information, you should generate filter criteria.
          
          Return a JSON object with this structure:
          {{
            "responseMessage": "Your conversational response to the user",
            "responseOptions": [
              {{
                "text": "Option text to show user",
                "value": "option_value"
              }}
            ],
            "actionType": "ask_question" | "suggest_criteria" | "complete_filter" | "provide_info",
            "criteriaToAdd": [
              {{
                "type": "string - criteria type",
                "value": "string - appropriate value",
                "rule": "string - appropriate operator",
                "and_or": "string - AND or OR",
                "isRequired": boolean
              }}
            ],
            "nextQuestion": "What specific question to ask next if actionType is ask_question"
          }}
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          formStateString,
          conversationString,
          userMessage,
          currentCriteriaString,
          missingRequiredTypes: missingRequiredTypes.join(", "),
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in filter conversation guide tool:", error);
        return JSON.stringify({
          error: "Failed to process conversation",
          details: error instanceof Error ? error.message : String(error),
          responseMessage:
            "I'm sorry, I encountered an error processing your request. Could you try again with different wording?",
          responseOptions: [],
          actionType: "provide_info",
        });
      }
    },
  });
};
