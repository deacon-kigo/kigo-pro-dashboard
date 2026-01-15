"use client";

/**
 * OfferConversationView - Chat interface for offer creation with markdown support
 * Displays conversation history with rich formatting
 */

import React from "react";
import { Message } from "@/lib/copilot-stubs";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface OfferConversationViewProps {
  messages: Message[];
  className?: string;
}

const MessageBubble: React.FC<{
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}> = ({ role, content, timestamp }) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-3 shadow-sm",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-200 text-gray-800"
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for markdown rendering
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-3 text-gray-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-medium mb-2 text-gray-800">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2 text-gray-700 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 text-sm">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700">{children}</em>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto text-gray-800">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-3 rounded overflow-x-auto mb-2">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-2">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-2">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white divide-y divide-gray-200">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 text-sm text-gray-700">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        {timestamp && (
          <div
            className={cn(
              "text-xs mt-2",
              isUser ? "text-blue-200" : "text-gray-400"
            )}
          >
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export const OfferConversationView: React.FC<OfferConversationViewProps> = ({
  messages,
  className,
}) => {
  const conversationRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={conversationRef}
      className={cn("overflow-y-auto space-y-4 p-4", className)}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <Bot className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Start Your Offer Journey
          </h3>
          <p className="text-sm text-gray-500 max-w-md">
            Ask me anything about creating offers, campaign strategies, or best
            practices. I'm here to help you build effective promotions!
          </p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          // Handle different message types from CopilotKit
          const role = msg.role === "user" ? "user" : "assistant";
          const content =
            typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content);

          return (
            <MessageBubble
              key={`msg-${idx}-${msg.id || ""}`}
              role={role}
              content={content}
              timestamp={msg.createdAt}
            />
          );
        })
      )}
    </div>
  );
};

export default OfferConversationView;
