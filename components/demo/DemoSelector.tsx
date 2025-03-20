'use client';

import { useState } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import demoConfigs from '../../config/demoConfigs';
import { 
  UserIcon, 
  PhoneIcon, 
  ShieldCheckIcon, 
  SunIcon, 
  MoonIcon, 
  BuildingStorefrontIcon 
} from '@heroicons/react/24/outline';

export default function DemoSelector() {
  const { 
    role, 
    clientId, 
    themeMode, 
    scenario, 
    updateDemoState
  } = useDemo();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Role selection
  const handleRoleChange = (newRole: 'merchant' | 'support' | 'admin') => {
    updateDemoState({ role: newRole });
  };
  
  // Client selection
  const handleClientChange = (newClientId: string) => {
    const client = demoConfigs.clients[newClientId];
    if (client) {
      updateDemoState({ 
        clientId: newClientId as any, 
        clientName: client.name 
      });
    }
  };
  
  // Theme mode selection
  const handleThemeModeChange = (newMode: 'light' | 'dark') => {
    updateDemoState({ themeMode: newMode });
  };
  
  // Scenario selection
  const handleScenarioChange = (newScenario: string) => {
    const scenarioConfig = demoConfigs.scenarios[newScenario];
    if (scenarioConfig) {
      updateDemoState({ scenario: newScenario as any });
    }
  };
  
  const isDarkMode = themeMode === 'dark';

  return (
    <>
      {/* Demo Settings Toggle Button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } hover:scale-105 transition-transform duration-200`}
        title="Demo Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {/* Demo Settings Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-[1000] w-80 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Demo Settings</h2>
            <button
              onClick={togglePanel}
              className={`p-2 rounded-full ${
                isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User Role Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3">User Role</h3>
            <div className={`grid grid-cols-3 gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg`}>
              <button
                onClick={() => handleRoleChange('merchant')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  role === 'merchant' 
                    ? 'bg-primary text-white' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <BuildingStorefrontIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Merchant</span>
              </button>
              <button
                onClick={() => handleRoleChange('support')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  role === 'support' 
                    ? 'bg-primary text-white' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <PhoneIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Support</span>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  role === 'admin' 
                    ? 'bg-primary text-white' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <ShieldCheckIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>
          
          {/* Client Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3">Client</h3>
            <div className={`grid grid-cols-1 gap-2`}>
              {Object.entries(demoConfigs.clients).map(([id, client]) => (
                <button
                  key={id}
                  onClick={() => handleClientChange(id)}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    clientId === id
                      ? 'bg-primary text-white'
                      : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="max-h-8" />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs opacity-75">{client.industry}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Theme Mode */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3">Theme Mode</h3>
            <div className={`grid grid-cols-2 gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-2 rounded-lg`}>
              <button
                onClick={() => handleThemeModeChange('light')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  themeMode === 'light' 
                    ? 'bg-primary text-white' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <SunIcon className="h-5 w-5 mr-2" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleThemeModeChange('dark')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  themeMode === 'dark' 
                    ? 'bg-primary text-white' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <MoonIcon className="h-5 w-5 mr-2" />
                <span>Dark</span>
              </button>
            </div>
          </div>
          
          {/* Scenario Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3">Demo Scenario</h3>
            <div className={`grid grid-cols-1 gap-2`}>
              {Object.entries(demoConfigs.scenarios).map(([id, scenarioConfig]) => (
                <button
                  key={id}
                  onClick={() => handleScenarioChange(id)}
                  className={`text-left p-3 rounded-lg transition-colors ${
                    scenario === id
                      ? 'bg-primary text-white'
                      : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium">{scenarioConfig.title}</div>
                  <div className="text-xs opacity-75">{scenarioConfig.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-xs opacity-75 text-center mt-auto pt-6">
            Demo Mode - v1.0.0
          </div>
        </div>
      </div>
    </>
  );
} 