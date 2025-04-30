import { getDefaultModel } from "./config";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

export interface ChatMessage {
  role: "human" | "ai" | "system";
  content: string;
  timestamp?: Date;
}

export class ChatService {
  private model;
  private memory;
  private chatHistory: ChatMessage[] = [];
  private systemPrompt: string;

  constructor(systemPrompt: string = "You are a helpful AI assistant.") {
    this.model = getDefaultModel();
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    });
    this.systemPrompt = systemPrompt;
  }

  // Convert our internal message format to LangChain message format
  private formatMessagesForLangChain() {
    return this.chatHistory.map((msg) => {
      switch (msg.role) {
        case "human":
          return new HumanMessage(msg.content);
        case "ai":
          return new AIMessage(msg.content);
        case "system":
          return new SystemMessage(msg.content);
      }
    });
  }

  // Add a new message to the chat history
  public addMessage(role: "human" | "ai" | "system", content: string) {
    this.chatHistory.push({
      role,
      content,
      timestamp: new Date(),
    });

    // Also update the memory
    if (role === "human") {
      this.memory.saveContext(
        { input: content },
        {
          output:
            this.chatHistory.length > 1
              ? this.chatHistory[this.chatHistory.length - 2].content
              : "",
        }
      );
    }
  }

  // Get the chat history
  public getMessages(): ChatMessage[] {
    return [...this.chatHistory];
  }

  // Reset the chat history
  public resetChat() {
    this.chatHistory = [];
    // Add system prompt as the first message
    this.addMessage("system", this.systemPrompt);
  }

  // Send a message and get a response
  public async sendMessage(message: string): Promise<string> {
    // Add user message to history
    this.addMessage("human", message);

    try {
      // Create a chain with memory
      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", this.systemPrompt],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]);

      const chain = new ConversationChain({
        memory: this.memory,
        prompt: chatPrompt,
        llm: this.model,
      });

      // Use the chain to get a response
      const response = await chain.call({
        input: message,
      });

      // Add AI response to history
      const aiResponse =
        response.response || "I'm not sure how to respond to that.";
      this.addMessage("ai", aiResponse);

      return aiResponse;
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage = "Sorry, there was an error processing your request.";
      this.addMessage("ai", errorMessage);
      return errorMessage;
    }
  }

  // Create a standalone chat sequence (alternative to ConversationChain)
  public createChatSequence() {
    const outputParser = new StringOutputParser();

    return RunnableSequence.from([
      {
        systemPrompt: () => this.systemPrompt,
        messages: () => this.formatMessagesForLangChain(),
        humanInput: (input: { text: string }) => input.text,
      },
      {
        messages: ({ systemPrompt, messages, humanInput }) => [
          new SystemMessage(systemPrompt),
          ...messages,
          new HumanMessage(humanInput),
        ],
      },
      this.model,
      outputParser,
    ]);
  }
}

// Create and export a default chat service instance
export const createChatService = (systemPrompt?: string) => {
  return new ChatService(systemPrompt);
};
