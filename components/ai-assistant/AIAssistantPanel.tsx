'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useDemo } from '../../contexts/DemoContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  responseOptions?: ResponseOption[];
  attachments?: Attachment[];
  severity?: 'info' | 'warning' | 'success' | 'error';
}

interface ResponseOption {
  text: string;
  value: string;
}

interface Attachment {
  type: 'image' | 'chart' | 'file';
  url: string;
  title: string;
  description?: string;
}

interface AIAssistantPanelProps {
  onSend?: (message: string) => void;
  onOptionSelected?: (optionId: string) => void;
}

// Initial messages for the campaign creation demo
const campaignCreationInitialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: "Welcome back to Kigo Pro! I've been analyzing your Deacon's Pizza data and noticed an opportunity to boost your weekday dinner sales. Looking at your business data, your Tuesday-Thursday dinner orders are significantly lower than weekend sales, but they represent a growth opportunity.",
    timestamp: new Date(Date.now() - 60000),
    responseOptions: [
      { text: "Tell me more about this opportunity", value: "tell-more" },
      { text: "What do you recommend?", value: "recommendation" }
    ]
  },
  {
    id: '2',
    type: 'ai',
    content: "I recommend creating a targeted campaign for weekday family dinners. Your data shows families make up 45% of your weekend business but only 22% of weekday orders. A weekday family dinner special could drive significant growth without requiring additional staff or equipment.",
    timestamp: new Date(),
    responseOptions: [
      { text: "Create a weekday dinner campaign", value: "create-campaign" },
      { text: "What audience should we target?", value: "tell-more" }
    ]
  }
];

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  onSend,
  onOptionSelected
}) => {
  const { clientId } = useDemo();
  const [messages, setMessages] = useState<Message[]>(campaignCreationInitialMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages - no need to recreate every render
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Run effect only when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Memoize the sendMessage function to avoid recreation on each render
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm analyzing your request and generating a response based on your marketing data...",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
      
      if (onSend) {
        onSend(newMessage);
      }
    }, 2000);
  }, [newMessage, onSend]);

  // Memoize option click handler to avoid recreation on each render
  const handleOptionClick = useCallback((value: string) => {
    // Add user's choice as a message
    const option = messages
      .flatMap(m => m.responseOptions || [])
      .find(opt => opt.value === value);
    
    if (option) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: option.text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsThinking(true);
      
      // Generate appropriate AI response based on option selected
      setTimeout(() => {
        let aiResponse: Message;
        
        switch(value) {
          case 'tell-more':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "Your weekday dinner business represents a big opportunity. While weekend sales average $3,833 per day, weekday sales are only $1,862. By targeting families with a weekday special, you could potentially increase weekday revenue by 35-40%.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's create a campaign", value: "create-campaign" },
                { text: "What kind of campaign would work best?", value: "campaign-suggestion" }
              ]
            };
            break;
            
          case 'recommendation':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "I recommend a 'Family Weekday Special' campaign. Based on your sales data and customer segments, this could drive significant growth. I can generate complete campaign options with creative assets, targeting strategies, and performance predictions tailored to your business.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Generate campaign options", value: "create-campaign" },
                { text: "What results can I expect?", value: "expected-results" }
              ]
            };
            break;
            
          case 'create-campaign':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "Great! I've created three complete campaign options for you. Each includes the offer structure, promotional copy, visual designs, and targeting strategy. You can view and compare them in the canvas.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Select the Family Dinner Bundle", value: "select-campaign" },
                { text: "How did you create these options?", value: "campaign-explanation" }
              ]
            };
            if (onOptionSelected) onOptionSelected('create-campaign');
            break;
            
          case 'show-data':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "I'm showing you the business intelligence data in the canvas. You can see the sales by day of week, performance trends, competitor activity, and customer segments. The data clearly shows the weekday dinner opportunity.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's create a campaign", value: "create-campaign" },
                { text: "What should I focus on?", value: "focus-suggestion" }
              ]
            };
            break;

          case 'select-campaign':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "You've selected the Family Dinner Bundle campaign. I've prepared all the creative assets you'll need including social media graphics, email templates, and in-store materials. You can customize any of these assets to perfectly match your brand.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Customize these assets", value: "customize-assets" },
                { text: "These look great as is", value: "keep-assets" }
              ]
            };
            if (onOptionSelected) onOptionSelected('select-campaign');
            break;

          case 'customize-assets':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "Based on your selections, I've updated all assets and calculated performance predictions. You can see the expected views, redemptions, revenue, and ROI in the performance dashboard.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Review performance details", value: "review-performance" },
                { text: "Optimize for better results", value: "optimize-campaign" }
              ]
            };
            if (onOptionSelected) onOptionSelected('customize-assets');
            break;

          case 'review-performance':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "Your campaign is ready to launch! I've prepared everything you need including distribution schedule, performance tracking, and a one-click launch option.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Launch campaign", value: "launch-campaign" },
                { text: "Schedule for later", value: "schedule-campaign" }
              ]
            };
            if (onOptionSelected) onOptionSelected('review-performance');
            break;
          
          default:
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "I understand. Let me know how else I can help with your marketing campaign.",
              timestamp: new Date()
            };
        }
        
        setMessages(prev => [...prev, aiResponse]);
        setIsThinking(false);
      }, 1500);
    }
  }, [messages, onOptionSelected]);

  // Memoize the form submit handler
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">AI Marketing Assistant</h3>
        <p className="text-sm text-gray-500">Ask me anything about creating your campaign</p>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onOptionSelected={handleOptionClick} 
            />
          ))}
          
          {isThinking && <AIThinkingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <form 
            className="flex items-center space-x-2"
            onSubmit={handleFormSubmit}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Chat Message Component - memoize to prevent unnecessary re-renders
const ChatMessage = React.memo<{
  message: Message;
  onOptionSelected?: (optionId: string) => void;
}>(({ message, onOptionSelected }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-3/4 rounded-lg p-3 ${
          message.type === 'user' 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        
        {/* Response Options */}
        {message.responseOptions && (
          <div className="mt-3 space-y-2">
            {message.responseOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionSelected && onOptionSelected(option.value)}
                className="w-full py-2 px-3 bg-white text-blue-600 hover:bg-blue-50 rounded text-sm text-left transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
        
        {/* Attachments */}
        {message.attachments && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="bg-white rounded p-2 border border-gray-200">
                {attachment.type === 'image' && (
                  <img 
                    src={attachment.url} 
                    alt={attachment.title} 
                    className="w-full h-auto rounded"
                  />
                )}
                <div className="mt-1">
                  <p className="text-xs font-medium">{attachment.title}</p>
                  {attachment.description && (
                    <p className="text-xs text-gray-500">{attachment.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-1 text-right">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

ChatMessage.displayName = 'ChatMessage';

// AI Thinking Indicator - removed clientId dependency
const AIThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 animate-pulse">
      <div className="h-12 w-12 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
        <span className="text-blue-600 font-bold">AI</span>
      </div>
      <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
          <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Analyzing business data...
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel; 