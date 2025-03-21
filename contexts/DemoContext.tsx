'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import demoConfigs from '../config/demoConfigs';
import { usePathname as usePathnameInternal, useRouter as useRouterInternal, useSearchParams as useSearchParamsInternal } from 'next/navigation';
import { MockUser, getUserForContext, getTimeBasedGreeting, getPersonalizedSuggestions, getWelcomeBackMessage } from '../lib/userProfileUtils';

// Define types for our context
export type Role = 'merchant' | 'support' | 'admin';
export type Scenario = keyof typeof demoConfigs.scenarios;
export type ClientId = keyof typeof demoConfigs.clients;
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export interface DemoInstance {
  id: string;
  role: Role;
  scenario: Scenario;
  clientId: ClientId;
  clientName: string;
  themeMode: ThemeMode;
}

export interface DemoState {
  role: Role;
  scenario: Scenario;
  clientId: ClientId;
  clientName: string;
  theme: Theme;
  themeMode: ThemeMode;
  initialStep?: string;
  instanceHistory: DemoInstance[];
  currentInstanceIndex: number;
  userProfile: MockUser;
}

interface DemoContextType extends DemoState {
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
  updateDemoState: (updates: Partial<DemoState>) => void;
  setClientId: (clientId: ClientId) => void;
  getCurrentInstance: () => DemoInstance;
  saveCurrentInstance: () => void;
  loadInstance: (instanceId: string) => void;
  goToInstance: (index: number) => void;
  createInstanceUrl: (instance: Partial<DemoInstance>) => string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathnameInternal();
  const searchParams = useSearchParamsInternal();
  const router = useRouterInternal();
  
  // Ref to prevent loop between URL and state updates
  const isUpdatingFromUrl = useRef(false);
  const lastUrlState = useRef('');
  
  // Initial state with defaults
  const [demoState, setDemoState] = useState<DemoState>({
    role: 'merchant',
    scenario: 'default',
    clientId: 'deacons-pizza',
    clientName: 'Deacon\'s Pizza',
    theme: demoConfigs.getThemeForClient('deacons-pizza'),
    themeMode: 'light',
    initialStep: undefined,
    instanceHistory: [],
    currentInstanceIndex: -1,
    userProfile: getUserForContext('merchant', 'deacons-pizza')
  });
  
  // Function to update state partially - wrapped in useCallback
  const updateDemoState = useCallback((updates: Partial<DemoState>) => {
    setDemoState(prev => {
      const newState = { ...prev, ...updates };
      
      // If we're updating scenario, also update initialStep if available
      if (updates.scenario && demoConfigs.scenarios[updates.scenario]?.initialStep) {
        newState.initialStep = demoConfigs.scenarios[updates.scenario].initialStep;
      }

      // If we're updating role or clientId, also update userProfile
      if (updates.role || updates.clientId) {
        const role = updates.role || prev.role;
        const clientId = updates.clientId || prev.clientId;
        newState.userProfile = getUserForContext(role, clientId);
      }
      
      return newState;
    });
  }, []);
  
  // Helper function to set client ID and update related state - wrapped in useCallback
  const setClientId = useCallback((clientId: ClientId) => {
    updateDemoState({
      clientId,
      clientName: demoConfigs.clients[clientId].name,
      theme: demoConfigs.getThemeForClient(clientId)
    });
  }, [updateDemoState]);
  
  // Get current instance as a serializable object
  const getCurrentInstance = useCallback((): DemoInstance => {
    return {
      id: `${demoState.role}-${demoState.clientId}-${demoState.scenario}`,
      role: demoState.role,
      scenario: demoState.scenario,
      clientId: demoState.clientId,
      clientName: demoState.clientName,
      themeMode: demoState.themeMode
    };
  }, [demoState]);
  
  // Save current instance to history
  const saveCurrentInstance = useCallback(() => {
    const currentInstance = getCurrentInstance();
    
    setDemoState(prev => {
      // Don't add duplicate consecutive instances
      if (prev.currentInstanceIndex >= 0 && 
          prev.instanceHistory[prev.currentInstanceIndex].id === currentInstance.id) {
        return prev;
      }
      
      // Remove any future history if we're not at the end
      const newHistory = prev.instanceHistory.slice(0, prev.currentInstanceIndex + 1);
      newHistory.push(currentInstance);
      
      return {
        ...prev,
        instanceHistory: newHistory,
        currentInstanceIndex: newHistory.length - 1
      };
    });
  }, [getCurrentInstance]);
  
  // Load a specific instance by ID
  const loadInstance = useCallback((instanceId: string) => {
    setDemoState(prev => {
      const instance = prev.instanceHistory.find(inst => inst.id === instanceId);
      if (!instance) return prev;
      
      return {
        ...prev,
        role: instance.role,
        scenario: instance.scenario,
        clientId: instance.clientId,
        clientName: instance.clientName,
        themeMode: instance.themeMode,
        theme: demoConfigs.getThemeForClient(instance.clientId),
        initialStep: demoConfigs.scenarios[instance.scenario]?.initialStep
      };
    });
  }, []);
  
  // Navigate to a specific instance in history by index
  const goToInstance = useCallback((index: number) => {
    setDemoState(prev => {
      if (index < 0 || index >= prev.instanceHistory.length) return prev;
      
      const instance = prev.instanceHistory[index];
      return {
        ...prev,
        role: instance.role,
        scenario: instance.scenario,
        clientId: instance.clientId,
        clientName: instance.clientName,
        themeMode: instance.themeMode,
        theme: demoConfigs.getThemeForClient(instance.clientId),
        initialStep: demoConfigs.scenarios[instance.scenario]?.initialStep,
        currentInstanceIndex: index
      };
    });
  }, []);
  
  // Create a URL for a specific instance configuration
  const createInstanceUrl = useCallback((instance: Partial<DemoInstance>): string => {
    const params = new URLSearchParams();
    
    if (instance.role) params.set('role', instance.role);
    if (instance.scenario) params.set('scenario', instance.scenario);
    if (instance.clientId) params.set('client', instance.clientId);
    if (instance.themeMode) params.set('theme', instance.themeMode);
    
    return `${pathname}?${params.toString()}`;
  }, [pathname]);
  
  // Update state based on URL parameters
  useEffect(() => {
    if (!searchParams) return;
    
    // Create a string representation of the current URL parameters to check for changes
    const currentUrlState = searchParams.toString();
    
    // Skip if we're in the middle of a programmatic URL update or if URL hasn't actually changed
    if (isUpdatingFromUrl.current || currentUrlState === lastUrlState.current) return;
    
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
      updates.initialStep = demoConfigs.scenarios[scenario].initialStep;
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
      // If role or clientId is changing, update the userProfile
      if (updates.role || updates.clientId) {
        const role = updates.role || demoState.role;
        const clientId = updates.clientId || demoState.clientId;
        updates.userProfile = getUserForContext(role, clientId);
      }

      // Remember the current URL state
      lastUrlState.current = currentUrlState;
      
      // Update state
      updateDemoState(updates);
      
      // After a small delay, save this URL-based instance to history
      setTimeout(() => {
        saveCurrentInstance();
      }, 100);
    }
  }, [searchParams, updateDemoState, saveCurrentInstance, demoState.role, demoState.clientId]);
  
  // Update URL when demo state changes
  useEffect(() => {
    if (!demoState.role || !demoState.scenario || !demoState.clientId) return;
    
    // Create URL parameters
    const params = new URLSearchParams();
    params.set('role', demoState.role);
    params.set('scenario', demoState.scenario);
    params.set('client', demoState.clientId);
    params.set('theme', demoState.themeMode);
    
    const newUrlState = params.toString();
    
    // Only update URL if it's actually different and not triggered by a URL change
    if (newUrlState !== lastUrlState.current) {
      // Set flag to prevent update loop
      isUpdatingFromUrl.current = true;
      
      // Update the URL
      router.replace(`${pathname}?${newUrlState}`, { scroll: false });
      
      // Store the new URL state
      lastUrlState.current = newUrlState;
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
      }, 100);
    }
  }, [demoState.role, demoState.scenario, demoState.clientId, demoState.themeMode, pathname, router]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...demoState,
    setDemoState,
    updateDemoState,
    setClientId,
    getCurrentInstance,
    saveCurrentInstance,
    loadInstance,
    goToInstance,
    createInstanceUrl
  }), [
    demoState, 
    setDemoState, 
    updateDemoState, 
    setClientId, 
    getCurrentInstance,
    saveCurrentInstance,
    loadInstance,
    goToInstance,
    createInstanceUrl
  ]);
  
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