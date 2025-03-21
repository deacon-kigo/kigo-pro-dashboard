'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useDemo } from '../../../contexts/DemoContext';
import AIAssistantPanel from '../../../components/ai-assistant/AIAssistantPanel';
import DynamicCanvas from '../../../components/campaign-creation/DynamicCanvas';
import Card from '../../../components/shared/Card';

// Define ViewType locally to match DynamicCanvas
type ViewType = 
  'business-intelligence' | 
  'campaign-selection' | 
  'asset-creation' | 
  'performance-prediction' | 
  'launch-control';

export default function AICampaignCreation() {
  const router = useRouter();
  const { clientId, setClientId } = useDemo();
  const [currentView, setCurrentView] = useState<ViewType>('business-intelligence');
  const [greeting, setGreeting] = useState('Good morning');

  // Memoize the greeting calculation to avoid recalculation on every render
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }, []);

  // Set client ID and greeting only once on mount
  useEffect(() => {
    setClientId('deacons-pizza');
    setGreeting(getGreeting());
  }, [setClientId, getGreeting]);

  // Handle option selected from AI Assistant Panel - memoize to avoid recreation
  const handleOptionSelected = useCallback((optionId: string) => {
    if (optionId === 'tell-more' || optionId === 'recommendation') {
      setCurrentView('business-intelligence');
    } else if (optionId === 'create-campaign') {
      setCurrentView('campaign-selection');
    } else if (optionId === 'customize-assets') {
      setCurrentView('asset-creation');
    } else if (optionId === 'launch-campaign') {
      setCurrentView('launch-control');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/demos/deacons-pizza" className="flex items-center text-gray-500 hover:text-gray-700">
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-2"
              >
                DP
              </div>
              <span className="font-medium text-gray-700">Deacon's Pizza</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Campaign Creation</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Greeting Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-4">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white">{greeting}, Jane!</h1>
            <p className="text-white/90 mt-1">Let's create a new marketing campaign together</p>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-screen-2xl mx-auto p-6">
          {/* AI Assistant Panel - Left Side */}
          <div className="lg:col-span-4 flex flex-col">
            <Card className="flex-1 p-0 overflow-hidden flex flex-col">
              <AIAssistantPanel 
                onOptionSelected={handleOptionSelected}
              />
            </Card>
          </div>

          {/* Dynamic Canvas - Right Side */}
          <div className="lg:col-span-8 flex flex-col">
            <Card className="flex-1 p-0 overflow-hidden">
              <DynamicCanvas 
                initialView={currentView}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 