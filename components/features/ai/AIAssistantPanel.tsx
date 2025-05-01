"use client";

import * as React from "react";
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
  magicGenerate,
} from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";
import {
  Tooltip,
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
  onSend?: () => void;
  className?: string;
  title: string;
  description?: string;
  requiredCriteriaTypes: string[];
}

interface ChatMessageProps {
  key?: string;
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
  applyInstantFilter: () => void;
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
  const [localMessages, setLocalMessages] = React.useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState("");
  const [clarifyingQuestionStep, setClarifyingQuestionStep] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [proposedUpdatePayload, setProposedUpdatePayload] =
    React.useState<any>(null);

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
  React.useEffect(() => {
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
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Get messages based on mode
  const displayMessages = isProductFilterMode ? reduxMessages : localMessages;

  // Determine processing state based on mode
  const isProcessingOrThinking = isProductFilterMode
    ? reduxIsProcessing
    : isThinking;

  // Add initial welcome message for product filter mode
  React.useEffect(() => {
    if (isProductFilterMode && reduxMessages.length === 0) {
      dispatch(
        addMessage({
          type: "ai",
          content:
            "Welcome! I can help you create product filters. Describe the filter you need, or click the magic button to auto-generate based on context. I'll guide you through the process.",
          responseOptions: [
            {
              text: "What criteria do I need?",
              value: "explain_criteria_types",
            },
            { text: "Show best practices", value: "best_practices" },
          ],
        })
      );
    }
  }, [dispatch, isProductFilterMode, reduxMessages.length]);

  // Updated message sending logic
  const handleSendMessage = React.useCallback(
    (messageToSend?: string) => {
      // Use either the passed message or the current newMessage state
      const currentUserMessage = messageToSend || newMessage;

      if (!currentUserMessage.trim()) return;

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
              : currentCriteria.find((c) => c.type === "OfferCommodity")
                  ?.value || null,
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
        onSend();
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
                  {
                    text: "Young adults 18-34",
                    value: "target-audience-young",
                  },
                  {
                    text: "Millennials & Gen X",
                    value: "target-audience-broad",
                  },
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
    },
    [
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
    ]
  );

  // Option selected handler routes based on mode
  const handleOptionSelectedInternal = React.useCallback(
    (optionValue: string) => {
      console.log("Option selected internal called with value:", optionValue); // Debug log

      if (isProductFilterMode) {
        // --- Product Filter Mode Option Handling ---
        console.log("Handling in product filter mode"); // Debug log
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
        } else {
          // Fallback for other/older option types if needed
          console.log("Calling parent onOptionSelected with:", optionValue); // Debug log
          onOptionSelected(optionValue);
        }
      } else {
        // --- Demo Mode Option Handling ---
        console.log("Handling in demo mode"); // Debug log

        // Add the selection message to the chat
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

        // Check if this is a filter type selection or apply updates command that should be passed to parent
        if (
          optionValue.startsWith("filter_type:") ||
          optionValue.startsWith("apply_updates:")
        ) {
          // Directly call parent's onOptionSelected to handle filter generation
          console.log("Calling parent with special option:", optionValue); // Debug log
          onOptionSelected(optionValue);

          // For apply_updates, add a confirmation message
          if (optionValue.startsWith("apply_updates:")) {
            setTimeout(() => {
              const confirmationMessage: AIMessage = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "Great! I've applied the filter criteria to your form. You can review and make any additional adjustments as needed.",
                timestamp: new Date().toISOString(),
              };
              setLocalMessages((prev) => [...prev, confirmationMessage]);
            }, 500);
          }
        } else {
          // For other options, process through handleSendMessage
          console.log("Processing through handleSendMessage"); // Debug log
          setNewMessage(optionValue);
          setTimeout(() => handleSendMessage(optionValue), 0);
        }
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

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle form submission
  const handleFormSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newMessage.trim() && !isProcessingOrThinking) {
        handleSendMessage(); // No parameter needed for form submission
        setNewMessage("");
      }
    },
    [handleSendMessage, newMessage, isProcessingOrThinking]
  );

  // Handle magic generate button click
  const handleMagicGenerate = React.useCallback(() => {
    // Skip all conversation and immediately apply a complete filter
    console.log("Magic Generate: Instantly creating and applying filter");

    // Pre-defined filter to apply immediately with query name and expiry date
    const instantFilterPayload =
      'apply_updates:{"criteriaToAdd":[{"type":"MerchantKeyword","value":"restaurant","rule":"contains","and_or":"OR","isRequired":true},{"type":"MerchantName","value":"local eatery","rule":"contains","and_or":"OR","isRequired":true},{"type":"OfferCommodity","value":"dining","rule":"equals","and_or":"AND","isRequired":true},{"type":"OfferKeyword","value":"discount","rule":"contains","and_or":"OR","isRequired":true}],"filterName":"Restaurant Dining Filter","queryViewName":"RestaurantDiningView","expiryDate":"' +
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
      '"}';

    if (isProductFilterMode) {
      // For product filter mode, apply the filter through Redux
      dispatch(
        addMessage({
          type: "user",
          content: "Create an instant filter for restaurants please.",
        })
      );

      // Add AI response
      setTimeout(() => {
        dispatch(
          addMessage({
            type: "ai",
            content:
              "I've created a complete restaurant filter with all required criteria. The filter has been applied to your form!",
          })
        );

        // Apply the filter
        onOptionSelected(instantFilterPayload);
      }, 500);
    } else {
      // For demo mode, use local state
      const userMsg: AIMessage = {
        id: Date.now().toString(),
        type: "user",
        content: "Create an instant filter for restaurants please.",
        timestamp: new Date().toISOString(),
      };

      setLocalMessages((prev) => [...prev, userMsg]);

      // Simulate brief thinking
      setIsThinking(true);

      setTimeout(() => {
        const aiResponseMsg: AIMessage = {
          id: Date.now().toString(),
          type: "ai",
          content:
            "I've created a complete restaurant filter with all required criteria. The filter has been applied to your form!",
          timestamp: new Date().toISOString(),
        };

        setLocalMessages((prev) => [...prev, aiResponseMsg]);
        setIsThinking(false);

        // Apply the filter
        onOptionSelected(instantFilterPayload);
      }, 800);
    }
  }, [
    dispatch,
    isProductFilterMode,
    setIsThinking,
    setLocalMessages,
    onOptionSelected,
  ]);

  // Add a direct function to apply instant filter
  const applyInstantFilter = () => {
    console.log("Directly applying instant filter");

    // Pre-defined filter payload - same as in handleMagicGenerate
    const instantFilterPayload =
      'apply_updates:{"criteriaToAdd":[{"type":"MerchantKeyword","value":"restaurant","rule":"contains","and_or":"OR","isRequired":true},{"type":"MerchantName","value":"local eatery","rule":"contains","and_or":"OR","isRequired":true},{"type":"OfferCommodity","value":"dining","rule":"equals","and_or":"AND","isRequired":true},{"type":"OfferKeyword","value":"discount","rule":"contains","and_or":"OR","isRequired":true}],"filterName":"Restaurant Dining Filter","queryViewName":"RestaurantDiningView","expiryDate":"' +
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
      '"}';

    onOptionSelected(instantFilterPayload);
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [displayMessages, scrollToBottom]);

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
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{ pointerEvents: "auto" }}
        >
          <div className="p-4 space-y-4">
            {displayMessages.map((message: AIMessage) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelected={handleOptionSelectedInternal}
                applyInstantFilter={applyInstantFilter}
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

          {/* Magic Generate Button - now available in all modes */}
          <div className="relative group">
            <Button
              type="button"
              variant="secondary"
              icon={<SparklesIcon className="w-5 h-5 animate-pulse" />}
              iconOnly
              disabled={isProcessingOrThinking}
              className="shadow-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105"
              aria-label="Magic Generate"
              onClick={() => {
                console.log("Magic Generate button clicked");
                handleMagicGenerate();
              }}
            />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Instant Magic Filter
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-solid border-transparent border-t-black"></div>
            </div>
          </div>

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
  key?: string;
  message: AIMessage;
  onOptionSelected: (optionId: string) => void;
  applyInstantFilter: () => void;
}

const ChatMessage = ({
  message,
  onOptionSelected,
  applyInstantFilter,
}: ChatMessageProps) => {
  // Check if the message contains HTML (for animations)
  const containsHTML =
    message.type === "ai" &&
    (message.content.includes("<div") || message.content.includes("<span"));

  // handleOptionClick moved back inside component
  const handleOptionClick = (event: React.MouseEvent, value: string) => {
    // Stop propagation to prevent other handlers from capturing the event
    event.preventDefault();
    event.stopPropagation();
    console.log(
      "Option clicked:",
      value,
      "Prevented default and stopped propagation"
    ); // Debug log

    // Always auto-apply filter for dining options as a fallback
    if (value.includes("dining") || value.includes("restaurant")) {
      applyInstantFilter();
    } else {
      onOptionSelected(value);
    }
  };

  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
      onClick={(e) => {
        console.log("ChatMessage outer div clicked");
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
          console.log("ChatMessage inner div clicked");
          e.stopPropagation();
        }}
      >
        {message.type === "ai" ? (
          <div
            onClick={(e) => {
              console.log("AI content div clicked");
              e.stopPropagation();
            }}
          >
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

            {/* Response options */}
            {message.responseOptions && message.responseOptions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3 max-w-full p-1">
                {message.responseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => handleOptionClick(e, option.value)}
                    className={`
                      relative overflow-hidden z-50 shadow-md
                      ${
                        option.value.includes("suggest_complete_filter")
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                          : option.value.includes("suggest_multiple_criteria")
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            : option.value.includes("apply_updates:")
                              ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                              : "bg-white hover:bg-gray-100 text-blue-700 border-2 border-blue-300"
                      }
                      font-medium py-2 px-4 rounded-full text-xs sm:text-sm
                      cursor-pointer hover:shadow-lg active:shadow-inner
                      hover:scale-110 transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
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
