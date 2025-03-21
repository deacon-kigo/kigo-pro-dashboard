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
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import shortcutManager from '../../lib/KeyboardShortcutManager';

// Map client IDs to emojis for visual representation
const clientEmojis: Record<string, string> = {
  'deacons-pizza': '🍕',
  'cvs': '💊',
  'generic': '🏢'
};

export default function DemoSelector() {
  const { 
    role, 
    clientId, 
    themeMode, 
    scenario,
    updateDemoState,
    instanceHistory,
    currentInstanceIndex,
    goToInstance,
    saveCurrentInstance
  } = useDemo();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Role selection
  const handleRoleChange = (newRole: 'merchant' | 'support' | 'admin') => {
    updateDemoState({ role: newRole });
    saveCurrentInstance();
  };
  
  // Client selection
  const handleClientChange = (newClientId: string) => {
    const client = demoConfigs.clients[newClientId];
    if (client) {
      updateDemoState({ 
        clientId: newClientId as any, 
        clientName: client.name 
      });
      saveCurrentInstance();
    }
  };
  
  // Theme mode selection
  const handleThemeModeChange = (newMode: 'light' | 'dark') => {
    updateDemoState({ themeMode: newMode });
    saveCurrentInstance();
  };
  
  // Scenario selection
  const handleScenarioChange = (newScenario: string) => {
    const scenarioConfig = demoConfigs.scenarios[newScenario];
    if (scenarioConfig) {
      updateDemoState({ scenario: newScenario as any });
      saveCurrentInstance();
    }
  };

  // Open the spotlight dialog
  const openSpotlight = () => {
    // Trigger the keyboard shortcut for Command+K to open the spotlight
    shortcutManager.registerShortcut(['meta', 'k'], () => {}, 'Open Spotlight');
    // Find and call the handler for meta+k
    const shortcut = shortcutManager.getRegisteredShortcuts().find(
      s => s.keys.includes('meta') && s.keys.includes('k')
    );
    if (shortcut) {
      // Trigger the handler
      const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
      window.dispatchEvent(event);
    }
    // Unregister our temporary shortcut
    shortcutManager.unregisterShortcut(['meta', 'k']);
  };
  
  const isDarkMode = themeMode === 'dark';

  // Helper function to get appropriate emoji for client
  const getClientEmoji = (clientId: string) => {
    return clientEmojis[clientId] || '🏢';
  };

  return (
    <>
      {/* Demo Settings Toggle Button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg glass-subtle hover:scale-105 transition-transform duration-200"
        title="Demo Settings"
      >
        <Cog6ToothIcon className="h-6 w-6" />
      </button>
      
      {/* Demo Settings Panel */}
      <div
        className={`fixed right-0 top-0 h-full z-[51] w-80 glass-intense shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
          
          {/* Quick Access Section */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <CommandLineIcon className="h-4 w-4 mr-2 opacity-70" />
              Quick Access
            </h3>
            <button
              onClick={openSpotlight}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg transition-colors mb-2 ${
                isDarkMode ? 'glass-subtle hover:bg-gray-700' : 'glass-subtle hover:bg-gray-200'
              }`}
            >
              <span className="text-sm font-medium">Open Demo Spotlight</span>
              <div className="flex items-center ml-2">
                <kbd className="px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">⌘</kbd>
                <span className="mx-0.5">+</span>
                <kbd className="px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">K</kbd>
              </div>
            </button>
          </div>
          
          {/* User Persona Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <UserIcon className="h-4 w-4 mr-2 opacity-70" />
              User Persona
            </h3>
            <div className="grid grid-cols-3 gap-2 glass-subtle p-2 rounded-lg">
              <button
                onClick={() => handleRoleChange('merchant')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  role === 'merchant' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-white/20 dark:hover:bg-gray-800/50'
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
                    : 'hover:bg-white/20 dark:hover:bg-gray-800/50'
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
                    : 'hover:bg-white/20 dark:hover:bg-gray-800/50'
                }`}
              >
                <ShieldCheckIcon className="h-6 w-6 mb-1" />
                <span className="text-xs">Admin</span>
              </button>
            </div>
          </div>
          
          {/* Client Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <BuildingStorefrontIcon className="h-4 w-4 mr-2 opacity-70" />
              Business
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(demoConfigs.clients).map(([id, client]) => (
                <button
                  key={id}
                  onClick={() => handleClientChange(id)}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    clientId === id
                      ? 'bg-primary text-white'
                      : 'glass-subtle hover:bg-white/20 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="w-8 h-8 mr-3 flex items-center justify-center">
                    <span className="text-2xl" aria-hidden="true">{getClientEmoji(id)}</span>
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
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <SunIcon className="h-4 w-4 mr-2 opacity-70" />
              Theme Mode
            </h3>
            <div className="grid grid-cols-2 gap-2 glass-subtle p-2 rounded-lg">
              <button
                onClick={() => handleThemeModeChange('light')}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  themeMode === 'light' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-white/20 dark:hover:bg-gray-800/50'
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
                    : 'hover:bg-white/20 dark:hover:bg-gray-800/50'
                }`}
              >
                <MoonIcon className="h-5 w-5 mr-2" />
                <span>Dark</span>
              </button>
            </div>
          </div>
          
          {/* Scenario Selection */}
          <div className="mb-8">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <ArrowPathIcon className="h-4 w-4 mr-2 opacity-70" />
              User Flow
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(demoConfigs.scenarios).map(([id, scenarioConfig]) => (
                <button
                  key={id}
                  onClick={() => handleScenarioChange(id)}
                  className={`text-left p-3 rounded-lg transition-colors ${
                    scenario === id
                      ? 'bg-primary text-white'
                      : 'glass-subtle hover:bg-white/20 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="font-medium">{scenarioConfig.title}</div>
                  <div className="text-xs opacity-75">{scenarioConfig.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Recent History */}
          {instanceHistory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-3 flex items-center">
                <ArrowPathIcon className="h-4 w-4 mr-2 opacity-70" />
                Recent Instances
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {instanceHistory.slice(-5).reverse().map((instance, index) => (
                  <button
                    key={`${instance.id}-${index}`}
                    onClick={() => goToInstance(instanceHistory.length - 1 - index)}
                    className={`text-left p-3 rounded-lg transition-colors ${
                      (instanceHistory.length - 1 - index) === currentInstanceIndex
                        ? 'bg-primary text-white'
                        : 'glass-subtle hover:bg-white/20 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2" aria-hidden="true">
                        {getClientEmoji(instance.clientId)}
                      </span>
                      <div>
                        <div className="font-medium">{instance.clientName}</div>
                        <div className="text-xs opacity-75">
                          {demoConfigs.scenarios[instance.scenario]?.title} ({instance.role})
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs opacity-75 text-center mt-auto pt-6">
            Demo Mode - v1.0.0
          </div>
        </div>
      </div>
    </>
  );
} 