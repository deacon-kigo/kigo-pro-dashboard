"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, User, Bot, X, Sparkles } from "lucide-react";
import { CampaignBuilderUI } from "@/components/features/ai-query/generative-ui/CampaignBuilderUI";

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
    // Add Tucker's initial message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: initialPrompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([userMessage]);

    // Show AI thinking
    setIsTyping(true);

    // AI response after delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Excellent choice, Tucker! Let's architect your AI-Powered New Mover Journey. I'll guide you through configuring each step of the conversational experience. You can customize the gift value, messaging, and partner offers to match your campaign objectives.",
        sender: "ai",
        timestamp: new Date(),
        uiComponent: {
          type: "campaign-builder",
          data: {
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
        },
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
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

    // Simple AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand! Let me help you with that. Is there anything specific you'd like to adjust in the campaign configuration?",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
                    {message.sender === "user" ? "Tucker" : "AI Assistant"}
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
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    AI Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className="flex gap-1">
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
                  <span className="ml-2">AI is thinking...</span>
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
