"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useDemoState } from "@/lib/redux/hooks";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onSend = () => {},
  onOptionSelected = () => {},
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

        setMessages([
          {
            id: "1",
            type: "ai",
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
          },
        ]);
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

      // Customize response based on client ID and user message
      const isSeven = clientId === "seven-eleven";

      // Try to match the message to known phrases or keywords
      const lowerMsg = newMessage.toLowerCase();

      if (
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
  const handleOptionClick = useCallback(
    (optionValue: string) => {
      // Set thinking state
      setIsThinking(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a timeout to simulate AI thinking
      timeoutRef.current = setTimeout(() => {
        let aiResponse: Message;

        // Customize responses based on client ID
        const isSeven = clientId === "seven-eleven";

        switch (optionValue) {
          case "create-campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "I've created three campaign options for you, designed specifically for 7-Eleven. Take a look at the delivery promotion, family bundle, and app-exclusive options in the canvas."
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

          case "show-data":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "Here's your business intelligence data showing 7-Eleven sales patterns, app usage, delivery trends, and customer segments. Weekday delivery shows significant growth potential."
                : "Here's your business intelligence data showing sales by day, performance trends, competitor activity, and customer segments. The weekday dinner opportunity is clear.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's create a campaign", value: "create-campaign" },
                { text: "What should I focus on?", value: "focus-suggestion" },
              ],
            };
            if (onOptionSelected) onOptionSelected("show-data");
            break;

          case "select-campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "7NOW Delivery Special selected. All creative assets are ready: app banners, email templates, social media posts, and in-store materials. Customize any asset to match your preferences."
                : "Family Dinner Bundle selected. All creative assets are ready: social media, email templates, and in-store materials. Customize any asset to match your brand.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Customize these assets", value: "customize-assets" },
                { text: "These look great as is", value: "keep-assets" },
              ],
            };
            if (onOptionSelected) onOptionSelected("select-campaign");
            break;

          case "customize-assets":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Assets updated based on your selections. Performance predictions are ready with expected views, redemptions, revenue, and ROI.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Review performance details",
                  value: "review-performance",
                },
                {
                  text: "Optimize for better results",
                  value: "optimize-campaign",
                },
              ],
            };
            if (onOptionSelected) onOptionSelected("customize-assets");
            break;

          case "review-performance":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Your campaign is ready to launch with distribution schedule, performance tracking, and one-click launch option.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Launch campaign", value: "launch-campaign" },
                { text: "Schedule for later", value: "schedule-campaign" },
              ],
            };
            if (onOptionSelected) onOptionSelected("review-performance");
            break;

          case "launch-campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Congratulations! Your Family Weekday Special campaign has been launched. You can monitor its performance from your dashboard.",
              timestamp: new Date(),
            };
            if (onOptionSelected) onOptionSelected("launch-campaign");
            break;

          case "keep-assets":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Great! I'll keep the assets as is. Let's move on to the performance predictions for your campaign.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Show me performance predictions",
                  value: "review-performance",
                },
              ],
            };
            if (onOptionSelected) onOptionSelected("customize-assets");
            break;

          case "campaign-suggestion":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "Based on your data, a 7NOW Weekday Delivery Special would be most effective. It offers free delivery and special pricing on weekdays to boost your slower periods."
                : "Based on your data, a Family Weekday Special would be most effective. It offers a complete family meal at a competitive price point, targeting your underperforming weekday periods.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Let's create this campaign",
                  value: "create-campaign",
                },
              ],
            };
            break;

          case "expected-results":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "Based on similar campaigns in your industry, you can expect a 20-30% increase in weekday delivery orders, with approximately 400-480 offer redemptions per week and a positive ROI within 10 days."
                : "Based on similar campaigns in your industry, you can expect a 25-35% increase in weekday dinner sales, with approximately 200-300 offer redemptions per week and a positive ROI within the first 14 days.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Generate campaign options", value: "create-campaign" },
              ],
            };
            break;

          case "campaign-explanation":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I created these options by analyzing your sales data, competitive landscape, and customer preferences. Each option targets your weekday dinner opportunity with a different approach to appeal to your family demographic.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Select the Family Dinner Bundle",
                  value: "select-campaign",
                },
              ],
            };
            break;

          case "focus-suggestion":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Based on your data, focus on the weekday dinner opportunity. Specifically, target families with a value-oriented bundle that emphasizes your portion size advantage over competitors.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Create a campaign for this focus",
                  value: "create-campaign",
                },
              ],
            };
            break;

          case "optimize-campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "I've optimized your campaign parameters for maximum ROI. By adjusting the targeting radius to 5 miles and focusing on Monday-Thursday from 4-8pm, we can increase expected redemptions by 15%.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Review updated performance",
                  value: "review-performance",
                },
              ],
            };
            if (onOptionSelected) onOptionSelected("customize-assets");
            break;

          case "schedule-campaign":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Your campaign has been scheduled to launch next Monday. You'll receive a notification when it goes live, and you can monitor performance from your dashboard.",
              timestamp: new Date(),
            };
            if (onOptionSelected) onOptionSelected("launch-campaign");
            break;

          case "pizza-palace":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: `Pizza Palace has been your strongest competitor for the past 18 months. Here's my detailed analysis:

1. **Pricing Strategy**: They operate at an average 12% lower price point than your menu, focusing on volume over margins.

2. **Target Audience**: Primarily budget-conscious families and students; 65% of their customer base consists of these two segments.

3. **Marketing Approach**: Heavy emphasis on limited-time offers and flash sales. They run twice as many promotions as the industry average.

4. **Weaknesses**:
• Customer satisfaction scores (3.9/5) are below yours (4.7/5)
• Portion sizes are 15% smaller than yours for comparable menu items
• Limited premium options for higher-end customers

5. **Recent Changes**: They've just launched a new mobile app with loyalty program, which has boosted their repeat customer rate by approximately 8% in the test areas.

Your family weekday special effectively counters their main value proposition while highlighting your superior portion sizes and quality.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's create our campaign", value: "create-campaign" },
                {
                  text: "Tell me about other competitors",
                  value: "other-competitors",
                },
              ],
            };
            break;

          case "compete-strategy":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: `Based on my competitive analysis, here are my recommended strategies to position against your competitors:

1. **Value Messaging**: Emphasize "family-sized portions" at competitive prices. Your portions are 15% larger than Pizza Palace's at only a slightly higher price point.

2. **Quality Differentiation**: Highlight your superior customer satisfaction scores (4.7/5 vs. competitor average of 4.2/5) in marketing materials.

3. **Targeting Opportunity**: Focus on families during weekday dinners - this segment is underserved by competitors who focus primarily on weekend business.

4. **Promotional Calendar**: Increase your promotional frequency to match competitors (currently they run 6 promotions to your 1). A consistent weekday family special would be ideal.

5. **Digital Strategy**: Develop a more visible online ordering experience; competitors are gaining ground through enhanced digital presence.

The Family Weekday Special campaign addresses most of these strategies, focusing on your strengths while targeting a competitive gap in the market.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Create this campaign now", value: "create-campaign" },
                {
                  text: "What creative assets do you suggest?",
                  value: "creative-assets",
                },
              ],
            };
            break;

          case "other-competitors":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: `Let me share insights on your other key competitors:

**Little Italy**
• Positioning: Authentic, premium Italian pizza with imported ingredients
• Price Point: 20-25% higher than your menu
• Target Audience: Higher-income families and professionals, 35-55 age range
• Strengths: Strong brand perception of authenticity and quality
• Weaknesses: Limited appeal to value-conscious customers; slower delivery times

**Crust & Co**
• Positioning: Fast, convenient lunch option with express service guarantee
• Price Point: Similar to yours for individual items, fewer family/group deals
• Target Audience: Office workers, professionals on lunch breaks
• Strengths: 10-minute service guarantee drives loyalty for lunch crowd
• Weaknesses: Lower dinner traffic; limited weekend business

Neither of these competitors directly targets the weekday family dinner segment, which represents your biggest opportunity. Little Italy is too premium-focused, while Crust & Co is lunch-oriented.`,
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Create our family dinner campaign",
                  value: "create-campaign",
                },
                {
                  text: "What other opportunities do you see?",
                  value: "more-opportunities",
                },
              ],
            };
            break;

          case "creative-assets":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: `For your Family Weekday Special campaign, I recommend these creative approaches:

1. **Primary Visual**: Family-centered imagery showing abundant food portions that emphasize the "more food" value proposition.

2. **Key Messaging**: 
   • Headline: "Family Dinner, Sized for REAL Families"
   • Subheading: "15% More Food at a Price Your Family Will Love"

3. **Creative Elements**:
   • Show side-by-side portion comparison with generic "competitor" pizza
   • Use bright, warm colors that convey freshness and abundance
   • Include authentic customer testimonials about portion sizes

4. **Channel-Specific Adaptations**:
   • Social Media: Short video showing family reactions to the portion sizes
   • Email: Personalized offers with family name when possible
   • In-store: Large format posters emphasizing the size difference

I've prepared draft assets for all these formats that you can customize in the Asset Creation Workshop.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Show me the assets", value: "customize-assets" },
                { text: "Create the campaign", value: "create-campaign" },
              ],
            };
            break;

          case "more-opportunities":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: `Beyond the Family Weekday Special, I see these additional opportunities:

1. **Weekend Lunch Gap**: Your weekend business is strong for dinner but underperforms at lunch compared to competitors. A weekend lunch bundle could drive incremental revenue.

2. **Online Ordering Enhancement**: Your online ordering flow has 15% higher abandonment than industry average. Streamlining this could improve conversion by 8-10%.

3. **Loyalty Program**: Your repeat customer rate (22%) lags behind the industry average (27%). A simple points-based system could close this gap.

4. **Student Special**: With 3 colleges within your delivery radius, there's potential to develop a student-focused offering for the upcoming semester.

5. **Premium Ingredients Line**: For targeting Little Italy's customer segment, a premium specialty pizza line could capture higher-end customers and increase average order value.

Would you like me to develop a campaign strategy for any of these opportunities after we complete the Family Weekday Special?`,
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Let's focus on the family campaign first",
                  value: "create-campaign",
                },
                {
                  text: "Tell me more about the loyalty program",
                  value: "loyalty-program",
                },
              ],
            };
            break;

          case "loyalty-program":
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content:
                "Based on your customer data, a simple points-based loyalty program could increase your repeat customer rate by 15-20%. We should focus on the family campaign first, then I can help you design a loyalty program next.",
              timestamp: new Date(),
              responseOptions: [
                {
                  text: "Let's focus on the family campaign",
                  value: "create-campaign",
                },
              ],
            };
            break;

          default:
            aiResponse = {
              id: Date.now().toString(),
              type: "ai",
              content: isSeven
                ? "I'm here to help you create effective campaigns for your 7-Eleven locations. What would you like to do next?"
                : "I'm here to help you create effective campaigns for your pizza business. What would you like to do next?",
              timestamp: new Date(),
              responseOptions: [
                { text: "Show me the data", value: "show-data" },
                { text: "Create a campaign", value: "create-campaign" },
              ],
            };
        }

        setMessages((prev) => [...prev, aiResponse]);
        setIsThinking(false);
      }, 1500);
    },
    [onOptionSelected, clientId]
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">AI Marketing Assistant</h3>
        <p className="text-sm text-gray-500">
          Ask me anything about creating your campaign
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Messages - Flex grow to take available space and scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin pb-20">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onOptionSelected={handleOptionClick}
            />
          ))}

          {isThinking && <AIThinkingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - Fixed at bottom, absolute positioned */}
        <div className="p-4 border-t border-gray-200 bg-white absolute bottom-0 left-0 right-0 z-10">
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
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
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
            : "bg-gray-100 text-gray-800 rounded-tl-none"
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
                  <button
                    key={option.value}
                    onClick={() =>
                      onOptionSelected && onOptionSelected(option.value)
                    }
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
      <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Analyzing business data...
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
