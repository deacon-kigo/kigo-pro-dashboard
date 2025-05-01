"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { addMessage } from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  responseOptions?: ResponseOption[];
  attachments?: Attachment[];
  severity?: "info" | "warning" | "success" | "error";
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
  onSend?: (message: string) => void;
  onOptionSelected?: (optionId: string) => void;
  className?: string;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onSend = () => {},
  onOptionSelected = () => {},
  className = "",
}) => {
  const { clientId } = useDemoState();
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Get AI assistant state from Redux
  const { messages: aiMessages, isProcessing } = useSelector(
    (state: RootState) => state.aiAssistant
  );

  // Initialize with false and update in useEffect
  const [isProductFilterContext, setIsProductFilterContext] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [clarifyingQuestionStep, setClarifyingQuestionStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set the product filter context based on the pathname
  useEffect(() => {
    if (pathname) {
      setIsProductFilterContext(pathname.includes("/product-filters"));
    }
  }, [pathname]);

  // Use Redux state for product filter context
  useEffect(() => {
    if (isProductFilterContext && aiMessages.length > 0) {
      // Convert from Redux format to component format
      const convertedMessages: Message[] = aiMessages.map((msg) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        responseOptions: msg.responseOptions,
        severity: msg.severity,
      }));

      setMessages(convertedMessages);
      setIsThinking(isProcessing);
    }
  }, [isProductFilterContext, aiMessages, isProcessing]);

  // Helper function to get appropriate greeting based on time of day
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

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      // Add a slight delay for a more natural feeling
      const timer = setTimeout(() => {
        const greeting = getGreeting();

        // Personalize based on client ID
        let merchantName = "there";
        if (clientId === "deacons") {
          merchantName = "Deacon";
        } else if (clientId === "seven-eleven") {
          merchantName = "7-Eleven team";
        }

        // Customize initial message based on client ID
        let initialMessage = {
          id: "1",
          type: "ai" as const,
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

        // For 7-Eleven, start with business objectives prompt
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

        setMessages([initialMessage]);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [messages.length, clientId]);

  // Auto-scroll to bottom on new messages - no need to recreate every render
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Run effect only when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Memoize the sendMessage function to avoid recreation on each render
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    // For product filter context, use Redux for state management
    if (isProductFilterContext) {
      // Dispatch the message to Redux
      dispatch(
        addMessage({
          type: "user",
          content: newMessage,
        })
      );

      setNewMessage("");
      return;
    }

    // Original implementation for demo mode
    // Add the user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Call the onSend callback with the message
    onSend(newMessage);

    setNewMessage("");
    setIsThinking(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to simulate AI thinking
    timeoutRef.current = setTimeout(() => {
      let aiResponse: Message;

      // Customize response based on client ID
      const isSeven = clientId === "seven-eleven";

      // Try to match the message to known phrases or keywords
      const lowerMsg = newMessage.toLowerCase();

      // Special handling for 7-Eleven offer creation demo
      if (clientId === "seven-eleven") {
        if (
          lowerMsg.includes("drive installs") ||
          lowerMsg.includes("7now") ||
          lowerMsg.includes("delivery app") ||
          lowerMsg.includes("texas and florida")
        ) {
          // First clarifying question after business objective
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "That sounds like an important business objective. To recommend an effective offer, tell me about the target audience you want to reach with the offer",
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "Primarily young adults 18-34 who are tech-savvy",
                value: "target-audience-young",
              },
              {
                text: "Both millennials and Gen X customers who use delivery apps",
                value: "target-audience-broad",
              },
            ],
          };

          // Update the clarifying question step
          setClarifyingQuestionStep(1);
        } else if (
          clarifyingQuestionStep === 1 &&
          (lowerMsg.includes("young adults") ||
            lowerMsg.includes("millennials") ||
            lowerMsg.includes("tech-savvy"))
        ) {
          // Second clarifying question
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "Great. And when do you want to the offer to start and expire?",
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "For the next 4 weeks",
                value: "timeframe-short",
              },
              {
                text: "Through the end of summer",
                value: "timeframe-long",
              },
            ],
          };

          // Update the clarifying question step
          setClarifyingQuestionStep(2);
        } else if (
          clarifyingQuestionStep === 2 &&
          (lowerMsg.includes("4 weeks") ||
            lowerMsg.includes("summer") ||
            lowerMsg.includes("timeframe"))
        ) {
          // Third clarifying question
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "Perfect. Do you have a specific offer or promotion in mind that you would like to use?",
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "Free pizza with 7NOW order",
                value: "free-pizza-offer",
              },
              {
                text: "I'd like your recommendation",
                value: "recommend-offer",
              },
            ],
          };

          // Update the clarifying question step
          setClarifyingQuestionStep(3);
        } else if (
          clarifyingQuestionStep === 3 ||
          lowerMsg.includes("free pizza") ||
          lowerMsg.includes("recommendation")
        ) {
          // This should be the 7-Eleven's response as per the script, regardless of input
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "Based on our conversation, here's what I understand about your initial offer concept:",
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, aiResponse]);

          // Reset clarifying question step
          setClarifyingQuestionStep(0);

          // After a brief pause, show the predetermined 7-Eleven offer response
          setTimeout(() => {
            const offerResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Free pizza with 7NOW order\n\nPromo code: BIGBITE\n\nLimit 1 per customer\n\nValid through end of June",
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, offerResponse]);

            // Start the analysis flow
            setTimeout(() => {
              const analysisStartResponse: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "I'm analyzing this offer to optimize its structure and performance...",
                timestamp: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, analysisStartResponse]);

              // After a brief delay, show the analysis process
              setTimeout(() => {
                const analysisResponse: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `
### Analysis in Progress

* Analyzing 7-Eleven's product catalog and margin data for pizza and typical delivery orders ✓
* Examining historical performance data from similar app-based promotions ✓
* Evaluating market-specific trends in Texas and Florida delivery patterns ✓
* Calculating optimal promotional pricing to maximize customer acquisition while ensuring ROI ✓
* Determining the most effective validation method for tracking unique redemptions ✓
                  `,
                  timestamp: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, analysisResponse]);

                // After analysis, show the optimized offer
                setTimeout(() => {
                  const finalOffer: Message = {
                    id: Date.now().toString(),
                    type: "ai",
                    content: `
### Optimized Offer Structure

**Free Big Bite Pizza with Your First 7NOW Order**

**Redemption flow:**
- Install app → Create account → Enter code 'BIGBITE' at checkout → Free pizza added to order

**Geographic Targeting:** Texas and Florida markets (covers 215 locations with estimated audience reach of 3.7M potential customers in app delivery zones)

**Validation method:** 
- Automated promo code redemption tracking with 1-per-customer limit enforced

**Timing:** 
- Immediate launch through June 30

**Projected performance:**
- 28% projected conversion rate from impression to app install
- 64% projected completion rate from install to first order
- $12.84 estimated average basket size on first order (excluding pizza)
- 42% projected retention rate for second order within 30 days

*The offer is configured and ready for campaign deployment. Would you like to proceed with this optimized structure?*
                    `,
                    timestamp: new Date().toISOString(),
                    responseOptions: [
                      {
                        text: "Yes, proceed with this offer",
                        value: "approve-offer",
                      },
                      {
                        text: "Make some adjustments",
                        value: "adjust-offer",
                      },
                    ],
                  };

                  setMessages((prev) => [...prev, finalOffer]);
                  setIsThinking(false);
                }, 4000);
              }, 3000);
            }, 1500);

            return;
          }, 1000);

          return;
        } else if (
          lowerMsg.includes("promo code") ||
          lowerMsg.includes("bigbite") ||
          lowerMsg.includes("june") ||
          (lowerMsg.includes("free pizza") && lowerMsg.includes("7now"))
        ) {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "I'm analyzing this offer to optimize its structure and performance...",
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, aiResponse]);

          // After a brief delay, show the analysis process
          setTimeout(() => {
            const analysisResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content: `
### Analysis in Progress

* Analyzing 7-Eleven's product catalog and margin data for pizza and typical delivery orders ✓
* Examining historical performance data from similar app-based promotions ✓
* Evaluating market-specific trends in Texas and Florida delivery patterns ✓
* Calculating optimal promotional pricing to maximize customer acquisition while ensuring ROI ✓
* Determining the most effective validation method for tracking unique redemptions ✓
              `,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, analysisResponse]);

            // After analysis, show the optimized offer
            setTimeout(() => {
              const finalOffer: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: `
### Optimized Offer Structure

**Free Big Bite Pizza with Your First 7NOW Order**

**Redemption flow:**
- Install app → Create account → Enter code 'BIGBITE' at checkout → Free pizza added to order

**Geographic Targeting:** Texas and Florida markets (covers 215 locations with estimated audience reach of 3.7M potential customers in app delivery zones)

**Validation method:** 
- Automated promo code redemption tracking with 1-per-customer limit enforced

**Timing:** 
- Immediate launch through June 30

**Projected performance:**
- 28% projected conversion rate from impression to app install
- 64% projected completion rate from install to first order
- $12.84 estimated average basket size on first order (excluding pizza)
- 42% projected retention rate for second order within 30 days

*The offer is configured and ready for campaign deployment. Would you like to proceed with this optimized structure?*
                `,
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "Yes, proceed with this offer",
                    value: "approve-offer",
                  },
                  {
                    text: "Make some adjustments",
                    value: "adjust-offer",
                  },
                ],
              };

              setMessages((prev) => [...prev, finalOffer]);
              setIsThinking(false);
            }, 4000);
          }, 3000);

          return;
        } else {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "I understand you want to drive installs and transactions for your 7NOW delivery app. Could you tell me more about your target audience demographics?",
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "Primarily young adults 18-34 who are tech-savvy",
                value: "target-audience-young",
              },
              {
                text: "Both millennials and Gen X customers who use delivery apps",
                value: "target-audience-broad",
              },
            ],
          };

          // Update the clarifying question step
          setClarifyingQuestionStep(1);
        }
      } else if (
        lowerMsg.includes("hello") ||
        lowerMsg.includes("hi") ||
        lowerMsg.includes("hey")
      ) {
        aiResponse = {
          id: Date.now().toString(),
          type: "ai",
          content: `Hello! I'm your AI marketing assistant. How can I help you create a successful campaign for your ${isSeven ? "7-Eleven locations" : "pizza business"} today?`,
          timestamp: new Date().toISOString(),
          responseOptions: [
            { text: "Show me the data", value: "show-data" },
            {
              text: "What campaign would you suggest?",
              value: "campaign-suggestion",
            },
          ],
        };
      } else if (
        lowerMsg.includes("competitor") ||
        lowerMsg.includes("competition")
      ) {
        if (isSeven) {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content: `Your main competitors include other convenience store chains and quick-service food outlets. They're running 2-3x more promotions than you are currently, especially focused on app-based ordering and loyalty programs.`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              { text: "Let's create our campaign", value: "create-campaign" },
              {
                text: "What should our strategy be?",
                value: "compete-strategy",
              },
            ],
          };
        } else {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content: `Your main competitor is Pizza Palace. They run more frequent promotions but have lower customer satisfaction. They focus on price while your strength is quality and portion size.`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              {
                text: "Tell me more about Pizza Palace",
                value: "pizza-palace",
              },
              { text: "How should we compete?", value: "compete-strategy" },
            ],
          };
        }
      } else if (
        lowerMsg.includes("recommend") ||
        lowerMsg.includes("suggest") ||
        lowerMsg.includes("idea")
      ) {
        if (isSeven) {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content: `Based on your data, I recommend a weekday 7NOW delivery promotion. This would address your slower weekday sales while leveraging your delivery service advantage over competitors.`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              { text: "Let's create this campaign", value: "create-campaign" },
              { text: "What results can I expect?", value: "expected-results" },
            ],
          };
        } else {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content: `Based on your data, a Family Weekday Special would be most effective. It offers a complete family meal at a competitive price point, targeting your underperforming weekday periods.`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              { text: "Let's create this campaign", value: "create-campaign" },
              { text: "What results can I expect?", value: "expected-results" },
            ],
          };
        }
      } else {
        // Handle known option values
        switch (lowerMsg) {
          case "show data":
          case "show me data":
          case "show the data":
          case "data":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "Here's your business intelligence data showing sales by day, delivery vs. in-store trends, competitor activity, and customer segments. The weekday opportunity for delivery is clear."
                : "Here's your business intelligence data showing sales by day, performance trends, competitor activity, and customer segments. The weekday dinner opportunity is clear.",
              timestamp: new Date().toISOString(),
              responseOptions: [
                { text: "Let's create a campaign", value: "create-campaign" },
                { text: "What should I focus on?", value: "focus-suggestion" },
              ],
            };
            if (onOptionSelected) onOptionSelected("show-data");
            break;

          case "create":
          case "create campaign":
          case "new campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "I've created three campaign options for you, each optimized for your 7-Eleven customer base and sales patterns. View them in the canvas to compare."
                : "I've created three campaign options for you, each with offer structure, promo copy, visuals, and targeting. View them in the canvas to compare.",
              timestamp: new Date().toISOString(),
              responseOptions: [
                {
                  text: isSeven
                    ? "Select the Free Big Bite Pizza Promotion"
                    : "Select the Family Dinner Bundle",
                  value: "select-campaign",
                },
                {
                  text: "How did you create these options?",
                  value: "campaign-explanation",
                },
              ],
            };
            if (onOptionSelected) onOptionSelected("create-campaign");
            break;

          default:
            // For any other message, look for keywords to determine intent
            if (
              lowerMsg.includes("sales") ||
              lowerMsg.includes("revenue") ||
              lowerMsg.includes("performance")
            ) {
              if (isSeven) {
                aiResponse = {
                  id: Date.now().toString(),
                  type: "ai",
                  content:
                    "Your sales data shows strong weekend performance but relatively lower weekday sales. Tuesday is your weakest day, with approximately 35% lower revenue than weekend days. Your delivery orders are growing at 18% month over month.",
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "What campaign would you suggest?",
                      value: "campaign-suggestion",
                    },
                    {
                      text: "Let's create a campaign",
                      value: "create-campaign",
                    },
                  ],
                };
              } else {
                aiResponse = {
                  id: Date.now().toString(),
                  type: "ai",
                  content:
                    "Your sales data shows strong weekend performance but relatively lower weekday sales. Monday is your weakest day, with approximately 50% lower revenue than weekend days. However, delivery orders are growing at 15% month over month.",
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "What campaign would you suggest?",
                      value: "campaign-suggestion",
                    },
                    {
                      text: "Let's create a campaign",
                      value: "create-campaign",
                    },
                  ],
                };
              }
            } else {
              // Generic response for anything we don't recognize
              aiResponse = {
                id: Date.now().toString(),
                type: "ai",
                content: isSeven
                  ? "Based on your business data, I can help you create a targeted marketing campaign for your 7-Eleven locations. Would you like to see the data or start creating a campaign?"
                  : "Based on your business data, I can help you create a targeted marketing campaign for your pizza business. Would you like to see the data or start creating a campaign?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  { text: "Show me the data", value: "show-data" },
                  { text: "Let's create a campaign", value: "create-campaign" },
                ],
              };
            }
        }
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  }, [
    newMessage,
    onOptionSelected,
    clientId,
    onSend,
    clarifyingQuestionStep,
    isProductFilterContext,
    dispatch,
  ]);

  // Memoize option click handler to avoid recreation on each render
  const handleOptionSelected = useCallback(
    (optionValue: string) => {
      // For product filter context, dispatch an option selected action
      if (isProductFilterContext) {
        dispatch({ type: "aiAssistant/optionSelected", payload: optionValue });

        // Also call the passed callback
        onOptionSelected(optionValue);
        return;
      }

      // Original implementation for demo mode
      // Notify parent component
      onOptionSelected && onOptionSelected(optionValue);

      // Find the selected option to populate the input field
      const selectedOption = messages
        .filter((m) => m.responseOptions)
        .flatMap((m) => m.responseOptions || [])
        .find((option) => option.value === optionValue);

      if (selectedOption) {
        // Set the input field to the option text instead of auto-sending
        setNewMessage(selectedOption.text);

        // Special handling for clarifying question responses to auto-send
        if (
          optionValue === "target-audience-young" ||
          optionValue === "target-audience-broad" ||
          optionValue === "timeframe-short" ||
          optionValue === "timeframe-long" ||
          optionValue === "free-pizza-offer" ||
          optionValue === "recommend-offer"
        ) {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Process based on which clarifying question we're at
            if (
              optionValue === "target-audience-young" ||
              optionValue === "target-audience-broad"
            ) {
              // After first clarifying question, ask second
              timeoutRef.current = setTimeout(() => {
                const nextQuestion: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content:
                    "Great. And when do you want to the offer to start and expire?",
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "For the next 4 weeks",
                      value: "timeframe-short",
                    },
                    {
                      text: "Through the end of summer",
                      value: "timeframe-long",
                    },
                  ],
                };

                setMessages((prev) => [...prev, nextQuestion]);
                setIsThinking(false);
                setClarifyingQuestionStep(2);
              }, 1500);
            } else if (
              optionValue === "timeframe-short" ||
              optionValue === "timeframe-long"
            ) {
              // After second clarifying question, ask third
              timeoutRef.current = setTimeout(() => {
                const nextQuestion: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content:
                    "Perfect. Do you have a specific offer or promotion in mind that you would like to use?",
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "Free pizza with 7NOW order",
                      value: "free-pizza-offer",
                    },
                    {
                      text: "I'd like your recommendation",
                      value: "recommend-offer",
                    },
                  ],
                };

                setMessages((prev) => [...prev, nextQuestion]);
                setIsThinking(false);
                setClarifyingQuestionStep(3);
              }, 1500);
            } else if (
              optionValue === "free-pizza-offer" ||
              optionValue === "recommend-offer"
            ) {
              // After third clarifying question, show 7-Eleven's response
              timeoutRef.current = setTimeout(() => {
                const aiSummary: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content:
                    "Based on our conversation, here's what I understand about your initial offer concept:",
                  timestamp: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, aiSummary]);

                // After a brief pause, show the offer details as an AI message
                setTimeout(() => {
                  const offerResponse: Message = {
                    id: Date.now().toString(),
                    type: "ai",
                    content:
                      "Free pizza with 7NOW order\n\nPromo code: BIGBITE\n\nLimit 1 per customer\n\nValid through end of June",
                    timestamp: new Date().toISOString(),
                  };

                  setMessages((prev) => [...prev, offerResponse]);

                  // Start the analysis flow
                  setTimeout(() => {
                    const analysisStartResponse: Message = {
                      id: Date.now().toString(),
                      type: "ai",
                      content:
                        "I'm analyzing this offer to optimize its structure and performance...",
                      timestamp: new Date().toISOString(),
                    };

                    setMessages((prev) => [...prev, analysisStartResponse]);
                    setIsThinking(false);

                    // After a brief delay, show the analysis process
                    setTimeout(() => {
                      const analysisResponse: Message = {
                        id: Date.now().toString(),
                        type: "ai",
                        content: `
### Analysis in Progress

* Analyzing 7-Eleven's product catalog and margin data for pizza and typical delivery orders ✓
* Examining historical performance data from similar app-based promotions ✓
* Evaluating market-specific trends in Texas and Florida delivery patterns ✓
* Calculating optimal promotional pricing to maximize customer acquisition while ensuring ROI ✓
* Determining the most effective validation method for tracking unique redemptions ✓
                        `,
                        timestamp: new Date().toISOString(),
                      };

                      setMessages((prev) => [...prev, analysisResponse]);

                      // After analysis, show the optimized offer
                      setTimeout(() => {
                        const finalOffer: Message = {
                          id: Date.now().toString(),
                          type: "ai",
                          content: `
### Optimized Offer Structure

**Free Big Bite Pizza with Your First 7NOW Order**

**Redemption flow:**
- Install app → Create account → Enter code 'BIGBITE' at checkout → Free pizza added to order

**Geographic Targeting:** Texas and Florida markets (covers 215 locations with estimated audience reach of 3.7M potential customers in app delivery zones)

**Validation method:** 
- Automated promo code redemption tracking with 1-per-customer limit enforced

**Timing:** 
- Immediate launch through June 30

**Projected performance:**
- 28% projected conversion rate from impression to app install
- 64% projected completion rate from install to first order
- $12.84 estimated average basket size on first order (excluding pizza)
- 42% projected retention rate for second order within 30 days

*The offer is configured and ready for campaign deployment. Would you like to proceed with this optimized structure?*
                          `,
                          timestamp: new Date().toISOString(),
                          responseOptions: [
                            {
                              text: "Yes, proceed with this offer",
                              value: "approve-offer",
                            },
                            {
                              text: "Make some adjustments",
                              value: "adjust-offer",
                            },
                          ],
                        };

                        setMessages((prev) => [...prev, finalOffer]);
                      }, 4000);
                    }, 3000);
                  }, 1500);
                }, 1000);

                // Reset the clarifying question step
                setClarifyingQuestionStep(0);
              }, 1500);
            }
          }, 100);
        }

        // For free-pizza-offer button, also handle the flow directly
        else if (optionValue === "free-pizza-offer") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // After a brief delay, show AI's summarizing message
            timeoutRef.current = setTimeout(() => {
              const aiSummary: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "Great choice! Can you provide any specific details for this offer, such as promo code, limitations, or validity period?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "Promo code: BIGBITE, Limit 1 per customer, Valid through end of June",
                    value: "offer-details",
                  },
                ],
              };

              setMessages((prev) => [...prev, aiSummary]);
              setIsThinking(false);
            }, 1500);
          }, 100);
        }
        // Handle approval of the offer
        else if (optionValue === "approve-offer") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // First show a processing message
            timeoutRef.current = setTimeout(() => {
              const processingMessage: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "Creating offer in system... Please wait while I configure all parameters.",
                timestamp: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, processingMessage]);

              // After another delay, show detailed offer confirmation
              setTimeout(() => {
                const offerConfirmationMessage: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `✅ Offer successfully created!

**Offer ID:** PIZZA-7NOW-2023
**Status:** Active (Pending Campaign Assignment)
**Offer Details:**
- Free pizza with 7NOW order
- Promo code: BIGBITE
- Redemption Method: App-based code entry
- Validation Rules: Limit 1 per customer
- Valid Through: June 30, 2023

The offer is now ready to be assigned to a campaign. Would you like to proceed with creating the campaign for this offer?`,
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "Next Step",
                      value: "next-step-campaign",
                    },
                  ],
                };

                setMessages((prev) => [...prev, offerConfirmationMessage]);
                setIsThinking(false);
              }, 2000);
            }, 1500);
          }, 100);
        }
        // Handle campaign creation flow start
        else if (optionValue === "next-step-campaign") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Start the campaign creation dialogue sequence
            timeoutRef.current = setTimeout(() => {
              const campaignNamePrompt: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "Let's create a campaign to deliver this offer. What would you like to name this campaign?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "7NOW App Texas & Florida Pizza Promotion",
                    value: "campaign-name-response",
                  },
                ],
              };

              setMessages((prev) => [...prev, campaignNamePrompt]);
              setIsThinking(false);
            }, 1000);
          }, 100);
        }
        // Handle campaign name response
        else if (optionValue === "campaign-name-response") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Ask about campaign timeline
            timeoutRef.current = setTimeout(() => {
              const timelinePrompt: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "The offer is set to run through June 30th. Would you like the campaign to follow the same timeline?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "Yes, but let's start next Monday to give us time for final approvals",
                    value: "campaign-timeline-response",
                  },
                ],
              };

              setMessages((prev) => [...prev, timelinePrompt]);
              setIsThinking(false);
            }, 1000);
          }, 100);
        }
        // Handle campaign timeline response
        else if (optionValue === "campaign-timeline-response") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Ask about campaign budget
            timeoutRef.current = setTimeout(() => {
              const budgetPrompt: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: "What's your total budget for this campaign?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "$120,000",
                    value: "campaign-budget-response",
                  },
                ],
              };

              setMessages((prev) => [...prev, budgetPrompt]);
              setIsThinking(false);
            }, 1000);
          }, 100);
        }
        // Handle campaign budget response
        else if (optionValue === "campaign-budget-response") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Ask about daily spend limit
            timeoutRef.current = setTimeout(() => {
              const dailySpendPrompt: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: "What's your maximum daily spend?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "$3,000",
                    value: "campaign-daily-spend-response",
                  },
                ],
              };

              setMessages((prev) => [...prev, dailySpendPrompt]);
              setIsThinking(false);
            }, 1000);
          }, 100);
        }
        // Handle daily spend response
        else if (optionValue === "campaign-daily-spend-response") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Ask about high value actions to track
            timeoutRef.current = setTimeout(() => {
              const actionsPrompt: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: "What High Value Actions would you like to track?",
                timestamp: new Date().toISOString(),
                responseOptions: [
                  {
                    text: "App installs, account creations, first orders, and repeat orders",
                    value: "campaign-actions-response",
                  },
                ],
              };

              setMessages((prev) => [...prev, actionsPrompt]);
              setIsThinking(false);
            }, 1000);
          }, 100);
        }
        // Handle high value actions response and show campaign configuration
        else if (optionValue === "campaign-actions-response") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Show campaign configuration being generated
            timeoutRef.current = setTimeout(() => {
              const configurationProcessingMessage: Message = {
                id: Date.now().toString(),
                type: "ai",
                content:
                  "Based on your inputs, I'm configuring the optimal campaign settings. This will just take a moment...",
                timestamp: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, configurationProcessingMessage]);

              // After a brief delay, show the advanced campaign configuration
              setTimeout(() => {
                const advancedConfigMessage: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `
### Optimized Campaign Configuration

**Audience Targeting:**
- Primary focus on adults 18+ within delivery range of 7-Eleven locations in Texas and Florida
- Secondary targeting for users with food delivery app usage patterns

**Placement Strategy:**
- 70% budget allocation to Local+ for neighborhood-level targeting around store locations
- 20% to TOP for broader awareness in key markets
- 10% to Boosts during weekend dinner hours

**Brand Safety Parameters:**
- Automatically configured to exclude content categories with negative sentiment alignment

**Pacing Controls:**
- Higher budget allocation to evenings (5-9pm) and weekends

**Performance Targets:**
- Target cost per app install: $3.50
- Target cost per completed order: $8.75
- Target ROAS based on average basket value: 3.6x

The campaign is now fully configured and ready to publish. Would you like to make any adjustments, or shall we proceed with publishing?
                  `,
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "Publish Campaign",
                      value: "publish-campaign",
                    },
                    {
                      text: "Make Adjustments",
                      value: "adjust-campaign",
                    },
                  ],
                };

                setMessages((prev) => [...prev, advancedConfigMessage]);
                setIsThinking(false);

                // Notify parent component to update the canvas view
                if (onOptionSelected) onOptionSelected("campaign-selection");
              }, 3000);
            }, 1500);
          }, 100);
        }
        // Handle campaign publication
        else if (optionValue === "publish-campaign") {
          // We'll use setTimeout to give enough time for the UI to update before triggering
          setTimeout(() => {
            // Create a user message
            const userMessage: Message = {
              id: Date.now().toString(),
              type: "user",
              content: selectedOption.text,
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setNewMessage("");
            setIsThinking(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Show publication in progress
            timeoutRef.current = setTimeout(() => {
              const publishingMessage: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: "Publishing your campaign across the network...",
                timestamp: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, publishingMessage]);

              // After a brief delay, show successful publication
              setTimeout(() => {
                const successMessage: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `
### Campaign Successfully Published!

Your 7NOW App Texas & Florida Pizza Promotion campaign is now live and running across our network. 

📱 Targeting mobile users in Texas and Florida
🍕 Promoting free pizza with first 7NOW order
📊 Tracking app installs, account creations, first orders, and repeat orders

**Campaign ID:** 7NOW-TX-FL-2023-06
**Status:** Active
**Estimated Daily Reach:** 45,000-60,000 impressions

Your campaign performance dashboard is now available. You'll receive daily performance updates, and our AI will continuously optimize your campaign to maximize results.
                  `,
                  timestamp: new Date().toISOString(),
                  responseOptions: [
                    {
                      text: "View Campaign Performance",
                      value: "view-campaign-performance",
                    },
                    {
                      text: "Create Another Campaign",
                      value: "create-another-campaign",
                    },
                  ],
                };

                setMessages((prev) => [...prev, successMessage]);
                setIsThinking(false);

                // Notify parent component to update the canvas view
                if (onOptionSelected) onOptionSelected("launch-campaign");
              }, 3000);
            }, 1500);
          }, 100);
        }
      }
    },
    [
      messages,
      onOptionSelected,
      timeoutRef,
      clarifyingQuestionStep,
      isProductFilterContext,
      dispatch,
    ]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoize the form submit handler
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage();
    },
    [handleSendMessage]
  );

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">AI Marketing Assistant</h3>
        <p className="text-sm text-gray-500">
          Ask me anything about creating your campaign
        </p>
      </div>

      {/* Messages - Scrollable container with absolute positioning */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelected={handleOptionSelected}
              />
            ))}

            {isThinking && <AIThinkingIndicator />}

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
          <Button
            type="submit"
            variant="primary"
            icon={<PaperAirplaneIcon className="w-5 h-5" />}
            iconOnly
            disabled={!newMessage.trim() || isThinking}
            className="shadow-md"
            aria-label="Send message"
          />
        </form>
      </div>
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
  onOptionSelected?: (optionId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onOptionSelected,
}) => {
  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          message.type === "user"
            ? "bg-primary text-white rounded-tr-none"
            : "bg-blue-50 text-blue-800 shadow-sm rounded-tl-none"
        }`}
      >
        {message.type === "ai" ? (
          <div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Remove unused node parameters
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-2 last:mb-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-2 last:mb-0">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 last:mb-0">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mb-2">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-semibold mb-1">{children}</h4>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-500 hover:underline">
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-2">
                      <Image
                        src={src || ""}
                        alt={alt || ""}
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

            {/* Restore response options buttons for interactivity */}
            {message.responseOptions && message.responseOptions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                {message.responseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      onOptionSelected && onOptionSelected(option.value)
                    }
                    className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-1 px-3 border border-blue-300 rounded-full text-sm mb-1 transition-colors duration-200"
                  >
                    {option.text.length > 50
                      ? `${option.text.substring(0, 47)}...`
                      : option.text}
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

// AI Thinking Indicator - removed clientId dependency
const AIThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 animate-pulse">
      <div className="h-12 w-12 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
        <span className="text-blue-600 font-bold">AI</span>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-xs shadow-sm">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-300 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-300 rounded-full"></div>
          <div className="h-2 w-2 bg-blue-300 rounded-full"></div>
        </div>
        <div className="text-xs text-blue-800 mt-2">
          Analyzing business data...
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
