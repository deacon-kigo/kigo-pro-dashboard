"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  User,
  Bot,
  X,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react";
import { RefinedCampaignWidget } from "./RefinedCampaignWidget";
import { ThinkingToCampaignWidget } from "./ThinkingToCampaignWidget";

interface TuckerAIChatInterfaceProps {
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  uiComponent?: UIComponent;
}

interface UIComponent {
  type: "refined-campaign-widget";
  data: any;
}

export function TuckerAIChatInterface({
  onClose,
  initialPrompt = "Create an AI-powered new mover journey campaign for Q4. I want to target new mortgage customers with personalized gifts and moving-related offers from partners like U-Haul, Public Storage, and Hilton.",
}: TuckerAIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [campaignProgress, setCampaignProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [campaignStep, setCampaignStep] = useState<
    "analysis" | "step1" | "step2" | "step3" | "complete"
  >("analysis");
  const [campaignConfig, setCampaignConfig] = useState({
    giftValue: 100,
    giftPersonalization: true,
    followUpQuestion: "",
    journeyBundle: [] as string[],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasStarted) {
      // Auto-start the conversation with Tucker's prompt
      setTimeout(() => {
        handleInitialPrompt();
        setHasStarted(true);
      }, 500);
    }
  }, [hasStarted]);

  const handleInitialPrompt = () => {
    // Add user's initial message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: initialPrompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([userMessage]);

    // Show the thinking widget that will transform into campaign widget
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Let me analyze your customer base and design the perfect AI-powered campaign...",
        sender: "ai",
        timestamp: new Date(),
        uiComponent: {
          type: "thinking-to-campaign-widget",
          data: {
            campaignType: "AI-Powered New Mover Journey",
            targetAudience: "New mortgage customers",
            estimatedReach: "2,847 customers",
            projectedEngagement: "68% open rate",
            expectedConversion: "23% conversion",
            currentStep: 1,
            stepStatus: "configuring",
            isTransformed: false, // Will transform after analysis
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
        },
      };

      setMessages((prev) => [...prev, thinkingMessage]);
      setIsAnalyzing(true);
    }, 800);

    // Simulate progressive analysis
    const analysisSteps = [
      { task: "Processing customer demographics...", progress: 25, delay: 800 },
      { task: "Identifying high-value segments...", progress: 45, delay: 1200 },
      {
        task: "Calculating campaign impact potential...",
        progress: 65,
        delay: 1000,
      },
      {
        task: "Designing personalized journey flow...",
        progress: 85,
        delay: 900,
      },
      {
        task: "Finalizing campaign architecture...",
        progress: 100,
        delay: 700,
      },
    ];

    let currentStep = 0;
    const runAnalysisStep = () => {
      if (currentStep < analysisSteps.length) {
        const step = analysisSteps[currentStep];
        setTimeout(() => {
          setCurrentTask(step.task);
          setCampaignProgress(step.progress);
          currentStep++;
          runAnalysisStep();
        }, step.delay);
      } else {
        // Analysis complete, show AI response
        setTimeout(() => {
          setIsAnalyzing(false);
          setCurrentTask("");

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Perfect! I've analyzed your customer base and identified a high-impact opportunity. Based on recent mortgage data, I can see approximately 2,847 new homeowners in your target markets who would be ideal for this journey.\n\nI've designed your three-phase conversational experience with beautiful visual architecture. Let's configure each step together to maximize engagement and conversion.\n\n**Step 1: Gift Configuration** - Ready to configure the AI-powered gifting moment?",
            sender: "ai",
            timestamp: new Date(),
            uiComponent: {
              type: "thinking-to-campaign-widget",
              data: {
                campaignType: "AI-Powered New Mover Journey",
                targetAudience: "New mortgage customers",
                estimatedReach: "2,847 customers",
                projectedEngagement: "68% open rate",
                expectedConversion: "23% conversion",
                currentStep: 1,
                stepStatus: "configuring",
                isTransformed: true, // Indicates it should show as campaign widget
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
            },
          };

          setCampaignStep("step1");

          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
          setCampaignProgress(0);
        }, 500);
      }
    };

    runAnalysisStep();
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText.toLowerCase();
    setInputText("");
    setIsTyping(true);

    // Handle conversational campaign building based on current step
    setTimeout(
      () => {
        let responseText = "";
        let nextStep = campaignStep;

        switch (campaignStep) {
          case "step1":
            // Step 1: Gift Configuration
            if (
              currentInput.includes("yes") ||
              currentInput.includes("proceed") ||
              currentInput.includes("100") ||
              currentInput.includes("agree")
            ) {
              setCampaignConfig((prev) => ({
                ...prev,
                giftValue: 100,
                giftPersonalization: true,
              }));
              responseText =
                "Excellent! I've configured the gift value at $100 with AI personalization enabled. The system will automatically select the most relevant gift option for each customer from our three partners.\n\n**Step 2: The Follow-Up Configuration**\nNow let's program the conversational flow. After the customer selects their gift, the AI agent should ask a follow-up question to guide them to the moving journey bundle.\n\nI recommend: 'Is there anything else we can help you with to plan your move?'\n\nShould we use this follow-up question, or would you like to customize it?";
              nextStep = "step2";

              // Add updated widget for step 2
              setTimeout(() => {
                const updatedMessage: Message = {
                  id: (Date.now() + 2).toString(),
                  text: "Step 1 configured! Now let's set up the follow-up question.",
                  sender: "ai",
                  timestamp: new Date(),
                  uiComponent: {
                    type: "refined-campaign-widget",
                    data: {
                      campaignType: "AI-Powered New Mover Journey",
                      targetAudience: "New mortgage customers",
                      estimatedReach: "2,847 customers",
                      projectedEngagement: "68% open rate",
                      expectedConversion: "23% conversion",
                      currentStep: 2,
                      stepStatus: "configuring",
                      offers: [
                        "✓ $100 AI Gift Personalization",
                        "Moving Journey Bundle",
                        "U-Haul, Public Storage, Hilton",
                      ],
                      steps: [
                        "✓ Step 1: AI-powered gifting moment ($100 value)",
                        "→ Step 2: Follow-up conversation about move planning",
                        "Step 3: Moving Journey bundle with partner offers",
                      ],
                    },
                  },
                };
                setMessages((prev) => [...prev, updatedMessage]);
              }, 500);
            } else if (
              currentInput.includes("no") ||
              currentInput.includes("different") ||
              currentInput.includes("change")
            ) {
              responseText =
                "Of course! What gift value would you prefer? You can set it anywhere from $25 to $500. Also, would you like to keep AI personalization enabled, or manually select specific gift options?";
            } else {
              responseText =
                "I can help you configure the gift settings. Would you like to proceed with $100 value and AI personalization, or would you prefer different settings? You can also ask me about the gift partners or personalization options.";
            }
            break;

          case "step2":
            // Step 2: Follow-up Question Configuration
            if (
              currentInput.includes("yes") ||
              currentInput.includes("use") ||
              currentInput.includes("good") ||
              currentInput.includes("perfect")
            ) {
              setCampaignConfig((prev) => ({
                ...prev,
                followUpQuestion:
                  "Is there anything else we can help you with to plan your move?",
              }));
              responseText =
                "Perfect! I've programmed the AI agent to ask: 'Is there anything else we can help you with to plan your move?' after the gift selection.\n\n**Step 3: The Journey Bundle Configuration**\nNow let's link the pre-built 'Moving Journey' offer bundle to this conversational path. This bundle contains offers for:\n• U-Haul (moving truck rentals)\n• Public Storage (temporary storage solutions)\n• Hilton Hotels (accommodation during the move)\n\nShould I activate all three partner offers in the Moving Journey bundle?";
              nextStep = "step3";

              // Add updated widget for step 3
              setTimeout(() => {
                const updatedMessage: Message = {
                  id: (Date.now() + 3).toString(),
                  text: "Step 2 configured! Now let's set up the journey bundle.",
                  sender: "ai",
                  timestamp: new Date(),
                  uiComponent: {
                    type: "refined-campaign-widget",
                    data: {
                      campaignType: "AI-Powered New Mover Journey",
                      targetAudience: "New mortgage customers",
                      estimatedReach: "2,847 customers",
                      projectedEngagement: "68% open rate",
                      expectedConversion: "23% conversion",
                      currentStep: 3,
                      stepStatus: "configuring",
                      offers: [
                        "✓ $100 AI Gift Personalization",
                        "✓ Follow-up Question Configured",
                        "→ U-Haul, Public Storage, Hilton",
                      ],
                      steps: [
                        "✓ Step 1: AI-powered gifting moment ($100 value)",
                        "✓ Step 2: Follow-up conversation about move planning",
                        "→ Step 3: Moving Journey bundle with partner offers",
                      ],
                    },
                  },
                };
                setMessages((prev) => [...prev, updatedMessage]);
              }, 500);
            } else if (
              currentInput.includes("custom") ||
              currentInput.includes("different") ||
              currentInput.includes("change")
            ) {
              responseText =
                "Great! What follow-up question would you like the AI agent to ask after the gift selection? This should guide customers toward the moving journey offers.";
            } else {
              responseText =
                "I can help you configure the follow-up question. The AI agent will ask this after the customer selects their gift. Would you like to use the recommended question: 'Is there anything else we can help you with to plan your move?' or customize it?";
            }
            break;

          case "step3":
            // Step 3: Journey Bundle Configuration
            if (
              currentInput.includes("yes") ||
              currentInput.includes("activate") ||
              currentInput.includes("all") ||
              currentInput.includes("proceed")
            ) {
              setCampaignConfig((prev) => ({
                ...prev,
                journeyBundle: ["U-Haul", "Public Storage", "Hilton Hotels"],
              }));
              responseText =
                "Excellent! I've linked all three partner offers to the Moving Journey bundle:\n✓ U-Haul - Moving truck rentals\n✓ Public Storage - Storage solutions  \n✓ Hilton Hotels - Accommodation\n\n**Campaign Configuration Complete!**\nYour AI-Powered New Mover Journey is now fully configured and ready to launch!";
              nextStep = "complete";

              // Add final complete widget
              setTimeout(() => {
                const completeMessage: Message = {
                  id: (Date.now() + 4).toString(),
                  text: "🎉 All steps configured! Your campaign is ready to launch.",
                  sender: "ai",
                  timestamp: new Date(),
                  uiComponent: {
                    type: "refined-campaign-widget",
                    data: {
                      campaignType: "AI-Powered New Mover Journey",
                      targetAudience: "New mortgage customers",
                      estimatedReach: "2,847 customers",
                      projectedEngagement: "68% open rate",
                      expectedConversion: "23% conversion",
                      currentStep: 3,
                      stepStatus: "complete",
                      offers: [
                        "✓ $100 AI Gift Personalization",
                        "✓ Follow-up Question Configured",
                        "✓ U-Haul, Public Storage, Hilton",
                      ],
                      steps: [
                        "✓ Step 1: AI-powered gifting moment ($100 value)",
                        "✓ Step 2: Follow-up conversation about move planning",
                        "✓ Step 3: Moving Journey bundle with partner offers",
                      ],
                    },
                  },
                };
                setMessages((prev) => [...prev, completeMessage]);
              }, 500);
            } else if (
              currentInput.includes("custom") ||
              currentInput.includes("select") ||
              currentInput.includes("specific")
            ) {
              responseText =
                "Of course! Which partners would you like to include in the Moving Journey bundle? You can choose from:\n• U-Haul (moving truck rentals)\n• Public Storage (storage solutions)\n• Hilton Hotels (accommodation)\n• Or suggest other moving-related partners";
            } else {
              responseText =
                "I can help you configure the Moving Journey bundle. Would you like to activate all three partner offers (U-Haul, Public Storage, Hilton), or would you prefer to select specific partners?";
            }
            break;

          case "complete":
            // Campaign Complete - Handle launch
            if (
              currentInput.includes("launch") ||
              currentInput.includes("yes") ||
              currentInput.includes("ready")
            ) {
              responseText =
                "🚀 Launching your AI-Powered New Mover Journey campaign now!\n\nI'm setting up the campaign with your configurations:\n• Gift personalization active\n• Conversational flow programmed\n• Partner integrations connecting...\n\nYour campaign will be live and ready to engage new homeowners in approximately 2 hours. I'll redirect you to the campaign dashboard to monitor performance.";

              // Store campaign data and redirect
              setTimeout(() => {
                const campaignData = {
                  type: "AI-Powered New Mover Journey",
                  audience: "New mortgage customers",
                  giftAmount: campaignConfig.giftValue,
                  giftPersonalization: campaignConfig.giftPersonalization,
                  followUpQuestion: campaignConfig.followUpQuestion,
                  journeyBundle: campaignConfig.journeyBundle,
                  giftOptions: [
                    "Olive & Finch - Italian Restaurant ($100)",
                    "Williams Sonoma - Home & Kitchen ($100)",
                    "Denver Cleaning Co - Professional Service ($100)",
                  ],
                  reach: "2,847 customers",
                  engagement: "68% open rate",
                  conversion: "23% conversion",
                  timestamp: new Date().toISOString(),
                };

                sessionStorage.setItem(
                  "aiCampaignData",
                  JSON.stringify(campaignData)
                );
                window.location.href =
                  "/campaign-manager/campaign-create?source=ai-builder";
              }, 3000);
            } else {
              responseText =
                "I understand you might want to review the configuration. Your campaign is ready with all three steps configured. Would you like to make any adjustments before launching, or shall we proceed with the launch?";
            }
            break;

          default:
            responseText =
              "I'm here to help you configure your AI-Powered New Mover Journey campaign. What would you like to know or adjust?";
        }

        setCampaignStep(nextStep);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1200 + Math.random() * 800
    );
  };

  const renderUIComponent = (component: UIComponent) => {
    switch (component.type) {
      case "refined-campaign-widget":
        return <RefinedCampaignWidget {...component.data} />;
      case "thinking-to-campaign-widget":
        return <ThinkingToCampaignWidget {...component.data} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden shadow-lg bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between p-6">
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
      </div>

      {/* Chat Content */}
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !hasStarted && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Command Center
              </h3>
              <p className="text-gray-600 max-w-md">
                Starting your AI-powered campaign creation journey...
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-blue-100"
                    : "bg-gradient-to-br from-purple-100 to-blue-100"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-purple-600" />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.sender === "user" ? "You" : "AI Assistant"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {message.text}
                </div>

                {/* UI Component */}
                {message.uiComponent && (
                  <div className="mt-4">
                    {renderUIComponent(message.uiComponent)}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Simple AI Typing Indicator */}
          {isTyping && !isAnalyzing && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-purple-600 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      AI Assistant
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                  {campaignStep !== "analysis" && (
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${campaignStep === "step1" || campaignStep === "step2" || campaignStep === "step3" || campaignStep === "complete" ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${campaignStep === "step2" || campaignStep === "step3" || campaignStep === "complete" ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`w-2 h-2 rounded-full ${campaignStep === "step3" || campaignStep === "complete" ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <span className="text-xs text-gray-500 ml-1">
                        Step{" "}
                        {campaignStep === "step1"
                          ? "1"
                          : campaignStep === "step2"
                            ? "2"
                            : campaignStep === "step3"
                              ? "3"
                              : campaignStep === "complete"
                                ? "✓"
                                : "0"}
                        /3
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced thinking indicator with glassmorphic design */}
                <div
                  className="rounded-xl p-4 border border-purple-200/50 backdrop-blur-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.8) 100%)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Progress section for analysis */}
                  {isAnalyzing && (campaignProgress > 0 || currentTask) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-blue-600 animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              AI Campaign Architect
                            </span>
                            <span className="text-xs text-gray-500">
                              {campaignProgress}%
                            </span>
                          </div>
                          <Progress value={campaignProgress} className="h-2" />
                        </div>
                      </div>
                      {currentTask && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 rounded-lg p-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>{currentTask}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Thinking animation */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex gap-1">
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
                    <span className="ml-2">
                      {isAnalyzing
                        ? "Building your campaign..."
                        : `Configuring ${
                            campaignStep === "step1"
                              ? "gift settings"
                              : campaignStep === "step2"
                                ? "follow-up question"
                                : campaignStep === "step3"
                                  ? "journey bundle"
                                  : campaignStep === "complete"
                                    ? "final review"
                                    : "campaign"
                          }...`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me about campaigns, insights, analytics..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
