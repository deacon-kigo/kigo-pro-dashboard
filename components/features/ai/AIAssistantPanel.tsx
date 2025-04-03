'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useDemo } from '../../contexts/DemoContext';
import ReactMarkdown from 'react-markdown';

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
    content: "I've analyzed your restaurant data and found an opportunity to boost weekday dinner sales. Your Tue-Thu dinner orders are significantly lower than weekends, representing a solid growth opportunity.",
    timestamp: new Date(Date.now() - 60000),
    responseOptions: [
      { text: "Tell me more about this opportunity", value: "tell-more" },
      { text: "What do you recommend?", value: "recommendation" }
    ]
  },
  {
    id: '2',
    type: 'ai',
    content: "I recommend a targeted campaign for weekday family dinners. Families make up 45% of your weekend business but only 22% of weekday orders. A weekday family special could drive growth without requiring additional resources.",
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
    
    // Check for specific competitor query
    const isCompetitorQuery = newMessage.toLowerCase().includes('competitor') || 
                             newMessage.toLowerCase().includes('competition');
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse: Message;
      
      if (isCompetitorQuery) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Based on my analysis of the local pizza market, here's what I can tell you about your competitors:

1. **Competitive Landscape**: There are 3 major competitors within your 5-mile radius: Pizza Palace, Little Italy, and Crust & Co. Pizza Palace is your most aggressive competitor, accounting for approximately 45% of competitor promotions in your area.

2. **Promotion Trends**: I've noticed a significant increase in competitor promotional activity over the past 5 months. In January, competitors ran 3 promotions while you ran 2. By May, they've ramped up to 6 promotions while you've decreased to just 1. This explains some of the pressure on your weekday dinner sales.

3. **Key Differentiators**:
• Pizza Palace: Focuses on value deals (2 medium pizzas for $18)
• Little Italy: Emphasizes authentic ingredients and premium pricing
• Crust & Co: Targets the lunch crowd with rapid service guarantees

4. **Competitive Advantages**: Your customer satisfaction scores (4.7/5) exceed all competitors (avg 4.2/5). Your family-size portions are also 15% larger than competitors at a similar price point, representing an under-marketed advantage.

5. **Recommended Strategy**: Your weekday family dinner special directly counters Pizza Palace's primary value proposition while leveraging your portion size advantage. I suggest emphasizing the "more food for your family" angle in marketing materials.

Would you like me to analyze any specific competitor in more detail, or would you prefer recommendations on how to better position against them?`,
          timestamp: new Date(),
          responseOptions: [
            { text: "Tell me about Pizza Palace", value: "pizza-palace" },
            { text: "How should we compete?", value: "compete-strategy" }
          ]
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm analyzing your request and generating a response based on your marketing data...",
          timestamp: new Date()
        };
      }
      
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
              content: "Your weekday dinner sales average $1,862 vs. weekend sales of $3,833. A family-focused weekday promotion could increase weekday revenue by 35-40% based on our analysis.",
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
              content: "I recommend a 'Family Weekday Special' campaign. I can generate complete options with creative assets, targeting strategies, and performance predictions tailored to your business.",
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
              content: "I've created three campaign options for you, each with offer structure, promo copy, visuals, and targeting. View them in the canvas to compare.",
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
              content: "Here's your business intelligence data showing sales by day, performance trends, competitor activity, and customer segments. The weekday dinner opportunity is clear.",
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
              content: "Family Dinner Bundle selected. All creative assets are ready: social media, email templates, and in-store materials. Customize any asset to match your brand.",
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
              content: "Assets updated based on your selections. Performance predictions are ready with expected views, redemptions, revenue, and ROI.",
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
              content: "Your campaign is ready to launch with distribution schedule, performance tracking, and one-click launch option.",
              timestamp: new Date(),
              responseOptions: [
                { text: "Launch campaign", value: "launch-campaign" },
                { text: "Schedule for later", value: "schedule-campaign" }
              ]
            };
            if (onOptionSelected) onOptionSelected('review-performance');
            break;
            
          case 'pizza-palace':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: `Pizza Palace has been your strongest competitor for the past 18 months. Here's my detailed analysis:

1. **Pricing Strategy**: They operate at an average 12% lower price point than your menu, focusing on volume over margins.

2. **Target Audience**: Primarily budget-conscious families and students; 65% of their customer base consists of these two segments.

3. **Marketing Approach**: Heavy emphasis on limited-time offers and flash sales. They run twice as many promotions as the industry average.

4. **Weaknesses**:
• Customer satisfaction scores (3.9/5) are below yours (4.7/5)
• Portion sizes are 15% smaller than yours for comparable menu items
• Limited premium options for higher-end customers

5. **Recent Changes**: They've just launched a new mobile app with loyalty program, which has boosted their repeat customer rate by approximately 8% in the test areas.

Your family weekday special effectively counters their main value proposition while highlighting your superior portion sizes and quality.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's create our campaign", value: "create-campaign" },
                { text: "Tell me about other competitors", value: "other-competitors" }
              ]
            };
            break;
            
          case 'compete-strategy':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: `Based on my competitive analysis, here are my recommended strategies to position against your competitors:

1. **Value Messaging**: Emphasize "family-sized portions" at competitive prices. Your portions are 15% larger than Pizza Palace's at only a slightly higher price point.

2. **Quality Differentiation**: Highlight your superior customer satisfaction scores (4.7/5 vs. competitor average of 4.2/5) in marketing materials.

3. **Targeting Opportunity**: Focus on families during weekday dinners - this segment is underserved by competitors who focus primarily on weekend business.

4. **Promotional Calendar**: Increase your promotional frequency to match competitors (currently they run 6 promotions to your 1). A consistent weekday family special would be ideal.

5. **Digital Strategy**: Develop a more visible online ordering experience; competitors are gaining ground through enhanced digital presence.

The Family Weekday Special campaign addresses most of these strategies, focusing on your strengths while targeting a competitive gap in the market.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Create this campaign now", value: "create-campaign" },
                { text: "What creative assets do you suggest?", value: "creative-assets" }
              ]
            };
            break;
            
          case 'other-competitors':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: `Let me share insights on your other key competitors:

**Little Italy**
• Positioning: Authentic, premium Italian pizza with imported ingredients
• Price Point: 20-25% higher than your menu
• Target Audience: Higher-income families and professionals, 35-55 age range
• Strengths: Strong brand perception of authenticity and quality
• Weaknesses: Limited appeal to value-conscious customers; slower delivery times

**Crust & Co**
• Positioning: Fast, convenient lunch option with express service guarantee
• Price Point: Similar to yours for individual items, fewer family/group deals
• Target Audience: Office workers, professionals on lunch breaks
• Strengths: 10-minute service guarantee drives loyalty for lunch crowd
• Weaknesses: Lower dinner traffic; limited weekend business

Neither of these competitors directly targets the weekday family dinner segment, which represents your biggest opportunity. Little Italy is too premium-focused, while Crust & Co is lunch-oriented.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Create our family dinner campaign", value: "create-campaign" },
                { text: "What other opportunities do you see?", value: "more-opportunities" }
              ]
            };
            break;
            
          case 'creative-assets':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: `For your Family Weekday Special campaign, I recommend these creative approaches:

1. **Primary Visual**: Family-centered imagery showing abundant food portions that emphasize the "more food" value proposition.

2. **Key Messaging**: 
   • Headline: "Family Dinner, Sized for REAL Families"
   • Subheading: "15% More Food at a Price Your Family Will Love"

3. **Creative Elements**:
   • Show side-by-side portion comparison with generic "competitor" pizza
   • Use bright, warm colors that convey freshness and abundance
   • Include authentic customer testimonials about portion sizes

4. **Channel-Specific Adaptations**:
   • Social Media: Short video showing family reactions to the portion sizes
   • Email: Personalized offers with family name when possible
   • In-store: Large format posters emphasizing the size difference

I've prepared draft assets for all these formats that you can customize in the Asset Creation Workshop.`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Show me the assets", value: "customize-assets" },
                { text: "Create the campaign", value: "create-campaign" }
              ]
            };
            break;
            
          case 'more-opportunities':
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: `Beyond the Family Weekday Special, I see these additional opportunities:

1. **Weekend Lunch Gap**: Your weekend business is strong for dinner but underperforms at lunch compared to competitors. A weekend lunch bundle could drive incremental revenue.

2. **Online Ordering Enhancement**: Your online ordering flow has 15% higher abandonment than industry average. Streamlining this could improve conversion by 8-10%.

3. **Loyalty Program**: Your repeat customer rate (22%) lags behind the industry average (27%). A simple points-based system could close this gap.

4. **Student Special**: With 3 colleges within your delivery radius, there's potential to develop a student-focused offering for the upcoming semester.

5. **Premium Ingredients Line**: For targeting Little Italy's customer segment, a premium specialty pizza line could capture higher-end customers and increase average order value.

Would you like me to develop a campaign strategy for any of these opportunities after we complete the Family Weekday Special?`,
              timestamp: new Date(),
              responseOptions: [
                { text: "Let's focus on the family campaign first", value: "create-campaign" },
                { text: "Tell me more about the loyalty program", value: "loyalty-program" }
              ]
            };
            break;
          
          default:
            aiResponse = {
              id: Date.now().toString(),
              type: 'ai',
              content: "I understand. Let me know how else I can help with your campaign.",
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
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">AI Marketing Assistant</h3>
        <p className="text-sm text-gray-500">Ask me anything about creating your campaign</p>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
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
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
        <div className={`${
          message.type === 'user' 
            ? 'text-sm text-white' 
            : 'text-sm prose prose-sm prose-strong:font-bold prose-strong:text-gray-900 prose-ul:pl-5 prose-ul:my-1 prose-li:my-0 max-w-none'
        }`}>
          {message.type === 'user' ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown 
              components={{
                // Remove default margin from paragraphs
                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                // Customize list styles
                ul: ({node, ...props}) => <ul className="list-disc ml-4 my-1" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                // Make headings look better
                h1: ({node, ...props}) => <h1 className="text-base font-bold mt-2 mb-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mt-2 mb-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-base font-bold mt-2 mb-1" {...props} />,
                h5: ({node, ...props}) => <h5 className="text-base font-bold mt-2 mb-1" {...props} />,
                h6: ({node, ...props}) => <h6 className="text-base font-bold mt-2 mb-1" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        
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