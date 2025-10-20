"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/lib/redux/hooks";
import { Card } from "@/components/ui/card";

/**
 * Agent Mode Indicator
 *
 * Displays at the top of the UI when AI is autonomously filling form fields
 * Mimics Perplexity's agent mode indicator with progress and status
 */
export function AgentModeIndicator() {
  const agentMode = useAppSelector((state) => state.agentMode);

  if (!agentMode.isActive) {
    return null;
  }

  const progressPercent =
    agentMode.progress.total > 0
      ? (agentMode.progress.current / agentMode.progress.total) * 100
      : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card
          className="px-6 py-3 shadow-lg border-2"
          style={{
            background: "linear-gradient(to right, #EFF6FF, #F0F9FF, #EFF6FF)",
            borderColor: "#3B82F6",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          <div className="flex items-center gap-4">
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom right, #3B82F6, #2563EB)",
              }}
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </motion.div>

            {/* Status Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  AI Agent Mode
                </span>
                <div className="flex items-center gap-1">
                  {agentMode.progress.total > 0 && (
                    <span className="text-xs text-gray-600">
                      {agentMode.progress.current} / {agentMode.progress.total}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600">{agentMode.message}</p>
            </div>

            {/* Progress Bar */}
            {agentMode.progress.total > 0 && (
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(to right, #3B82F6, #2563EB)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Current Action */}
            {agentMode.currentAction && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-blue-200">
                <motion.div
                  className="w-2 h-2 rounded-full bg-blue-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-xs font-medium text-gray-700">
                  {agentMode.currentAction}
                </span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Field Highlight Wrapper
 *
 * Wraps form fields to show shining border when being filled by AI
 */
export function AgentFieldHighlight({
  fieldId,
  children,
}: {
  fieldId: string;
  children: React.ReactNode;
}) {
  const agentMode = useAppSelector((state) => state.agentMode);

  const isActive =
    agentMode.isActive &&
    (agentMode.activeField === fieldId ||
      agentMode.fieldsBeingFilled.includes(fieldId));

  const isCompleted = agentMode.completedFields.includes(fieldId);

  return (
    <div className="relative">
      {/* Shining Border when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "8px",
            border: "2px solid transparent",
            background:
              "linear-gradient(90deg, #3B82F6, #8B5CF6, #3B82F6) border-box",
            backgroundSize: "200% 100%",
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
            boxShadow: [
              "0 0 10px rgba(59, 130, 246, 0.4)",
              "0 0 20px rgba(59, 130, 246, 0.6)",
              "0 0 10px rgba(59, 130, 246, 0.4)",
            ],
          }}
          transition={{
            backgroundPosition: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
            boxShadow: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      )}

      {/* Completed Checkmark */}
      {isCompleted && !isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div
            className="flex items-center justify-center w-6 h-6 rounded-full shadow-md"
            style={{
              background: "linear-gradient(to bottom right, #059669, #10B981)",
            }}
          >
            <CheckCircleIcon className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}

      {children}
    </div>
  );
}
