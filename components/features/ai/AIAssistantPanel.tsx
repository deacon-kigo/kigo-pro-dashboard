"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Button } from "@/components/atoms/Button/Button";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          content: `${greeting}, ${merchantName}! I'm your AI marketing assistant. Let me show you your business intelligence data to help identify opportunities for a new campaign.`,
          timestamp: new Date(),
          responseOptions: [
            { text: "Show me the data", value: "show-data" },
            {
              text: "What campaign would you suggest?",
              value: "campaign-suggestion",
            },
            {
              text: "What can I expect from a new campaign?",
              value: "expected-results",
            },
          ],
        };

        // For 7-Eleven, start with business objectives prompt
        if (clientId === "seven-eleven") {
          initialMessage = {
            id: "1",
            type: "ai",
            content: `${greeting}, ${merchantName}! I'm your AI marketing assistant. To help you create an effective campaign, please share your primary business objective.`,
            timestamp: new Date(),
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

    // Add the user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
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
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "Thank you for sharing your business objective. To drive installs and transactions through your 7NOW delivery app, I recommend creating a special offer. Do you have an initial offer concept in mind?",
            timestamp: new Date(),
            responseOptions: [
              {
                text: "Free pizza with 7NOW order",
                value: "free-pizza-offer",
              },
              {
                text: "What would you recommend?",
                value: "recommend-offer",
              },
            ],
          };
        } else if (
          lowerMsg.includes("promo code") ||
          lowerMsg.includes("bigbite") ||
          lowerMsg.includes("june")
        ) {
          aiResponse = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "I'm analyzing this offer to optimize its structure and performance...",
            timestamp: new Date(),
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
* Calculating optimal promotion structure to maximize both installs and completed transactions ✓
* Determining the most effective validation method for tracking unique redemptions ✓
              `,
              timestamp: new Date(),
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

**Geographic targeting:** 
- All 7-Eleven locations across Texas and Florida (1,842 stores)

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
                timestamp: new Date(),
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
              "I understand you want to drive installs and transactions for your 7NOW delivery app. Could you tell me more about the specific offer you'd like to create?",
            timestamp: new Date(),
            responseOptions: [
              {
                text: "Free pizza with 7NOW order",
                value: "free-pizza-offer",
              },
              {
                text: "What would you recommend?",
                value: "recommend-offer",
              },
            ],
          };
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
          timestamp: new Date(),
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
            timestamp: new Date(),
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
            timestamp: new Date(),
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
            timestamp: new Date(),
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
            timestamp: new Date(),
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
              timestamp: new Date(),
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
              timestamp: new Date(),
              responseOptions: [
                {
                  text: isSeven
                    ? "Select the 7NOW Delivery Special"
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
                  timestamp: new Date(),
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
                  timestamp: new Date(),
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
                timestamp: new Date(),
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
  }, [newMessage, onOptionSelected, clientId, onSend]);

  // Memoize option click handler to avoid recreation on each render
  const handleOptionSelected = useCallback(
    (optionValue: string) => {
      // Notify parent component
      onOptionSelected && onOptionSelected(optionValue);

      // Add the option as a user message
      const selectedOption = messages
        .filter((m) => m.responseOptions)
        .flatMap((m) => m.responseOptions || [])
        .find((option) => option.value === optionValue);

      if (selectedOption) {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: selectedOption.text,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsThinking(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Special handling for 7-Eleven offer creation demo
        if (optionValue === "app-installs-objective") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Thank you for sharing your business objective. To drive installs and transactions through your 7NOW delivery app, I recommend creating a special offer. Do you have an initial offer concept in mind?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Free pizza with 7NOW order",
                  value: "free-pizza-offer",
                },
                {
                  text: "What would you recommend?",
                  value: "recommend-offer",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "need-objective-help") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I can help you define your objective. Based on your previous campaigns and market trends, focusing on driving app installs and transactions would be most effective. Would you like to target specific regions?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Target Texas and Florida",
                  value: "app-installs-objective",
                },
                {
                  text: "Target all regions",
                  value: "app-installs-nationwide",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "free-pizza-offer") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Great choice! For your free pizza with 7NOW order promotion, I need a few more details to optimize the offer structure. Do you have specific parameters like promo code, limitations, or validity period in mind?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Promo code: BIGBITE, Limit 1 per customer, Valid through end of June",
                  value: "offer-details",
                },
                {
                  text: "No, please recommend the best parameters",
                  value: "recommend-parameters",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "recommend-parameters") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Based on our analysis, I recommend the following parameters:\n\nPromo code: BIGBITE (easy to remember and branded)\nLimitation: 1 per new customer (focuses on app installs)\nValidity: Through end of June (gives 4-5 weeks of runway)\n\nWould you like to proceed with these parameters?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Yes, use these parameters",
                  value: "offer-details",
                },
                {
                  text: "Let me make some adjustments",
                  value: "adjust-parameters",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "discount-offer") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "The $5 off offer is a good alternative. However, our data indicates that the free pizza offer would likely drive 32% more app installs in your target markets. Would you like to reconsider the free pizza offer, or proceed with the $5 discount?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Let's go with the free pizza offer after all",
                  value: "free-pizza-offer",
                },
                {
                  text: "Still prefer the $5 discount offer",
                  value: "confirm-discount-offer",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "confirm-discount-offer") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I understand. Let's proceed with analyzing the $5 discount offer structure...",
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);

            // After a brief delay, show the analysis process (similar to the pizza offer flow but with discount)
            setTimeout(() => {
              const analysisResponse: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: `
### Analysis in Progress

* Analyzing 7-Eleven's pricing structure and typical order values ✓
* Examining historical performance data from similar discount-based promotions ✓
* Evaluating market-specific trends in Texas and Florida app adoption rates ✓
* Calculating optimal discount threshold to maximize both installs and completed transactions ✓
* Determining the most effective validation method for tracking unique redemptions ✓
                `,
                timestamp: new Date(),
              };

              setMessages((prev) => [...prev, analysisResponse]);

              // Show optimized offer after analysis
              setTimeout(() => {
                const finalOffer: Message = {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `
### Optimized Discount Offer Structure

**$5 Off Your First 7NOW Order of $15+**

**Redemption flow:**
- Install app → Create account → Enter code 'SAVE5' at checkout → $5 discount applied

**Geographic targeting:** 
- All 7-Eleven locations across Texas and Florida (1,842 stores)

**Validation method:** 
- Automated promo code redemption tracking with 1-per-customer limit enforced

**Timing:** 
- Immediate launch through June 30

**Projected performance:**
- 21% projected conversion rate from impression to app install
- 68% projected completion rate from install to first order
- $16.75 estimated average basket size on first order
- 38% projected retention rate for second order within 30 days

*The offer is configured and ready for campaign deployment. Would you like to proceed with this optimized structure?*
                  `,
                  timestamp: new Date(),
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
          }, 1500);
          return;
        }

        if (optionValue === "approve-offer") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Great! The offer has been finalized and is ready for deployment. The campaign will launch immediately and run through June 30th. Would you like me to help with anything else?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Help me create the campaign materials",
                  value: "create-assets",
                },
                {
                  text: "No, that's all for now",
                  value: "end-session",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "recommend-offer") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Based on your app usage data and purchase patterns, I recommend a 'Free pizza with first 7NOW order' promotion. This type of offer has shown strong conversion rates for app installs and first-time usage. Would you like to proceed with this concept?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Yes, let's use the free pizza offer",
                  value: "free-pizza-offer",
                },
                {
                  text: "Show me other options",
                  value: "other-offer-options",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "other-offer-options") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Here are some alternative offer concepts for driving app installs:\n\n1. Free delivery on first order\n2. $5 off orders over $15\n3. Buy one, get one free on select items\n\nHowever, our data shows that the free pizza offer has the strongest pull for new app installs and completed transactions.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Let's go with the free pizza offer",
                  value: "free-pizza-offer",
                },
                {
                  text: "I prefer the $5 off offer",
                  value: "discount-offer",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "offer-details") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I'm analyzing this offer to optimize its structure and performance...",
              timestamp: new Date(),
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
* Calculating optimal promotion structure to maximize both installs and completed transactions ✓
* Determining the most effective validation method for tracking unique redemptions ✓
                `,
                timestamp: new Date(),
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

**Geographic targeting:** 
- All 7-Eleven locations across Texas and Florida (1,842 stores)

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
                  timestamp: new Date(),
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
          }, 1500);
          return;
        }

        if (
          optionValue === "adjust-parameters" ||
          optionValue === "adjust-offer"
        ) {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "What aspects of the offer would you like to adjust? You can modify the promo code, targeting, limitations, or validity period.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Change validity to end of July",
                  value: "adjust-validity",
                },
                {
                  text: "Let's go with the original parameters",
                  value: "offer-details",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        if (optionValue === "adjust-validity") {
          timeoutRef.current = setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I've updated the validity period to end of July. This gives the campaign a full 8-week run, which should maximize app installs while maintaining operational feasibility. Would you like me to analyze this adjusted offer?",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Yes, analyze the adjusted offer",
                  value: "offer-details",
                },
                {
                  text: "Make additional adjustments",
                  value: "adjust-parameters",
                },
              ],
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsThinking(false);
          }, 1500);
          return;
        }

        // Handle other option selections with standard response
        timeoutRef.current = setTimeout(() => {
          // Default response
          let aiResponse: Message = {
            id: Date.now().toString(),
            type: "ai",
            content:
              "I'm analyzing your request. How would you like to proceed?",
            timestamp: new Date(),
            responseOptions: [
              { text: "Continue", value: "continue" },
              { text: "Start over", value: "start-over" },
            ],
          };

          // ... the rest of the existing logic...

          setMessages((prev) => [...prev, aiResponse]);
          setIsThinking(false);
        }, 1500);
      }
    },
    [messages, onOptionSelected]
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
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">AI Marketing Assistant</h3>
        <p className="text-sm text-gray-500">
          Ask me anything about creating your campaign
        </p>
      </div>

      {/* Messages - Change to take all available space except for input height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
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

      {/* Input - Change from absolute to sticky positioning */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 sticky bottom-0 left-0 right-0 z-10">
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
            : "bg-blue-50 text-blue-800  shadow-sm rounded-tl-none"
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

            {message.responseOptions && message.responseOptions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.responseOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() =>
                      onOptionSelected && onOptionSelected(option.value)
                    }
                    variant="outline"
                    size="sm"
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {option.text}
                  </Button>
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
