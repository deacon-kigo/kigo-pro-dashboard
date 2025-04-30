import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Model provider interface
interface ModelProvider {
  getModel: (options?: Record<string, any>) => any;
}

// Configure model providers
export const modelProviders: Record<string, ModelProvider> = {
  openai: {
    getModel: (options = {}) =>
      new ChatOpenAI({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        modelName: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4.1-2025-04-14",
        temperature: 0.7,
        ...options,
      }),
  },
  anthropic: {
    getModel: (options = {}) =>
      new ChatAnthropic({
        anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        modelName:
          process.env.NEXT_PUBLIC_ANTHROPIC_MODEL ||
          "claude-3-7-sonnet-20250219",
        temperature: 0.7,
        ...options,
      }),
  },
  gemini: {
    getModel: (options = {}) => {
      console.warn(
        "Gemini provider not implemented - falling back to default provider"
      );
      return modelProviders.openai.getModel(options);

      // TODO: Implement when dependencies are available
      // return new ChatGoogleGenerativeAI({
      //   apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      //   modelName: process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-pro-preview-03-25",
      //   temperature: 0.7,
      //   ...options
      // });
    },
  },
  xai: {
    getModel: (options = {}) => {
      console.warn(
        "XAI provider not implemented - falling back to default provider"
      );
      return modelProviders.openai.getModel(options);

      // TODO: Implement when XAI API integration is available
      // const provider = new CustomXAIProvider({
      //   apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY,
      //   modelName: process.env.NEXT_PUBLIC_XAI_MODEL || "grok-3-beta",
      //   ...options,
      // });
      // return provider;
    },
  },
};

// Default model selection
export const getDefaultModel = (options = {}) => {
  const defaultProvider =
    process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || "openai";

  // Ensure we have a valid provider, fallback to openai if not
  const provider = modelProviders[defaultProvider] || modelProviders.openai;
  return provider.getModel(options);
};

// Reusable sequence for simple text generation
export const createTextGenerationChain = (systemPrompt: string) => {
  const model = getDefaultModel();
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([
    {
      system: () => systemPrompt,
      human: (input: { text: string }) => input.text,
    },
    {
      messages: ({ system, human }: { system: string; human: string }) => [
        new SystemMessage(system),
        new HumanMessage(human),
      ],
    },
    model,
    outputParser,
  ]);
};
