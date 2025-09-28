"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  User,
  Bot,
  X,
  Sparkles,
  MessageSquare,
  Home,
  GraduationCap,
  Hammer,
  Plane,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Bell,
  Gift,
  CheckCircle,
  UtensilsCrossed,
} from "lucide-react";
import { CampaignPlanCard } from "./CampaignPlanCard";
import { GiftSelectionUI } from "./GiftSelectionUI";
import { CustomerJourneyUI } from "./CustomerJourneyUI";
import { PartnerNetworkUI } from "./PartnerNetworkUI";

interface ABCFIDemoChatProps {
  isOpen: boolean;
  onClose: () => void;
  onDashboardTransition: (step: string, data?: any) => void;
}

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  component?:
    | "campaign-plan"
    | "gift-selection"
    | "customer-journey"
    | "partner-network"
    | "mobile-experience"
    | "roi-model";
  data?: any;
}

interface JourneyCard {
  id: string;
  title: string;
  customerVolume: string;
  revenuePotential: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trendData?: number[];
  growthRate?: string;
  confidence?: number;
}

const JOURNEY_OPPORTUNITIES: JourneyCard[] = [
  {
    id: "home-purchase",
    title: "Home Purchase + Relocation Journey",
    customerVolume: "567 customers/month",
    revenuePotential: "$127-245 per customer",
    icon: Home,
    color: "bg-blue-500",
    trendData: [45, 52, 48, 61, 67, 72, 78, 85, 92, 89, 95, 102],
    growthRate: "+18%",
    confidence: 94,
  },
  {
    id: "life-transitions",
    title: "Life Event Transitions",
    customerVolume: "~800 customers/month",
    revenuePotential: "$89-156 per customer",
    icon: Heart,
    color: "bg-pink-500",
    trendData: [62, 58, 65, 71, 68, 74, 79, 82, 86, 91, 88, 94],
    growthRate: "+12%",
    confidence: 87,
  },
  {
    id: "back-to-school",
    title: "Back-to-School Prep",
    customerVolume: "2,890 families/month",
    revenuePotential: "$45-89 per customer",
    icon: GraduationCap,
    color: "bg-green-500",
    trendData: [120, 115, 125, 140, 158, 172, 165, 180, 195, 210, 225, 240],
    growthRate: "+25%",
    confidence: 91,
  },
  {
    id: "home-improvement",
    title: "Home Improvement & DIY",
    customerVolume: "1,240 customers/month",
    revenuePotential: "$85-156 per customer",
    icon: Hammer,
    color: "bg-orange-500",
    trendData: [85, 82, 88, 95, 92, 98, 105, 102, 108, 115, 112, 118],
    growthRate: "+15%",
    confidence: 89,
  },
  {
    id: "travel-vacation",
    title: "Travel & Vacation Planning",
    customerVolume: "3,200+ customers/month",
    revenuePotential: "$65-134 per customer",
    icon: Plane,
    color: "bg-purple-500",
    trendData: [180, 175, 185, 195, 210, 225, 240, 255, 270, 285, 300, 320],
    growthRate: "+22%",
    confidence: 96,
  },
];

const CAMPAIGN_PLAN_CARD: JourneyCard = {
  id: "campaign-plan",
  title: "New Homeowner Welcome Campaign",
  customerVolume: "Ready to Launch",
  revenuePotential: "+33% ROI Potential",
  icon: Gift,
  color: "bg-green-500",
  trendData: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155],
  growthRate: "+33%",
  confidence: 96,
};

export function ABCFIDemoChat({
  isOpen,
  onClose,
  onDashboardTransition,
}: ABCFIDemoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [demoStep, setDemoStep] = useState<
    | "initial"
    | "opportunities"
    | "selection"
    | "campaign"
    | "mobile-experience"
    | "roi-model"
  >("initial");
  const [hasStarted, setHasStarted] = useState(false);
  const [cardScrollIndex, setCardScrollIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardSelecting, setIsCardSelecting] = useState(false);

  // Clean Scene 2 Flow State
  const [scene2Step, setScene2Step] = useState<
    "plan" | "gift" | "journey" | "network" | "complete"
  >("plan");
  const [campaignConfig, setCampaignConfig] = useState({
    gift: "home-depot",
    giftAmount: 100,
    notification: "congratulatory",
    followupDays: 30,
    partners: ["home-depot", "taskrabbit", "best-buy"] as string[],
    projectedRevenue: 127,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({
        top: mainContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Get suggestion pills based on current demo step - Scene 1 & 2 Script
  const getSuggestionPills = () => {
    if (messages.length <= 1) {
      // Step 1.2 - Initial response options
      return [
        {
          text: "one of my goals this quarter is to increase engagement among key customer segments",
          action: "start_demo",
        },
        {
          text: "Show me customer journey opportunities",
          action: "show_journeys",
        },
        { text: "What are high-value segments?", action: "show_segments" },
      ];
    } else if (demoStep === "opportunities") {
      // Step 1.4 - After seeing the 5 journey cards
      return [
        {
          text: "Home buyers. I met with the mortgage team yesterday and they're looking for significant incremental revenue opportunities.",
          action: "select_home_buyers",
        },
        {
          text: "Tell me more about Life Event Transitions",
          action: "life_events",
        },
        {
          text: "Which journey has the highest potential?",
          action: "highest_potential",
        },
      ];
    } else if (demoStep === "selection") {
      // Step 1.4 - After "Excellent choice" message (same options as opportunities for consistency)
      return [
        {
          text: "Home buyers. I met with the mortgage team yesterday and they're looking for significant incremental revenue opportunities.",
          action: "build_campaign",
        },
        {
          text: "Tell me more about Life Event Transitions",
          action: "life_events",
        },
        {
          text: "Which journey has the highest potential?",
          action: "highest_potential",
        },
      ];
    } else if (demoStep === "campaign") {
      // Scene 2 - Simple progression suggestions
      if (scene2Step === "complete") {
        return [
          {
            text: "This is great. What will this cost and how much incremental revenue will it generate for us?",
            action: "show_roi",
          },
          {
            text: "Show me what the customer will see on their phone",
            action: "show_mobile",
          },
          {
            text: "How do we launch this campaign?",
            action: "launch_campaign",
          },
        ];
      } else {
        return [
          { text: "This looks good, let's continue", action: "continue_flow" },
          { text: "What's the expected ROI?", action: "show_roi_preview" },
          { text: "Show me the mobile experience", action: "show_mobile" },
        ];
      }
    } else {
      return [
        { text: "How do I launch this campaign?", action: "launch_campaign" },
        { text: "What are the expected results?", action: "campaign_results" },
        { text: "Show me the next steps", action: "next_steps" },
      ];
    }
  };

  // Handle suggestion pill clicks
  const handleSuggestionClick = (suggestionText: string) => {
    if (isTyping) return;

    setInputText(suggestionText);

    // Auto-send the message after a brief delay
    setTimeout(() => {
      handleSendMessage(suggestionText);
    }, 100);
  };

  // Clean Scene 2 Step-by-Step Handlers
  const handleGiftSelection = (giftId: string, giftAmount: number) => {
    setCampaignConfig((prev) => ({ ...prev, gift: giftId, giftAmount }));
    setScene2Step("journey");

    // Move to next step: Customer Journey
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect! $${giftAmount} ${giftId.replace("-", " ")} gift configured. Now let's set up the customer journey:`,
      sender: "ai",
      timestamp: new Date(),
      component: "customer-journey",
      data: { selectedGift: giftId, giftAmount },
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleJourneyConfiguration = (journeyConfig: any) => {
    setCampaignConfig((prev) => ({
      ...prev,
      notification: journeyConfig.notification,
      followupDays: journeyConfig.followupDays,
    }));
    setScene2Step("network");

    // Move to final step: Partner Network
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: `Great! Customer journey configured with ${journeyConfig.followupDays}-day follow-up. Finally, let's optimize the partner network:`,
      sender: "ai",
      timestamp: new Date(),
      component: "partner-network",
      data: {
        selectedGift: campaignConfig.gift,
        giftAmount: campaignConfig.giftAmount,
      },
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleNetworkConfiguration = (
    selectedPartners: string[],
    projectedRevenue: number
  ) => {
    setCampaignConfig((prev) => ({
      ...prev,
      partners: selectedPartners,
      projectedRevenue,
    }));
    setScene2Step("complete");

    // Campaign complete
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: `🎉 Campaign configured successfully! Your "New Homeowner Welcome Campaign" is ready with ${selectedPartners.length} partners and $${projectedRevenue} projected revenue per customer.`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  // Update demo step based on user input
  const updateDemoStep = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes("engagement") || input.includes("customer segments")) {
      setDemoStep("opportunities");
    } else if (
      input.includes("home") ||
      input.includes("purchase") ||
      input.includes("opportunities")
    ) {
      setDemoStep("selection");
    } else if (
      input.includes("campaign") ||
      input.includes("target") ||
      input.includes("next step")
    ) {
      setDemoStep("campaign");
    }
  };

  // Card scroll functions
  const scrollCardsLeft = () => {
    if (cardScrollIndex > 0) {
      setCardScrollIndex(cardScrollIndex - 1);
      scrollToCardIndex(cardScrollIndex - 1);
    }
  };

  const scrollCardsRight = () => {
    if (cardScrollIndex < JOURNEY_OPPORTUNITIES.length - 3) {
      setCardScrollIndex(cardScrollIndex + 1);
      scrollToCardIndex(cardScrollIndex + 1);
    }
  };

  const scrollToCardIndex = (index: number) => {
    if (cardsScrollRef.current) {
      const cardWidth = 280; // Approximate card width + gap
      cardsScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Handle card selection with animation
  const handleCardSelection = (cardId: string, cardTitle: string) => {
    if (isCardSelecting) return; // Prevent multiple selections

    setIsCardSelecting(true);
    setSelectedCardId(cardId);

    // After selection animation, transition to selection step
    setTimeout(() => {
      setDemoStep("selection");

      // Trigger dashboard transition for campaign plan
      onDashboardTransition("show-campaign", {
        title: "New Homeowner Welcome Campaign",
        type: "home-buyers",
      });
    }, 1000); // Wait for selection animation to complete
  };

  useEffect(() => {
    // Scroll after messages update with proper delay for DOM update
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasStarted) {
      // Auto-start the conversation when chat opens
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Good morning, Tucker! How can I help?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        setHasStarted(true);
      }, 500);
    }
  }, [isOpen, hasStarted]);

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Handle different demo steps
    setTimeout(
      () => {
        let aiResponse = "";
        let nextStep = demoStep;

        if (
          demoStep === "initial" &&
          (textToSend.toLowerCase().includes("engagement") ||
            textToSend.toLowerCase().includes("customer segments"))
        ) {
          aiResponse =
            "That's right. Here are 5 high-value customer journeys I'm seeing in the last 90 days:";
          nextStep = "opportunities";
          // Trigger dashboard transition to show journey cards
          console.log(
            "🚀 Calling onDashboardTransition with:",
            "show-opportunities",
            JOURNEY_OPPORTUNITIES
          );
          onDashboardTransition("show-opportunities", JOURNEY_OPPORTUNITIES);
        } else if (
          (demoStep === "opportunities" || demoStep === "selection") &&
          (textToSend.toLowerCase().includes("home") ||
            textToSend.toLowerCase().includes("mortgage"))
        ) {
          // Scene 2: AI-Powered Campaign Co-Creation - Clean Flow
          console.log(
            "🔥 SCENE 2 TRIGGER: Starting clean campaign creation flow"
          );
          aiResponse =
            "Excellent choice. That aligns perfectly with the mortgage team's goals. Based on our network data, new homeowners are highly receptive to welcome offers. Here is a campaign plan I've drafted.";
          nextStep = "campaign";
          setScene2Step("plan");

          // Show campaign plan first, then start step-by-step configuration
          setTimeout(() => {
            const campaignPlanMessage: Message = {
              id: (Date.now() + 2).toString(),
              text: "",
              sender: "ai",
              timestamp: new Date(),
              component: "campaign-plan",
              data: { title: "New Homeowner Welcome Campaign" },
            };
            setMessages((prev) => [...prev, campaignPlanMessage]);

            // Start step-by-step configuration
            setTimeout(() => {
              setScene2Step("gift");
              const giftConfigMessage: Message = {
                id: (Date.now() + 3).toString(),
                text: "Let's configure this campaign step by step. First, let's set up the welcome gift amount and options:",
                sender: "ai",
                timestamp: new Date(),
                component: "gift-selection",
                data: {},
              };
              setMessages((prev) => [...prev, giftConfigMessage]);
            }, 2000);
          }, 1500);
        } else if (
          demoStep === "campaign" &&
          (textToSend.toLowerCase().includes("cost") ||
            textToSend.toLowerCase().includes("revenue") ||
            textToSend.toLowerCase().includes("incremental"))
        ) {
          // Scene 4: The Instant Business Case - ROI Model
          aiResponse =
            "Great question. Let me pull together a simple model quickly.";
          nextStep = "roi-model";
          // Trigger dashboard transition to show ROI model
          onDashboardTransition("show-roi-model", {
            title: "Projected Monthly ROI: New Homeowner Campaign",
            type: "roi-calculator",
            segment: "home-buyers",
          });
        } else if (
          demoStep === "campaign" &&
          textToSend.toLowerCase().includes("customer")
        ) {
          // Scene 3: Visualizing the End-Customer Experience
          aiResponse =
            "Absolutely! Let me show you exactly what Sarah will see on her phone when she receives this campaign.";
          nextStep = "mobile-experience";
          // Trigger dashboard transition to show mobile experience
          onDashboardTransition("show-mobile-experience", {
            title: "Customer Mobile Experience",
            type: "mobile-mockup",
            segment: "home-buyers",
          });
        } else {
          aiResponse =
            "I understand. Could you tell me more about what you'd like to focus on?";
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        console.log("🔥 SETTING demoStep to:", nextStep);
        setDemoStep(nextStep);

        // Note: Removed updateDemoStep call as it was conflicting with nextStep
      },
      1200 + Math.random() * 800
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={mainContainerRef}
      className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-300 bg-white overflow-y-auto"
    >
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform
            [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]
          `}
        ></div>
      </div>

      {/* AI Chat Experience Header */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-60">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Kigo AI Assistant
              </h3>
              <p className="text-xs text-gray-600">Financial Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple close button */}
      <div className="fixed top-4 right-4 z-60">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages - Centered and wider with better spacing */}
      <div className="flex flex-col justify-start items-center px-8 py-20 pb-40">
        <div className="w-full max-w-4xl space-y-6 mb-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
                  message.sender === "ai" ? "bg-indigo-600" : "bg-blue-600"
                }`}
              >
                {message.sender === "ai" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              {message.text && (
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl transition-all duration-500 ease-out transform ${
                    message.sender === "ai"
                      ? "bg-white/95 text-gray-800 shadow-lg border border-gray-200/50 animate-in slide-in-from-left-2 fade-in"
                      : "bg-gray-800/80 text-white backdrop-blur-sm shadow-lg border border-white/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {/* Render UI Component if present - Full width below message */}
              {message.component && (
                <div className="mt-4 w-full animate-in slide-in-from-left-2 fade-in duration-500">
                  {message.component === "campaign-plan" && (
                    <div className="w-full">
                      <CampaignPlanCard
                        title={
                          message.data?.title ||
                          "New Homeowner Welcome Campaign"
                        }
                        isCompact={false}
                        className="w-full"
                      />
                    </div>
                  )}

                  {message.component === "gift-selection" && (
                    <div className="w-full">
                      <GiftSelectionUI
                        onGiftSelect={handleGiftSelection}
                        className="w-full"
                      />
                    </div>
                  )}

                  {message.component === "customer-journey" && (
                    <div className="w-full">
                      <CustomerJourneyUI
                        selectedGift={
                          message.data?.selectedGift || campaignConfig.gift
                        }
                        giftAmount={
                          message.data?.giftAmount || campaignConfig.giftAmount
                        }
                        onJourneyConfirm={handleJourneyConfiguration}
                        className="w-full"
                      />
                    </div>
                  )}

                  {message.component === "partner-network" && (
                    <div className="w-full">
                      <PartnerNetworkUI
                        selectedGift={
                          message.data?.selectedGift || campaignConfig.gift
                        }
                        giftAmount={
                          message.data?.giftAmount || campaignConfig.giftAmount
                        }
                        onNetworkConfirm={handleNetworkConfiguration}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3 animate-in slide-in-from-left-2 fade-in duration-300">
              {/* AI Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>

              {/* Typing Bubble */}
              <div className="bg-white/95 px-4 py-3 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Journey Cards Carousel - Show after AI mentions the 5 journeys */}
          {(demoStep === "opportunities" ||
            demoStep === "selection" ||
            demoStep === "campaign") &&
            (console.log("🔥 CAROUSEL RENDERING: demoStep is", demoStep),
            (
              <div className="animate-in slide-in-from-left-2 fade-in duration-500 mt-8 mb-8">
                <div className="relative">
                  {/* Navigation Arrows - Hide during selection */}
                  {!isCardSelecting && (
                    <>
                      <button
                        onClick={scrollCardsLeft}
                        disabled={cardScrollIndex === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-700" />
                      </button>

                      <button
                        onClick={scrollCardsRight}
                        disabled={
                          cardScrollIndex >= JOURNEY_OPPORTUNITIES.length - 3
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Cards Container */}
                  <div
                    ref={cardsScrollRef}
                    className={`flex gap-4 scroll-smooth transition-all duration-1000 ${
                      isCardSelecting
                        ? "justify-center px-0"
                        : "overflow-x-hidden px-10"
                    }`}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {/* Show journey cards in opportunities/selection, show campaign card in campaign step */}
                    {(console.log(
                      "🔥 CARD LOGIC: demoStep is",
                      demoStep,
                      "showing",
                      demoStep === "campaign"
                        ? "CAMPAIGN_PLAN_CARD"
                        : "JOURNEY_OPPORTUNITIES"
                    ),
                    demoStep === "campaign"
                      ? [CAMPAIGN_PLAN_CARD]
                      : JOURNEY_OPPORTUNITIES.filter(
                          (card) =>
                            !isCardSelecting || card.id === selectedCardId
                        )).map((card, index) => {
                      const IconComponent = card.icon;
                      const isSelected = selectedCardId === card.id;

                      return (
                        <div
                          key={card.id}
                          className={`group cursor-pointer transition-all duration-1000 ease-out animate-in fade-in flex-shrink-0 ${
                            isSelected && isCardSelecting
                              ? "scale-110 opacity-100 transform translate-x-0"
                              : "hover:scale-105 opacity-100"
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            width:
                              isCardSelecting && isSelected ? "320px" : "260px",
                          }}
                          onClick={() => {
                            if (!isCardSelecting) {
                              handleCardSelection(card.id, card.title);
                            }
                          }}
                        >
                          {/* Enhanced Glassmorphic Card */}
                          <div
                            className={`backdrop-blur-md rounded-2xl p-4 shadow-xl transition-all duration-1000 h-full ${
                              isSelected
                                ? "bg-white/90 border-2 border-indigo-400 shadow-2xl ring-4 ring-indigo-200/50"
                                : "bg-white/70 border border-white/30 hover:shadow-2xl hover:bg-white/80"
                            }`}
                          >
                            {/* Campaign Plan Content */}
                            {card.id === "campaign-plan" ? (
                              <CampaignPlanCard
                                title={card.title}
                                isCompact={true}
                                className="h-full"
                              />
                            ) : (
                              /* Regular Journey Card Content */
                              <div>
                                {/* Header with Icon and Trend */}
                                <div className="flex items-start justify-between mb-3">
                                  <div
                                    className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                                  >
                                    <IconComponent className="w-5 h-5 text-white" />
                                  </div>

                                  {/* Mini Trend Chart */}
                                  {card.trendData &&
                                    card.trendData.length > 0 && (
                                      <div className="flex flex-col items-end">
                                        <div className="flex items-end gap-0.5 h-6 w-12">
                                          {card.trendData
                                            .slice(-8)
                                            .map((value, idx) => {
                                              const trendSlice =
                                                card.trendData!.slice(-8);
                                              const max = Math.max(
                                                ...trendSlice
                                              );
                                              const min = Math.min(
                                                ...trendSlice
                                              );
                                              const range = max - min;
                                              const height =
                                                range === 0
                                                  ? 50
                                                  : ((value - min) / range) *
                                                    100;
                                              return (
                                                <div
                                                  key={idx}
                                                  className={`${card.color.replace("bg-", "bg-").replace("-500", "-400")} rounded-sm opacity-70 transition-all duration-300 group-hover:opacity-100`}
                                                  style={{
                                                    height: `${Math.max(height, 15)}%`,
                                                    width: "10px",
                                                  }}
                                                />
                                              );
                                            })}
                                        </div>
                                        {card.growthRate && (
                                          <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="w-3 h-3 text-green-600" />
                                            <span className="text-xs text-green-600 font-medium">
                                              {card.growthRate}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm leading-tight">
                                  {card.title}
                                </h3>

                                {/* Metrics */}
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3 h-3 text-blue-600" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500">
                                        Volume
                                      </p>
                                      <p className="text-xs font-medium text-gray-900">
                                        {card.customerVolume}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-3 h-3 text-green-600" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500">
                                        Revenue Potential
                                      </p>
                                      <p className="text-xs font-medium text-gray-900">
                                        {card.revenuePotential}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Confidence Score */}
                                {card.confidence && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200/50 rounded-full h-1.5">
                                      <div
                                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${card.confidence}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-900">
                                      {card.confidence}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scroll Indicators - Hide during selection */}
                  {!isCardSelecting && (
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({
                        length: Math.max(1, JOURNEY_OPPORTUNITIES.length - 2),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCardScrollIndex(index);
                            scrollToCardIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            cardScrollIndex === index
                              ? "bg-indigo-600"
                              : "bg-white/50 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* AI Response below carousel - Show in selection step */}
                  {demoStep === "selection" && (
                    <div
                      className="mt-8 mb-6 animate-in slide-in-from-left-2 fade-in duration-500"
                      style={{ animationDelay: "1500ms" }}
                    >
                      <div className="flex items-start gap-3">
                        {/* AI Avatar */}
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>

                        {/* AI Response Bubble */}
                        <div className="bg-white/95 px-4 py-3 rounded-2xl shadow-lg border border-gray-200/50 max-w-md transition-all duration-500 ease-out transform animate-in slide-in-from-left-2 fade-in">
                          <p className="text-sm leading-relaxed">
                            Excellent choice. That aligns perfectly with the
                            mortgage team's goals. Based on our network data,
                            new homeowners are highly receptive to welcome
                            offers. Here is a campaign plan I've drafted.
                          </p>
                          <p className="text-xs opacity-70 mt-2">
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input at Bottom */}
      <div className="fixed bottom-6 left-8 right-8 z-60">
        <div className="max-w-4xl mx-auto">
          {/* Suggestion Pills */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {getSuggestionPills().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  disabled={isTyping}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm text-gray-700 hover:bg-white/90 hover:border-gray-300/50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50">
              {/* Message Icon */}
              <div className="pl-4 pr-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>

              {/* Input Field */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to continue the ABC FI demo..."
                className="flex-1 py-3 pr-4 bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500"
                disabled={isTyping}
              />

              {/* Send Button */}
              <div className="pr-2">
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:scale-105 p-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Simple Demo Progress */}
          <div className="mt-3 flex justify-center">
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${demoStep === "initial" ? "bg-white" : "bg-white/30"}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${demoStep === "opportunities" ? "bg-white" : "bg-white/30"}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${demoStep === "selection" ? "bg-white" : "bg-white/30"}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${demoStep === "campaign" ? "bg-white" : "bg-white/30"}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${demoStep === "mobile-experience" || demoStep === "roi-model" ? "bg-white" : "bg-white/30"}`}
              ></div>
            </div>
            <span className="text-xs text-white/70 ml-2">
              Demo Progress:{" "}
              {demoStep === "initial"
                ? "Getting Started"
                : demoStep === "opportunities"
                  ? "Exploring Opportunities"
                  : demoStep === "selection"
                    ? "Journey Selected"
                    : demoStep === "campaign"
                      ? "Campaign Planning"
                      : demoStep === "mobile-experience"
                        ? "Customer Experience"
                        : demoStep === "roi-model"
                          ? "ROI Analysis"
                          : "Campaign Planning"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
