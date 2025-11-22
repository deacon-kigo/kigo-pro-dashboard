"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export interface Step {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  reasoning?: string;
  result?: any;
}

interface ThinkingStepsProps {
  steps: Step[];
  currentPhase: string;
}

export function ThinkingSteps({ steps, currentPhase }: ThinkingStepsProps) {
  if (steps.length === 0) return null;

  const hasInProgressStep = steps.some((step) => step.status === "in_progress");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ShineBorder
        isActive={hasInProgressStep}
        simulateLoading={true}
        loadingDuration={3}
        borderWidth={2}
        className="w-full"
      >
        <Card
          className="p-4 border border-blue-200 shadow-sm"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(to bottom right, #2563EB, #4F46E5)",
              }}
            >
              <SparklesIcon className="w-5 h-5" style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                AI Assistant
              </h3>
              <p className="text-xs text-gray-600">{currentPhase}</p>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.6,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <ThinkingStepItem step={step} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      </ShineBorder>
    </motion.div>
  );
}

function ThinkingStepItem({ step }: { step: Step }) {
  return (
    <div className="flex gap-3">
      {/* Status Indicator */}
      <div className="flex-shrink-0 pt-1">
        {step.status === "completed" ? (
          <CheckCircleIcon className="w-5 h-5" style={{ color: "#059669" }} />
        ) : step.status === "in_progress" ? (
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: "#2563EB", borderTopColor: "transparent" }}
          />
        ) : (
          <div
            className="w-5 h-5 border-2 rounded-full"
            style={{ borderColor: "#D1D5DB" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div
          className={`text-sm font-medium ${
            step.status === "completed"
              ? "text-gray-900"
              : step.status === "in_progress"
                ? "text-blue-900"
                : "text-gray-500"
          }`}
        >
          {step.title}
        </div>

        {step.reasoning && (
          <div className="mt-1 text-xs text-gray-700 bg-gray-50 rounded p-2 border border-gray-100">
            {step.reasoning}
          </div>
        )}

        {step.result && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Recommendation:
            </div>
            <div className="text-sm text-gray-900">{step.result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
