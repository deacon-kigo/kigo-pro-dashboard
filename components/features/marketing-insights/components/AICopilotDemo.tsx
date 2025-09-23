/**
 * AI Marketing Co-pilot Demo Component
 *
 * Demonstrates the AI co-pilot generating business and behavioral insights
 * for marketing managers and making strategic recommendations.
 */

"use client";

import React, { useState, useEffect } from "react";
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
    <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pastel-blue border border-gray-200">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                AI Marketing Co-pilot Demo
              </CardTitle>
              <p className="text-sm text-gray-600">
                See how the AI generates insights and strategic recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showDemo ? (
              <Button
                onClick={startDemo}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 text-sm font-medium shadow-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Demo
              </Button>
            ) : (
              <Button
                onClick={resetDemo}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:text-gray-800 px-4 py-2 text-sm font-medium"
              >
                Reset Demo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {!showDemo ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-pastel-blue flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Driven Marketing Insights
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Experience how our AI co-pilot analyzes customer behavior,
              identifies revenue opportunities, and provides strategic campaign
              recommendations in natural language.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Behavioral Analysis
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Revenue Opportunities
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Campaign Strategy
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Audience Targeting
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {message.type === "ai" && (
                      <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm whitespace-pre-line ${
                          message.type === "user"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {message.content}
                      </p>

                      {message.insights && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Revenue
                              </p>
                              <p className="text-sm font-semibold text-green-600">
                                {message.insights.revenue}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Confidence
                              </p>
                              <p className="text-sm font-semibold text-blue-600">
                                {message.insights.confidence}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Timeline
                              </p>
                              <p className="text-sm font-semibold text-purple-600">
                                {message.insights.timeline}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                Customers
                              </p>
                              <p className="text-sm font-semibold text-orange-600">
                                {message.insights.customers?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.recommendations && (
                        <div className="mt-3 space-y-2">
                          {message.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="p-3 bg-white rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {rec.title}
                                </h4>
                                <Badge
                                  className={`text-xs ${
                                    rec.type === "tactical"
                                      ? "bg-pastel-green text-green-700"
                                      : "bg-pastel-blue text-blue-700"
                                  }`}
                                >
                                  {rec.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                {rec.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-green-600">
                                  {rec.revenue}
                                </span>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      AI is analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showDemo && messages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className="bg-pastel-green text-green-700 px-2 py-1 text-xs">
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
                  className="bg-primary hover:bg-primary/90 text-white px-3 py-1 text-xs font-medium"
                >
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
