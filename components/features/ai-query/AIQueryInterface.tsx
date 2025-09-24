/**
 * AI Query Interface - Natural Language Command Center
 *
 * A sleek popover interface for natural language queries and commands.
 * Uses Vercel AI SDK UI components for proper streaming and chat functionality.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  Send,
  X,
  Mic,
  MicOff,
  Command,
  Zap,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  ArrowRight,
  Loader2,
  User,
  Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addNotification } from "@/lib/redux/slices/uiSlice";
import {
  CampaignBuilderUI,
  AnalyticsDashboardUI,
  CustomerInsightsUI,
  JourneyDiscoveryUI,
  PatternAnalysisUI,
  CampaignArchitectureUI,
  LightningStrategyUI,
  CampaignLaunchUI,
  type GenerativeUIComponent,
} from "./generative-ui";

interface QuerySuggestion {
  id: string;
  text: string;
  category: "campaign" | "insights" | "analytics" | "targeting";
  icon: React.ReactNode;
  example?: string;
}

interface QueryResult {
  id: string;
  query: string;
  response: string;
  actions?: Array<{
    label: string;
    action: () => void;
    type: "primary" | "secondary";
  }>;
  insights?: {
    revenue?: string;
    confidence?: number;
    timeline?: string;
    customers?: number;
  };
}

const QUERY_SUGGESTIONS: QuerySuggestion[] = [
  // Tucker's New Mover Journey (Part 1 of Demo Script)
  {
    id: "new-mover-campaign",
    text: "Create AI-Powered New Mover Journey for Q4 mortgage customers",
    category: "campaign",
    icon: <Target className="w-4 h-4" />,
    example:
      "Build 3-step conversational flow: $100 AI Gift → Follow-up conversation → Moving Journey bundle with U-Haul, Public Storage, Hilton",
  },
  // Tucker's Starbucks Coffee Switch Campaign (Part 2 of Demo Script)
  {
    id: "starbucks-conquesting",
    text: "Create Starbucks Coffee Switch conquesting campaign",
    category: "campaign",
    icon: <DollarSign className="w-4 h-4" />,
    example:
      "Target 50,000 members with competitor coffee purchases → 1,000 bonus points offer → Geofenced delivery near Starbucks",
  },
  // Tucker Williams Complete Campaign Creation Demo
  {
    id: "create-campaign-demo",
    text: "Create a complete campaign for home buyers (Visual Demo)",
    category: "campaign",
    icon: <Brain className="w-4 h-4" />,
    example:
      "Interactive visual experience: Data discovery → Analysis charts → Architecture design → Strategy optimization → Live dashboard",
  },
  // Original suggestions for variety
  {
    id: "back-to-school",
    text: "Design a back-to-school campaign for families with children",
    category: "campaign",
    icon: <Target className="w-4 h-4" />,
    example: "Target families with school supplies, clothing, and electronics",
  },
  {
    id: "weekend-dining",
    text: "Build a weekend dining and entertainment campaign",
    category: "campaign",
    icon: <Target className="w-4 h-4" />,
    example: "Focus on restaurants, activities, and local experiences",
  },
  {
    id: "millennial-behavior",
    text: "Analyze spending patterns for millennial customers",
    category: "insights",
    icon: <TrendingUp className="w-4 h-4" />,
    example: "Show preferences, frequency, and seasonal trends",
  },
  {
    id: "revenue-forecast",
    text: "What are our biggest revenue opportunities this quarter?",
    category: "analytics",
    icon: <DollarSign className="w-4 h-4" />,
    example: "Include ROI projections and implementation timelines",
  },
  {
    id: "family-targeting",
    text: "Set up targeting for high-value suburban families",
    category: "targeting",
    icon: <Users className="w-4 h-4" />,
    example: "Focus on household income, family size, and location",
  },
];

interface AIQueryInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  apiEndpoint?: string;
  mode?: "vercel-ai" | "copilotkit";
  isFullScreen?: boolean;
  initialMessages?: any[];
  initialUIComponent?: { messageId: string; component: any } | null;
}

export default function AIQueryInterface({
  isOpen,
  onClose,
  apiEndpoint = "/api/ai/chat",
  mode = "vercel-ai",
  isFullScreen = false,
  initialMessages = [],
  initialUIComponent = null,
}: AIQueryInterfaceProps) {
  // Vercel AI SDK useChat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    reload,
    stop,
  } = useChat({
    api: apiEndpoint,
    onError: (error) => {
      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "error",
          title: "AI Query Failed",
          message:
            error.message || "There was an error processing your request.",
          duration: 5000,
        })
      );
    },
    onFinish: (message, { finishReason, usage }) => {
      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "success",
          title: "AI Query Completed",
          message: "Your request has been processed successfully.",
          duration: 3000,
        })
      );
    },
    // Custom fetch to capture response headers
    fetch: async (input, init) => {
      const response = await fetch(input, init);

      // Check for UI component in headers
      const uiComponentHeader = response.headers.get("X-UI-Component");
      if (uiComponentHeader) {
        try {
          const uiComponent = JSON.parse(
            uiComponentHeader
          ) as GenerativeUIComponent;
          const messageId = Date.now().toString();
          setGenerativeComponents((prev) =>
            new Map(prev).set(messageId, uiComponent)
          );
        } catch (error) {
          console.error("Failed to parse UI component:", error);
        }
      }

      return response;
    },
  });

  // Local state for input if useChat doesn't provide it
  const [localInput, setLocalInput] = useState("");
  const [generativeComponents, setGenerativeComponents] = useState<
    Map<string, GenerativeUIComponent>
  >(() => {
    const initialMap = new Map();
    if (initialUIComponent) {
      initialMap.set(
        initialUIComponent.messageId,
        initialUIComponent.component
      );
    }
    return initialMap;
  });
  const [localMessages, setLocalMessages] = useState<any[]>(initialMessages);
  // Local state for campaign creation flow
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Function to render generative UI components
  const renderGenerativeUI = (component: GenerativeUIComponent) => {
    switch (component.type) {
      case "campaign-builder":
        return <CampaignBuilderUI {...component.props} />;
      case "analytics-dashboard":
        return <AnalyticsDashboardUI {...component.props} />;
      case "customer-insights":
        return <CustomerInsightsUI {...component.props} />;
      case "journey-discovery":
        return (
          <JourneyDiscoveryUI
            {...component.props}
            onAnalyzeJourney={(journeyId) => {
              // Trigger the next step by simulating a query submission
              setLocalInput(
                "Analyze home purchase + relocation journey (567 customers/month)"
              );
              setTimeout(() => {
                safeHandleSubmit(new Event("submit") as any);
              }, 100);
            }}
          />
        );
      case "pattern-analysis":
        return (
          <PatternAnalysisUI
            {...component.props}
            onContinue={() => {
              // Trigger the next step by simulating a query submission
              setLocalInput(
                "Build phase-based campaign with 15 national + 12K local partners"
              );
              setTimeout(() => {
                safeHandleSubmit(new Event("submit") as any);
              }, 100);
            }}
          />
        );
      case "campaign-architecture":
        return (
          <CampaignArchitectureUI
            {...component.props}
            onActivateNetwork={() => {
              // Trigger the next step by simulating a query submission
              setLocalInput(
                "Create lightning offers (+34% engagement, +$67 revenue)"
              );
              setTimeout(() => {
                safeHandleSubmit(new Event("submit") as any);
              }, 100);
            }}
          />
        );
      case "lightning-strategy":
        return (
          <LightningStrategyUI
            {...component.props}
            onLaunchCampaign={() => {
              // Trigger the next step by simulating a query submission
              setLocalInput(
                "Launch campaign: 567 targets, live performance tracking"
              );
              setTimeout(() => {
                safeHandleSubmit(new Event("submit") as any);
              }, 100);
            }}
          />
        );
      case "campaign-launch":
        return <CampaignLaunchUI {...component.props} />;
      default:
        return null;
    }
  };

  // Campaign creation flow handler
  const handleCampaignStep = (step: string, journey?: string) => {
    setCurrentStep(step);
    if (journey) {
      setSelectedJourney(journey);
    }
  };

  // Start the interactive campaign demo - just shows the first step
  const startCompleteCampaignDemo = () => {
    // Clear any existing messages and start fresh
    setLocalMessages([]);
    setGenerativeComponents(new Map());

    // Add initial AI greeting and first step
    const initialMessage = {
      id: Date.now().toString() + "-initial",
      role: "assistant" as const,
      content:
        "I've analyzed ABC FI's transaction data and discovered 4 high-value customer journey opportunities:",
    };

    setLocalMessages([initialMessage]);
    setGenerativeComponents(
      new Map().set(initialMessage.id, {
        type: "journey-discovery" as const,
        props: {},
      })
    );

    // Show first suggestion after a delay
    setTimeout(() => {
      setCurrentSuggestions([
        "Analyze the home purchase + relocation journey pattern",
      ]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  // Handle suggestion clicks for interactive demo flow
  const handleDemoSuggestionClick = (suggestion: string) => {
    // Clear current suggestions
    setCurrentSuggestions([]);

    // Add user message
    const userMessage = {
      id: Date.now().toString() + "-user",
      role: "user" as const,
      content: suggestion,
    };

    setLocalMessages((prev) => [...prev, userMessage]);

    // Determine next step based on suggestion
    setTimeout(() => {
      let aiResponse = "";
      let uiComponent: any = null;
      let nextSuggestions: string[] = [];

      if (suggestion.includes("Analyze the home purchase")) {
        aiResponse =
          "Here's the detailed 12-week journey analysis with engagement rates and financial projections:";
        uiComponent = {
          type: "pattern-analysis" as const,
          props: { journeyType: "Home Purchase + Relocation" },
        };
        nextSuggestions = ["Build the phase-based campaign architecture"];
      } else if (suggestion.includes("Build the phase-based campaign")) {
        aiResponse =
          "Campaign architecture designed with 4 phases and full partner network integration:";
        uiComponent = { type: "campaign-architecture" as const, props: {} };
        nextSuggestions = ["Create the lightning offers strategy"];
      } else if (suggestion.includes("Create the lightning offers")) {
        aiResponse =
          "AI-optimized lightning offers strategy activated with phase-specific timing and scarcity management:";
        uiComponent = { type: "lightning-strategy" as const, props: {} };
        nextSuggestions = [
          "Launch the campaign with live performance tracking",
        ];
      } else if (suggestion.includes("Launch the campaign")) {
        aiResponse =
          "🚀 Campaign launched! Real-time performance dashboard is now active:";
        uiComponent = { type: "campaign-launch" as const, props: {} };
        nextSuggestions = []; // No more suggestions - demo complete
      }

      // Add AI response
      const assistantMessage = {
        id: Date.now().toString() + "-assistant",
        role: "assistant" as const,
        content: aiResponse,
      };

      setLocalMessages((prev) => [...prev, assistantMessage]);
      setGenerativeComponents((prev) =>
        new Map(prev).set(assistantMessage.id, uiComponent)
      );

      // Show next suggestions after a delay
      setTimeout(() => {
        setCurrentSuggestions(nextSuggestions);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }, 500);
  };

  // Use local state if useChat input is not available
  const currentInput = input !== undefined ? input : localInput || "";
  const currentSetInput = setInput || setLocalInput;

  // Debug logging
  console.log("AIQueryInterface - messages from useChat:", messages);
  console.log("AIQueryInterface - localMessages:", localMessages);
  console.log("AIQueryInterface - initialMessages prop:", initialMessages);
  console.log(
    "AIQueryInterface - initialUIComponent prop:",
    initialUIComponent
  );
  console.log("AIQueryInterface - generativeComponents:", generativeComponents);

  const currentMessages =
    messages && messages.length > 0 ? messages : localMessages;

  console.log("AIQueryInterface - currentMessages (final):", currentMessages);

  // Fallback handlers in case useChat doesn't provide them
  const safeHandleInputChange =
    handleInputChange ||
    ((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalInput(e.target.value);
    });

  const safeHandleSubmit =
    handleSubmit ||
    ((e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted with input:", currentInput);
      console.log("handleSubmit available:", !!handleSubmit);
      if (currentInput && currentInput.trim()) {
        // Manual submission if handleSubmit not available
        console.log("Submitting query:", currentInput);

        // Add user message immediately
        const userMessage = {
          id: Date.now().toString() + "-user",
          role: "user" as const,
          content: currentInput,
        };

        setLocalMessages((prev) => [...prev, userMessage]);
        currentSetInput(""); // Clear input immediately

        // Show AI thinking state
        setIsAIThinking(true);

        // Simulate natural AI processing time (2-4 seconds)
        const processingTime = 2000 + Math.random() * 2000;

        setTimeout(() => {
          setIsAIThinking(false);

          // For demo purposes, simulate a response with generative UI based on Tucker's workflow
          let assistantMessage: any;
          let mockUI: any;

          // Handle Tucker's Starbucks Coffee Switch Campaign (Part 2)
          if (
            currentInput.toLowerCase().includes("starbucks") ||
            currentInput.toLowerCase().includes("coffee switch") ||
            currentInput.toLowerCase().includes("conquesting")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "Excellent opportunity, Tucker! I've identified a high-value partnership with Starbucks. Our AI has detected **50,000 ABC FI members** who frequently purchase coffee at competitor locations but haven't visited Starbucks in 180+ days. This is prime conquesting territory with significant revenue potential. Let me show you the campaign architecture:",
            };

            mockUI = {
              type: "campaign-builder" as const,
              props: {
                campaignType: "Brand-Funded Coffee Switch Campaign",
                targetAudience: "Coffee competitor customers",
                offers: [
                  "1,000 Bonus ABC FI Points",
                  "Geofenced Push Notifications",
                  "Starbucks Partnership",
                ],
                steps: [
                  "Step 1: Identify conquesting segment (3+ competitor purchases, 0 Starbucks)",
                  "Step 2: Create high-value brand-funded offer (1,000 points)",
                  "Step 3: Configure geofenced delivery when near Starbucks locations",
                ],
                audience: "50,000 ABC FI members",
                funding: "Advertiser-funded (Starbucks pays point liability)",
              },
            };
          }
          // Handle Tucker's New Mover Journey
          else if (
            currentInput.toLowerCase().includes("new mover") ||
            (currentInput.toLowerCase().includes("mortgage") &&
              currentInput.toLowerCase().includes("campaign")) ||
            currentInput.toLowerCase().includes("q4 mortgage")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "Perfect timing, Tucker! I've analyzed ABC FI's Q4 objectives and identified a high-impact opportunity.\n\n**💡 AI Insight**: Based on our transaction data, I recommend creating an **AI-Powered New Mover Journey** for new mortgage customers. This campaign targets 567 customers per month with a projected $127K-$245K revenue potential.\n\n**🎯 Strategy**: Begin with a personalized gift, then guide customers through their moving journey with curated partner offers.\n\nWould you like me to help you architect this conversational experience using the Kigo PRO campaign builder?",
            };

            // Don't show the campaign builder immediately - wait for Tucker's confirmation
          }
          // Handle Tucker's confirmation to proceed with campaign builder
          else if (
            (currentInput.toLowerCase().includes("yes") ||
              currentInput.toLowerCase().includes("architect") ||
              currentInput.toLowerCase().includes("build") ||
              currentInput.toLowerCase().includes("create")) &&
            (currentInput.toLowerCase().includes("campaign") ||
              currentInput.toLowerCase().includes("journey") ||
              currentInput.toLowerCase().includes("experience"))
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "Excellent choice, Tucker! Let's architect your AI-Powered New Mover Journey. I'll guide you through configuring each step of the conversational experience. You can customize the gift value, messaging, and partner offers to match your campaign objectives.",
            };

            mockUI = {
              type: "campaign-builder" as const,
              props: {
                campaignType: "AI-Powered New Mover Journey",
                targetAudience: "New mortgage customers",
                offers: [
                  "$100 AI Gift Personalization",
                  "Moving Journey Bundle",
                  "U-Haul, Public Storage, Hilton",
                ],
                steps: [
                  "Step 1: AI-powered gifting moment ($100 value)",
                  "Step 2: Follow-up conversation about move planning",
                  "Step 3: Moving Journey bundle with partner offers",
                ],
              },
            };
          }
          // Handle the complete campaign creation demo flow
          else if (
            currentInput.toLowerCase().includes("complete campaign") ||
            currentInput.toLowerCase().includes("full demo") ||
            (currentInput.toLowerCase().includes("campaign") &&
              currentInput.toLowerCase().includes("home buyers"))
          ) {
            // Clear input and start the complete demo flow
            setIsAIThinking(false);
            startCompleteCampaignDemo();
            return;
          }

          // Determine response based on user input
          if (
            currentInput.toLowerCase().includes("discover") &&
            currentInput.toLowerCase().includes("journey")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "I've discovered several high-value customer journey patterns from ABC FI's transaction data:\n\n🏡 **Home Purchase + Relocation:** 567 customers/month, $127-245 revenue potential, $72K-139K monthly (94% confidence)\n🔨 **DIY Home Improvement:** 1,240 customers/month, $85-156 revenue, $105K-194K monthly (87% confidence)\n🎒 **Back to School:** 2,890 families/month, $45-89 revenue, $130K-257K monthly (92% confidence)\n🍽️ **Weekend Entertainment:** 4,200+ customers/month, $28-52 revenue, $118K-218K monthly (78% confidence)\n\nThe Home Purchase + Relocation journey shows the highest revenue potential. Select it to proceed with campaign creation.",
            };
            mockUI = {
              type: "journey-discovery" as const,
              props: {},
            };
          } else if (
            currentInput.toLowerCase().includes("analyze") &&
            currentInput.toLowerCase().includes("pattern")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "**Journey Pattern Analysis Complete**\n\n**12-Week Customer Timeline:**\n• **Weeks 3-4:** Moving logistics (94% engagement)\n• **Weeks 5-6:** Travel & transition (89% engagement)\n• **Weeks 7-8:** Home setup (96% engagement)\n• **Weeks 9-12:** Local integration (91% engagement)\n\n**Financial Impact:** $3,200-4,800 incremental spend + $2,400-3,800 LTV boost\n**Revenue Breakdown:** $45-85 ad-funded + $82-160 merchant partnerships = $127-245 per customer\n**ROI Projections:** 445% immediate, 890% LTV, 1,200%+ combined\n\nReady to build campaign architecture around this pattern?",
            };
            mockUI = {
              type: "pattern-analysis" as const,
              props: {
                journeyType: "Home Purchase + Relocation",
              },
            };
          } else if (
            currentInput.toLowerCase().includes("architecture") ||
            currentInput.toLowerCase().includes("partner")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "**Campaign Architecture Built Successfully**\n\n**4-Phase Structure with Partner Network:**\n\n**Phase 1 - Moving Logistics (Weeks 3-4):**\n• Ad-funded: U-Haul ($25), Two Men and a Truck ($18)\n• Merchant: Local movers (12%), storage (15%)\n• Revenue: $32-58 per customer\n\n**Phase 2 - Travel + Transition (Weeks 5-6):**\n• Ad-funded: Southwest ($25), Hilton ($20), National ($12)\n• Revenue: $28-52 per customer\n\n**Phase 3 - Home Setup (Weeks 7-8):**\n• Ad-funded: Home Depot ($22), Best Buy ($18), West Elm ($15)\n• Revenue: $35-68 per customer\n\n**Phase 4 - Local Integration (Weeks 9-12):**\n• Network: 12,000+ local businesses (10-15% commissions)\n• Revenue: $32-67 per customer\n\n**Total Network:** 15 national partners + 12,000+ local merchants activated",
            };
            mockUI = {
              type: "campaign-architecture" as const,
              props: {},
            };
          } else if (
            currentInput.toLowerCase().includes("lightning") ||
            currentInput.toLowerCase().includes("optimization")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                '**Lightning Offers Strategy Activated**\n\n**AI Optimization Features:**\n• **Phase-specific timing:** Offers triggered by journey progression\n• **Scarcity management:** Limited quantities create urgency\n• **Cross-phase integration:** Early offers inform later opportunities\n• **Performance boost:** +34% engagement, +$67 revenue per customer\n\n**Example Lightning Offers:**\n• Phase 1: "1 of 200: 40% off moving company" (48-hour window)\n• Phase 2: "1 of 300: Hotel suite upgrade" (arrival-triggered)\n• Phase 3: "1 of 500: Free furniture delivery" (setup-triggered)\n• Phase 4: "1 of 400: Local discovery package" (integration-triggered)\n\n**Market Intelligence Alert:** Increased home-buying activity detected in Denver (+34%), Austin (+28%), Seattle (+31%), Charleston (+42%). Ready to launch?',
            };
            mockUI = {
              type: "lightning-strategy" as const,
              props: {},
            };
          } else if (
            currentInput.toLowerCase().includes("launch") ||
            currentInput.toLowerCase().includes("performance")
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "**🚀 Campaign Launched Successfully!**\n\n**Live Campaign Status:**\n• **Target:** 567 customers/month entering journey nationwide\n• **Partner Network:** 15 national + 12,000+ local merchants activated\n• **AI Intelligence:** Real-time optimization and market alerts active\n\n**Current Customer Activity:**\n• Phase 1 (Moving): 127 customers\n• Phase 2 (Travel): 89 customers\n• Phase 3 (Setup): 156 customers\n• Phase 4 (Integration): 195 customers\n\n**Projected Performance:**\n• **Month 1:** $72K-139K immediate revenue + $680K-1.08M LTV boost\n• **Annual Program:** $1.03M-2.00M immediate + $16.3M-25.8M LTV enhancement\n\nCampaign is now live with real-time performance tracking and AI optimization!",
            };
            mockUI = {
              type: "campaign-launch" as const,
              props: {},
            };
          } else {
            // Default fallback
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "I'll help you create that campaign! Here's an interactive campaign builder based on your requirements.",
            };
            mockUI = {
              type: "campaign-builder" as const,
              props: {
                campaignType: "First-Time Home Buyer Campaign",
                targetAudience: "First-time home buyers",
                offers: [
                  "HELOC Special Rate",
                  "Moving Day Package",
                  "Local Business Partnerships",
                  "First-Time Buyer Bonus",
                ],
              },
            };
          }

          // Add AI response with generative UI immediately
          setLocalMessages((prev) => [...prev, assistantMessage]);
          setGenerativeComponents((prev) =>
            new Map(prev).set(assistantMessage.id, mockUI)
          );

          // Handle campaign creation flow
          if (mockUI) {
            handleCampaignStep(mockUI.type, selectedJourney);
          }

          // Scroll to bottom after a short delay
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }, processingTime); // End of setTimeout for AI processing
      }
    });

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Enter key (with or without modifiers)
    if (e.key === "Enter") {
      // If Shift+Enter, allow new line (don't submit)
      if (e.shiftKey) {
        return; // Let the default behavior happen (new line)
      }

      // For regular Enter or Cmd/Ctrl+Enter, submit the form
      e.preventDefault();
      e.stopPropagation();

      if (currentInput.trim() && !isLoading) {
        // Try to submit using the form ref
        if (formRef.current && handleSubmit) {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          Object.defineProperty(submitEvent, "target", {
            value: formRef.current,
          });
          Object.defineProperty(submitEvent, "currentTarget", {
            value: formRef.current,
          });
          handleSubmit(submitEvent as any);
        } else if (formRef.current) {
          formRef.current.requestSubmit();
        } else {
          safeHandleSubmit({
            preventDefault: () => {},
            stopPropagation: () => {},
            target: e.target,
            currentTarget: e.target,
          } as React.FormEvent);
        }
      }
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for prefill events
  useEffect(() => {
    const handlePrefill = (event: CustomEvent) => {
      currentSetInput(event.detail);
    };

    window.addEventListener("prefill-query", handlePrefill as EventListener);
    return () =>
      window.removeEventListener(
        "prefill-query",
        handlePrefill as EventListener
      );
  }, [currentSetInput]);

  // Listen for auto-prompt events (for command center navigation)
  useEffect(() => {
    const handleAutoPrompt = (event: CustomEvent) => {
      const { prompt, clientId } = event.detail;
      console.log("Auto-prompt received:", prompt, clientId);
      if (prompt && prompt.trim()) {
        console.log("Processing auto-prompt:", prompt);

        // Immediately add user message to chat
        const userMessage = {
          id: Date.now().toString() + "-user",
          role: "user" as const,
          content: prompt,
        };

        setLocalMessages((prev) => [...prev, userMessage]);

        // Show AI thinking state
        setIsAIThinking(true);

        // Simulate AI processing and response
        setTimeout(() => {
          setIsAIThinking(false);

          // Generate AI response based on the prompt
          let assistantMessage: any;
          let mockUI: any;

          // Handle Tucker's New Mover Journey auto-prompt
          if (
            prompt.toLowerCase().includes("new mover") ||
            (prompt.toLowerCase().includes("mortgage") &&
              prompt.toLowerCase().includes("campaign"))
          ) {
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "Excellent choice, Tucker! Let's architect your AI-Powered New Mover Journey. I'll guide you through configuring each step of the conversational experience. You can customize the gift value, messaging, and partner offers to match your campaign objectives.",
            };

            mockUI = {
              type: "campaign-builder" as const,
              props: {
                campaignType: "AI-Powered New Mover Journey",
                targetAudience: "New mortgage customers",
                offers: [
                  "$100 AI Gift Personalization",
                  "Moving Journey Bundle",
                  "U-Haul, Public Storage, Hilton",
                ],
                steps: [
                  "Step 1: AI-powered gifting moment ($100 value)",
                  "Step 2: Follow-up conversation about move planning",
                  "Step 3: Moving Journey bundle with partner offers",
                ],
              },
            };
          } else {
            // Default response
            assistantMessage = {
              id: Date.now().toString() + "-assistant",
              role: "assistant" as const,
              content:
                "I'll help you create that campaign! Let me set up the campaign builder for you.",
            };

            mockUI = {
              type: "campaign-builder" as const,
              props: {
                campaignType: "Marketing Campaign",
                targetAudience: "Target customers",
                offers: ["Special Offer", "Partnership Benefits"],
              },
            };
          }

          // Add AI response with generative UI
          setLocalMessages((prev) => [...prev, assistantMessage]);
          setGenerativeComponents((prev) =>
            new Map(prev).set(assistantMessage.id, mockUI)
          );

          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }, 1500); // 1.5 second delay for AI thinking
      }
    };

    window.addEventListener(
      "ai-auto-prompt",
      handleAutoPrompt as EventListener
    );
    return () =>
      window.removeEventListener(
        "ai-auto-prompt",
        handleAutoPrompt as EventListener
      );
  }, [currentSetInput]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && input?.trim()) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, input, handleSubmit, onClose]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestionClick = (suggestion: QuerySuggestion) => {
    const fullQuery = suggestion.example
      ? `${suggestion.text}. ${suggestion.example}`
      : suggestion.text;

    console.log("Suggestion clicked:", fullQuery);

    // Use the same direct message handling as auto-prompt
    if (fullQuery && fullQuery.trim()) {
      // Immediately add user message to chat
      const userMessage = {
        id: Date.now().toString() + "-user",
        role: "user" as const,
        content: fullQuery,
      };

      setLocalMessages((prev) => [...prev, userMessage]);

      // Show AI thinking state
      setIsAIThinking(true);

      // Generate AI response based on the suggestion
      setTimeout(() => {
        setIsAIThinking(false);

        let assistantMessage: any;
        let mockUI: any;

        // Handle different suggestion types
        if (
          fullQuery.toLowerCase().includes("new mover") ||
          fullQuery.toLowerCase().includes("new-mover-campaign")
        ) {
          assistantMessage = {
            id: Date.now().toString() + "-assistant",
            role: "assistant" as const,
            content:
              "Excellent choice, Tucker! Let's architect your AI-Powered New Mover Journey. I'll guide you through configuring each step of the conversational experience. You can customize the gift value, messaging, and partner offers to match your campaign objectives.",
          };

          mockUI = {
            type: "campaign-builder" as const,
            props: {
              campaignType: "AI-Powered New Mover Journey",
              targetAudience: "New mortgage customers",
              offers: [
                "$100 AI Gift Personalization",
                "Moving Journey Bundle",
                "U-Haul, Public Storage, Hilton",
              ],
              steps: [
                "Step 1: AI-powered gifting moment ($100 value)",
                "Step 2: Follow-up conversation about move planning",
                "Step 3: Moving Journey bundle with partner offers",
              ],
            },
          };
        } else if (
          fullQuery.toLowerCase().includes("complete campaign") ||
          fullQuery.toLowerCase().includes("home buyers")
        ) {
          // Start the interactive campaign demo flow
          setIsAIThinking(false);
          startCompleteCampaignDemo();
          return;
        } else if (
          fullQuery.toLowerCase().includes("starbucks") ||
          fullQuery.toLowerCase().includes("coffee switch")
        ) {
          assistantMessage = {
            id: Date.now().toString() + "-assistant",
            role: "assistant" as const,
            content:
              "Excellent opportunity, Tucker! I've identified a high-value partnership with Starbucks. Our AI has detected **50,000 ABC FI members** who frequently purchase coffee at competitor locations but haven't visited Starbucks in 180+ days. This is prime conquesting territory with significant revenue potential. Let me show you the campaign architecture:",
          };

          mockUI = {
            type: "campaign-builder" as const,
            props: {
              campaignType: "Brand-Funded Coffee Switch Campaign",
              targetAudience: "Coffee competitor customers",
              offers: [
                "1,000 Bonus ABC FI Points",
                "Geofenced Push Notifications",
                "Starbucks Partnership",
              ],
              steps: [
                "Step 1: Identify conquesting segment (3+ competitor purchases, 0 Starbucks)",
                "Step 2: Create high-value brand-funded offer (1,000 points)",
                "Step 3: Configure geofenced delivery when near Starbucks locations",
              ],
              audience: "50,000 ABC FI members",
              funding: "Advertiser-funded (Starbucks pays point liability)",
            },
          };
        } else {
          // Default campaign builder response
          assistantMessage = {
            id: Date.now().toString() + "-assistant",
            role: "assistant" as const,
            content:
              "I'll help you create that campaign! Let me set up the campaign builder for you.",
          };

          mockUI = {
            type: "campaign-builder" as const,
            props: {
              campaignType: "Marketing Campaign",
              targetAudience: "Target customers",
              offers: ["Special Offer", "Partnership Benefits"],
            },
          };
        }

        // Add AI response with generative UI
        setLocalMessages((prev) => [...prev, assistantMessage]);
        setGenerativeComponents((prev) =>
          new Map(prev).set(assistantMessage.id, mockUI)
        );

        // Scroll to bottom
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, 1500); // 1.5 second delay for AI thinking
    }
  };

  const toggleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsListening(!isListening);
      // Voice recognition implementation would go here
    } else {
      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "info",
          title: "Voice Input Unavailable",
          message: "Speech recognition is not supported in this browser.",
          duration: 3000,
        })
      );
    }
  };

  const filteredSuggestions = selectedCategory
    ? QUERY_SUGGESTIONS.filter((s) => s.category === selectedCategory)
    : QUERY_SUGGESTIONS;

  if (!isOpen) return null;

  // Full-screen mode (no modal overlay)
  if (isFullScreen) {
    return (
      <Card className="w-full h-full overflow-hidden shadow-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Command Center
              </h2>
              <p className="text-sm text-gray-600">
                Campaign creation and marketing insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              AI Assistant
            </Badge>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 h-[calc(100vh-200px)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full">
            {/* Left Panel - Suggestions Only */}
            <div className="md:col-span-1 border-r border-gray-200 p-4 h-full overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {/* Category Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "campaign", label: "Campaigns" },
                      { key: "insights", label: "Customer Insights" },
                      { key: "analytics", label: "Performance" },
                      { key: "optimization", label: "Optimization" },
                    ].map((category) => (
                      <Button
                        key={category.key}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.key
                              ? null
                              : category.key
                          )
                        }
                        variant={
                          selectedCategory === category.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="text-xs"
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Quick Suggestions
                  </label>
                  <div className="space-y-2">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-blue-600 mt-0.5">
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                              {suggestion.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {suggestion.example}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="md:col-span-3 flex flex-col h-full">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Welcome to AI Command Center
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Ask me anything about campaigns, customer insights,
                      analytics, or marketing strategies. I'm here to help you
                      grow your business.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUERY_SUGGESTIONS.slice(0, 3).map(
                        (suggestion, index) => (
                          <Button
                            key={index}
                            onClick={() =>
                              handleSuggestionClick(suggestion.text)
                            }
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {suggestion.text}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className="space-y-4">
                      <div
                        className={`flex gap-3 ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === "assistant" && (
                              <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            )}
                            {message.role === "user" && (
                              <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="prose prose-sm max-w-none">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Render generative UI component if available */}
                      {generativeComponents.has(message.id) && (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3">
                          {(() => {
                            const component = generativeComponents.get(
                              message.id
                            );
                            if (!component) return null;

                            switch (component.type) {
                              case "campaign-builder":
                                return <CampaignBuilderUI />;
                              case "customer-insights":
                                return <CustomerInsightsUI />;
                              case "analytics-dashboard":
                                return <AnalyticsDashboardUI />;
                              default:
                                return (
                                  <div className="text-gray-500 text-sm">
                                    Unknown component type: {component.type}
                                  </div>
                                );
                            }
                          })()}
                        </div>
                      )}

                      {/* Action buttons for non-campaign-builder responses */}
                      {message.role === "assistant" &&
                        !generativeComponents.has(message.id) && (
                          <div className="flex gap-2 justify-start">
                            <Button
                              onClick={() =>
                                router.push("/campaign-manager/campaign-create")
                              }
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Create Campaign
                            </Button>
                            <Button
                              onClick={() =>
                                router.push("/campaign-manager/ai-insights")
                              }
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              View Insights
                            </Button>
                            <Button
                              onClick={() =>
                                router.push("/campaign-manager/analytics")
                              }
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input at Bottom */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <form
                  ref={formRef}
                  onSubmit={safeHandleSubmit}
                  className="space-y-2"
                >
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me about campaigns, insights, analytics..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={isLoading}
                      />
                      {isLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={!input?.trim() || isLoading}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={toggleVoiceInput}
                      variant="outline"
                      className="px-4 py-3"
                      disabled={isLoading}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modal mode (original glassmorphic modal)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Card
        className="w-full h-full max-w-none max-h-none overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200"
          style={{
            background:
              "linear-gradient(to right, rgba(239, 246, 255, 0.9), rgba(250, 245, 255, 0.9))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Command Center
              </h2>
              <p className="text-sm text-gray-600">
                Campaign creation and marketing insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              AI Assistant
            </Badge>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 h-[calc(100vh-120px)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-full">
            {/* Left Panel - Suggestions Only */}
            <div
              className="md:col-span-1 border-r border-gray-200 p-4 h-full overflow-y-auto"
              style={{
                backgroundColor: "rgba(249, 250, 251, 0.95)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <div className="space-y-4">
                {/* Category Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "campaign", label: "Campaigns" },
                      { key: "insights", label: "Customer Insights" },
                      { key: "analytics", label: "Performance" },
                      { key: "targeting", label: "Audience Targeting" },
                    ].map((category) => (
                      <Button
                        key={category.key}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.key
                              ? null
                              : category.key
                          )
                        }
                        variant={
                          selectedCategory === category.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="text-xs"
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quick Commands
                  </label>
                  <div className="space-y-2">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-blue-600 mt-0.5">
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                              {suggestion.text}
                            </p>
                            {suggestion.example && (
                              <p className="text-xs text-gray-500 mt-1">
                                {suggestion.example}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className="md:col-span-3 flex flex-col h-full overflow-hidden">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to help
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Describe what you'd like to create or select from the
                    suggestions to get started. I can help with campaign
                    creation, analytics, insights, and more.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Conversation
                    </h3>
                    <div className="flex items-center gap-2">
                      {(isLoading || isAIThinking) && (
                        <Badge variant="outline" className="text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Thinking...
                        </Badge>
                      )}
                      <Button
                        onClick={reload}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        disabled={isLoading}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {currentMessages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-blue-100"
                              : "bg-gradient-to-br from-purple-100 to-blue-100"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Bot className="w-4 h-4 text-purple-600" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div
                          className={`flex-1 rounded-lg p-3 ${
                            message.role === "user"
                              ? "border border-blue-200 shadow-sm"
                              : "bg-white border border-gray-200 shadow-sm"
                          }`}
                          style={
                            message.role === "user"
                              ? { backgroundColor: "#dbeafe" }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {message.role === "user"
                                ? "You"
                                : "AI Marketing Co-pilot"}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              AI Assistant
                            </Badge>
                          </div>

                          <div className="prose prose-sm max-w-none">
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                              {message.content ||
                                (message.parts &&
                                  message.parts.map(
                                    (part: any, index: number) => {
                                      if (part.type === "text") {
                                        return (
                                          <span key={index}>{part.text}</span>
                                        );
                                      }
                                      return null;
                                    }
                                  ))}
                            </div>
                          </div>

                          {/* Render Generative UI Component if available */}
                          {message.role === "assistant" &&
                            generativeComponents.has(message.id) && (
                              <div className="mt-4">
                                {renderGenerativeUI(
                                  generativeComponents.get(message.id)!
                                )}
                              </div>
                            )}

                          {/* Action Buttons for AI Messages - Only show for non-campaign-builder responses */}
                          {message.role === "assistant" &&
                            !generativeComponents.has(message.id) && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button
                                  onClick={() =>
                                    router.push(
                                      "/campaign-manager/campaign-create"
                                    )
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <Target className="w-3 h-3 mr-1" />
                                  Create Campaign
                                </Button>
                                <Button
                                  onClick={() =>
                                    router.push("/campaign-manager/ai-insights")
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  View Insights
                                </Button>
                                <Button
                                  onClick={() =>
                                    router.push("/campaign-manager/analytics")
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Analytics
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}

                    {/* AI Thinking Indicator */}
                    {isAIThinking && (
                      <div className="flex items-start gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              AI Marketing Co-pilot
                            </span>
                            <Badge variant="outline" className="text-xs">
                              AI Assistant
                            </Badge>
                          </div>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                              <span className="text-sm text-gray-600">
                                Analyzing ABC FI's transaction data and Q4
                                objectives...
                              </span>
                            </div>
                            <div className="mt-2 flex gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Suggestions */}
                    {currentSuggestions.length > 0 && (
                      <div className="flex items-start gap-3 mb-4 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              AI Marketing Co-pilot
                            </span>
                            <Badge variant="outline" className="text-xs">
                              AI Assistant
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleDemoSuggestionClick(suggestion)
                                }
                                className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-200 text-blue-700 font-medium"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Demo Running Indicator */}
                    {isRunningDemo && (
                      <div className="flex items-center justify-center py-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-sm font-medium text-blue-700">
                            Creating campaign...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}

              {/* Chat Input at Bottom */}
              <div
                className="border-t border-gray-200 p-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <form
                  ref={formRef}
                  onSubmit={safeHandleSubmit}
                  className="space-y-2"
                >
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={currentInput}
                      onChange={safeHandleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me to create campaigns, analyze data, or get insights..."
                      className="w-full h-12 p-2 pr-20 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isLoading}
                      rows={2}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <Button
                        onClick={toggleVoiceInput}
                        variant="ghost"
                        size="sm"
                        type="button"
                        className={`p-1 h-8 w-8 ${isListening ? "text-red-500" : "text-gray-400"}`}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                      {isLoading && (
                        <Button
                          onClick={stop}
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="p-1 h-8 w-8 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={!currentInput?.trim() || isLoading}
                        size="sm"
                        className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm border-0"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            <span className="text-xs">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1" />
                            <span className="text-xs">Send</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Command className="w-3 h-3" />
                      <span>
                        Press Enter to send • Shift + Enter for new line
                      </span>
                    </div>
                    <Button
                      type="submit"
                      disabled={!currentInput?.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium border-0 shadow-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
