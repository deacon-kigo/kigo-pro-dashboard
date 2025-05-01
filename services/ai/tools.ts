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

// Tool for analyzing existing filter criteria
export const createFilterAnalysisTool = () => {
  return new DynamicTool({
    name: "filter_analyzer",
    description:
      "Analyzes existing filter criteria and suggests improvements. Input must be a JSON string with keys: filterName (string), criteria (array of {type: string, value: string, operator: string}).",
    func: async (
      input: string,
      runManager?: CallbackManagerForToolRun | undefined,
      config?: RunnableConfig
    ): Promise<string> => {
      try {
        // Parse the JSON input string
        const { filterName, criteria }: FilterAnalysisInput = JSON.parse(input);

        const model = getDefaultModel({ temperature: 0.2 });

        const criteriaString = criteria
          .map(
            (c) => `Type: ${c.type}, Value: ${c.value}, Operator: ${c.operator}`
          )
          .join("\n");

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
          Analyze the following product filter criteria for "${filterName}":
          
          {criteriaString}
          
          Provide analysis in JSON format:
          {
            "analysis": "Overall analysis of the criteria set",
            "missingRequiredTypes": ["List of any missing required criteria types"],
            "suggestions": ["List of suggestions for improvement"],
            "potentialIssues": ["List of potential issues with current criteria"]
          }
          
          Required criteria types are: MerchantKeyword, MerchantName, OfferCommodity, OfferKeyword
        `);

        const outputParser = new JsonOutputParser();

        const chain = promptTemplate.pipe(model).pipe(outputParser);

        const response = await chain.invoke({
          filterName,
          criteriaString,
        });

        return JSON.stringify(response);
      } catch (error) {
        console.error("Error in filter analysis tool:", error);
        return JSON.stringify({
          error: "Failed to analyze filter criteria",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
};
