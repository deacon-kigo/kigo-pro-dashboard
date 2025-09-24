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
import CampaignBuilderUI from "@/components/features/ai-query/generative-ui/CampaignBuilderUI";

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
  type: "campaign-builder";
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

    // Start analysis phase
    setIsAnalyzing(true);
    setIsTyping(true);
    setCurrentTask("Analyzing customer data and market trends...");
    setCampaignProgress(10);

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
            text: "Perfect! I've analyzed your customer base and identified a high-impact opportunity. Based on recent mortgage data, I can see approximately 2,847 new homeowners in your target markets who would be ideal for this journey.\n\nI've designed a three-phase conversational experience that leverages AI personalization to maximize engagement and conversion. The projected impact looks very promising - let me show you the campaign architecture.",
            sender: "ai",
            timestamp: new Date(),
            uiComponent: {
              type: "campaign-builder",
              data: {
                campaignType: "AI-Powered New Mover Journey",
                targetAudience: "New mortgage customers",
                estimatedReach: "2,847 customers",
                projectedEngagement: "68% open rate",
                expectedConversion: "23% conversion",
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
    setInputText("");
    setIsTyping(true);

    // More natural AI responses based on input
    setTimeout(
      () => {
        let responseText = "";
        const input = inputText.toLowerCase();

        if (
          input.includes("gift") ||
          input.includes("amount") ||
          input.includes("value")
        ) {
          responseText =
            "Great question! The gift value is completely customizable. Based on your customer lifetime value data, I'd recommend starting with $100 as it typically drives 3x higher engagement rates. However, you can adjust this anywhere from $25 to $500 depending on your campaign budget and target segment value.";
        } else if (input.includes("partner") || input.includes("offer")) {
          responseText =
            "Excellent point! I've pre-selected high-performing partners based on new mover behavior patterns. U-Haul shows 89% relevance for your audience, Public Storage has 76% appeal, and Hilton captures the celebration aspect. We can easily swap these for other partners in your network if you prefer.";
        } else if (
          input.includes("launch") ||
          input.includes("start") ||
          input.includes("begin")
        ) {
          responseText =
            "Perfect timing! To launch this campaign, I'll need a few quick details: your preferred gift card value, any specific partner preferences, and your target launch date. Should we configure these settings now?";
        } else {
          responseText =
            "I understand! That's a great consideration for optimizing campaign performance. Based on similar campaigns, I can provide specific recommendations. What aspect would you like to dive deeper into?";
        }

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
    ); // Variable response time for naturalness
  };

  const renderUIComponent = (component: UIComponent) => {
    switch (component.type) {
      case "campaign-builder":
        return <CampaignBuilderUI {...component.data} />;
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

        {/* Progress Toolbar */}
        {(isAnalyzing || currentTask) && (
          <div className="px-6 pb-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>{currentTask}</span>
                </div>
              )}
            </div>
          </div>
        )}
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

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-purple-600 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
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
                        ? "Analyzing data and building campaign..."
                        : "Crafting response..."}
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
