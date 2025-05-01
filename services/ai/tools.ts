import { DynamicTool } from "@langchain/core/tools";
import { getDefaultModel } from "./config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import { type RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

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

// Zod schema definitions for filter conditions based on the database structure
const FilterRuleEnum = z.enum(["Include", "Exclude"]);
const FilterLogicEnum = z.enum(["AND", "OR"]);
const FilterFieldEnum = z.enum([
  "MerchantKeyword",
  "MerchantName",
  "OfferCommodity",
  "OfferKeyword",
  "OfferRedemptionType",
  "OfferExpiry",
  // Add other field names as needed
]);

// Define field-specific value validation based on field type
const getValueSchema = (fieldType: string) => {
  switch (fieldType) {
    case "OfferExpiry":
      // Date format validation for expiry
      return z.string().regex(/^\d{4}-\d{2}-\d{2}/, {
        message: "Date should be in YYYY-MM-DD format",
      });
    case "OfferRedemptionType":
      // Specific redemption types
      return z.enum(["P", "Points", "Cash", "Both"]);
    case "OfferKeyword":
    case "MerchantName":
    case "MerchantKeyword":
      // Text with potential array indicators (e.g., "coffee [+4]", "coffee [+9]")
      return z.string().min(1);
    case "OfferCommodity":
      // Commodity categories
      return z.string().min(1);
    default:
      return z.string();
  }
};

// Utility function to get appropriate field placeholder based on field type
export const getFieldPlaceholder = (fieldType: string): string => {
  switch (fieldType) {
    case "OfferExpiry":
      return "YYYY-MM-DD";
    case "OfferRedemptionType":
      return "P, Points, Cash, or Both";
    case "MerchantKeyword":
      return "restaurant, coffee, etc.";
    case "MerchantName":
      return "Starbucks, Local Cafe, etc.";
    case "OfferKeyword":
      return "discount, sale, special, etc.";
    case "OfferCommodity":
      return "Food, Travel, Apparel, etc.";
    case "MerchantId":
      return "merchant UUID";
    case "OfferId":
      return "offer UUID";
    case "Client":
      return "client name";
    case "OfferCategory":
      return "category name";
    case "OfferType":
      return "offer type";
    case "OfferRedemptionControlLimit":
      return "numeric limit";
    default:
      return "Enter value";
  }
};

// Helper type to infer the field type for better type safety
type FilterFieldType = z.infer<typeof FilterFieldEnum>;

// Dynamic schema for filter criterion that validates based on the field type
const createFilterCriterionSchema = () =>
  z
    .object({
      type: FilterFieldEnum,
      value: z.string(), // Initial string type
      rule: FilterRuleEnum,
      and_or: FilterLogicEnum,
      isRequired: z.boolean().default(false),
    })
    .superRefine((criterion, ctx) => {
      // Additional validation based on field type
      const valueSchema = getValueSchema(criterion.type);

      // Parse with the field-specific schema
      const valueResult = valueSchema.safeParse(criterion.value);

      // If validation fails, add an issue
      if (!valueResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid value for ${criterion.type}: ${valueResult.error.message}`,
          path: ["value"],
        });
      }

      // Add field-specific format examples to help with validation
      if (criterion.type === "OfferExpiry" && !valueResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `OfferExpiry should be in format: YYYY-MM-DD`,
          path: ["value"],
        });
      }
    });

// Schema for a single filter criterion
const FilterCriterionSchema = createFilterCriterionSchema();

// Schema for auto-generated filter
const AutoFilterOutputSchema = z.object({
  criteriaToAdd: z.array(FilterCriterionSchema),
  suggestedName: z.string(),
  explanation: z.string(),
});

// Schema for conversation guide response
const ConversationGuideOutputSchema = z.object({
  responseMessage: z.string(),
  responseOptions: z.array(
    z.object({
      text: z.string(),
      value: z.string(),
    })
  ),
  actionType: z.enum([
    "ask_question",
    "suggest_criteria",
    "complete_filter",
    "provide_info",
  ]),
  criteriaToAdd: z.array(FilterCriterionSchema).optional(),
  nextQuestion: z.string().optional(),
});

// Schema for filter analysis
const FilterAnalysisOutputSchema = z.object({
  isComplete: z.boolean(),
  isMissingRequired: z.array(FilterFieldEnum),
  suggestedImprovements: z.array(z.string()),
  effectiveness: z.enum(["high", "medium", "low"]),
  analysis: z.string(),
});

// Create structured output parsers from Zod schemas
const autoFilterParser = StructuredOutputParser.fromZodSchema(
  AutoFilterOutputSchema
);
const conversationGuideParser = StructuredOutputParser.fromZodSchema(
  ConversationGuideOutputSchema
);
const filterAnalysisParser = StructuredOutputParser.fromZodSchema(
  FilterAnalysisOutputSchema
);

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

        // Define a simple schema for filter generator output
        const filterCriteriaSchema = z.object({
          value: z.string(),
          operator: z.enum(["equals", "contains", "startsWith", "endsWith"]),
        });

        const criteriaParser =
          StructuredOutputParser.fromZodSchema(filterCriteriaSchema);
        const formatInstructions = criteriaParser.getFormatInstructions();

        // Properly escape curly braces in the format instructions
        const escapedFormatInstructions = formatInstructions
          .replace(/\{/g, "{{")
          .replace(/\}/g, "}}");

        // Use template with properly escaped curly braces
        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Generate appropriate filter criteria for a product filter.
          
          Filter Name: {filterName}
          Filter Type: {filterType}
          Description: {description}
          
          ${escapedFormatInstructions}
          
          Make the suggestions realistic and relevant to the filter type.
        `);

        const chain = promptTemplate.pipe(model).pipe(criteriaParser);

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

        // Define schema for name suggestions
        const nameSchema = z.array(z.string());
        const nameParser = StructuredOutputParser.fromZodSchema(nameSchema);
        const formatInstructions = nameParser.getFormatInstructions();

        // Properly escape curly braces in the format instructions
        const escapedFormatInstructions = formatInstructions
          .replace(/\{/g, "{{")
          .replace(/\}/g, "}}");

        // Use template with properly escaped curly braces
        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Suggest 5 appropriate names for a product filter with the following details:
          
          Description: {description}
          
          Criteria:
          {criteriaString}
          
          ${escapedFormatInstructions}
          
          The names should be clear, concise, and descriptive of the filter's purpose.
        `);

        const chain = promptTemplate.pipe(model).pipe(nameParser);

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

        // Get format instructions from Zod schema parser
        const formatInstructions = filterAnalysisParser.getFormatInstructions();

        // Properly escape curly braces in the format instructions
        const escapedFormatInstructions = formatInstructions
          .replace(/\{/g, "{{")
          .replace(/\}/g, "}}");

        // Use template with properly escaped curly braces
        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Analyze the following product filter criteria for completeness and effectiveness:
          
          {criteriaString}
          
          Consider the following in your analysis:
          1. Are all required criteria types present? (MerchantKeyword, MerchantName, OfferCommodity, OfferKeyword)
          2. Are the values appropriate and specific enough for their types?
          3. Are the operators (equals, contains, etc.) appropriate for their values?
          
          ${escapedFormatInstructions}
        `);

        const chain = promptTemplate.pipe(model).pipe(filterAnalysisParser);

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

        // Generate field type guidance based on database schema
        const fieldTypeGuidance = `
Field Type Format Guidelines:
- MerchantKeyword: Text string (e.g., "restaurant", "coffee shop")
- MerchantName: Text string, can include specific merchant names (e.g., "Starbucks", "Local Cafe")
- OfferCommodity: Category of product/service (e.g., "Food", "Travel", "Apparel")
- OfferKeyword: Keywords relevant to offers (e.g., "discount", "sale", "special")
- OfferRedemptionType: Use one of: "P" (Points), "Cash", or "Both"
- OfferExpiry: Date in YYYY-MM-DD format (e.g., "2023-12-31")`;

        // Get format instructions from Zod schema parser
        const formatInstructions = autoFilterParser.getFormatInstructions();

        // Properly escape curly braces in the format instructions
        const escapedFormatInstructions = formatInstructions
          .replace(/\{/g, "{{")
          .replace(/\}/g, "}}");

        // Use template with properly escaped curly braces
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
          
          {fieldTypeGuidance}
          
          Your task:
          1. Generate appropriate criteria for all missing required types
          2. If criteria already exist, use them as context to generate coherent additional criteria
          3. Generate values that are specific but not too narrow
          4. Ensure values match the correct format for each field type
          
          ${escapedFormatInstructions}
        `);

        const chain = promptTemplate.pipe(model).pipe(autoFilterParser);

        const response = await chain.invoke({
          filterName: filterName || "Not set",
          filterDescription: filterDescription || "Not set",
          currentCriteriaString,
          conversationString,
          requiredTypesString: requiredTypes.join(", "),
          missingTypesString,
          fieldTypeGuidance,
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

        // Generate field type guidance based on database schema
        const fieldTypeGuidance = `
Field Type Format Guidelines:
- MerchantKeyword: Text string (e.g., "restaurant", "coffee shop")
- MerchantName: Text string, can include specific merchant names (e.g., "Starbucks", "Local Cafe")
- OfferCommodity: Category of product/service (e.g., "Food", "Travel", "Apparel")
- OfferKeyword: Keywords relevant to offers (e.g., "discount", "sale", "special")
- OfferRedemptionType: Use one of: "P" (Points), "Cash", or "Both"
- OfferExpiry: Date in YYYY-MM-DD format (e.g., "2023-12-31")`;

        // Get format instructions from Zod schema parser
        const formatInstructions =
          conversationGuideParser.getFormatInstructions();

        // Properly escape curly braces in the format instructions
        const escapedFormatInstructions = formatInstructions
          .replace(/\{/g, "{{")
          .replace(/\}/g, "}}");

        // Use template with properly escaped curly braces
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
          
          {fieldTypeGuidance}
          
          Your task is to guide the user through creating a product filter by:
          1. Identifying what the user wants to filter (e.g., restaurants, retail offers)
          2. Asking clarifying questions to gather missing required information
          3. Suggesting specific values based on the conversation
          4. Moving the conversation forward toward completion
          5. Ensuring any suggested criteria values use the correct format for each field type
          
          When you have enough information, you should generate filter criteria.
          
          ${escapedFormatInstructions}
        `);

        const chain = promptTemplate.pipe(model).pipe(conversationGuideParser);

        const response = await chain.invoke({
          formStateString,
          conversationString,
          userMessage,
          currentCriteriaString,
          missingRequiredTypes: missingRequiredTypes.join(", "),
          fieldTypeGuidance,
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
