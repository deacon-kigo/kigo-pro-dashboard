/**
 * AI Marketing Co-pilot Demo Component
 *
 * Demonstrates the AI co-pilot generating business and behavioral insights
 * for marketing managers and making strategic recommendations.
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  DollarSign,
  Users,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Target,
  Zap,
  Bot,
  User,
  Send,
} from "lucide-react";

interface ConversationMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  insights?: {
    revenue?: string;
    confidence?: number;
    timeline?: string;
    customers?: number;
  };
  recommendations?: Array<{
    title: string;
    description: string;
    type: "tactical" | "strategic";
    revenue: string;
  }>;
}

const DEMO_CONVERSATIONS: ConversationMessage[] = [
  {
    id: "1",
    type: "ai",
    content:
      "🔍 I've analyzed your customer data and found an interesting opportunity. We've identified 12,450 customers who spend less than 10% of their budget on food and beverage categories, but show high engagement with premium dining experiences.",
    timestamp: new Date(Date.now() - 300000),
    insights: {
      revenue: "$100,000 - $150,000",
      confidence: 91,
      timeline: "3 months",
      customers: 12450,
    },
  },
  {
    id: "2",
    type: "ai",
    content:
      "💡 **Strategic Opportunity Identified:** We've found an opportunity to drive an estimated $100,000 to $150,000 in incremental card spend by targeting low food and beverage consumers with a 2X points offer to try merchants and brands in the category. Would you like to see a campaign strategy and plan brief?",
    timestamp: new Date(Date.now() - 240000),
    recommendations: [
      {
        title: "2X Points Food & Beverage Trial",
        description:
          "Target low F&B consumers with double points on dining and grocery purchases",
        type: "tactical",
        revenue: "$100K - $150K",
      },
      {
        title: "Premium Dining Partnership",
        description:
          "Partner with high-end restaurants for exclusive member experiences",
        type: "strategic",
        revenue: "$250K - $400K",
      },
    ],
  },
  {
    id: "3",
    type: "user",
    content:
      "Yes, show me the campaign strategy for the 2X points offer. What would the targeting criteria be?",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    type: "ai",
    content:
      "📋 **Campaign Strategy Brief - 2X Points F&B Trial**\n\n🎯 **Target Audience:**\n• 12,450 customers with <10% F&B spend\n• High premium dining engagement scores\n• Active card users (3+ transactions/month)\n\n💰 **Financial Projections:**\n• Estimated incremental revenue: $100K-$150K\n• Expected participation rate: 18-22%\n• Average spend lift per participant: $340\n• ROI: 320-450%\n\n🚀 **Campaign Mechanics:**\n• 2X points on all F&B purchases\n• 90-day campaign duration\n• Personalized merchant recommendations\n• Progressive rewards for category trial\n\nShall I create the campaign targeting rules and launch timeline?",
    timestamp: new Date(Date.now() - 120000),
    insights: {
      revenue: "$100,000 - $150,000",
      confidence: 91,
      timeline: "90 days",
      customers: 12450,
    },
  },
  {
    id: "5",
    type: "user",
    content:
      "What about seasonal patterns? Are there better times to launch this?",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "6",
    type: "ai",
    content:
      "📊 **Seasonal Analysis for F&B Campaigns:**\n\n🍂 **Optimal Launch Windows:**\n• **January (New Year):** +35% engagement (health/dining resolutions)\n• **March-April:** +28% engagement (spring dining season)\n• **September:** +31% engagement (back-to-routine dining)\n\n📈 **Behavioral Insights:**\n• Weekend dining increases 65% during campaign periods\n• Premium restaurant trials peak in March (+40%)\n• Grocery category adoption highest in January (+52%)\n\n💡 **Recommendation:** Launch in early March to capture spring dining season with 4-week pre-launch teaser campaign. This timing could increase participation by 25-30% and boost revenue to $125K-$195K range.",
    timestamp: new Date(Date.now() - 10000),
    insights: {
      revenue: "$125,000 - $195,000",
      confidence: 94,
      timeline: "March launch optimal",
      customers: 12450,
    },
  },
];

export default function AICopilotDemo() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showDemo && currentMessageIndex < DEMO_CONVERSATIONS.length) {
      const timer = setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            DEMO_CONVERSATIONS[currentMessageIndex],
          ]);
          setIsTyping(false);
          setCurrentMessageIndex((prev) => prev + 1);
        }, 1500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showDemo, currentMessageIndex]);

  const startDemo = () => {
    setShowDemo(true);
    setMessages([]);
    setCurrentMessageIndex(0);
  };

  const resetDemo = () => {
    setShowDemo(false);
    setMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      {/* Enhanced Header with Glassmorphic Design */}
      <div
        className="border-b border-purple-200/50"
        style={{
          background:
            "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.8) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                AI Marketing Co-pilot
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Strategic insights and recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
                color: "#166534",
              }}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              AI Active
            </div>
            {!showDemo ? (
              <Button
                onClick={startDemo}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl px-6 py-2 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Demo
              </Button>
            ) : (
              <Button
                onClick={resetDemo}
                variant="outline"
                className="px-4 py-2 rounded-2xl border-gray-200 hover:bg-white/50 transition-colors"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        {!showDemo ? (
          <div className="text-center py-12 px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              AI-Powered Marketing Insights
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
              Experience how our AI co-pilot analyzes customer data to generate
              actionable marketing strategies and revenue opportunities.
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Behavioral Analysis
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Revenue Opportunities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-sm">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Campaign Strategy
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Audience Targeting
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    message.type === "ai"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                      : "bg-gradient-to-br from-blue-500 to-cyan-600"
                  }`}
                >
                  {message.type === "ai" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-lg px-5 py-3 rounded-2xl shadow-sm ${
                    message.type === "ai"
                      ? "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200"
                      : "bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* AI Insights Display */}
                  {message.type === "ai" && message.insights && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="font-bold text-green-700 text-lg">
                            {message.insights.revenue}
                          </div>
                          <div className="text-green-600 font-medium">
                            Revenue Potential
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="font-bold text-blue-700 text-lg">
                            {message.insights.confidence}%
                          </div>
                          <div className="text-blue-600 font-medium">
                            Confidence
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="font-bold text-purple-700 text-lg">
                            {message.insights.customers?.toLocaleString()}
                          </div>
                          <div className="text-purple-600 font-medium">
                            Customers
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="font-bold text-orange-700 text-lg">
                            {message.insights.timeline}
                          </div>
                          <div className="text-orange-600 font-medium">
                            Timeline
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations Display */}
                  {message.type === "ai" && message.recommendations && (
                    <div className="mt-4 space-y-3">
                      {message.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {rec.title}
                            </h4>
                            <Badge
                              className={`text-xs px-3 py-1 rounded-full ${
                                rec.type === "strategic"
                                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {rec.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            {rec.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600">
                              {rec.revenue}
                            </span>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs px-4 py-2 rounded-lg shadow-sm"
                            >
                              <ArrowRight className="w-3 h-3 mr-1" />
                              Explore
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-5 py-3 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="ml-2 text-sm text-gray-500">
                      AI is analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Enhanced Input Section */}
        {showDemo && (
          <div
            className="border-t border-purple-200/50 p-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.8) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about marketing insights..."
                  className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm shadow-sm"
                  disabled={isTyping}
                />
              </div>
              <Button
                disabled={!inputText.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Demo Progress and Status */}
        {showDemo && (
          <div
            className="border-t border-purple-200/50 px-6 py-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(243, 244, 246, 0.8) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs border border-green-200">
                  <Zap className="w-3 h-3 mr-1" />
                  Live AI Analysis
                </Badge>
                <span className="text-xs text-gray-500">
                  {messages.length} / {DEMO_CONVERSATIONS.length} messages
                </span>
              </div>
              {currentMessageIndex >= DEMO_CONVERSATIONS.length && (
                <Button
                  onClick={() => {
                    // This would integrate with the actual CopilotKit chat
                    alert(
                      "In the real application, this would open the CopilotKit chat sidebar where you can continue the conversation with natural language queries."
                    );
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 text-xs font-medium rounded-lg shadow-sm"
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Continue in Chat
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
