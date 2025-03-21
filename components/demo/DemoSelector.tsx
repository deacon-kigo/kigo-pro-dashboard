'use client';

import { useState, useEffect } from 'react';
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
  ArrowPathIcon,
  ChevronRightIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinIconSolid } from '@heroicons/react/24/solid';
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
  
  // Start with panel open on first render, use localStorage to remember state
  const [isOpen, setIsOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('demoSelectorState');
    if (savedState) {
      const { wasOpen, wasPinned, wasCollapsed } = JSON.parse(savedState);
      setIsOpen(wasOpen);
      setIsPinned(wasPinned);
      setIsCollapsed(wasCollapsed);
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('demoSelectorState', JSON.stringify({
      wasOpen: isOpen,
      wasPinned: isPinned,
      wasCollapsed: isCollapsed
    }));
  }, [isOpen, isPinned, isCollapsed]);
  
  const togglePanel = () => {
    if (!isPinned) {
      setIsOpen(!isOpen);
    }
  };
  
  const togglePinned = () => {
    setIsPinned(!isPinned);
  };
  
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
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
      {/* Demo Settings Panel - New position and styling */}
      <div 
        className={`fixed top-4 right-4 z-[51] shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen 
            ? isCollapsed 
              ? 'w-64' 
              : 'w-80'
            : 'w-14'
        }`}
      >
        <div className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200/80 dark:border-gray-700/80 shadow-lg transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-95 hover:opacity-100'
        }`}>
          {/* Header with controls */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            {isOpen ? (
              <>
                <div className="flex items-center">
                  <Cog6ToothIcon className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="font-medium text-gray-900 dark:text-white">Demo Controls</h2>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleCollapsed}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={isCollapsed ? "Expand" : "Collapse"}
                  >
                    <ChevronRightIcon className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
                  </button>
                  <button
                    onClick={togglePinned}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={isPinned ? "Unpin" : "Pin"}
                  >
                    {isPinned ? <MapPinIconSolid className="h-4 w-4 text-primary" /> : <MapPinIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={togglePanel}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Close"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={togglePanel}
                className="w-full flex justify-center"
                title="Open Demo Controls"
              >
                <Cog6ToothIcon className="h-6 w-6 text-primary" />
              </button>
            )}
          </div>
          
          {/* Collapsed View - Quick Actions */}
          {isOpen && isCollapsed && (
            <div className="p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="space-y-2">
                <button
                  onClick={openSpotlight}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">Demo Spotlight</span>
                  <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-200 rounded">⌘K</kbd>
                </button>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button
                    onClick={() => handleRoleChange('merchant')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                      role === 'merchant' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Merchant"
                  >
                    <BuildingStorefrontIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRoleChange('support')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                      role === 'support' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Support"
                  >
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                      role === 'admin' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Admin"
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => handleThemeModeChange('light')}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      themeMode === 'light' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Light Mode"
                  >
                    <SunIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleThemeModeChange('dark')}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                      themeMode === 'dark' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title="Dark Mode"
                  >
                    <MoonIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {Object.entries(demoConfigs.clients).map(([id, client]) => (
                    <button
                      key={id}
                      onClick={() => handleClientChange(id)}
                      className={`flex items-center p-2 rounded-lg transition-colors ${
                        clientId === id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      title={client.name}
                    >
                      <span className="text-xl" aria-hidden="true">{getClientEmoji(id)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Expanded View */}
          {isOpen && !isCollapsed && (
            <div className="p-5 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Quick Access Section */}
              <div className="mb-7">
                <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-200">
                  <CommandLineIcon className="h-4 w-4 mr-2 opacity-70" />
                  Quick Access
                </h3>
                <button
                  onClick={openSpotlight}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-lg transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 mb-2"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Open Demo Spotlight</span>
                  <div className="flex items-center ml-2">
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-200 rounded">⌘</kbd>
                    <span className="mx-0.5">+</span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-200 rounded">K</kbd>
                  </div>
                </button>
              </div>
              
              {/* User Persona Selection */}
              <div className="mb-7">
                <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
                  <UserIcon className="h-4 w-4 mr-2 opacity-70" />
                  User Persona
                </h3>
                <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <button
                    onClick={() => handleRoleChange('merchant')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                      role === 'merchant' 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
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
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
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
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ShieldCheckIcon className="h-6 w-6 mb-1" />
                    <span className="text-xs">Admin</span>
                  </button>
                </div>
              </div>
              
              {/* Client Selection */}
              <div className="mb-7">
                <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
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
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              <div className="mb-7">
                <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
                  <SunIcon className="h-4 w-4 mr-2 opacity-70" />
                  Theme Mode
                </h3>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <button
                    onClick={() => handleThemeModeChange('light')}
                    className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                      themeMode === 'light' 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
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
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <MoonIcon className="h-5 w-5 mr-2" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
              
              {/* Scenario Selection */}
              <div className="mb-7">
                <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
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
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                <div className="mb-7">
                  <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-300">
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
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
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
          )}
        </div>
      </div>
      
      {/* Keyboard shortcut indicator */}
      <div className="fixed right-6 bottom-6 z-40 px-3 py-2 rounded-lg bg-gray-800/90 text-white text-sm pointer-events-none select-none opacity-0 hover:opacity-100 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-center">
          <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-300 font-mono text-xs mx-1">⌘</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-300 font-mono text-xs mx-1">K</kbd>
          <span className="ml-2">for demo switcher</span>
        </div>
      </div>
    </>
  );
} 