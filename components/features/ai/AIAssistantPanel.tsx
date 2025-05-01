"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PaperAirplaneIcon,
  LightBulbIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  AIMessage,
  addMessage,
  setIsProcessing,
} from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define types locally (Consider moving to a shared types file later)
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

interface ResponseOption {
  text: string;
  value: string;
}

interface Attachment {
  type: "image" | "chart" | "file";
  url: string;
  title: string;
  description?: string;
}

interface AIAssistantPanelProps {
  onOptionSelected: (optionId: string) => void;
  onSend?: (message: string) => void;
  className?: string;
  title: string;
  description?: string;
  requiredCriteriaTypes: string[];
}

const AIAssistantPanel = ({
  onOptionSelected,
  onSend = () => {},
  className = "",
  title,
  description,
  requiredCriteriaTypes,
}) => {
  const { clientId } = useDemoState();
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Determine mode
  const isProductFilterMode = pathname.includes("/product-filters");

  // Redux state (used only in product filter mode)
  const {
    messages: reduxMessages,
    isProcessing: reduxIsProcessing,
    currentCriteria,
  } = useSelector((state: RootState) => state.aiAssistant);

  // Local state (used primarily for demo mode)
  const [localMessages, setLocalMessages] = useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [clarifyingQuestionStep, setClarifyingQuestionStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [proposedUpdatePayload, setProposedUpdatePayload] = useState<any>(null);

  // Helper function for demo greetings
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Initial greeting for demo mode
  useEffect(() => {
    if (!isProductFilterMode && clientId && localMessages.length === 0) {
      const timer = setTimeout(() => {
        const greeting = getGreeting();
        let merchantName = "there";
        if (clientId === "deacons") {
          merchantName = "Deacon";
        } else if (clientId === "seven-eleven") {
          merchantName = "7-Eleven team";
        }

        let initialMessage: AIMessage = {
          id: "1",
          type: "ai",
          content: `${greeting}, ${merchantName}! I'm your AI marketing assistant. How can I help?`,
          timestamp: new Date().toISOString(),
        };

        if (clientId === "seven-eleven") {
          initialMessage = {
            id: "1",
            type: "ai",
            content: `${greeting}, ${merchantName}! I'm your AI marketing assistant. Sounds like you'd like to create a new offer. Let's get started. To help you create an effective offer, tell me about your primary business objective.`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "Drive installs of and transactions through our 7NOW delivery app in Texas and Florida",
                value: "app-installs-objective",
              },
              {
                text: "I need help defining my objective",
                value: "need-objective-help",
              },
            ],
          };
        }
        setLocalMessages([initialMessage]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [clientId, isProductFilterMode, localMessages.length]);

  // Auto-scroll logic (can apply to both modes)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Decide which messages to display
  const displayMessages = isProductFilterMode ? reduxMessages : localMessages;

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, scrollToBottom]);

  // Updated message sending logic
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    const currentUserMessage = newMessage;
    const userMessagePayload: Omit<AIMessage, "id" | "timestamp"> = {
      type: "user",
      content: currentUserMessage,
    };

    // Clear proposed payload when user sends a new message
    setProposedUpdatePayload(null);

    if (isProductFilterMode) {
      dispatch(addMessage(userMessagePayload));
      dispatch(setIsProcessing(true));
      setNewMessage("");

      setTimeout(() => {
        const currentCriteriaTypes = currentCriteria.map((c) => c.type);
        const lowerMessage = currentUserMessage.toLowerCase();

        // --- Simulate Information Gathering ---
        // (This would be replaced by real NLU/context tracking)
        // For simulation, let's assume we *always* find some basic info
        // and potentially one missing required type to demonstrate the flow.
        const detectedData = {
          merchantKeyword: lowerMessage.includes("pizza hut")
            ? "pizza hut"
            : currentCriteria.find((c) => c.type === "MerchantKeyword")
                ?.value || null,
          offerCommodity: lowerMessage.includes("pizza")
            ? "pizza"
            : currentCriteria.find((c) => c.type === "OfferCommodity")?.value ||
              null,
          offerKeyword: lowerMessage.includes("deal")
            ? "deal"
            : currentCriteria.find((c) => c.type === "OfferKeyword")?.value ||
              null,
          // Assume MerchantName is missing for demo question
        };

        let allRequiredPresent = true;
        let firstMissingRequiredType: string | null = null;
        let detectedCriteriaForPayload: Partial<FilterCriteria>[] = [];
        const tempAllTypes = new Set(currentCriteriaTypes);

        // Build payload based on NEWLY detected info from this message
        if (
          lowerMessage.includes("pizza hut") &&
          !currentCriteriaTypes.includes("MerchantKeyword")
        ) {
          detectedCriteriaForPayload.push({
            type: "MerchantKeyword",
            value: "pizza hut",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("MerchantKeyword");
        }
        if (
          lowerMessage.includes("pizza") &&
          !currentCriteriaTypes.includes("OfferCommodity")
        ) {
          detectedCriteriaForPayload.push({
            type: "OfferCommodity",
            value: "pizza",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("OfferCommodity");
        }
        if (
          lowerMessage.includes("deal") &&
          !currentCriteriaTypes.includes("OfferKeyword")
        ) {
          detectedCriteriaForPayload.push({
            type: "OfferKeyword",
            value: "deal",
            rule: "contains",
            and_or: "OR",
            isRequired: true,
          });
          tempAllTypes.add("OfferKeyword");
        }
        // Add logic for MerchantName etc.

        // Check required fields based on current + newly detected
        for (const reqType of requiredCriteriaTypes) {
          if (!tempAllTypes.has(reqType)) {
            allRequiredPresent = false;
            firstMissingRequiredType = reqType;
            break;
          }
        }

        let aiResponseMessage: Omit<AIMessage, "id" | "timestamp">;

        if (!allRequiredPresent && firstMissingRequiredType) {
          // --- Scenario B: Ask for missing required field ---
          let baseText = "Okay, I understood some details. ";
          if (detectedCriteriaForPayload.length > 0) {
            baseText = `Okay, I see ${detectedCriteriaForPayload.map((c) => `'${c.value}' (${c.type})`).join(" and ")}. `;
          }
          let question = `To create the filter, I also need the ${firstMissingRequiredType.replace(/([A-Z])/g, " $1").toLowerCase()}. What should that be?`;
          // Add specific question phrasing if needed
          aiResponseMessage = { type: "ai", content: baseText + question };
          dispatch(addMessage(aiResponseMessage));
        } else {
          // --- Scenario C: All required present (or assumed) -> Propose Generation ---
          const finalCriteriaToAdd = [
            ...currentCriteria,
            // Ensure newly detected aren't duplicates (simple type check)
            ...detectedCriteriaForPayload.filter(
              (newItem) => !currentCriteriaTypes.includes(newItem.type!)
            ),
          ];
          const filterNameProposal = `${detectedData.merchantKeyword || detectedData.offerCommodity || "Generated"} Filter`;

          // Store the proposed payload
          const payloadToConfirm = {
            criteriaToAdd: finalCriteriaToAdd,
            filterName: filterNameProposal,
          };
          setProposedUpdatePayload(payloadToConfirm); // Store for confirmation click

          aiResponseMessage = {
            type: "ai",
            content: `Okay, I have enough information (Criteria: ${finalCriteriaToAdd.map((c) => c.type).join(", ")}). Shall I generate the filter with name "${filterNameProposal}" now?`,
            responseOptions: [
              { text: "Yes, generate filter", value: "confirm_generate" },
              { text: "No, wait", value: "cancel_generate" },
              // { text: "Add more details...", value: "add_more_details" } // Optional
            ],
          };
          dispatch(addMessage(aiResponseMessage));
        }

        dispatch(setIsProcessing(false));
      }, 1200);
    } else {
      const fullUserMessage: AIMessage = {
        ...userMessagePayload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, fullUserMessage]);
      onSend(currentUserMessage);
      setIsThinking(true);
      setNewMessage("");

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        let aiResponse: AIMessage | null = null;
        const lowerMsg = currentUserMessage.toLowerCase();

        if (clientId === "seven-eleven") {
          if (
            lowerMsg.includes("drive installs") ||
            lowerMsg.includes("7now") ||
            lowerMsg.includes("app-installs-objective")
          ) {
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "That sounds like an important business objective. To recommend an effective offer, tell me about the target audience you want to reach with the offer",
              timestamp: new Date().toISOString(),
              responseOptions: [
                { text: "Young adults 18-34", value: "target-audience-young" },
                { text: "Millennials & Gen X", value: "target-audience-broad" },
              ],
            };
            setClarifyingQuestionStep(1);
          } else if (
            clarifyingQuestionStep === 1 &&
            (lowerMsg.includes("young adults") ||
              lowerMsg.includes("millennials"))
          ) {
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Great. And when do you want to the offer to start and expire?",
              timestamp: new Date().toISOString(),
              responseOptions: [
                { text: "Next 4 weeks", value: "timeframe-short" },
                { text: "End of summer", value: "timeframe-long" },
              ],
            };
            setClarifyingQuestionStep(2);
          } else {
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: "Thanks! How else can I help?",
              timestamp: new Date().toISOString(),
            };
          }
        } else {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content: `Okay, I received: \"${currentUserMessage}\". What next?`,
            timestamp: new Date().toISOString(),
          };
        }

        if (aiResponse) {
          setLocalMessages((prev) => [...prev, aiResponse!]);
        }
        setIsThinking(false);
      }, 1500);
    }
  }, [
    newMessage,
    dispatch,
    isProductFilterMode,
    reduxMessages,
    currentCriteria,
    requiredCriteriaTypes,
    clientId,
    clarifyingQuestionStep,
    onSend,
    onOptionSelected,
  ]);

  // Option selected handler routes based on mode
  const handleOptionSelectedInternal = useCallback(
    (optionValue: string) => {
      if (isProductFilterMode) {
        // --- Product Filter Mode Option Handling ---
        if (optionValue === "confirm_generate") {
          if (proposedUpdatePayload) {
            // Add confirmation message
            const aiConfirmMsg: Omit<AIMessage, "id" | "timestamp"> = {
              type: "ai",
              content: "Okay, applying the filter updates to the form!",
            };
            dispatch(addMessage(aiConfirmMsg));
            // Send the actual update command
            onOptionSelected(
              `apply_updates:${JSON.stringify(proposedUpdatePayload)}`
            );
            setProposedUpdatePayload(null); // Clear proposal
          } else {
            // Handle error: proposal was somehow lost
            const aiErrorMsg: Omit<AIMessage, "id" | "timestamp"> = {
              type: "ai",
              content:
                "Sorry, something went wrong. Could you try describing the filter again?",
              severity: "error",
            };
            dispatch(addMessage(aiErrorMsg));
          }
        } else if (optionValue === "cancel_generate") {
          const aiCancelMsg: Omit<AIMessage, "id" | "timestamp"> = {
            type: "ai",
            content:
              "Okay, I won't generate the filter yet. Let me know what you want to do next.",
          };
          dispatch(addMessage(aiCancelMsg));
          setProposedUpdatePayload(null); // Clear proposal
        }
        // Handle refine_criteria or other future options here
        // else if (optionValue.startsWith('refine_criteria:')) { ... }
        else {
          // Fallback for other/older option types if needed
          onOptionSelected(optionValue);
        }
      } else {
        // --- Demo Mode Option Handling ---
        const selectionMessage: AIMessage = {
          id: Date.now().toString() + "-selection",
          type: "user",
          content:
            localMessages[localMessages.length - 1]?.responseOptions?.find(
              (opt) => opt.value === optionValue
            )?.text || optionValue,
          timestamp: new Date().toISOString(),
        };
        setLocalMessages((prev) => [...prev, selectionMessage]);
        setNewMessage(optionValue);
        setTimeout(() => handleSendMessage(), 0);
      }
    },
    [
      onOptionSelected,
      isProductFilterMode,
      handleSendMessage,
      localMessages,
      dispatch,
      proposedUpdatePayload, // Add proposedUpdatePayload as dependency
    ]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage]
  );

  const isProcessingOrThinking = isProductFilterMode
    ? reduxIsProcessing
    : isThinking;

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header - Fixed at exactly 61px to match product filter header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px]">
        <div className="flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-primary" />
          <div>
            <h3 className="font-medium">{title}</h3>
            {/* Description can be added here if needed */}
            {/* <p className="text-xs text-muted-foreground">{description}</p> */}
          </div>
        </div>
      </div>

      {/* Messages - Scrollable container with absolute positioning */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {displayMessages.map((message: AIMessage) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelected={handleOptionSelectedInternal}
              />
            ))}

            {isProcessingOrThinking && <AIThinkingIndicator />}

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
            placeholder={
              isProductFilterMode
                ? "Describe the filter you need..."
                : "Type your message..."
            }
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            type="submit"
            variant="primary"
            icon={<PaperAirplaneIcon className="w-5 h-5" />}
            iconOnly
            disabled={!newMessage.trim() || isProcessingOrThinking}
            className="shadow-md"
            aria-label="Send message"
          />
        </form>
      </div>
    </div>
  );
};

interface ChatMessageProps {
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
}

const ChatMessage = ({ message, onOptionSelected }: ChatMessageProps) => {
  // Check if the message contains HTML (for animations)
  const containsHTML =
    message.type === "ai" &&
    (message.content.includes("<div") || message.content.includes("<span"));

  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-lg p-3 max-w-[80%] break-words ${
          message.type === "user"
            ? "bg-primary text-white rounded-tr-none"
            : "bg-blue-50 text-blue-800 shadow-sm rounded-tl-none border border-blue-100"
        }`}
      >
        {message.type === "ai" ? (
          <div>
            {containsHTML ? (
              // Render HTML content directly for animations
              <div
                dangerouslySetInnerHTML={{ __html: message.content }}
                className="prose prose-sm max-w-none"
              />
            ) : (
              // Use ReactMarkdown for standard content
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2 last:mb-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-5 mb-2 last:mb-0"
                        {...props}
                      />
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
            )}

            {/* Response options - keep for now */}
            {message.responseOptions && message.responseOptions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                {message.responseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onOptionSelected(option.value)}
                    className={`
                      relative overflow-hidden 
                      ${
                        option.value.includes("suggest_complete_filter")
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                          : option.value.includes("suggest_multiple_criteria")
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            : "bg-white hover:bg-gray-100 text-blue-700 border border-blue-300"
                      }
                      font-medium py-1.5 px-3 rounded-full text-xs sm:text-sm transition-all duration-200
                      hover:shadow-md hover:scale-105 active:scale-95
                    `}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
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

export default AIAssistantPanel;
