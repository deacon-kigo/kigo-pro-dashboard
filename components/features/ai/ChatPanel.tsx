"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PaperAirplaneIcon,
  LightBulbIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Define types for the ChatPanel
export interface AIMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  responseOptions?: Array<{
    text: string;
    value: string;
  }>;
  severity?: "info" | "warning" | "success" | "error";
  contextId?: string | null;
  systemPrompt?: string;
  error?: string | null;
  currentCriteria?: any[];
  attachment?: {
    type: "image" | "chart" | "file";
    url: string;
    title: string;
    description?: string;
  };
}

export interface ChatPanelProps {
  title: string;
  description?: string;
  messages: AIMessage[];
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
  onOptionSelected: (optionId: string) => void;
  onMagicGenerate?: () => void;
  className?: string;
  showMagicButton?: boolean;
}

// Helper component for chat message
interface ChatMessageProps {
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
  applyInstantFilter?: () => void;
}

const ChatMessage = ({
  message,
  onOptionSelected,
  applyInstantFilter,
}: ChatMessageProps) => {
  // handleOptionClick to handle button clicks
  const handleOptionClick = (event: React.MouseEvent, value: string) => {
    // Stop propagation to prevent other handlers from capturing the event
    event.preventDefault();
    event.stopPropagation();
    console.log(
      "Option clicked:",
      value,
      "Prevented default and stopped propagation"
    );

    // Always auto-apply filter for dining options as a fallback
    if (
      (value.includes("dining") || value.includes("restaurant")) &&
      applyInstantFilter
    ) {
      applyInstantFilter();
    } else {
      onOptionSelected(value);
    }
  };

  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className={`rounded-lg p-3 max-w-[80%] break-words ${
          message.type === "user"
            ? "bg-primary text-white rounded-tr-none"
            : "bg-blue-50 text-blue-800 shadow-sm rounded-tl-none border border-blue-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {message.type === "ai" ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Main content */}
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-2 last:mb-0" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-2 last:mb-0" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal pl-5 mb-2 last:mb-0"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1 last:mb-0" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold mb-2" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-base font-semibold mb-1" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-500 hover:underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <div className="my-2">
                      <Image
                        src={props.src || ""}
                        alt={props.alt || ""}
                        width={400}
                        height={300}
                        className="rounded max-w-full"
                        style={{ height: "auto", objectFit: "contain" }}
                      />
                    </div>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Response options - enhanced and prioritized */}
            {message.responseOptions && message.responseOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 flex flex-wrap gap-3 max-w-full p-1"
              >
                <AnimatePresence>
                  {message.responseOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={(e) => handleOptionClick(e, option.value)}
                      className={`
                        relative overflow-hidden z-50 shadow-sm
                        ${
                          option.value.includes("suggest_complete_filter")
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                            : option.value.includes("suggest_multiple_criteria")
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                              : option.value.includes("apply_updates:")
                                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                                : "bg-white hover:bg-gray-100 text-blue-700 border border-blue-300"
                        }
                        font-medium py-3 px-4 rounded-full text-xs sm:text-sm
                        cursor-pointer hover:shadow-md transition-all duration-150
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        hover:scale-105
                      `}
                    >
                      {option.text}
                      {/* Add directional icon for options */}
                      {option.value.includes("apply_updates:") && (
                        <span className="ml-1">→</span>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};

// Simplified AI Thinking Indicator
const AIThinkingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 animate-pulse py-2">
      <div className="h-2 w-2 bg-blue-300 rounded-full"></div>
      <div className="h-2 w-2 bg-blue-300 rounded-full animation-delay-200"></div>
      <div className="h-2 w-2 bg-blue-300 rounded-full animation-delay-400"></div>
      <span className="text-xs text-muted-foreground">AI is thinking...</span>
    </div>
  );
};

// The ChatPanel component
export const ChatPanel: React.FC<ChatPanelProps> = ({
  title,
  description,
  messages,
  isProcessing,
  onSendMessage,
  onOptionSelected,
  onMagicGenerate,
  className = "",
  showMagicButton = true,
}) => {
  const [newMessage, setNewMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isProcessing) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  // A function that applies the instant filter - to be passed into the ChatMessage component
  const applyInstantFilter = () => {
    if (onMagicGenerate) {
      onMagicGenerate();
    }
  };

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header - Fixed at exactly 61px to match product filter header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px]">
        <div className="flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-primary" />
          <div>
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages - Scrollable container with absolute positioning */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{ pointerEvents: "auto" }}
        >
          <div className="p-4 space-y-4">
            {messages.map((message: AIMessage) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelected={onOptionSelected}
                applyInstantFilter={applyInstantFilter}
              />
            ))}

            {isProcessing && <AIThinkingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <form
          className="flex items-center space-x-2"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Magic Generate Button - optional */}
          {showMagicButton && onMagicGenerate && (
            <div className="relative group">
              <Button
                type="button"
                variant="secondary"
                icon={<SparklesIcon className="w-5 h-5 animate-pulse" />}
                iconOnly
                disabled={isProcessing}
                className="shadow-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
                aria-label="Magic Generate"
                onClick={onMagicGenerate}
              />
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Instant Magic Filter
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-solid border-transparent border-t-black"></div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            icon={<PaperAirplaneIcon className="w-5 h-5" />}
            iconOnly
            disabled={!newMessage.trim() || isProcessing}
            className="shadow-md"
            aria-label="Send message"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
