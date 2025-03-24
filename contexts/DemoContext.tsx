/**
 * DemoContext.tsx
 * 
 * This context provides a way to manage the demo state across the application.
 * It allows for switching between different personas, clients, scenarios, and versions.
 */
'use client';

import React, { createContext, useContext } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { 
  setRole, 
  setClientId, 
  setScenario, 
  setThemeMode, 
  setVersion, 
  updateDemoState, 
  resetToDefault,
  saveCurrentInstance,
  goToInstance,
  VersionType
} from '@/lib/redux/slices/demoSlice';
import { MockUser, getUserForContext } from '@/lib/userProfileUtils';

// Create a compatibility context
const DemoContext = createContext<any>(undefined);

// Compatibility provider that uses Redux under the hood
export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const demoState = useAppSelector(state => state.demo);
  const dispatch = useAppDispatch();
  
  // Get user profile based on current role and client
  const userProfile = getUserForContext(demoState.role, demoState.clientId);
  
  // Create a compatibility value object that matches the original context structure
  const contextValue = {
    ...demoState,
    userProfile,
    setRole: (role: string) => dispatch(setRole(role)),
    setClientId: (clientId: string) => dispatch(setClientId(clientId)),
    setScenario: (scenario: string) => dispatch(setScenario(scenario)),
    setThemeMode: (themeMode: 'light' | 'dark') => dispatch(setThemeMode(themeMode)),
    setVersion: (version: VersionType) => dispatch(setVersion(version)),
    updateDemoState: (updates: any) => dispatch(updateDemoState(updates)),
    resetToDefault: () => dispatch(resetToDefault()),
    goToInstance: (index: number) => dispatch(goToInstance(index)),
    saveCurrentInstance: () => dispatch(saveCurrentInstance())
  };
  
  return (
    <DemoContext.Provider value={contextValue}>
      {children}
    </DemoContext.Provider>
  );
};

// Hook to use the context (compatibility hook)
export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    // If used outside the provider, fallback to direct Redux access
    const demoState = useAppSelector(state => state.demo);
    const dispatch = useAppDispatch();
    const userProfile = getUserForContext(demoState.role, demoState.clientId);
    
    return {
      ...demoState,
      userProfile,
      setRole: (role: string) => dispatch(setRole(role)),
      setClientId: (clientId: string) => dispatch(setClientId(clientId)),
      setScenario: (scenario: string) => dispatch(setScenario(scenario)),
      setThemeMode: (themeMode: 'light' | 'dark') => dispatch(setThemeMode(themeMode)),
      setVersion: (version: VersionType) => dispatch(setVersion(version)),
      updateDemoState: (updates: any) => dispatch(updateDemoState(updates)),
      resetToDefault: () => dispatch(resetToDefault()),
      goToInstance: (index: number) => dispatch(goToInstance(index)),
      saveCurrentInstance: () => dispatch(saveCurrentInstance())
    };
  }
  return context;
}; 