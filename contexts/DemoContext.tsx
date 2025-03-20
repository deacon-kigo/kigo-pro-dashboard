'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import demoConfigs from '../config/demoConfigs';

// Define types for our context
type Role = 'merchant' | 'support' | 'admin';
type Scenario = 'default' | 'campaign-creation' | 'support-flow';
type ClientId = 'deacons-pizza' | 'cvs' | 'generic';
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export interface DemoState {
  role: Role;
  scenario: Scenario;
  clientId: ClientId;
  clientName: string;
  theme: Theme;
  themeMode: ThemeMode;
}

interface DemoContextType extends DemoState {
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
  updateDemoState: (updates: Partial<DemoState>) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initial state with defaults
  const [demoState, setDemoState] = useState<DemoState>({
    role: 'merchant',
    scenario: 'default',
    clientId: 'deacons-pizza',
    clientName: 'Deacon\'s Pizza',
    theme: demoConfigs.getThemeForClient('deacons-pizza'),
    themeMode: 'light'
  });
  
  // Function to update state partially
  const updateDemoState = (updates: Partial<DemoState>) => {
    setDemoState(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Update state based on URL parameters
  useEffect(() => {
    if (searchParams) {
      const role = searchParams.get('role') as Role | null;
      const scenario = searchParams.get('scenario') as Scenario | null;
      const clientId = searchParams.get('client') as ClientId | null;
      const themeMode = searchParams.get('theme') as ThemeMode | null;
      
      const updates: Partial<DemoState> = {};
      
      if (role && ['merchant', 'support', 'admin'].includes(role)) {
        updates.role = role;
      }
      
      if (scenario && demoConfigs.scenarios[scenario]) {
        updates.scenario = scenario;
      }
      
      if (clientId && demoConfigs.clients[clientId]) {
        updates.clientId = clientId;
        updates.clientName = demoConfigs.clients[clientId].name;
        updates.theme = demoConfigs.getThemeForClient(clientId);
      }
      
      if (themeMode && ['light', 'dark'].includes(themeMode)) {
        updates.themeMode = themeMode;
      }
      
      if (Object.keys(updates).length > 0) {
        updateDemoState(updates);
      }
    }
  }, [searchParams]);
  
  const contextValue = {
    ...demoState,
    setDemoState,
    updateDemoState
  };
  
  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}; 