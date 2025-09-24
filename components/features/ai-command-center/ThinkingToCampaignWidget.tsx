"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { RefinedCampaignWidget } from "./RefinedCampaignWidget";
import {
  Zap,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface ThinkingToCampaignWidgetProps {
  campaignType?: string;
  targetAudience?: string;
  estimatedReach?: string;
  projectedEngagement?: string;
  expectedConversion?: string;
  offers?: string[];
  steps?: string[];
  currentStep?: number;
  stepStatus?: "configuring" | "configured" | "complete";
  isTransformed?: boolean;
}

export function ThinkingToCampaignWidget({
  campaignType = "AI-Powered New Mover Journey",
  targetAudience = "New mortgage customers",
  estimatedReach = "2,847 customers",
  projectedEngagement = "68% open rate",
  expectedConversion = "23% conversion",
  offers = [],
  steps = [],
  currentStep = 0,
  stepStatus = "configuring",
  isTransformed = false,
}: ThinkingToCampaignWidgetProps) {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [showCampaign, setShowCampaign] = useState(isTransformed);

  useEffect(() => {
    if (!isTransformed) {
      // Simulate the thinking/analysis process
      const tasks = [
        { task: "Analyzing customer data...", progress: 20, delay: 800 },
        { task: "Identifying target segments...", progress: 40, delay: 1000 },
        {
          task: "Optimizing gift personalization...",
          progress: 60,
          delay: 1200,
        },
        {
          task: "Configuring partner integrations...",
          progress: 80,
          delay: 900,
        },
        {
          task: "Finalizing campaign architecture...",
          progress: 100,
          delay: 600,
        },
      ];

      let currentTaskIndex = 0;
      const runTask = () => {
        if (currentTaskIndex < tasks.length) {
          const task = tasks[currentTaskIndex];
          setTimeout(() => {
            setCurrentTask(task.task);
            setProgress(task.progress);

            if (task.progress === 100) {
              // Transform to campaign widget after reaching 100%
              setTimeout(() => {
                setShowCampaign(true);
              }, 800);
            }

            currentTaskIndex++;
            runTask();
          }, task.delay);
        }
      };
      runTask();
    }
  }, [isTransformed]);

  if (showCampaign) {
    // Show the beautiful campaign widget
    return (
      <div className="animate-fade-in">
        <RefinedCampaignWidget
          campaignType={campaignType}
          targetAudience={targetAudience}
          estimatedReach={estimatedReach}
          projectedEngagement={projectedEngagement}
          expectedConversion={expectedConversion}
          offers={offers}
          steps={steps}
          currentStep={currentStep}
          stepStatus={stepStatus}
        />
      </div>
    );
  }

  // Show the thinking/progress container
  return (
    <div
      className="w-full max-w-2xl mx-auto mt-4 rounded-2xl overflow-hidden border border-purple-200/50 shadow-2xl animate-fade-in backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="p-6 border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(248, 250, 252, 0.1) 100%)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {campaignType}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Zap className="w-4 h-4 text-purple-500" />
                AI-powered campaign creation
              </p>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              color: "#1e40af",
            }}
          >
            🧠 Analyzing...
          </div>
        </div>
      </div>

      {/* Progress Content */}
      <div
        className="p-8 flex flex-col items-center justify-center min-h-[400px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(248, 250, 252, 0.05) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Progress Circle */}
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(99, 102, 241, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 314} 314`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Status */}
        <div className="text-center space-y-4 max-w-md">
          <h4 className="text-xl font-semibold text-gray-900">
            {progress === 100
              ? "🎉 Analysis Complete!"
              : "Building Your Campaign..."}
          </h4>

          {progress < 100 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="text-gray-600">
                {currentTask || "Analyzing your customer data..."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Transforming into campaign builder...
              </p>
              <div
                className="rounded-xl p-4 border border-white/30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">✓ Customer Analysis:</span>
                    <span className="text-green-600 font-medium">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">✓ Target Audience:</span>
                    <span className="text-green-600 font-medium">
                      {estimatedReach}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">
                      ✓ Campaign Architecture:
                    </span>
                    <span className="text-green-600 font-medium">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
