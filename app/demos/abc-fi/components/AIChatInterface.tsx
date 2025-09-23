"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";

interface AIChatInterfaceProps {
  onNext: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  uiComponent?: UIComponent;
}

interface UIComponent {
  type:
    | "moving-offers"
    | "travel-offers"
    | "home-setup-offers"
    | "loyalty-links";
  data: any;
}

interface Offer {
  id: string;
  title: string;
  merchant: string;
  logo: string;
  price: string;
  savings: string;
  description: string;
  category: string;
}

export function AIChatInterface({ onNext }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "🌟 Moving your whole family from Kansas City to Denver! I can help organize everything from movers to kids' new rooms! Cross-state family moves have so many pieces. I've organized deals for moving logistics, travel, and setting up your new Denver home. Where should we start?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "moving" | "travel" | "home-setup" | "local-discovery"
  >("moving");
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response following Sarah's journey story
    setTimeout(() => {
      let aiResponse = "";
      let uiComponent: UIComponent | undefined;

      // Follow the demo script conversation flow
      if (
        text.toLowerCase().includes("overwhelming") ||
        text.toLowerCase().includes("everything")
      ) {
        aiResponse =
          "I understand! Cross-state family moves have so many pieces. I've organized deals for moving logistics, travel, and setting up your new Denver home. Let's start with the most urgent - your moving logistics:";
        uiComponent = getPhaseOffers("moving");
      } else if (
        text.toLowerCase().includes("moving") ||
        text.toLowerCase().includes("logistics")
      ) {
        aiResponse =
          "Perfect! I found some great moving deals specifically for your Kansas City to Denver move with Emma and Jake:";
        uiComponent = getPhaseOffers("moving");
      } else if (
        text.toLowerCase().includes("travel") ||
        text.toLowerCase().includes("flight")
      ) {
        aiResponse =
          "Great! Here are family-friendly travel options for your KC→Denver move:";
        uiComponent = getPhaseOffers("travel");
      } else if (
        text.toLowerCase().includes("home") ||
        text.toLowerCase().includes("setup") ||
        text.toLowerCase().includes("furniture")
      ) {
        aiResponse =
          "Excellent! Let's get your new Denver home ready for the family:";
        uiComponent = getPhaseOffers("home-setup");
      } else if (
        text.toLowerCase().includes("loyalty") ||
        text.toLowerCase().includes("accounts")
      ) {
        aiResponse =
          "Smart thinking! Linking your loyalty accounts will unlock better deals and upgrades for your move:";
        uiComponent = {
          type: "loyalty-links",
          data: {
            accounts: [
              {
                name: "Southwest Rapid Rewards",
                status: "ready",
                benefits: "Priority boarding, free bags",
              },
              {
                name: "Hilton Honors",
                status: "ready",
                benefits: "Room upgrades, late checkout",
              },
              {
                name: "National Emerald Club",
                status: "ready",
                benefits: "Skip the counter, choose any car",
              },
            ],
          },
        };
      } else if (
        text.toLowerCase().includes("denver") ||
        text.toLowerCase().includes("local") ||
        text.toLowerCase().includes("discover")
      ) {
        aiResponse =
          "Perfect! Let me help you and the kids discover Denver like locals:";
        uiComponent = getPhaseOffers("local-discovery");
      } else {
        // Default response based on current phase
        const phaseResponses = {
          moving:
            "Let's tackle your moving logistics first - I found some time-sensitive deals:",
          travel: "Ready to plan your family's travel to Denver?",
          "home-setup": "Time to make your Denver house feel like home:",
          "local-discovery": "Ready to explore Denver with Emma and Jake?",
        };
        aiResponse =
          phaseResponses[currentPhase] ||
          "I'm here to help with your Kansas City to Denver move. What would you like to start with?";
        uiComponent = getPhaseOffers(currentPhase);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        uiComponent,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getPhaseReplies = () => {
    switch (currentPhase) {
      case "moving":
        return [
          "We need help with everything! This feels overwhelming.",
          "Can you help with moving logistics?",
          "Show me moving company deals",
        ];
      case "travel":
        return [
          "What about travel options?",
          "Link my loyalty accounts for better deals",
          "Show me hotel and flight deals",
        ];
      case "home-setup":
        return [
          "Help with setting up our new home",
          "Show me furniture and home deals",
          "What about the kids' rooms?",
        ];
      case "local-discovery":
        return [
          "Help us discover Denver",
          "Show me local family activities",
          "What about local dining options?",
        ];
      default:
        return ["We need help with everything! This feels overwhelming."];
    }
  };

  const quickReplies = getPhaseReplies();

  const handleOfferClick = (offer: Offer) => {
    if (savedOffers.includes(offer.id)) {
      return; // Already saved
    }

    // Save the offer and add to savings
    setSavedOffers((prev) => [...prev, offer.id]);
    const savingsAmount = parseInt(offer.savings.replace(/[^0-9]/g, ""));
    setTotalSavings((prev) => prev + savingsAmount);

    // Add a confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `✅ Great choice! I've saved the ${offer.title} deal for you. You'll save ${offer.savings}! Your total savings so far: $${totalSavings + savingsAmount}`,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, confirmationMessage]);

    // Progress to next phase if enough offers saved
    if (savedOffers.length >= 1) {
      setTimeout(() => {
        progressToNextPhase();
      }, 1500);
    }
  };

  const progressToNextPhase = () => {
    const phases: Array<
      "moving" | "travel" | "home-setup" | "local-discovery"
    > = ["moving", "travel", "home-setup", "local-discovery"];
    const currentIndex = phases.indexOf(currentPhase);

    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      setCurrentPhase(nextPhase);

      // Add phase transition message
      const phaseMessages = {
        travel:
          "Perfect! Now let's plan your family's travel to Denver. I found some great options:",
        "home-setup":
          "Excellent! With moving and travel sorted, let's set up your new Denver home:",
        "local-discovery":
          "Amazing! Your home is ready. Now let's help you discover Denver like a local:",
      };

      if (phaseMessages[nextPhase]) {
        const transitionMessage: Message = {
          id: Date.now().toString(),
          text: phaseMessages[nextPhase],
          sender: "ai",
          timestamp: new Date(),
          uiComponent: getPhaseOffers(nextPhase),
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, transitionMessage]);
        }, 2000);
      }
    }
  };

  const getPhaseOffers = (phase: string): UIComponent => {
    switch (phase) {
      case "moving":
        return {
          type: "moving-offers",
          data: {
            offers: [
              {
                id: "moving-1",
                title: "Two Men and a Truck KC→Denver",
                merchant: "Two Men and a Truck",
                logo: "/logos/two-men-and-truck.jpg",
                price: "$1,440",
                savings: "Save $960",
                description: "40% off professional moving (46 hours left)",
                category: "Moving",
              },
              {
                id: "moving-2",
                title: "FREE U-Haul Storage Denver",
                merchant: "U-Haul",
                logo: "/logos/U-Haul-logo.png",
                price: "FREE",
                savings: "Save $89",
                description: "Free month storage (44 hours left)",
                category: "Storage",
              },
            ],
          },
        };
      case "travel":
        return {
          type: "travel-offers",
          data: {
            offers: [
              {
                id: "travel-1",
                title: "Southwest Flights KC→Denver",
                merchant: "Southwest Airlines",
                logo: "/logos/southwest-logo.svg",
                price: "$600",
                savings: "Save $600",
                description: "50% off family flights (68 hours left)",
                category: "Flight",
              },
              {
                id: "travel-2",
                title: "Hilton Denver Hotel Suite",
                merchant: "Hilton",
                logo: "/logos/hilton-honor-logo.png",
                price: "$89/night",
                savings: "Save $120",
                description: "Family suite upgrade included",
                category: "Hotel",
              },
            ],
          },
        };
      case "home-setup":
        return {
          type: "home-setup-offers",
          data: {
            offers: [
              {
                id: "home-1",
                title: "West Elm Kids Bedroom Sets",
                merchant: "West Elm",
                logo: "/logos/west-elm-logo.png",
                price: "$910",
                savings: "Save $490",
                description: "35% off Emma & Jake's furniture",
                category: "Kids Furniture",
              },
              {
                id: "home-2",
                title: "Best Buy Home Electronics",
                merchant: "Best Buy",
                logo: "/logos/best-buy-logo.png",
                price: "$1,799",
                savings: "Save $400",
                description: "FREE delivery to Denver home",
                category: "Electronics",
              },
            ],
          },
        };
      case "local-discovery":
        return {
          type: "local-discovery",
          data: {
            offers: [
              {
                id: "local-1",
                title: "Denver Zoo Family Passes",
                merchant: "Denver Zoo",
                logo: "/logos/denver-zoo-logo.png",
                price: "$45",
                savings: "Save $15",
                description: "25% off annual family pass",
                category: "Family Fun",
              },
              {
                id: "local-2",
                title: "Snooze A.M. Eatery Brunch",
                merchant: "Snooze",
                logo: "/logos/snooze-logo.png",
                price: "$32",
                savings: "Save $8",
                description: "20% off welcome brunch",
                category: "Dining",
              },
            ],
          },
        };
      default:
        return getPhaseOffers("moving");
    }
  };

  const renderUIComponent = (component: UIComponent) => {
    switch (component.type) {
      case "moving-offers":
      case "travel-offers":
      case "home-setup-offers":
      case "local-discovery":
        return (
          <div className="mt-3 space-y-3">
            {component.data.offers.map((offer: Offer) => {
              const isSaved = savedOffers.includes(offer.id);
              return (
                <div
                  key={offer.id}
                  onClick={() => handleOfferClick(offer)}
                  className={`rounded-2xl shadow-sm p-4 transition-all border ${
                    isSaved
                      ? "bg-green-50 border-green-200 cursor-default"
                      : "bg-white border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-2 relative">
                      <img
                        src={offer.logo}
                        alt={offer.merchant}
                        className="w-full h-full object-contain"
                      />
                      {isSaved && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium text-sm ${isSaved ? "text-green-800" : "text-gray-900"}`}
                        >
                          {offer.title}
                        </h4>
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm ${isSaved ? "text-green-800" : "text-gray-900"}`}
                          >
                            {offer.price}
                          </p>
                          <p
                            className={`text-xs ${isSaved ? "text-green-600" : "text-green-600"}`}
                          >
                            {offer.savings}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-xs mb-2 ${isSaved ? "text-green-700" : "text-gray-600"}`}
                      >
                        {offer.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isSaved
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isSaved ? "✅ Saved" : offer.category}
                        </span>
                        <span
                          className={`text-xs ${isSaved ? "text-green-600" : "text-gray-500"}`}
                        >
                          {offer.merchant}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "loyalty-links":
        return (
          <div className="mt-3 space-y-2">
            {component.data.accounts.map((account: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm p-3 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {account.name}
                    </h4>
                    <p className="text-xs text-gray-600">{account.benefits}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors">
                    Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-to-b from-blue-50 to-white h-full flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <img
                    src="/logos/abc-fi-logo.png"
                    alt="ABC FI"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    ABC FI Assistant
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 rounded-full">
                <span className="text-xs font-medium text-blue-700">
                  Moving Streak 1/3
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="px-3 py-1 bg-green-100 rounded-full">
                  <span className="text-xs font-medium text-green-700">
                    Saved ${totalSavings}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container - with bottom padding for sticky input */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-14 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${message.sender === "user" ? "order-2" : "order-1"}`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <img
                        src="/logos/abc-fi-logo.png"
                        alt="ABC FI"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      ABC FI Assistant
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === "user" ? "text-white" : "bg-white"
                  }`}
                  style={
                    message.sender === "user"
                      ? { backgroundColor: "#3b82f6" }
                      : {}
                  }
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>

                {/* Render generative UI component if present */}
                {message.uiComponent && (
                  <div className="mt-2">
                    {renderUIComponent(message.uiComponent)}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1 px-2">
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
              <div className="max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <img
                      src="/logos/abc-fi-logo.png"
                      alt="ABC FI"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    ABC FI Assistant is typing...
                  </span>
                </div>

                <div className="bg-white shadow-sm rounded-2xl px-4 py-3">
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
                </div>
              </div>
            </div>
          )}

          {/* Suggestion Bubbles in Chat - only show when no messages or after AI response */}
          {(messages.length <= 1 ||
            messages[messages.length - 1]?.sender === "ai") &&
            !isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <img
                        src="/logos/abc-fi-logo.png"
                        alt="ABC FI"
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      ABC FI Assistant
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-3 shadow-sm border border-blue-100">
                    <p className="text-xs text-gray-600 mb-3">
                      Try asking me about:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(reply)}
                          className="px-3 py-1 bg-white hover:bg-blue-50 text-gray-700 text-xs rounded-full transition-all duration-200 shadow-sm border border-gray-200 hover:border-blue-300 hover:scale-105"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Bottom Input Area - positioned within mobile container */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          {/* Input Only */}
          <div className="px-4 py-2 bg-transparent">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    inputText.trim() &&
                    sendMessage(inputText)
                  }
                  placeholder="Ask about your move..."
                  className="w-full px-4 py-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-200 shadow-sm"
                />
              </div>

              <button
                onClick={() => inputText.trim() && sendMessage(inputText)}
                disabled={!inputText.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm border-0 hover:scale-105"
                style={{
                  backgroundColor: !inputText.trim() ? "#d1d5db" : "#3b82f6",
                }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
