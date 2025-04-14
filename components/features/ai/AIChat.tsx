"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleChat } from "@/lib/redux/slices/uiSlice";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const dispatch = useAppDispatch();
  const { chatOpen } = useAppSelector((state) => state.ui);

  // Local state for backward compatibility
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your Kigo AI Assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync local state with Redux state
  useEffect(() => {
    setIsOpen(chatOpen);
  }, [chatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    dispatch(toggleChat());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = { role: "user", content: inputMessage.trim() };
    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setIsLoading(true);

    setTimeout(() => {
      const aiResponses = [
        "I can help you with that! Let me look into it for you.",
        "Based on your campaign metrics, I recommend focusing on email personalization to improve open rates.",
        "Your customer feedback analysis shows that product quality is consistently mentioned as a strength.",
        "I've analyzed your data and identified three key opportunities for growth.",
        "Let me generate a report for you. I'll have that ready in just a moment.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: Message = { role: "assistant", content: randomResponse };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-30"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-30 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-primary text-white flex justify-between items-center">
            <h3 className="font-semibold">Kigo AI Assistant</h3>
            <button
              onClick={handleToggle}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary-light text-primary rounded-tr-none"
                      : "bg-blue-50 text-blue-800 border border-blue-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]">
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="ml-2 text-sm text-blue-800">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 bg-white"
          >
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className={`bg-primary text-white px-3 py-2 rounded-r-md ${
                  !inputMessage.trim() || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-dark"
                }`}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
