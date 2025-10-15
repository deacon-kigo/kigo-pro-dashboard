"use client";

import React from "react";
import { useCoAgent, useCopilotChat } from "@copilotkit/react-core";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { OfferManagerState } from "./types";

export default function OfferConversationView() {
  const { messages, append, isLoading } = useCopilotChat();
  const { state } = useCoAgent<OfferManagerState>({
    name: "supervisor",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (message.trim()) {
      append({
        role: "user",
        content: message,
      });
      e.currentTarget.reset();
    }
  };

  return (
    <div className="space-y-4">
      {/* Message Thread */}
      <Card className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
        {(!messages || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <SparklesIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              What offer would you like to create?
            </h3>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Describe your goals in natural language. I'll help you create the
              perfect promotional offer.
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
              <p className="text-xs text-gray-700 font-medium mb-2">
                Example prompts:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 text-left">
                <li>
                  • "Create a 20% discount to boost Q4 sales for new customers"
                </li>
                <li>• "I need a cashback offer for loyal members"</li>
                <li>• "Help me set up a seasonal promotion"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4">
          {messages &&
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

          {/* AI Thinking Indicator (Perplexity Pattern) */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg rounded-bl-none border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-sm text-gray-700">
                    {state?.current_phase === "goal_setting" &&
                      "Understanding your goals..."}
                    {state?.current_phase === "offer_creation" &&
                      "Creating recommendations..."}
                    {state?.current_phase === "campaign_setup" &&
                      "Setting up campaign..."}
                    {state?.current_phase === "validation" &&
                      "Validating offer..."}
                    {state?.current_phase === "approval" &&
                      "Preparing for approval..."}
                    {!state?.current_phase && "Thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Single Input Field (Perplexity Style) */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          name="message"
          placeholder="Describe what you want to achieve with this offer..."
          className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
          autoComplete="off"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Sending...</span>
            </div>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </div>
  );
}
