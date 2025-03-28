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
import { buildDemoUrl } from '@/lib/utils';

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
    setClientId('deacons');
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
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto">
          <Card className="flex justify-between items-center p-3">
            <Link href={buildDemoUrl('deacons', 'pizza')} className="flex items-center text-gray-500 hover:text-primary transition-colors">
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="text-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 text-transparent bg-clip-text">{greeting}, Deacon</h2>
              <p className="text-sm text-gray-500">Let's create a new marketing campaign</p>
            </div>
            <div className="w-32"></div> {/* Empty div for alignment */}
          </Card>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="flex-1 max-w-screen-2xl mx-auto px-3 sm:px-4 pb-3 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
          {/* AI Assistant Panel - Left Side */}
          <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
            <Card className="flex-1 p-0 overflow-hidden flex flex-col">
              <AIAssistantPanel 
                onOptionSelected={handleOptionSelected}
              />
            </Card>
          </div>

          {/* Dynamic Canvas - Right Side */}
          <div className="lg:col-span-8 h-full overflow-hidden flex flex-col">
            <Card className="flex-1 p-0 overflow-hidden flex flex-col">
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