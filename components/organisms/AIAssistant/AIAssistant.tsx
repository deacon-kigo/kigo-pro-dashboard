'use client';

import React, { useState, useEffect } from 'react';
import { SparklesIcon, ArrowRightIcon, LightBulbIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ChartBarIcon, RocketLaunchIcon, MicrophoneIcon, PaperAirplaneIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface SuggestionProps {
  title: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

const Suggestion = ({ title, onClick, icon }: SuggestionProps) => (
  <button 
    onClick={onClick}
    className="flex items-center bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors border border-white/20 group"
  >
    {icon && <span className="mr-2 text-primary group-hover:scale-110 transition-transform">{icon}</span>}
    <span>{title}</span>
    <ArrowRightIcon className="w-3.5 h-3.5 ml-1.5 text-primary opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
  </button>
);

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'insight' | 'recommendation' | 'alert';
  icon: React.ReactNode;
}

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'assistant' | 'insights'>('assistant');
  const [personalizedSuggestion, setPersonalizedSuggestion] = useState('');
  
  useEffect(() => {
    // Get current hour to personalize suggestions
    const hour = new Date().getHours();
    
    // Generate personalized suggestion based on time of day
    if (hour < 12) {
      setPersonalizedSuggestion("Analyze morning campaign performance");
    } else if (hour < 17) {
      setPersonalizedSuggestion("Plan weekend marketing strategy");
    } else {
      setPersonalizedSuggestion("Review today's metrics");
    }
  }, []);
  
  const insights: AIInsight[] = [
    {
      id: '1',
      title: 'Weekend campaigns performing better',
      description: 'Your weekend promotions have 3.5x higher engagement rates. Recommend shifting 15% more budget.',
      type: 'insight',
      icon: <ChartBarIcon className="w-5 h-5 text-blue-500" />
    },
    {
      id: '2',
      title: 'Competitor reduced spend',
      description: 'Widget Co reduced marketing spend by 15%. Good time to capture market share.',
      type: 'recommendation',
      icon: <RocketLaunchIcon className="w-5 h-5 text-purple-500" />
    }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    console.log(`Suggestion clicked: ${suggestion}`);
    // In a real app, this would trigger AI to perform an action
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log(`AI Assistant query: ${inputValue}`);
      // In a real app, this would send the query to an LLM
      setInputValue('');
    }
  };

  return (
    <div className={`${isExpanded ? 'p-4' : 'p-3'} transition-all duration-200 bg-gradient-to-br from-primary-light/80 to-pastel-purple/60 backdrop-blur-md rounded-xl border border-white/20 shadow-sm`}>
      <div className="flex items-start">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
          <SparklesIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-text-dark">Hey Jane, I'm your AI Assistant</h3>
              <p className="text-xs text-text-muted">Personalized insights for your campaigns</p>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 p-1 rounded-md hover:bg-white/20 transition-colors"
            >
              {isExpanded ? (
                <XMarkIcon className="w-4 h-4 text-text-muted" />
              ) : (
                <PlusIcon className="w-4 h-4 text-text-muted" />
              )}
            </button>
          </div>
          
          {isExpanded && (
            <div className="mt-4">
              <div className="flex border-b border-white/20 mb-3">
                <button
                  className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'assistant' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-muted hover:text-text-dark'
                  }`}
                  onClick={() => setActiveTab('assistant')}
                >
                  Assistant
                </button>
                <button
                  className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'insights' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-text-muted hover:text-text-dark'
                  }`}
                  onClick={() => setActiveTab('insights')}
                >
                  Insights
                </button>
              </div>
              
              {activeTab === 'assistant' ? (
                <>
                  <p className="text-xs mb-3">
                    I've analyzed your campaigns and noticed your <span className="font-medium">Summer Sale Promotion</span> has 
                    3.5x higher engagement on weekends. Consider adjusting budget allocation.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="mt-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me anything about your campaigns..."
                        className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                        <button 
                          type="submit" 
                          className="text-primary p-1 rounded-md hover:bg-primary/10 transition-colors disabled:opacity-50"
                          disabled={!inputValue.trim()}
                        >
                          <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-2">
                  {insights.map((insight) => (
                    <div key={insight.id} className="bg-white/80 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start">
                        <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center mr-2 shrink-0">
                          {insight.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-xs">{insight.title}</h4>
                          <p className="text-xs text-text-muted mt-0.5">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3 pl-12">
          <Suggestion 
            title={personalizedSuggestion}
            onClick={() => handleSuggestionClick(personalizedSuggestion)}
            icon={<ChartBarIcon className="w-4 h-4" />}
          />
          <Suggestion 
            title="Run performance report" 
            onClick={() => handleSuggestionClick('Run performance report')} 
            icon={<RocketLaunchIcon className="w-4 h-4" />}
          />
        </div>
      )}
    </div>
  );
} 