"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Bell,
  Gift,
  CheckCircle,
  Home,
  Sparkles,
  UtensilsCrossed,
  Signal,
  Wifi,
  BatteryMedium,
} from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";

interface MobileExperienceViewProps {
  isVisible: boolean;
  campaignData?: {
    title: string;
    type: string;
    segment?: string;
  };
}

export function MobileExperienceView({
  isVisible,
  campaignData,
}: MobileExperienceViewProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  // Auto-advance through screens
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 3);
    }, 3000); // Change screen every 3 seconds

    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  const giftOptions = [
    {
      id: "home-depot",
      title: "$100 Home Depot Gift Card",
      icon: "🏠",
      color: "bg-orange-500",
    },
    {
      id: "cleaning",
      title: "Professional Cleaning Service",
      icon: "✨",
      color: "bg-blue-500",
    },
    {
      id: "dining",
      title: "Local Dining Experience",
      icon: "🍽️",
      color: "bg-green-500",
    },
  ];

  const screens = [
    {
      id: "notification",
      title: "Push Notification",
      content: (
        <div className="bg-gray-100 h-full flex flex-col">
          {/* Status Bar */}
          <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-3 h-3 text-white" />
              <Wifi className="w-3 h-3 text-white" />
              <BatteryMedium className="w-4 h-3 text-white" />
            </div>
          </div>

          {/* Notification Banner */}
          <div className="bg-white mx-2 mt-2 rounded-lg shadow-lg p-4 animate-slide-down">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">ABC</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">ABC FI Banking</span>
                  <span className="text-xs text-gray-500">now</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Congratulations on your new home! We have a special welcome
                  gift waiting for you.
                </p>
              </div>
            </div>
          </div>

          {/* Home Screen Background */}
          <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start mt-8">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-12 h-12 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "selection",
      title: "In-App Gift Selection",
      content: (
        <div className="bg-white h-full flex flex-col">
          {/* Status Bar */}
          <div className="bg-blue-600 text-white text-xs px-4 py-3 flex justify-between items-center">
            <span>← ABC FI</span>
            <div className="flex items-center gap-2">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3 text-white" />
                <Wifi className="w-3 h-3 text-white" />
                <BatteryMedium className="w-4 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="p-6 text-center bg-gradient-to-b from-blue-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Welcome Home!
            </h2>
            <p className="text-gray-600">Choose Your Gift</p>
          </div>

          {/* Gift Options */}
          <div className="flex-1 p-4 space-y-4">
            {giftOptions.map((option, index) => (
              <div
                key={option.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  index === 0
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {option.title}
                    </h3>
                    {index === 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-blue-600">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="p-4">
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium">
              Continue
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Gift Confirmation",
      content: (
        <div className="bg-white h-full flex flex-col">
          {/* Status Bar */}
          <div className="bg-blue-600 text-white text-xs px-4 py-3 flex justify-between items-center">
            <span>← ABC FI</span>
            <div className="flex items-center gap-2">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3 text-white" />
                <Wifi className="w-3 h-3 text-white" />
                <BatteryMedium className="w-4 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Success Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your Gift is on its Way!
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Your $100 Home Depot gift card has been added to your Kigo Hub.
              You can access it anytime.
            </p>

            {/* Gift Card Preview */}
            <div className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Home Depot</span>
                <span className="text-lg font-bold">$100</span>
              </div>
              <div className="text-xs opacity-90">Gift Card</div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium">
              View in Kigo Hub
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <WavyBackground
      className="w-full h-full p-8 overflow-y-auto animate-in fade-in duration-500"
      containerClassName="w-full h-full"
      colors={["#a855f7", "#8b5cf6", "#7c3aed", "#6d28d9", "#c084fc"]}
      waveWidth={50}
      backgroundFill="rgb(250, 245, 255)"
      blur={12}
      speed="slow"
      waveOpacity={0.2}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Mobile Experience
        </h1>
        <p className="text-gray-600">
          What Sarah sees on her phone during the campaign
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-purple-100 text-purple-700">
            3-Step Journey
          </Badge>
          <Badge className="bg-pink-100 text-pink-700">
            Seamless Experience
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Mobile Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-black rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {screens[currentScreen].content}
                </div>
              </div>

              {/* Screen Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {screens.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreen(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentScreen === index ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step Description */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                  {screens[currentScreen].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentScreen === 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Push Notification
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        A notification banner appears at the top of Sarah's
                        phone screen with the ABC FI Banking logo and
                        congratulatory message about her new home.
                      </p>
                    </div>
                  )}

                  {currentScreen === 1 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Gift Selection Interface
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The screen transitions to a clean app interface with the
                        header "Welcome Home! Choose Your Gift" and displays the
                        three gift options as large, tappable images.
                      </p>
                    </div>
                  )}

                  {currentScreen === 2 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Confirmation Screen
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Shows "Your Gift is on its Way!" with confirmation that
                        the $100 Home Depot gift card has been added to her Kigo
                        Hub and can be accessed anytime.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-pink-600" />
                  Customer Journey Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {screens.map((screen, index) => (
                    <div
                      key={screen.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        currentScreen === index
                          ? "bg-purple-50 border border-purple-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentScreen === index
                            ? "bg-purple-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          currentScreen === index
                            ? "text-purple-900"
                            : "text-gray-700"
                        }`}
                      >
                        {screen.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
}
