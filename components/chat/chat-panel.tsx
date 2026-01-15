/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- AI SDK types are loosely typed */
"use client";

import type { ToolUIPart } from "ai";

import type { PromptInputMessage } from "@/components/ai-elements/atoms/prompt-input";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useChat } from "@ai-sdk/react";
import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DefaultChatTransport } from "ai";
import Image from "next/image";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/atoms/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/atoms/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/atoms/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/atoms/reasoning";
import {
  Suggestion,
  Suggestions,
} from "@/components/ai-elements/atoms/suggestion";
import {
  Tool,
  ToolContent,
  ToolHeader,
} from "@/components/ai-elements/atoms/tool";
import { Loader } from "@/components/loader";
import { ROUTES } from "@/constants/routes";
import { STORAGE_KEYS } from "@/constants/storage-keys";

interface ChatPanelProps {
  chatWidth: number;
  onChatWidthChange: (width: number) => void;
  onClose: () => void;
}

const SUGGESTIONS = [
  "Create a new offer campaign",
  "Analyze my ad performance",
  "Design a BOGO offer",
  "Show me best practices for offers",
  "Help me target the right audience",
  "Optimize my existing campaigns",
];

export function ChatPanel({
  chatWidth,
  onChatWidthChange,
  onClose,
}: ChatPanelProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);

  const [conversationId, setConversationId] = useState(() => {
    if (typeof window === "undefined") return crypto.randomUUID();

    const stored = localStorage.getItem(STORAGE_KEYS.chat.conversationId);

    if (stored) return stored;

    const newId = crypto.randomUUID();

    localStorage.setItem(STORAGE_KEYS.chat.conversationId, newId);

    return newId;
  });

  // Create transport - simplified for kigo-pro-dashboard
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: ROUTES.nextApi.chat,
        body: { conversationId },
      }),
    [conversationId]
  );

  // Use the AI SDK useChat hook with AI Elements
  const {
    clearError,
    error,
    messages,
    regenerate,
    sendMessage,
    setMessages,
    status,
    stop,
  } = useChat({
    onError: () => {
      // Error handling - error will be displayed in UI via error state
    },
    onFinish: () => {
      /*
       * Generate smart suggestions after AI response
       */
      // Smart suggestions generation will be implemented here
    },
    transport,
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.chat.messages);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);

        setMessages(parsed);
      } catch {
        // Failed to load chat history - ignore and start fresh
      }
    }
  }, [setMessages]);

  /*
   * Save messages to localStorage whenever they change
   * Implement message limit to prevent localStorage overflow (typically 5-10MB limit)
   */
  useEffect(() => {
    if (messages.length > 0) {
      try {
        /*
         * Keep only the last 50 messages to prevent storage overflow
         * Each message can be large due to tool results and reasoning
         */
        const MAX_MESSAGES = 50;
        const messagesToSave =
          messages.length > MAX_MESSAGES
            ? messages.slice(-MAX_MESSAGES)
            : messages;

        localStorage.setItem(
          STORAGE_KEYS.chat.messages,
          JSON.stringify(messagesToSave)
        );
      } catch (error) {
        /*
         * localStorage quota exceeded - clear old messages and try again with fewer
         * This is an important storage error that needs visibility in production
         */
        // eslint-disable-next-line no-console, no-restricted-properties -- Important storage error that needs visibility
        console.warn(
          "localStorage quota exceeded, clearing old messages",
          error
        );
        try {
          // Keep only last 20 messages as fallback
          const recentMessages = messages.slice(-20);

          localStorage.setItem(
            STORAGE_KEYS.chat.messages,
            JSON.stringify(recentMessages)
          );
        } catch {
          // If still failing, clear the storage entirely
          localStorage.removeItem(STORAGE_KEYS.chat.messages);
        }
      }
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  // Dynamic placeholder based on status
  const placeholder = useMemo(() => {
    switch (status) {
      case "error":
        return "Error occurred. Try again...";
      case "streaming":
        return "Generating response...";
      case "submitted":
        return "Thinking...";
      default:
        return "Ask me anything...";
    }
  }, [status]);

  const handleSubmit = async (message: PromptInputMessage) => {
    // eslint-disable-next-line no-console -- Debug logging for chat submission
    console.log("PromptInput onSubmit called with:", message);
    if (message.text.trim() || message.files.length) {
      // If already loading, queue the message
      if (isLoading) {
        setMessageQueue((prev) => [...prev, message.text]);

        return;
      }
      await sendMessage({ text: message.text });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // If already loading, queue the message
    if (isLoading) {
      setMessageQueue((prev) => [...prev, suggestion]);

      return;
    }
    void sendMessage({ text: suggestion });
  };

  // Process message queue when chat becomes available
  useEffect(() => {
    if (!isLoading && messageQueue.length > 0) {
      const [nextMessage, ...remainingQueue] = messageQueue;

      if (nextMessage) {
        const processQueue = async () => {
          setMessageQueue(remainingQueue);
          await sendMessage({ text: nextMessage });
        };

        void processQueue();
      }
    }
  }, [isLoading, messageQueue, sendMessage]);

  const handleCloseClick = () => {
    onClose();
  };

  const handleClearChat = () => {
    // Stop any ongoing generation before clearing
    if (isLoading) {
      void stop();
    }
    setMessages([]);
    setMessageQueue([]);
    localStorage.removeItem(STORAGE_KEYS.chat.messages);

    // Generate new conversation ID for fresh conversation
    const newId = crypto.randomUUID();

    setConversationId(newId);
    localStorage.setItem(STORAGE_KEYS.chat.conversationId, newId);
  };

  // Resize functionality
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsResizing(true);
      setStartX(event.clientX);
      setStartWidth(chatWidth);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    },
    [chatWidth]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = startX - event.clientX;
      const newWidth = Math.max(300, Math.min(800, startWidth + deltaX));

      onChatWidthChange(newWidth);
    },
    [isResizing, startX, startWidth, onChatWidthChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const handleRegenerate = useCallback(() => {
    void regenerate();
  }, [regenerate]);

  const handleCopyResponse = (allParts: any[]) => {
    // Extract text content from all text parts
    const textContent = allParts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n\n");

    void navigator.clipboard.writeText(textContent);
  };

  const handleDismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  const handleStop = useCallback(async () => {
    await stop();
  }, [stop]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="flex h-full flex-col border-l bg-white shadow-lg"
      style={{ width: `${String(chatWidth)}px` }}
    >
      {/* Resize handle on left edge */}
      <button
        aria-label="Resize chat panel"
        className={`absolute top-0 left-0 h-full w-1 cursor-ew-resize transition-colors ${
          isResizing ? "bg-blue-500" : "hover:bg-gray-300"
        }`}
        onMouseDown={handleMouseDown}
        type="button"
      />
      {/* Header */}
      <div className="flex h-[72px] items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Image alt="Kigo AI" height={32} src="/kigo logo.svg" width={120} />
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              aria-label="Clear chat"
              className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={handleClearChat}
              title="Clear conversation"
              type="button"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
          <button
            aria-label="Close assistant"
            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={handleCloseClick}
            type="button"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Chat - Using AI Elements */}
      <div className="relative flex flex-1 flex-col divide-y overflow-hidden">
        <Conversation className="overflow-x-hidden" resize="instant">
          <ConversationContent className="min-h-0 overflow-x-hidden">
            {messages.map(({ id, parts, role }, msgIndex) => {
              // Cast parts to any to handle all UIMessage part types

              const allParts = parts as any[];
              const isLastMessage = msgIndex === messages.length - 1;

              return (
                <Message from={role} key={id}>
                  <div>
                    {/* Render all parts in order */}
                    {allParts.map((part, partIndex) => {
                      const isLastPart = partIndex === allParts.length - 1;
                      const isStreaming =
                        status === "streaming" && isLastMessage && isLastPart;

                      switch (part.type) {
                        case "reasoning":
                          return (
                            <Reasoning
                              className="w-full"
                              isStreaming={isStreaming}
                              key={`${id}-${String(partIndex)}`}
                            >
                              <ReasoningTrigger />
                              {}
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );

                        case "text":
                          return (
                            <MessageContent key={`${id}-${String(partIndex)}`}>
                              {}
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          );

                        case "tool-call": {
                          // Find matching result

                          const toolResult = allParts.find(
                            (partItem: any) =>
                              partItem.type === "tool-result" &&
                              partItem.toolCallId === part.toolCallId
                          );

                          const toolState: ToolUIPart["state"] = toolResult
                            ? toolResult.error
                              ? "output-error"
                              : "output-available"
                            : "input-available";

                          return (
                            <Tool key={`${id}-${String(partIndex)}`}>
                              {}
                              <ToolHeader
                                state={toolState}
                                title={part.toolName}
                                type={part.type}
                              />
                              {toolResult && (
                                <ToolContent>
                                  {}
                                  {toolResult.error ? (
                                    <p className="text-sm text-red-600">
                                      {}
                                      Error: {String(toolResult.error)}
                                    </p>
                                  ) : (
                                    <pre className="overflow-auto rounded bg-gray-50 p-2 text-xs">
                                      {}
                                      {JSON.stringify(
                                        toolResult.result,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  )}
                                </ToolContent>
                              )}
                            </Tool>
                          );
                        }

                        case "tool-result":
                          // Already handled in tool-call case
                          return null;

                        default:
                          return null;
                      }
                    })}

                    {/* Action buttons for assistant messages */}
                    {role === "assistant" &&
                      isLastMessage &&
                      status !== "streaming" && (
                        <div className="mt-2 flex gap-1">
                          <button
                            aria-label="Regenerate response"
                            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
                            onClick={handleRegenerate}
                            type="button"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Copy response"
                            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleCopyResponse(allParts)}
                            type="button"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                  </div>
                </Message>
              );
            })}

            {/* Show loader when AI is thinking */}
            {status === "submitted" && (
              <Message className="min-h-[60px]" from="assistant">
                <div className="ml-4 flex items-center gap-2">
                  <Loader className="size-5" />
                  <span className="text-muted-foreground text-sm">
                    Thinking...
                  </span>
                </div>
              </Message>
            )}

            {/* Show error if request fails */}
            {error && (
              <div className="mx-4 my-2 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                <p className="flex-1 text-sm text-red-800">
                  <strong>Error:</strong>{" "}
                  {error.message || "Failed to send message"}
                </p>
                <button
                  aria-label="Dismiss error"
                  className="rounded p-1 text-red-600 hover:bg-red-100"
                  onClick={handleDismissError}
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Suggestions and Input Area */}
        <div className="grid shrink-0 gap-4 pt-4">
          {/* Show suggestions when not loading */}
          {!isLoading && (
            <Suggestions className="px-4">
              {SUGGESTIONS.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
          )}

          {/* Show queue indicator if messages are queued */}
          {messageQueue.length > 0 && (
            <div className="mx-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {messageQueue.length} message{messageQueue.length > 1 ? "s" : ""}{" "}
              queued
            </div>
          )}

          <div className="w-full px-4 pb-4">
            <PromptInput multiple onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  disabled={isLoading}
                  placeholder={placeholder}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit onStop={handleStop} status={status} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
