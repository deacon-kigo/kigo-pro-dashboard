"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface ThinkingStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  reasoning?: string;
  result?: any;
}

interface ThinkingStepsProps {
  steps: ThinkingStep[];
  currentPhase: string;
}

export function ThinkingSteps({ steps, currentPhase }: ThinkingStepsProps) {
  if (steps.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">AI Assistant</h3>
          <p className="text-xs text-gray-600">{currentPhase}</p>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThinkingStepItem step={step} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function ThinkingStepItem({ step }: { step: ThinkingStep }) {
  return (
    <div className="flex gap-3">
      {/* Status Indicator */}
      <div className="flex-shrink-0 pt-1">
        {step.status === "completed" ? (
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
        ) : step.status === "in_progress" ? (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
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
          <div className="mt-1 text-xs text-gray-600 bg-white/60 rounded p-2">
            {step.reasoning}
          </div>
        )}

        {step.result && (
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
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
