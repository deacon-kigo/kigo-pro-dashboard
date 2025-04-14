"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  MicrophoneIcon,
  PhotoIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi there! 👋 I'm your AI assistant. How can I help you with your campaigns today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      // Simulate AI response after a delay
      setTimeout(() => {
        const aiResponses = [
          "I'm analyzing your campaigns and I notice your weekend promotions have higher engagement. Would you like me to generate optimized campaign schedules?",
          "Based on your data, I recommend focusing on the summer sale campaign which is currently your top performer.",
          "Looking at your metrics, it seems like you could increase conversion rates by refining your target audience. Would you like me to suggest some strategies?",
          "I've checked your campaign calendar and noticed you don't have anything planned for the upcoming holiday season. Would you like me to help draft some ideas?",
        ];

        const randomResponse =
          aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const aiMessage: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"} shadow-lg flex items-center justify-center text-white z-50 transition-all duration-300`}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-primary text-white">
          <div className="flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">Kigo AI Assistant</h3>
          </div>
          <button
            onClick={toggleChat}
            className="text-white/80 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          style={{ maxHeight: "400px" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-blue-50 text-blue-800 border border-blue-100 shadow-sm rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-400"}`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-blue-50 border border-blue-100 shadow-sm rounded-tl-none">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-100 bg-white"
        >
          <div className="flex">
            <div className="flex space-x-1 mr-2">
              <button
                type="button"
                className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-100"
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-100"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-100"
              >
                <PaperClipIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Kigo AI..."
                className="w-full px-4 py-2.5 pl-4 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary p-1.5 rounded-full hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
