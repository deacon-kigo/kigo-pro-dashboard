import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

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
        modelName: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-3.5-turbo",
        temperature: 0.7,
        ...options,
      }),
  },
  anthropic: {
    getModel: (options = {}) =>
      new ChatAnthropic({
        anthropicApiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        modelName:
          process.env.NEXT_PUBLIC_ANTHROPIC_MODEL || "claude-3-haiku-20240307",
        temperature: 0.7,
        ...options,
      }),
  },
};

// Default model selection
export const getDefaultModel = (options = {}) => {
  const defaultProvider =
    process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER || "openai";
  return (
    modelProviders[defaultProvider]?.getModel(options) ||
    modelProviders.openai.getModel(options)
  );
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
