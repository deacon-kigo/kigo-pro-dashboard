"use client";

import * as React from "react";
import { useDemoState } from "@/lib/redux/hooks";
import ChatPanel, { AIMessage } from "./ChatPanel";

interface DemoAIAssistantProps {
  onOptionSelected: (optionId: string) => void;
  className?: string;
  title?: string;
  description?: string;
  initialMessage?: string;
}

export const DemoAIAssistant: React.FC<DemoAIAssistantProps> = ({
  onOptionSelected,
  className = "",
  title = "AI Assistant",
  description,
  initialMessage,
}) => {
  const { clientId } = useDemoState();

  // Local state for demo mode
  const [messages, setMessages] = React.useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = React.useState(false);
  const [clarifyingQuestionStep, setClarifyingQuestionStep] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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
    if (clientId && messages.length === 0) {
      const timer = setTimeout(() => {
        let initialMsg = initialMessage;

        if (!initialMsg) {
          const greeting = getGreeting();
          let merchantName = "there";
          if (clientId === "deacons") {
            merchantName = "Deacon";
          } else if (clientId === "seven-eleven") {
            merchantName = "7-Eleven team";
          }

          initialMsg = `${greeting}, ${merchantName}! I'm your AI marketing assistant. How can I help?`;
        }

        let initialAIMessage: AIMessage = {
          id: "1",
          type: "ai",
          content: initialMsg,
          timestamp: new Date().toISOString(),
        };

        if (clientId === "seven-eleven" && !initialMessage) {
          initialAIMessage = {
            id: "1",
            type: "ai",
            content: `${getGreeting()}, 7-Eleven team! I'm your AI marketing assistant. Sounds like you'd like to create a new offer. Let's get started. To help you create an effective offer, tell me about your primary business objective.`,
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
        setMessages([initialAIMessage]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [clientId, messages.length, initialMessage]);

  // Handle message sending for demo mode
  const handleSendMessage = React.useCallback(
    (messageText: string) => {
      if (!messageText.trim()) return;

      const userMessage: AIMessage = {
        id: Date.now().toString(),
        type: "user",
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        let aiResponse: AIMessage | null = null;
        const lowerMsg = messageText.toLowerCase();

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
            content: `Okay, I received: \"${messageText}\". What next?`,
            timestamp: new Date().toISOString(),
          };
        }

        if (aiResponse) {
          setMessages((prev) => [...prev, aiResponse!]);
        }
        setIsThinking(false);
      }, 1500);
    },
    [clientId, clarifyingQuestionStep]
  );

  // Option selected handler for demo mode
  const handleOptionSelected = React.useCallback(
    (optionValue: string) => {
      console.log("Option selected in demo mode:", optionValue);

      // Add the selection message to the chat
      const selectionMessage: AIMessage = {
        id: Date.now().toString() + "-selection",
        type: "user",
        content:
          messages[messages.length - 1]?.responseOptions?.find(
            (opt) => opt.value === optionValue
          )?.text || optionValue,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, selectionMessage]);

      // Check if this is a filter type selection or apply updates command that should be passed to parent
      if (
        optionValue.startsWith("filter_type:") ||
        optionValue.startsWith("apply_updates:")
      ) {
        // Directly call parent's onOptionSelected to handle filter generation
        console.log("Calling parent with special option:", optionValue);
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
            setMessages((prev) => [...prev, confirmationMessage]);
          }, 500);
        }
      } else {
        // For other options, process through handleSendMessage
        console.log("Processing through handleSendMessage");
        handleSendMessage(optionValue);
      }
    },
    [onOptionSelected, messages, handleSendMessage]
  );

  // Handle magic generate button click (instant filter)
  const handleMagicGenerate = React.useCallback(() => {
    console.log(
      "Magic Generate: Instantly creating and applying filter in demo mode"
    );

    // Pre-defined filter to apply immediately with query name and expiry date
    const instantFilterPayload =
      'apply_updates:{"criteriaToAdd":[{"type":"MerchantKeyword","value":"restaurant","rule":"contains","and_or":"OR","isRequired":true},{"type":"MerchantName","value":"local eatery","rule":"contains","and_or":"OR","isRequired":true},{"type":"OfferCommodity","value":"dining","rule":"equals","and_or":"AND","isRequired":true},{"type":"OfferKeyword","value":"discount","rule":"contains","and_or":"OR","isRequired":true}],"filterName":"Restaurant Dining Filter","queryViewName":"RestaurantDiningView","expiryDate":"' +
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() +
      '"}';

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: "Create an instant filter for restaurants please.",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

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

      setMessages((prev) => [...prev, aiResponseMsg]);
      setIsThinking(false);

      // Apply the filter
      onOptionSelected(instantFilterPayload);
    }, 800);
  }, [onOptionSelected]);

  // Cleanup timeouts
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ChatPanel
      title={title}
      description={description}
      messages={messages}
      isProcessing={isThinking}
      onSendMessage={handleSendMessage}
      onOptionSelected={handleOptionSelected}
      onMagicGenerate={handleMagicGenerate}
      className={className}
      showMagicButton={true}
    />
  );
};

export default DemoAIAssistant;
