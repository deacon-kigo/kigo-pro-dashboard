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
import { addMessage } from "@/lib/redux/slices/ai-assistantSlice";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterDirectCreator } from "@/services/ai/filterHandler";

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
  title: string;
  description?: string;
}

// Add type definitions for filter context
interface FilterContext {
  availableFilterTypes: string[];
  currentCriteria: any[];
  merchantCategories: string[];
  currentFilterName?: string;
  currentFilterDescription?: string;
}

// Add preset filter templates that can be used directly
const PRESET_FILTERS = {
  skincare: {
    name: "Skin Care Campaign Filter",
    queryViewName: "SkinCareFilter",
    description: "Filter for skin care products targeting mature customers",
    criteria: [
      {
        type: "OfferCommodity",
        value: "Skin Care",
        rule: "contains",
        and_or: "OR",
      },
      {
        type: "OfferKeyword",
        value: "anti-aging",
        rule: "contains",
        and_or: "OR",
      },
      {
        type: "OfferKeyword",
        value: "wrinkle",
        rule: "contains",
        and_or: "OR",
      },
      {
        type: "OfferKeyword",
        value: "mature skin",
        rule: "contains",
        and_or: "OR",
      },
    ],
  },
  restaurant: {
    name: "Restaurant Deals Filter",
    queryViewName: "RestaurantFilter",
    description: "Filter for restaurant and dining offers",
    criteria: [
      {
        type: "OfferCategory",
        value: "Food & Dining",
        rule: "equals",
        and_or: "AND",
      },
      {
        type: "MerchantKeyword",
        value: "restaurant",
        rule: "contains",
        and_or: "OR",
      },
      {
        type: "MerchantKeyword",
        value: "dining",
        rule: "contains",
        and_or: "OR",
      },
    ],
  },
  discount: {
    name: "Discount Offers Filter",
    queryViewName: "DiscountFilter",
    description: "Filter for offers with discounts, sales or promotions",
    criteria: [
      {
        type: "OfferKeyword",
        value: "discount",
        rule: "contains",
        and_or: "OR",
      },
      { type: "OfferKeyword", value: "sale", rule: "contains", and_or: "OR" },
      { type: "OfferKeyword", value: "% off", rule: "contains", and_or: "OR" },
    ],
  },
};

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onSend = () => {},
  onOptionSelected = () => {},
  className = "",
  title,
  description,
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

    // For product filter context, add initial instructional message if no messages
    if (isProductFilterContext && messages.length === 0) {
      // Add a slight delay for a more natural feeling
      const timer = setTimeout(() => {
        const initialMessage: Message = {
          id: "filter-instruction",
          type: "ai",
          content: `✨ Ready to create filters! Choose an option below or tell me what you're looking for:`,
          timestamp: new Date().toISOString(),
          responseOptions: [
            {
              text: "🧴 Skin Care Products",
              value: "create_preset_filter:skincare",
            },
            {
              text: "🍽️ Restaurants & Dining",
              value: "create_preset_filter:restaurant",
            },
            {
              text: "💰 Discounts & Sales",
              value: "create_preset_filter:discount",
            },
            {
              text: "🔍 Create Custom Filter",
              value: "show_filter_wizard_menu",
            },
          ],
        };

        setMessages([initialMessage]);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isProductFilterContext, aiMessages, isProcessing, messages.length]);

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

  // Add a function to get the filter context properly inside the component
  const getFilterContext = (): FilterContext => {
    // Safe to use hooks here since we're inside a component
    const filterState = useSelector(
      (state: RootState) => state.productFilter || {}
    );

    return {
      availableFilterTypes: [
        "MerchantKeyword",
        "MerchantName",
        "OfferCommodity",
        "OfferKeyword",
        "Client",
        "MerchantId",
        "OfferCategory",
        "OfferExpiry",
        "OfferId",
        "OfferRedemptionControlLimit",
        "OfferRedemptionType",
        "OfferType",
      ],
      merchantCategories: [
        "Food & Dining",
        "Retail",
        "Entertainment",
        "Travel",
        "Health & Beauty",
        "Services",
        "Other",
      ],
      // If filterState doesn't exist yet, fallback to empty arrays and strings
      currentCriteria: [],
      currentFilterName: "",
      currentFilterDescription: "",
    };
  };

  // Add utility to parse LLM responses into filter data
  const parseLLMFilterResponse = (content: string): any => {
    try {
      // Look for JSON in the response
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }

      // Fall back to simple parsing for "field: value" format
      const filterData: any = { criteria: [] };
      const lines = content.split("\n");

      for (const line of lines) {
        if (line.includes(":")) {
          const [key, value] = line.split(":", 2).map((s) => s.trim());
          if (key && value) {
            if (key.toLowerCase().includes("name")) {
              filterData.name = value;
            } else if (key.toLowerCase().includes("description")) {
              filterData.description = value;
            } else if (
              key.toLowerCase().includes("category") ||
              key.toLowerCase().includes("keyword") ||
              key.toLowerCase().includes("commodity")
            ) {
              // This might be a criteria item
              filterData.criteria.push({
                type: key,
                value: value,
                rule: "contains",
                and_or: "AND",
              });
            }
          }
        }
      }

      return filterData;
    } catch (e) {
      console.error("Error parsing LLM response:", e);
      return null;
    }
  };

  // Add this utility function to generate filter suggestion buttons consistently
  const generateFilterSuggestion = (type: string, data: any) => {
    switch (type) {
      case "criteria":
        return {
          text: `Use "${data.value}" as ${data.type.replace(/([A-Z])/g, " $1").trim()}`,
          value: `suggest_criteria:${JSON.stringify(data)}`,
        };
      case "multiple":
        return {
          text: `Add ${data.length} criteria for ${data.map((c: any) => c.value).join(" & ")}`,
          value: `suggest_multiple_criteria:${JSON.stringify(data)}`,
        };
      case "complete":
        return {
          text: `✨ Create "${data.name}" filter`,
          value: `suggest_complete_filter:${JSON.stringify({
            name: data.name,
            queryViewName: data.name.replace(/\s+/g, ""),
            description: data.description,
            criteria: data.items,
          })}`,
        };
      default:
        return {
          text: `Add as filter`,
          value: `suggest_generic:${JSON.stringify(data)}`,
        };
    }
  };

  // Update the message handling to automatically detect filter queries and respond with bubbles
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    // For product filter context, use Redux for state management
    if (isProductFilterContext) {
      try {
        // Create a context object directly within the callback
        const context = {
          availableFilterTypes: [
            "MerchantKeyword",
            "MerchantName",
            "OfferCommodity",
            "OfferKeyword",
            "Client",
            "MerchantId",
            "OfferCategory",
            "OfferExpiry",
            "OfferId",
            "OfferRedemptionControlLimit",
            "OfferRedemptionType",
            "OfferType",
          ],
          merchantCategories: [
            "Food & Dining",
            "Retail",
            "Entertainment",
            "Travel",
            "Health & Beauty",
            "Services",
            "Other",
          ],
          currentCriteria: [],
          currentFilterName: "",
          currentFilterDescription: "",
        };

        // Dispatch user message
        dispatch(
          addMessage({
            type: "user",
            content: newMessage,
          })
        );

        // Set processing state
        dispatch({
          type: "aiAssistant/setProcessing",
          payload: true,
        });

        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

      // For product filter context, enhance responses with structured options for filter topics
      if (isProductFilterContext && lowerMsg.includes("pizza")) {
        // Add responseOptions to the aiResponse
        aiResponse.responseOptions = [
          generateFilterSuggestion("criteria", {
            type: "OfferCommodity",
            value: "Pizza",
            rule: "contains",
          }),
          generateFilterSuggestion("criteria", {
            type: "MerchantKeyword",
            value: "local",
            rule: "contains",
          }),
          generateFilterSuggestion("multiple", [
            { type: "OfferCommodity", value: "Pizza", rule: "contains" },
            { type: "MerchantKeyword", value: "local", rule: "contains" },
          ]),
          generateFilterSuggestion("complete", {
            name: "Local Pizza Offers",
            description: "Shows pizza offers from local merchants",
            items: [
              { type: "OfferCommodity", value: "Pizza", rule: "contains" },
              { type: "MerchantKeyword", value: "local", rule: "contains" },
            ],
          }),
        ];
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

  // Add a function to directly open the filter menu without going through chat
  const handleShowFilterMenu = () => {
    // Create a menu with direct filter options
    const wizardMenu = {
      id: Date.now().toString(),
      type: "ai" as const,
      content: "Choose a filter type:",
      timestamp: new Date().toISOString(),
      responseOptions: [
        { text: "🧴 Skin Care Products", value: "direct_preset:skincare" },
        { text: "🍽️ Restaurants & Dining", value: "direct_preset:restaurant" },
        { text: "💰 Discounts & Sales", value: "direct_preset:discount" },
        { text: "🏷️ By Product Category", value: "direct_category" },
        { text: "🔎 By Keywords", value: "direct_keyword" },
      ],
    };

    // Replace any existing messages with this menu
    setMessages([wizardMenu]);
  };

  // Add direct handling for preset filters
  const handleDirectFilterCreation = (optionValue: string) => {
    // Handle direct preset filter creation
    if (optionValue.startsWith("direct_preset:")) {
      const filterType = optionValue.replace("direct_preset:", "");
      const filterConfig = FilterDirectCreator.createPresetFilter(filterType);

      if (filterConfig) {
        // Show magical animation
        const processingMsg = {
          id: Date.now().toString(),
          type: "ai" as const,
          content: `<div class="filter-creation-animation">
            <div class="magic-wand">✨</div>
            <div class="filter-text">Creating ${filterType} filter...</div>
          </div>`,
          timestamp: new Date().toISOString(),
        };

        // Replace the menu with processing animation
        setMessages([processingMsg]);

        // After a moment, create the filter
        setTimeout(() => {
          // Format for the filter configuration handler
          const completeFilterValue = `suggest_complete_filter:${JSON.stringify(filterConfig)}`;
          onOptionSelected?.(completeFilterValue);

          // Show confirmation
          const confirmationMsg = {
            id: Date.now().toString(),
            type: "ai" as const,
            content: `✨ ${filterConfig.name} has been created and applied!`,
            timestamp: new Date().toISOString(),
            responseOptions: [
              { text: "Create Another Filter", value: "direct_show_menu" },
            ],
          };

          setMessages([confirmationMsg]);
        }, 800);

        return true;
      }
    }

    // Handle direct category selection
    if (optionValue === "direct_category") {
      const categories = FilterDirectCreator.getProductCategories();
      const categoryMenu = {
        id: Date.now().toString(),
        type: "ai" as const,
        content: "Select a product category:",
        timestamp: new Date().toISOString(),
        responseOptions: categories.map((category) => ({
          text: category,
          value: `direct_create_category:${category}`,
        })),
      };

      setMessages([categoryMenu]);
      return true;
    }

    // Handle direct category filter creation
    if (optionValue.startsWith("direct_create_category:")) {
      const category = optionValue.replace("direct_create_category:", "");
      const filterConfig = FilterDirectCreator.createCategoryFilter(category);

      // Show magical animation
      const processingMsg = {
        id: Date.now().toString(),
        type: "ai" as const,
        content: `<div class="filter-creation-animation">
          <div class="magic-wand">✨</div>
          <div class="filter-text">Creating ${category} filter...</div>
        </div>`,
        timestamp: new Date().toISOString(),
      };

      // Replace the menu with processing animation
      setMessages([processingMsg]);

      // After a moment, create the filter
      setTimeout(() => {
        // Format for the filter configuration handler
        const completeFilterValue = `suggest_complete_filter:${JSON.stringify(filterConfig)}`;
        onOptionSelected?.(completeFilterValue);

        // Show confirmation
        const confirmationMsg = {
          id: Date.now().toString(),
          type: "ai" as const,
          content: `✨ ${filterConfig.name} has been created and applied!`,
          timestamp: new Date().toISOString(),
          responseOptions: [
            { text: "Create Another Filter", value: "direct_show_menu" },
          ],
        };

        setMessages([confirmationMsg]);
      }, 800);

      return true;
    }

    // Handle direct keyword selection
    if (optionValue === "direct_keyword") {
      const keywords = FilterDirectCreator.getPopularKeywords();
      const keywordMenu = {
        id: Date.now().toString(),
        type: "ai" as const,
        content: "Select a keyword to filter by:",
        timestamp: new Date().toISOString(),
        responseOptions: [
          ...keywords.map((keyword) => ({
            text: keyword,
            value: `direct_create_keyword:${keyword}`,
          })),
          { text: "✏️ Enter Custom Keyword", value: "custom_keyword_input" },
        ],
      };

      setMessages([keywordMenu]);
      return true;
    }

    // Handle direct keyword filter creation
    if (optionValue.startsWith("direct_create_keyword:")) {
      const keyword = optionValue.replace("direct_create_keyword:", "");
      const filterConfig = FilterDirectCreator.createKeywordFilter(keyword);

      // Show magical animation
      const processingMsg = {
        id: Date.now().toString(),
        type: "ai" as const,
        content: `<div class="filter-creation-animation">
          <div class="magic-wand">✨</div>
          <div class="filter-text">Creating filter for "${keyword}"...</div>
        </div>`,
        timestamp: new Date().toISOString(),
      };

      // Replace the menu with processing animation
      setMessages([processingMsg]);

      // After a moment, create the filter
      setTimeout(() => {
        // Format for the filter configuration handler
        const completeFilterValue = `suggest_complete_filter:${JSON.stringify(filterConfig)}`;
        onOptionSelected?.(completeFilterValue);

        // Show confirmation
        const confirmationMsg = {
          id: Date.now().toString(),
          type: "ai" as const,
          content: `✨ ${filterConfig.name} has been created and applied!`,
          timestamp: new Date().toISOString(),
          responseOptions: [
            { text: "Create Another Filter", value: "direct_show_menu" },
          ],
        };

        setMessages([confirmationMsg]);
      }, 800);

      return true;
    }

    // Show menu again for the "Create Another Filter" option
    if (optionValue === "direct_show_menu") {
      handleShowFilterMenu();
      return true;
    }

    // Not handled by direct filter creator
    return false;
  };

  // Update option selected handler to first try direct creation
  const handleOptionSelected = useCallback(
    (optionValue: string) => {
      // First try to handle with direct filter creation
      if (handleDirectFilterCreation(optionValue)) {
        return;
      }

      // Continue with existing logic if not handled by direct creation
      // ...existing code...
    },
    [onOptionSelected, isProductFilterContext, dispatch]
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
      {/* Header - Fixed at exactly 61px to match product filter header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px]">
        <div className="flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-primary" />
          <div>
            <h3 className="font-medium">{title}</h3>
          </div>
        </div>
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
          {/* Quick Create Icon with Tooltip - Only show in product filter context */}
          {isProductFilterContext && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleShowFilterMenu}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Quick Create Filter"
                  >
                    <SparklesIcon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick Create Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

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
  // Check if the message contains HTML (for animations)
  const containsHTML =
    message.type === "ai" &&
    (message.content.includes("<div") || message.content.includes("<span"));

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
                      <h4 className="text-base font-semibold mb-1">
                        {children}
                      </h4>
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
            )}

            {/* Enhanced responsive filter suggestion buttons */}
            {message.responseOptions && message.responseOptions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                {message.responseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      onOptionSelected && onOptionSelected(option.value)
                    }
                    className={`
                      relative overflow-hidden 
                      ${
                        option.value.includes("suggest_complete_filter")
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                          : option.value.includes("suggest_multiple_criteria")
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
                            : "bg-white hover:bg-gray-100 text-blue-700 border border-blue-300"
                      }
                      font-medium py-2 px-3 rounded-full text-sm mb-1 transition-all duration-200
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

// Add animated filter creation effect
const style = `
<style>
.filter-creation-animation {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  min-height: 40px;
}

.magic-wand {
  font-size: 24px;
  margin-right: 12px;
  animation: sparkle 1.5s infinite ease-in-out;
}

.filter-text {
  position: relative;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Add a subtle glow effect */
.filter-creation-animation::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(125, 185, 232, 0.1) 0%, rgba(125, 185, 232, 0) 100%);
  border-radius: 8px;
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(125, 185, 232, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(125, 185, 232, 0.8);
  }
}
</style>
`;

// Add the style to the document when the component mounts
if (typeof document !== "undefined") {
  const styleElement = document.createElement("div");
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement.firstChild as Node);
}

export default AIAssistantPanel;
