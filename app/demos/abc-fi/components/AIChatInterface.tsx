"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { MobileLayout } from "./MobileLayout";
import { InlineTravelAnimation } from "@/components/features/demo/InlineTravelAnimation";
import { DenverHomeLocation } from "@/components/features/demo/DenverHomeLocation";
import { MerchantLocationMap } from "@/components/features/demo/MerchantLocationMap";

interface AIChatInterfaceProps {
  onChatComplete: () => void;
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
    | "gift-selection"
    | "moving-offers"
    | "travel-offers"
    | "home-setup-offers"
    | "local-discovery"
    | "loyalty-links"
    | "denver-map"
    | "inline-travel-animation"
    | "denver-home-location"
    | "merchant-location-map"
    | "single-offer"
    | "scheduled-message-indicator";
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

export function AIChatInterface({ onChatComplete }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "gift-selection" | "moving" | "travel" | "home-setup" | "local-discovery"
  >("gift-selection");
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [visibleGifts, setVisibleGifts] = useState<number>(0);
  const [visibleOffers, setVisibleOffers] = useState<number>(0);
  const [conversationSequenceComplete, setConversationSequenceComplete] =
    useState(false);
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [movingConversationStep, setMovingConversationStep] =
    useState<number>(0);
  const [movingAnswers, setMovingAnswers] = useState<{
    moveDate?: string;
    currentLocation?: string;
    travelMethod?: string;
    needsStorage?: string;
  }>({});
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [homeLocationShown, setHomeLocationShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToLatestContent = () => {
    // Smooth scroll that doesn't jump to the very bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  useEffect(() => {
    scrollToLatestContent();
  }, [messages]);

  // Scroll when gift options become visible
  useEffect(() => {
    if (visibleGifts > 0) {
      scrollToLatestContent();
    }
  }, [visibleGifts]);

  // Scroll when offers become visible
  useEffect(() => {
    if (visibleOffers > 0) {
      scrollToLatestContent();
    }
  }, [visibleOffers]);

  // Start the conversation when component mounts
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      startConversationSequence();
    }
  }, [hasStarted]);

  const startConversationSequence = () => {
    setIsTyping(true);

    // Step 1: Congratulations message
    setTimeout(() => {
      const congratsMessage: Message = {
        id: "congrats",
        text: "Congratulations again on your new home in Denver!",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages([congratsMessage]);
      setIsTyping(false);

      // Step 2: Gift announcement
      // Step 2: Personalization explanation (skip gift announce message)
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const personalizationMessage: Message = {
            id: "personalization",
            text: "As a housewarming gift, please choose one of following gift card options we hope you'll find useful getting settled in your new home.",
            sender: "ai",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, personalizationMessage]);
          setIsTyping(false);

          // Step 3: Show gift options with progressive reveal
          setTimeout(() => {
            const giftOptionsMessage: Message = {
              id: "gift-options",
                  text: "", // Empty text since we're just showing the component
                  sender: "ai",
                  timestamp: new Date(),
                  uiComponent: {
                    type: "gift-selection",
                    data: {
                      gifts: [
                        {
                          id: "home-depot-1",
                          title: "Home Depot Gift Card",
                          merchant: "The Home Depot",
                          logo: "/logos/home-depot-logo.png",
                          value: "$100",
                          description:
                            "Perfect for all your home improvement needs",
                          category: "home-goods",
                        },
                        {
                          id: "williams-sonoma-1",
                          title: "Williams Sonoma",
                          merchant: "Home & Kitchen",
                          logo: "/logos/williams_sonoma_logo.svg",
                          value: "$100",
                          description: "Premium kitchen and home essentials",
                          category: "home-goods",
                        },
                        {
                          id: "danford-cleaning-1",
                          title: "Danford Cleaning Company",
                          merchant: "Professional Cleaning Service",
                          logo: "/logos/denver_cleaning_co_logo.png",
                          value: "$100",
                          description:
                            "Professional home cleaning for your new place",
                          category: "local-service",
                        },
                      ],
                    },
                  },
                };

                setMessages((prev) => [...prev, giftOptionsMessage]);

                // Start progressive reveal of gift options
                setTimeout(() => {
                  setVisibleGifts(1);
                  setTimeout(() => {
                    setVisibleGifts(2);
                    setTimeout(() => {
                      setVisibleGifts(3);
                      // Mark conversation sequence as complete after all gifts are shown
                      setTimeout(() => {
                        setConversationSequenceComplete(true);
                      }, 500);
                    }, 800);
                  }, 800);
                }, 500);
              }, 1000);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const startMovingPlanningSequence = () => {
    setIsTyping(true);
    setConversationSequenceComplete(false);
    setMovingConversationStep(1);
    setAnimationCompleted(false); // Reset animation flag
    setHomeLocationShown(false); // Reset home location flag

    // Step 1: Initial acknowledgment and first question
    setTimeout(() => {
      const acknowledgmentMessage: Message = {
        id: "planning-ack",
        text: "I'd love to help you with your move to Denver! Let me ask a few questions to find the perfect offers for you.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, acknowledgmentMessage]);
      setIsTyping(false);
      scrollToLatestContent();

      // Step 2: Ask about move date
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const moveDateMessage: Message = {
            id: "move-date-question",
            text: "When are you planning to move?",
            sender: "ai",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, moveDateMessage]);
          setIsTyping(false);
          scrollToLatestContent();
          setConversationSequenceComplete(true); // Allow user to respond
        }, 1000);
      }, 1500);
    }, 1000);
  };

  const handleTravelAnimationComplete = () => {
    // Prevent multiple calls
    if (animationCompleted) return;
    setAnimationCompleted(true);

    // Show Denver home location after animation completes
    setTimeout(() => {
      const homeLocationMessage: Message = {
        id: "denver-home-location",
        text: "Great! Now let me show you your new Denver home location:",
        sender: "ai",
        timestamp: new Date(),
        uiComponent: {
          type: "denver-home-location",
          data: {
            address: "4988 Valentia Ct, Denver, CO 80238",
            neighborhood: "Stapleton",
          },
        },
      };

      // Use functional state update to check for duplicates with current state
      setMessages((prev) => {
        const hasHomeLocationMessage = prev.some(
          (msg) => msg.id === "denver-home-location"
        );
        if (hasHomeLocationMessage) return prev; // Return unchanged if duplicate
        return [...prev, homeLocationMessage];
      });
    }, 1000);
  };

  const handleHomeLocationShown = () => {
    // Prevent multiple calls
    if (homeLocationShown) return;
    setHomeLocationShown(true);

    // Start the modular offer sequence
    setTimeout(() => {
      showUHaulOffer();
    }, 1000);
  };

  // Step 1: Show U-Haul offer
  const showUHaulOffer = () => {
    const uHaulMessage: Message = {
      id: "uhaul-offer",
      text: "Perfect! Let me start with your moving logistics:",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "single-offer",
        data: {
          offer: {
            id: "uhaul-moving-package",
            title: "U-Haul Complete Moving Package",
            merchant: "U-Haul",
            logo: "/logos/U-Haul-logo.png",
            price: "$450",
            savings: "Save $200",
            description: "Truck rental + moving supplies for KC→Denver",
            category: "Moving Logistics",
            address: "Multiple locations near you",
          },
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "uhaul-offer");
      if (hasMessage) return prev;
      return [...prev, uHaulMessage];
    });

    // Add AI prompt to save the offer after a delay
    setTimeout(() => {
      showUHaulPrompt();
    }, 2000);
  };

  // Step 1.5: AI prompt to save U-Haul offer
  const showUHaulPrompt = () => {
    const promptMessage: Message = {
      id: "uhaul-prompt",
      text: "This moving package could save you $200 on your Kansas City to Denver move! Would you like me to save this to your Kigo Hub?",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "uhaul-prompt");
      if (hasMessage) return prev;
      return [...prev, promptMessage];
    });
  };

  // Step 2: Handle U-Haul offer save and show savings update
  const handleUHaulSave = () => {
    const savingsMessage: Message = {
      id: "uhaul-savings",
      text: "Great choice! You've saved $200 on your moving logistics. Total savings so far: $200",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "uhaul-savings");
      if (hasMessage) return prev;
      return [...prev, savingsMessage];
    });

    // Move to next step after delay
    setTimeout(() => {
      showStaybridgeTransition();
    }, 2000);
  };

  // Step 2.5: Natural transition to Staybridge
  const showStaybridgeTransition = () => {
    const transitionMessage: Message = {
      id: "staybridge-transition",
      text: "Now, for your moving period, you'll need a comfortable place to stay while you get settled. Here's a perfect option for you:",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "staybridge-transition");
      if (hasMessage) return prev;
      return [...prev, transitionMessage];
    });

    // Show Staybridge offer after delay
    setTimeout(() => {
      showStaybridgeOffer();
    }, 2000);
  };

  // Step 3: Show Staybridge offer
  const showStaybridgeOffer = () => {
    const staybridgeMessage: Message = {
      id: "staybridge-offer",
      text: "",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "single-offer",
        data: {
          offer: {
            id: "staybridge-hotel",
            title: "Staybridge Suites Denver",
            merchant: "Staybridge Suites",
            logo: "/logos/staybridge_logo_english.png",
            price: "$129/night",
            savings: "Save $70/night",
            description: "Extended stay hotel for your moving period",
            category: "Accommodation",
            address: "8101 E Northfield Blvd, Denver, CO 80238",
          },
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "staybridge-offer");
      if (hasMessage) return prev;
      return [...prev, staybridgeMessage];
    });

    // Automatically show map after displaying the offer
    setTimeout(() => {
      showStaybridgeMap();
    }, 3000);
  };

  // Step 4: Handle Staybridge offer save (map already shown)
  const handleStaybridgeSave = () => {
    // Add savings confirmation message
    const savingsMessage: Message = {
      id: "staybridge-savings",
      text: "Excellent! You've saved $70/night on accommodation. Total savings so far: $270",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "staybridge-savings");
      if (hasMessage) return prev;
      return [...prev, savingsMessage];
    });

    // Map is already displayed, continue to storage after showing savings
    setTimeout(() => {
      showStorageTransition();
    }, 2000);
  };

  // Step 5: Show Staybridge map
  const showStaybridgeMap = () => {
    const mapMessage: Message = {
      id: "staybridge-map",
      text: "Here's how close Staybridge Suites is to your new home:",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "merchant-location-map",
        data: {
          homeAddress: "4988 Valentia Ct, Denver, CO 80238",
          homeCoordinates: { lat: 39.7817, lng: -104.8897 },
          merchantName: "Staybridge Suites",
          merchantAddress: "8101 E Northfield Blvd, Denver, CO 80238",
          merchantCoordinates: { lat: 39.785, lng: -104.895 },
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "staybridge-map");
      if (hasMessage) return prev;
      return [...prev, mapMessage];
    });

    // Map is now displayed, waiting for user to save the offer
  };

  // Step 5.5: Natural transition to Storage
  const showStorageTransition = () => {
    const transitionMessage: Message = {
      id: "storage-transition",
      text: "Finally, you'll need secure storage for your belongings during the move. Here's a great option near your new home:",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "storage-transition");
      if (hasMessage) return prev;
      return [...prev, transitionMessage];
    });

    // Show Storage offer after delay
    setTimeout(() => {
      showStorageOffer();
    }, 2000);
  };

  // Step 6: Show Storage offer
  const showStorageOffer = () => {
    const storageMessage: Message = {
      id: "storage-offer",
      text: "",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "single-offer",
        data: {
          offer: {
            id: "extra-space-storage",
            title: "Extra Space Storage",
            merchant: "Extra Space Storage",
            logo: "/logos/extra_space_storage_logo.png",
            price: "$89/month",
            savings: "Save $89",
            description:
              "First month FREE - Secure storage near your new Denver home",
            category: "Storage",
            address: "5062 Central Park Blvd, Denver, CO 80238",
          },
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "storage-offer");
      if (hasMessage) return prev;
      return [...prev, storageMessage];
    });

    // Automatically show map after displaying the offer
    setTimeout(() => {
      showStorageMap();
    }, 3000);
  };

  // Step 7: Handle Storage offer save (map already shown)
  const handleStorageSave = () => {
    // Skip individual savings message and go directly to final summary
    setTimeout(() => {
      showFinalSavingsSummary();
    }, 1000);
  };

  // Step 8: Final wrap-up with suggestion tabs
  const showFinalWrapUp = () => {
    const anythingElseMessage: Message = {
      id: "anything-else",
      text: "Anything else I can help you with?",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "anything-else");
      if (hasMessage) return prev;
      return [...prev, anythingElseMessage];
    });

    // Show suggestion tabs and wait for user interaction
    // The suggestion tabs will be handled by the existing UI logic
    // When user clicks "Thank you", it will trigger the final response
  };

  // Step 9: Final savings summary
  const showFinalSavingsSummary = () => {
    const totalSavingsAmount = 200 + 70 + 89; // U-Haul + Hotel + Storage savings
    const finalMessage: Message = {
      id: "final-savings-summary",
      text: `Looks like you've got most of the bases covered for planning your move. You're expected to save $${totalSavingsAmount}.00 and earn 10,000 points once you book the U-haul, storage and hotel with your ABC FI rewards credit card.\n\nIs there anything else I can help you with today?`,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "final-savings-summary");
      if (hasMessage) return prev;
      return [...prev, finalMessage];
    });

    // Complete the sequence
    setTimeout(() => {
      setConversationSequenceComplete(true);
    }, 2000);
  };

  // Step 10: Show follow-up offer (Screen 6)
  const showFollowUpOffer = () => {
    const followUpMessage: Message = {
      id: "follow-up-offer",
      text: "Happy to help! One last thought… Would you like me to follow up after your move-in date on October 25th with a few savings recommendations for popular local places to eat and fun family activities?",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "follow-up-offer");
      if (hasMessage) return prev;
      return [...prev, followUpMessage];
    });
  };

  // Step 11: Handle follow-up acceptance
  const handleFollowUpAcceptance = () => {
    // Show confirmation message
    const confirmationMessage: Message = {
      id: "follow-up-confirmation",
      text: "Will do. I'll send you a message with a few choice options to earn reward points and save.",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some(
        (msg) => msg.id === "follow-up-confirmation"
      );
      if (hasMessage) return prev;
      return [...prev, confirmationMessage];
    });

    // Show final message and scheduled indicator
    setTimeout(() => {
      showFinalMessage();
    }, 2000);
  };

  // Step 12: Show final message with scheduled indicator
  const showFinalMessage = () => {
    const finalMessage: Message = {
      id: "final-message",
      text: "Don't hesitate to come back if there's anything else we can help you with during your move. Congrats again and all the best to you and your family getting settled in the Mile High City!",
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "final-message");
      if (hasMessage) return prev;
      return [...prev, finalMessage];
    });

    // Show scheduled message indicator
    setTimeout(() => {
      showScheduledMessageIndicator();
    }, 1000);
  };

  // Step 13: Show scheduled message indicator
  const showScheduledMessageIndicator = () => {
    const scheduledIndicator: Message = {
      id: "scheduled-indicator",
      text: "",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "scheduled-message-indicator",
        data: {
          scheduledDate: "October 25th",
          message: "Follow-up with local Denver recommendations",
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "scheduled-indicator");
      if (hasMessage) return prev;
      return [...prev, scheduledIndicator];
    });

    // Complete the demo
    setTimeout(() => {
      setConversationSequenceComplete(true);
    }, 2000);
  };

  // Step 8: Show Storage map and complete sequence
  const showStorageMap = () => {
    const mapMessage: Message = {
      id: "storage-map",
      text: "Here's how close Extra Space Storage is to your new home:",
      sender: "ai",
      timestamp: new Date(),
      uiComponent: {
        type: "merchant-location-map",
        data: {
          homeAddress: "4988 Valentia Ct, Denver, CO 80238",
          homeCoordinates: { lat: 39.7817, lng: -104.8897 },
          merchantName: "Extra Space Storage",
          merchantAddress: "5062 Central Park Blvd, Denver, CO 80238",
          merchantCoordinates: { lat: 39.778, lng: -104.885 },
        },
      },
    };

    setMessages((prev) => {
      const hasMessage = prev.some((msg) => msg.id === "storage-map");
      if (hasMessage) return prev;
      return [...prev, mapMessage];
    });

    // Map is now displayed, waiting for user to save the offer
  };

  const handleMovingAnswer = (answer: string, questionType: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: answer,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save the answer
    setMovingAnswers((prev) => ({
      ...prev,
      [questionType]: answer,
    }));

    setConversationSequenceComplete(false);
    setIsTyping(true);

    // Continue conversation based on step
    setTimeout(() => {
      if (movingConversationStep === 1) {
        // After move date, confirm current location
        const locationMessage: Message = {
          id: "location-question",
          text: "I see you're currently in Kansas City, MO - is that correct?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, locationMessage]);
        setMovingConversationStep(2);
      } else if (movingConversationStep === 2) {
        // After location, ask about travel method
        const travelMessage: Message = {
          id: "travel-question",
          text: "How are you planning to travel to Denver?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, travelMessage]);
        setMovingConversationStep(3);
      } else if (movingConversationStep === 3) {
        // After travel method, ask about storage
        const storageMessage: Message = {
          id: "storage-question",
          text: "Do you need temporary storage?",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, storageMessage]);
        setMovingConversationStep(4);
      } else if (movingConversationStep === 4) {
        // After storage, show inline travel animation (only if not already shown)
        const travelMessage: Message = {
          id: "travel-animation",
          text: "Perfect! Let me show your journey:",
          sender: "ai",
          timestamp: new Date(),
          uiComponent: {
            type: "inline-travel-animation",
            data: {
              fromCity: "Kansas City, MO",
              toCity: "Denver, CO",
            },
          },
        };

        // Use functional state update to check for duplicates with current state
        setMessages((prev) => {
          const hasAnimationMessage = prev.some(
            (msg) => msg.id === "travel-animation"
          );
          if (hasAnimationMessage) return prev; // Return unchanged if duplicate
          return [...prev, travelMessage];
        });

        setMovingConversationStep(5);
      }

      setIsTyping(false);
      scrollToLatestContent();
      if (movingConversationStep < 4) {
        setConversationSequenceComplete(true); // Allow next response
      }
    }, 1500);
  };

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
    setVisibleOffers(0); // Reset offers animation
    setConversationSequenceComplete(false); // Reset sequence state

    // Simulate AI response following Sarah's journey story
    setTimeout(() => {
      let aiResponse = "";
      let uiComponent: UIComponent | undefined;

      // Follow the demo script conversation flow - Part 1 Implementation
      if (
        text.toLowerCase().includes("plan") &&
        text.toLowerCase().includes("move")
      ) {
        // Start the background agent thinking pattern
        startMovingPlanningSequence();
        return; // Don't add the AI message yet, let the sequence handle it
      } else if (
        text.toLowerCase().includes("overwhelming") ||
        text.toLowerCase().includes("everything")
      ) {
        aiResponse =
          "I understand! Cross-state family moves have so many pieces. I've organized deals for moving logistics, travel, and setting up your new Denver home. Let's start with the most urgent - your moving logistics:";
        uiComponent = getPhaseOffers("moving");

        // Start progressive reveal of offers
        setTimeout(() => {
          setVisibleOffers(1);
          setTimeout(() => {
            setVisibleOffers(2);
            // Mark sequence complete after offers are shown
            setTimeout(() => {
              setConversationSequenceComplete(true);
            }, 500);
          }, 600);
        }, 1000);
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

        // Start progressive reveal for any offers
        if (uiComponent && uiComponent.data.offers) {
          setTimeout(() => {
            setVisibleOffers(1);
            setTimeout(() => {
              setVisibleOffers(2);
              if (uiComponent?.data?.offers?.length > 2) {
                setTimeout(() => {
                  setVisibleOffers(3);
                  // Mark sequence complete after all offers are shown
                  setTimeout(() => {
                    setConversationSequenceComplete(true);
                  }, 500);
                }, 600);
              } else {
                // Mark sequence complete for 2-item offers
                setTimeout(() => {
                  setConversationSequenceComplete(true);
                }, 500);
              }
            }, 600);
          }, 1000);
        } else {
          // No offers, mark sequence complete immediately
          setTimeout(() => {
            setConversationSequenceComplete(true);
          }, 500);
        }
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
    // Check if we're in the follow-up offer phase
    const hasFollowUpOffer = messages.some(
      (msg) => msg.id === "follow-up-offer"
    );

    if (hasFollowUpOffer) {
      return [
        "That would be amazing. Thank you.",
        "Yes, that would be great!",
        "I'd love that!",
      ];
    }

    // Check if we're in the final savings summary phase
    const hasFinalSavingsSummary = messages.some(
      (msg) => msg.id === "final-savings-summary"
    );

    if (hasFinalSavingsSummary) {
      return [
        "Wow! You made this so easy. Thanks. I think that's it for now.",
        "This was incredibly helpful!",
        "Thank you so much!",
      ];
    }

    // If we're in moving conversation flow, return context-specific suggestions
    if (movingConversationStep > 0 && movingConversationStep < 5) {
      switch (movingConversationStep) {
        case 1: // Move date question
          return [
            "We need to arrive in Denver by October 25th",
            "In 2-3 weeks",
            "Next month",
            "I'm flexible",
          ];
        case 2: // Current location confirmation
          return [
            "Yes, that's correct",
            "Actually, I'm in a different city",
            "Close, but not exactly",
          ];
        case 3: // Travel method question
          return [
            "Driving",
            "Air travel",
            "Combination of both",
            "Haven't decided yet",
          ];
        case 4: // Storage question
          return ["Yes, definitely", "Maybe", "No, direct move"];
        default:
          return [];
      }
    }

    // Default phase-based suggestions
    switch (currentPhase) {
      case "gift-selection":
        return [
          "Thank you! This is so thoughtful.",
          "These look great! Let me choose one.",
          "I love the personalized options!",
        ];
      case "moving":
        return [
          "I need to plan the move",
          "We need help with everything! This feels overwhelming.",
          "Can you help with moving logistics?",
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

  const handleGiftSelection = (gift: any) => {
    setSelectedGift(gift.id);
    // DON'T reset visibleGifts - keep them visible to show selection state
    setConversationSequenceComplete(false); // Reset sequence state

    // Add confirmation message
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect choice! I've added your ${gift.value} gift card for ${gift.title} to your Kigo Hub. 🎁`,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, confirmationMessage]);

    // Move to next phase after a delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const followUpMessage: Message = {
          id: Date.now().toString() + "-followup",
          text: "Is there anything else we can help you with to plan your move to Denver?",
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, followUpMessage]);
        setCurrentPhase("moving");
        setIsTyping(false);

        // Mark sequence complete after follow-up message
        setTimeout(() => {
          setConversationSequenceComplete(true);
        }, 500);
      }, 1500);
    }, 1000);
  };

  const handleSaveAllOffers = (offers: Offer[]) => {
    // Save all unsaved offers
    const unsavedOffers = offers.filter(
      (offer) => !savedOffers.includes(offer.id)
    );
    const newOfferIds = unsavedOffers.map((offer) => offer.id);
    const totalNewSavings = unsavedOffers.reduce((sum, offer) => {
      return sum + parseInt(offer.savings.replace(/[^0-9]/g, ""));
    }, 0);

    setSavedOffers((prev) => [...prev, ...newOfferIds]);
    setTotalSavings((prev) => prev + totalNewSavings);

    // Add confirmation message matching the script
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `🎉 Perfect! I've saved all your moving offers to your Kigo Hub. You'll save $${totalNewSavings} total on your Kansas City to Denver move!`,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, confirmationMessage]);

    // Show impressed reaction after a delay
    setTimeout(() => {
      const impressedMessage: Message = {
        id: Date.now().toString() + "-impressed",
        text: "I can see you're impressed with these personalized offers! Is there anything else I can help you with for your move?",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, impressedMessage]);
      setConversationSequenceComplete(true);
    }, 2000);
  };

  const handleOfferClick = (offer: Offer) => {
    if (savedOffers.includes(offer.id)) {
      return; // Already saved
    }

    // Save the offer and add to savings
    setSavedOffers((prev) => [...prev, offer.id]);
    const savingsAmount = parseInt(offer.savings.replace(/[^0-9]/g, ""));
    setTotalSavings((prev) => prev + savingsAmount);

    // Handle specific offer flows based on offer ID
    if (offer.id === "uhaul-moving-package") {
      handleUHaulSave();
    } else if (offer.id === "staybridge-hotel") {
      handleStaybridgeSave();
    } else if (offer.id === "extra-space-storage") {
      handleStorageSave();
    } else {
      // Default confirmation message for other offers
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        text: `✅ Great choice! I've saved the ${offer.title} deal to your Kigo Hub. You'll save ${offer.savings}!`,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, confirmationMessage]);

      // Progress to next phase if enough offers saved
      if (savedOffers.length >= 2) {
        setTimeout(() => {
          progressToNextPhase();
        }, 1500);
      }
    }
  };

  const progressToNextPhase = () => {
    const phases: Array<
      "gift-selection" | "moving" | "travel" | "home-setup" | "local-discovery"
    > = ["gift-selection", "moving", "travel", "home-setup", "local-discovery"];
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

  const getMovingJourneyBundle = (): UIComponent => {
    return {
      type: "moving-offers",
      data: {
        offers: [
          {
            id: "uhaul-bundle",
            title: "U-Haul Complete Moving Package",
            merchant: "U-Haul",
            logo: "/logos/U-Haul-logo.png",
            price: "$450",
            savings: "Save $200",
            description: "Truck rental + moving supplies for KC→Denver",
            category: "Moving Logistics",
            address: "Near your location",
          },
          {
            id: "staybridge-hotel",
            title: "Staybridge Suites Denver",
            merchant: "Staybridge Suites",
            logo: "/logos/staybridge-logo.png",
            price: "$129/night",
            savings: "Save $70/night",
            description: "Extended stay hotel for your moving period",
            category: "Accommodation",
            address: "8101 E Northfield Blvd, Denver, CO 80238",
          },
          {
            id: "extra-space-storage",
            title: "Extra Space Storage",
            merchant: "Extra Space Storage",
            logo: "/logos/extra-space-storage-logo.png",
            price: "$89/month",
            savings: "First month FREE",
            description: "Secure storage near your new Denver home",
            category: "Storage",
            address: "5062 Central Park Blvd, Denver, CO 80238",
          },
        ],
      },
    };
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

  // Unified offer card renderer for both gifts and offers
  const renderOfferCards = (
    items: any[],
    type: "gifts" | "offers",
    visibleCount: number
  ) => {
    const isGiftType = type === "gifts";
    const selectedId = isGiftType ? selectedGift : null;

    return (
      <div className="mt-3 space-y-3">
        {items.map((item: any, index: number) => {
          const isSelected = isGiftType
            ? selectedId === item.id
            : savedOffers.includes(item.id);
          const handleClick = isGiftType
            ? () => !isSelected && handleGiftSelection(item)
            : () => !isSelected && handleOfferClick(item);

          return (
            <div
              key={item.id}
              onClick={handleClick}
              className={`rounded-2xl shadow-sm p-6 transition-all duration-500 border relative ${
                isSelected
                  ? "bg-green-50 border-green-200 cursor-default"
                  : "bg-white border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 active:scale-[0.98]"
              } ${
                index < visibleCount
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Top Row: Logo (left) and Heart (right) */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-3 shadow-sm">
                  <img
                    src={item.logo}
                    alt={item.merchant || item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Heart action button */}
                <div
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      if (isGiftType) {
                        handleGiftSelection(item);
                      } else {
                        handleOfferClick(item);
                      }
                    }
                  }}
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      isSelected
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                    fill={isSelected ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom Section: Offer Details */}
              <div className="space-y-3">
                {/* Title and Price Row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {item.merchant}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-blue-600">
                      {item.value || item.price}
                    </p>
                    {item.savings && (
                      <p className="text-sm text-green-600 font-medium">
                        {item.savings}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center">
                  <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                    {isGiftType ? (
                      <>
                        {item.category === "restaurant" && "Dining"}
                        {item.category === "home-goods" && "Home & Kitchen"}
                        {item.category === "local-service" && "Local Service"}
                      </>
                    ) : (
                      item.category
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderUIComponent = (component: UIComponent) => {
    switch (component.type) {
      case "gift-selection":
        return renderOfferCards(component.data.gifts, "gifts", visibleGifts);

      case "moving-offers":
      case "travel-offers":
      case "home-setup-offers":
      case "local-discovery":
        const allOffersVisible = visibleOffers >= component.data.offers.length;
        const allOffersSaved = component.data.offers.every((offer: Offer) =>
          savedOffers.includes(offer.id)
        );

        return (
          <div className="mt-3 space-y-3">
            {/* Save All Button - appears after all offers are visible */}
            {allOffersVisible && !allOffersSaved && (
              <div className="animate-fade-in">
                <button
                  onClick={() => handleSaveAllOffers(component.data.offers)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-2xl font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  💾 Save All Moving Offers to Kigo Hub
                </button>
              </div>
            )}

            {/* Use unified component for offers */}
            {renderOfferCards(component.data.offers, "offers", visibleOffers)}
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

      case "denver-map":
        return (
          <div className="mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Your Move: Kansas City → Denver
              </h4>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-gray-700">
                      Kansas City, MO
                    </p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                      🚗
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-xs font-medium text-gray-700">
                      Denver, CO
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Distance</p>
                    <p>~600 miles</p>
                  </div>
                  <div>
                    <p className="font-medium">Drive Time</p>
                    <p>~9 hours</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                🎯 Finding personalized offers for your move...
              </div>
            </div>
          </div>
        );

      case "inline-travel-animation":
        return (
          <div className="mt-3">
            <InlineTravelAnimation
              fromCity={component.data.fromCity}
              toCity={component.data.toCity}
              onAnimationComplete={handleTravelAnimationComplete}
            />
          </div>
        );

      case "denver-home-location":
        return (
          <div className="mt-3">
            <DenverHomeLocation
              address={component.data.address}
              neighborhood={component.data.neighborhood}
              onLocationShown={handleHomeLocationShown}
            />
          </div>
        );

      case "merchant-location-map":
        return (
          <div className="mt-3">
            <MerchantLocationMap
              homeAddress={component.data.homeAddress}
              homeCoordinates={component.data.homeCoordinates}
              merchantName={component.data.merchantName}
              merchantAddress={component.data.merchantAddress}
              merchantCoordinates={component.data.merchantCoordinates}
            />
          </div>
        );

      case "single-offer":
        return (
          <div className="mt-3">
            {renderOfferCards([component.data.offer], "offers", 1)}
          </div>
        );

      case "scheduled-message-indicator":
        return (
          <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-900">
                    Message Scheduled
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {component.data.scheduledDate}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {component.data.message}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
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

                {message.text && (
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
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                )}

                {/* Render generative UI component if present - Full width */}
                {message.uiComponent && (
                  <div className="mt-2 -mx-6 px-6 py-4 bg-gray-50/50">
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

          {/* Suggestion Bubbles in Chat - only show when conversation sequence is complete */}
          {conversationSequenceComplete &&
            (messages.length <= 1 ||
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
                          onClick={() => {
                            // Check if we're in follow-up offer phase
                            const hasFollowUpOffer = messages.some(
                              (msg) => msg.id === "follow-up-offer"
                            );

                            if (hasFollowUpOffer) {
                              // Add user acceptance message
                              const userMessage: Message = {
                                id: "follow-up-acceptance",
                                text: reply,
                                sender: "user",
                                timestamp: new Date(),
                              };

                              setMessages((prev) => {
                                const hasMessage = prev.some(
                                  (msg) => msg.id === "follow-up-acceptance"
                                );
                                if (hasMessage) return prev;
                                return [...prev, userMessage];
                              });

                              // Handle follow-up acceptance
                              setTimeout(() => {
                                handleFollowUpAcceptance();
                              }, 1000);

                              return;
                            }

                            // Check if we're in final savings summary phase (final user response)
                            const hasFinalSavingsSummary = messages.some(
                              (msg) => msg.id === "final-savings-summary"
                            );

                            if (hasFinalSavingsSummary) {
                              // Add final user message and show follow-up offer
                              const userMessage: Message = {
                                id: "final-user-response",
                                text: reply,
                                sender: "user",
                                timestamp: new Date(),
                              };

                              setMessages((prev) => {
                                const hasMessage = prev.some(
                                  (msg) => msg.id === "final-user-response"
                                );
                                if (hasMessage) return prev;
                                return [...prev, userMessage];
                              });

                              // Show follow-up offer after delay
                              setTimeout(() => {
                                showFollowUpOffer();
                              }, 1000);

                              return;
                            }

                            // Handle moving conversation flow
                            if (
                              movingConversationStep > 0 &&
                              movingConversationStep < 5
                            ) {
                              const questionTypes = [
                                "moveDate",
                                "currentLocation",
                                "travelMethod",
                                "needsStorage",
                              ];
                              const questionType =
                                questionTypes[movingConversationStep - 1];
                              handleMovingAnswer(reply, questionType);
                            } else {
                              sendMessage(reply);
                            }
                          }}
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

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </MobileLayout>
  );
}
