"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Rocket, Users, Target, TrendingUp } from "lucide-react";

interface CampaignLaunchConfirmationProps {
  campaignType?: string;
  className?: string;
}

export function CampaignLaunchConfirmation({
  campaignType = "New Homeowner Welcome Campaign",
  className = "",
}: CampaignLaunchConfirmationProps) {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    // Animation steps
    const timer1 = setTimeout(() => setAnimationStep(1), 500);
    const timer2 = setTimeout(() => setAnimationStep(2), 900);
    const timer3 = setTimeout(() => setAnimationStep(3), 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Target Customers",
      value: "567/month",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Target,
      label: "Expected ROI",
      value: "+33%",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: TrendingUp,
      label: "Revenue Impact",
      value: "$45.3K",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-3 transition-all duration-1000 ${
              animationStep >= 0 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2
            className={`text-2xl font-bold text-gray-900 mb-2 transition-all duration-1000 delay-200 ${
              animationStep >= 1
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            🎉 Campaign Launched!
          </h2>

          <p
            className={`text-gray-600 transition-all duration-1000 delay-400 ${
              animationStep >= 1
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {campaignType} is now live
          </p>
        </div>

        {/* Key Metrics */}
        <div
          className={`bg-gray-50 rounded-xl p-4 mb-4 transition-all duration-1000 delay-600 ${
            animationStep >= 2
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Campaign Overview
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg p-3 text-center border border-gray-100"
                >
                  <IconComponent
                    className={`w-5 h-5 ${stat.color} mx-auto mb-2`}
                  />
                  <div className={`text-lg font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div
          className={`bg-white rounded-xl p-6 border border-gray-200 transition-all duration-1000 delay-1000 ${
            animationStep >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Campaign is Live!
            </h4>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              ✅ New homeowners will receive welcome notifications within 24
              hours
            </p>
            <p>📊 Real-time analytics available in your dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
