'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import demoConfigs from '../../config/demoConfigs';
import shortcutManager from '../../lib/KeyboardShortcutManager';
import { 
  UserIcon, 
  PhoneIcon, 
  ShieldCheckIcon, 
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Define instance type that combines role, client, and scenario
interface DemoInstance {
  id: string;
  title: string;
  description: string;
  role: 'merchant' | 'support' | 'admin';
  clientId: string;
  scenario: string;
  category: string;
  emoji: string;
  tags: string[];
}

// Generate focused demo instances based on our actual documentation
const generateDemoInstances = (): DemoInstance[] => {
  const instances: DemoInstance[] = [];
  
  // Based on user-persona.md, use-cases.md, and merchant-deacon-pizza-demo.md
  // Local Merchant - Deacon's Pizza
  instances.push({
    id: 'merchant-deacons-pizza-campaign-creation',
    title: 'Deacon\'s Pizza - AI Campaign Creation',
    description: 'Create a restaurant campaign with AI assistance',
    role: 'merchant',
    clientId: 'deacons-pizza',
    scenario: 'campaign-creation',
    category: 'Small Business Owner',
    emoji: '🍕',
    tags: ['merchant', 'restaurant', 'campaign', 'ai assistant', 'marketing']
  });
  
  // Support Agent - Token Management
  instances.push({
    id: 'support-generic-support-flow',
    title: 'Support - Token Management',
    description: 'Assist customers with offer token issues',
    role: 'support',
    clientId: 'generic',
    scenario: 'support-flow',
    category: 'Support Agent',
    emoji: '🎫',
    tags: ['support', 'token', 'customer service']
  });
  
  // National Chain - CVS
  instances.push({
    id: 'merchant-cvs-campaign-creation',
    title: 'CVS - Multi-location Campaign',
    description: 'Create campaigns across multiple locations',
    role: 'merchant',
    clientId: 'cvs',
    scenario: 'campaign-creation',
    category: 'National Chain',
    emoji: '💊',
    tags: ['merchant', 'pharmacy', 'chain', 'multiple locations']
  });
  
  // Admin Analytics Dashboard
  instances.push({
    id: 'admin-generic-default',
    title: 'Admin - Analytics Dashboard',
    description: 'Overview of system-wide performance metrics',
    role: 'admin',
    clientId: 'generic',
    scenario: 'default',
    category: 'Platform Administration',
    emoji: '📊',
    tags: ['admin', 'analytics', 'dashboard', 'reporting']
  });
  
  // Additional Deacon's Pizza flows
  instances.push({
    id: 'merchant-deacons-pizza-default',
    title: 'Deacon\'s Pizza - Dashboard',
    description: 'View merchant dashboard and performance',
    role: 'merchant',
    clientId: 'deacons-pizza',
    scenario: 'default',
    category: 'Small Business Owner',
    emoji: '🍕',
    tags: ['merchant', 'restaurant', 'dashboard', 'analytics']
  });
  
  return instances;
};

// Group instances by category
const groupInstancesByCategory = (instances: DemoInstance[]) => {
  const groups: Record<string, DemoInstance[]> = {};
  
  instances.forEach(instance => {
    if (!groups[instance.category]) {
      groups[instance.category] = [];
    }
    groups[instance.category].push(instance);
  });
  
  return groups;
};

const DemoSpotlight: React.FC = () => {
  const demoInstances = useRef(generateDemoInstances());
  const instanceGroups = useRef(groupInstancesByCategory(demoInstances.current));
  const { updateDemoState } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  const filteredInstances = searchQuery.trim() === '' 
    ? demoInstances.current 
    : demoInstances.current.filter(instance => 
        instance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  
  useEffect(() => {
    // Register the keyboard shortcut to open the spotlight (Command+K)
    shortcutManager.registerShortcut(['meta', 'k'], () => {
      setIsOpen(true);
    }, 'Open Demo Spotlight');
    
    return () => {
      shortcutManager.unregisterShortcut(['meta', 'k']);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      // Focus the input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      
      // Apply backdrop effect
      document.body.classList.add('spotlight-open');
      
      // Activate backdrop with a slight delay for smooth transition
      setTimeout(() => {
        if (backdropRef.current) {
          backdropRef.current.classList.add('active');
        }
      }, 10);
    } else {
      // Deactivate backdrop first
      if (backdropRef.current) {
        backdropRef.current.classList.remove('active');
      }
      
      // Remove body class after transition
      setTimeout(() => {
        document.body.classList.remove('spotlight-open');
      }, 200);
    }
    
    return () => {
      document.body.classList.remove('spotlight-open');
    };
  }, [isOpen]);
  
  useEffect(() => {
    // Reset selected index when search query changes
    setSelectedIndex(0);
  }, [searchQuery]);
  
  // Close spotlight if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredInstances.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && filteredInstances.length > 0) {
      selectInstance(filteredInstances[selectedIndex]);
    }
  };
  
  const selectInstance = (instance: DemoInstance) => {
    updateDemoState({
      role: instance.role,
      clientId: instance.clientId as any,
      clientName: demoConfigs.clients[instance.clientId].name,
      scenario: instance.scenario as any,
      theme: demoConfigs.getThemeForClient(instance.clientId as any)
    });
    
    setIsOpen(false);
    setSearchQuery('');
  };
  
  // Helper function to render role icon
  const renderRoleIcon = (role: string) => {
    switch (role) {
      case 'merchant':
        return <BuildingStorefrontIcon className="h-5 w-5" />;
      case 'support':
        return <PhoneIcon className="h-5 w-5" />;
      case 'admin':
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };
  
  // Function to get scenario icon
  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'campaign-creation':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'support-flow':
        return <PhoneIcon className="h-5 w-5" />;
      case 'default':
        return <ChartBarIcon className="h-5 w-5" />;
      default:
        return <PuzzlePieceIcon className="h-5 w-5" />;
    }
  };
  
  // Function to render instances grouped by category
  const renderGroupedInstances = () => {
    if (searchQuery.trim() !== '') {
      // When searching, show flat list of results
      return (
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredInstances.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No results found. Try a different search term.
            </div>
          ) : (
            filteredInstances.map((instance, index) => renderInstanceItem(instance, index))
          )}
        </div>
      );
    }
    
    // Otherwise show grouped by category
    return (
      <div className="max-h-[60vh] overflow-y-auto py-2">
        {Object.entries(instanceGroups.current).map(([category, instances]) => (
          <div key={category} className="mb-2">
            <div className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {category}
            </div>
            {instances.map((instance, index) => {
              // Calculate the global index for this instance for selection
              const globalIndex = demoInstances.current.findIndex(i => i.id === instance.id);
              return renderInstanceItem(instance, globalIndex);
            })}
          </div>
        ))}
      </div>
    );
  };
  
  // Render individual instance item
  const renderInstanceItem = (instance: DemoInstance, index: number) => {
    return (
      <div
        key={instance.id}
        onClick={() => selectInstance(instance)}
        className={`px-4 py-3 flex items-center cursor-pointer ${
          index === selectedIndex 
            ? 'bg-primary/10 dark:bg-primary/20' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
        }`}
      >
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md overflow-hidden mr-3 shadow-sm">
          <span className="text-xl" aria-hidden="true">{instance.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{instance.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {instance.description}
          </div>
        </div>
        <div className={`ml-3 p-1.5 rounded-full ${
          instance.role === 'merchant' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          instance.role === 'support' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
        }`}>
          {renderRoleIcon(instance.role)}
        </div>
      </div>
    );
  };
  
  return (
    <>
      {/* Backdrop element */}
      {isOpen && (
        <div 
          ref={backdropRef} 
          className="spotlight-backdrop"
          aria-hidden="true"
        />
      )}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" aria-modal="true" role="dialog">
            <motion.div 
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-[700px] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
            >
              {/* Glassmorphism container */}
              <div className="glass-intense rounded-xl">
                {/* Search input */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-200/70 dark:border-gray-700/70 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for demo instances..."
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Results */}
                {renderGroupedInstances()}
                
                {/* Keyboard shortcuts */}
                <div className="px-4 py-2 border-t border-gray-200/70 dark:border-gray-700/70 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                  <div>
                    <span className="inline-flex items-center mr-3">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-300 font-mono text-xs mr-1">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-300 font-mono text-xs mr-1">↓</kbd>
                      to navigate
                    </span>
                    <span className="inline-flex items-center mr-3">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-300 font-mono text-xs mr-1">Enter</kbd>
                      to select
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-300 font-mono text-xs mr-1">Esc</kbd>
                      to close
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Keyboard shortcut indicator */}
      <div className="fixed right-6 bottom-20 z-40 glass-subtle px-3 py-1.5 rounded-full text-sm pointer-events-none select-none opacity-70 hover:opacity-100 transition-opacity duration-200">
        Press <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-300 font-mono text-xs mx-1">⌘</kbd>+<kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-300 font-mono text-xs mx-1">K</kbd> for demo switcher
      </div>
    </>
  );
};

export default DemoSpotlight; 