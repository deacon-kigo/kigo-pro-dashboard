'use client';

import { useState, useEffect } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { VersionType } from '@/lib/redux/slices/demoSlice';
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
  XMarkIcon,
  BeakerIcon,
  ClockIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinIconSolid } from '@heroicons/react/24/solid';
import shortcutManager from '../../lib/KeyboardShortcutManager';

// Map client IDs to emojis for visual representation
const clientEmojis: Record<string, string> = {
  'deacons-pizza': '🍕',
  'cvs': '💊',
  'generic': '🏢'
};

// Define version info here since it's no longer exported from DemoContext
const versionInfo: Record<VersionType, { name: string, description: string }> = {
  'current': {
    name: 'Current Release',
    description: 'Features currently implemented in production'
  },
  'upcoming': {
    name: 'Next Release',
    description: 'Features planned for the next release cycle'
  },
  'future': {
    name: 'Future Roadmap',
    description: 'Features in the long-term development roadmap'
  },
  'experimental': {
    name: 'Experimental',
    description: 'Experimental concepts and designs for feedback'
  }
};

// Map version types to icons
const versionIcons: Record<VersionType, React.ReactNode> = {
  'current': <ClockIcon className="w-5 h-5" />,
  'upcoming': <RocketLaunchIcon className="w-5 h-5" />,
  'future': <CommandLineIcon className="w-5 h-5" />,
  'experimental': <BeakerIcon className="w-5 h-5" />
};

export default function DemoSelector() {
  const { 
    role, 
    clientId, 
    themeMode, 
    scenario,
    version,
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
  
  const handleRoleChange = (newRole: string) => {
    updateDemoState({ role: newRole });
  };
  
  const handleClientChange = (newClientId: string) => {
    updateDemoState({ clientId: newClientId, clientName: demoConfigs.clients[newClientId].name });
  };
  
  const handleScenarioChange = (newScenario: string) => {
    updateDemoState({ scenario: newScenario });
  };
  
  const handleThemeModeChange = (newThemeMode: 'light' | 'dark') => {
    updateDemoState({ themeMode: newThemeMode });
  };
  
  const handleVersionChange = (newVersion: VersionType) => {
    updateDemoState({ version: newVersion });
  };
  
  const openSpotlight = () => {
    // Trigger the keyboard shortcut for opening the spotlight
    // This delegates to the DemoSpotlight component
    shortcutManager.triggerShortcut(['meta', 'k']);
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-30 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Cog6ToothIcon className="w-6 h-6" />
      </button>
    );
  }
  
  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-80'} transition-all duration-300 fixed bottom-6 right-6 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col`}>
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Demo Settings</h2>
            <div className="flex">
              <button 
                onClick={toggleCollapsed}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={togglePinned}
                className={`ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none ${isPinned ? 'text-blue-500 dark:text-blue-400' : ''}`}
              >
                <MapPinIcon className={`w-5 h-5 ${isPinned ? 'hidden' : 'block'}`} />
                <MapPinIconSolid className={`w-5 h-5 ${isPinned ? 'block' : 'hidden'}`} />
              </button>
              <button 
                onClick={togglePanel}
                className="ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {isCollapsed && (
          <button 
            onClick={toggleCollapsed}
            className="flex items-center justify-center w-full focus:outline-none"
          >
            <Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">User Role</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleRoleChange('merchant')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                  role === 'merchant' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
                <span>Merchant</span>
              </button>
              <button
                onClick={() => handleRoleChange('support')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                  role === 'support' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                <span>Support</span>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                  role === 'admin' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span>Admin</span>
              </button>
            </div>
          </div>
          
          {/* Client Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Client</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(demoConfigs.clients).map(([id, client]) => (
                <button
                  key={id}
                  onClick={() => handleClientChange(id)}
                  className={`py-2 px-3 rounded-lg flex items-center justify-between ${
                    clientId === id 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium border border-blue-300 dark:border-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="truncate">{client.name}</span>
                  <span className="text-lg">{clientEmojis[id] || '🏢'}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Version Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Version</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(versionInfo).map(([versionKey, versionData]) => (
                <button
                  key={versionKey}
                  onClick={() => handleVersionChange(versionKey as VersionType)}
                  className={`py-2 px-3 rounded-lg flex items-center justify-between ${
                    version === versionKey 
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-medium border border-indigo-300 dark:border-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="truncate">{versionData.name}</span>
                  <span>{versionIcons[versionKey as VersionType]}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 px-1">
              {version && versionInfo[version as VersionType]?.description}
            </div>
          </div>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleThemeModeChange('light')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                  themeMode === 'light' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <SunIcon className="w-5 h-5 mr-2" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleThemeModeChange('dark')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                  themeMode === 'dark' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <MoonIcon className="w-5 h-5 mr-2" />
                <span>Dark</span>
              </button>
            </div>
          </div>
          
          {/* Scenario Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Scenario</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(demoConfigs.scenarios).map(([id, scenarioData]) => (
                <button
                  key={id}
                  onClick={() => handleScenarioChange(id)}
                  className={`py-2 px-3 rounded-lg flex items-center justify-between ${
                    scenario === id 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <div>
                    <div className="font-medium">{scenarioData.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {scenarioData.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Recent Instances */}
          {instanceHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Instances</h3>
              <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto">
                {instanceHistory.map((instance: any, index: number) => (
                  <button
                    key={instance.id || index}
                    onClick={() => goToInstance(index)}
                    className={`py-2 px-3 rounded-lg text-left ${
                      index === currentInstanceIndex 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate flex items-center">
                        {instance.role === 'merchant' && <BuildingStorefrontIcon className="w-4 h-4 mr-1 text-emerald-600 dark:text-emerald-400" />}
                        {instance.role === 'support' && <PhoneIcon className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />}
                        {instance.role === 'admin' && <ShieldCheckIcon className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />}
                        <span>{instance.clientName || instance.clientId}</span>
                      </div>
                      <div className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                        {instance.scenario}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Spotlight Button */}
          <button
            onClick={openSpotlight}
            className="w-full py-2.5 px-4 mt-2 flex items-center justify-center bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-800 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            <span className="mr-3">Show All Demo Instances</span>
            <div className="flex items-center space-x-1 text-xs">
              <kbd className="px-1.5 py-0.5 bg-gray-700 dark:bg-gray-300 text-gray-200 dark:text-gray-700 font-mono rounded">⌘</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-700 dark:bg-gray-300 text-gray-200 dark:text-gray-700 font-mono rounded">K</kbd>
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 