'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDemoState, useDemoActions } from '@/lib/redux/hooks';
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
  PuzzlePieceIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { MockUser, getUserForContext, convertMockUserToUserProfile } from '@/lib/userProfileUtils';
import { getMockAvatarUrl } from '@/lib/avatarUtils';
import { UserProfile } from '@/types/demo';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleSpotlight, setDemoSelectorOpen } from '@/lib/redux/slices/uiSlice';
import Link from 'next/link';
import { buildDemoUrl } from '@/lib/utils';

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
  userProfile?: MockUser;
  path?: string;
}

// Generate focused demo instances based on our actual documentation
const generateDemoInstances = (): DemoInstance[] => {
  const instances: DemoInstance[] = [];
  
  // Based on user-persona.md, use-cases.md, and merchant-deacon-pizza-demo.md
  // Local Merchant - Deacon's Pizza
  instances.push({
    id: 'merchant-deacons-campaign-creation',
    title: 'AI-Powered Campaign Creation',
    description: 'Experience the next-gen AI campaign wizard',
    role: 'merchant',
    clientId: 'deacons',
    scenario: 'campaign-creation',
    category: 'Featured Experiences',
    emoji: '🪄',
    tags: ['merchant', 'deacons', 'ai', 'campaign'],
    userProfile: getUserForContext('merchant', 'deacons') as MockUser
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
    tags: ['support', 'token', 'customer service'],
    userProfile: getUserForContext('support', 'generic') as MockUser
  });
  
  // CVS Support Agent - ExtraCare Token Management
  instances.push({
    id: 'support-cvs-support-flow',
    title: 'CVS Support - ExtraCare Token Management',
    description: 'Manage CVS ExtraCare offer tokens for customers',
    role: 'support',
    clientId: 'cvs',
    scenario: 'support-flow',
    category: 'CVS Support',
    emoji: '💊',
    tags: ['support', 'pharmacy', 'extracare', 'token', 'customer service'],
    userProfile: getUserForContext('support', 'cvs') as MockUser
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
    tags: ['merchant', 'pharmacy', 'chain', 'multiple locations'],
    userProfile: getUserForContext('merchant', 'cvs') as MockUser
  });
  
  // Admin Analytics Dashboard
  instances.push({
    id: 'admin-generic-default',
    title: 'Admin - Analytics Dashboard',
    description: 'Overview of system-wide performance metrics',
    role: 'admin',
    clientId: 'generic',
    scenario: 'dashboard',
    category: 'Platform Administration',
    emoji: '📊',
    tags: ['admin', 'analytics', 'dashboard', 'reporting'],
    userProfile: getUserForContext('admin', 'generic') as MockUser
  });
  
  // Additional Deacon's Pizza flows
  instances.push({
    id: 'merchant-deacons-default',
    title: 'Deacon\'s Pizza Dashboard',
    description: 'Local pizzeria owner dashboard',
    role: 'merchant',
    clientId: 'deacons',
    scenario: 'pizza',
    category: 'Merchant Views',
    emoji: '🍕',
    tags: ['merchant', 'deacons', 'dashboard'],
    userProfile: getUserForContext('merchant', 'deacons') as MockUser
  });
  
  // CVS Dashboard
  instances.push({
    id: 'merchant-cvs-dashboard',
    title: 'CVS - Pharmacy Dashboard',
    description: 'View pharmacy chain dashboard and metrics',
    role: 'merchant',
    clientId: 'cvs',
    scenario: 'dashboard',
    category: 'National Chain',
    emoji: '💊',
    tags: ['merchant', 'pharmacy', 'dashboard', 'analytics'],
    userProfile: getUserForContext('merchant', 'cvs') as MockUser
  });
  
  // CVS Support Token Management
  instances.push({
    id: 'support-cvs-token-management',
    title: 'CVS - ExtraCare Support',
    description: 'Manage customer ExtraCare tokens and offers',
    role: 'support',
    clientId: 'cvs',
    scenario: 'support-flow',
    category: 'Customer Support',
    emoji: '🎟️',
    tags: ['support', 'pharmacy', 'extracare', 'token management'],
    userProfile: getUserForContext('support', 'cvs') as MockUser,
    path: '/demos/cvs-token-management'
  });
  
  // Support Dashboard
  instances.push({
    id: 'support-generic-dashboard',
    title: 'Support - Agent Dashboard',
    description: 'Customer support dashboard and ticket overview',
    role: 'support',
    clientId: 'generic',
    scenario: 'dashboard',
    category: 'Support Agent',
    emoji: '🎫',
    tags: ['support', 'tickets', 'dashboard', 'customer service'],
    userProfile: getUserForContext('support', 'generic') as MockUser
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
  const dispatch = useAppDispatch();
  const { spotlightOpen } = useAppSelector(state => state.ui);
  const { role, clientId, version } = useAppSelector(state => state.demo);
  const demoInstances = useRef(generateDemoInstances());
  const instanceGroups = useRef(groupInstancesByCategory(demoInstances.current));
  const { updateDemoState } = useDemoActions();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredInstance, setHoveredInstance] = useState<DemoInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  
  // Sync local state with Redux state
  useEffect(() => {
    setIsOpen(spotlightOpen);
  }, [spotlightOpen]);
  
  const filteredInstances = searchQuery.trim() === '' 
    ? demoInstances.current 
    : demoInstances.current.filter(instance => 
        instance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instance.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Also search user profile
        (instance.userProfile && (
          instance.userProfile.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instance.userProfile.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instance.userProfile.role.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
  
  useEffect(() => {
    // Register the keyboard shortcut to open the spotlight (Command+K)
    shortcutManager.registerShortcut(['meta', 'k'], () => {
      // Update both local and Redux state
      setIsOpen(true);
      dispatch(toggleSpotlight());
      
      // Focus the input when opened via shortcut
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }, 'Open Demo Spotlight');
    
    return () => {
      shortcutManager.unregisterShortcut(['meta', 'k']);
    };
  }, [dispatch]);
  
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
        dispatch(toggleSpotlight());
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dispatch]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      dispatch(toggleSpotlight());
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
    // Include userProfile in updates if available
    const userProfile = instance.userProfile ? 
      convertMockUserToUserProfile(instance.userProfile) : 
      undefined;
      
    // Update state in both context and Redux
    updateDemoState({
      role: instance.role,
      clientId: instance.clientId as any,
      scenario: instance.scenario as any,
      userProfile
    });
    
    setIsOpen(false);
    dispatch(toggleSpotlight());
    setSearchQuery('');
    
    // Custom navigation if path exists
    if (instance.path) {
      // Use Next.js router for client-side navigation when possible
      window.location.href = instance.path;
    } else {
      // Default path based on role, client, and scenario
      let defaultPath = '/';
      
      // Construct path based on instance properties
      if (instance.scenario === 'campaign-creation') {
        defaultPath = '/campaigns/create';
      } else if (instance.scenario === 'dashboard') {
        defaultPath = '/';
      } else if (instance.role === 'support' && instance.scenario === 'support-flow') {
        defaultPath = '/tickets';
      }
      
      // For specific client demos
      if (instance.clientId === 'deacons' && instance.scenario === 'campaign-creation') {
        defaultPath = '/demos/ai-campaign-creation';
      } else if (instance.clientId && instance.scenario && 
                 ['dashboard', 'token-management', 'customers', 'tickets', 'settings', 'pizza'].includes(instance.scenario)) {
        // Use the buildDemoUrl utility for standard demo scenarios
        defaultPath = buildDemoUrl(instance.clientId, instance.scenario);
      }
      
      // Navigate to the constructed path
      window.location.href = defaultPath;
    }
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
      case 'dashboard':
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
            <div className="px-4 py-8 text-center text-gray-600 dark:text-gray-200">
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
            <div className="px-4 py-1 text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
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
    const user = instance.userProfile;
    const hasUserProfile = !!user;
    const avatarUrl = hasUserProfile ? getMockAvatarUrl(user) : null;
    
    return (
      <div
        key={instance.id}
        onClick={() => selectInstance(instance)}
        onMouseEnter={() => setHoveredInstance(instance)}
        onMouseLeave={() => setHoveredInstance(null)}
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
          <div className="font-medium truncate text-gray-900 dark:text-gray-100">{instance.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {instance.description}
          </div>
          {hasUserProfile && (
            <div className="text-xs text-blue-600 dark:text-blue-300 truncate flex items-center mt-1">
              <UserCircleIcon className="h-3 w-3 mr-1" />
              {user.firstName} {user.lastName} • {user.title}
            </div>
          )}
        </div>
        <div className={`ml-3 p-1.5 rounded-full ${
          instance.role === 'merchant' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
          instance.role === 'support' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
          'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
        }`}>
          {renderRoleIcon(instance.role)}
        </div>
      </div>
    );
  };
  
  // Render user profile preview
  const renderUserProfilePreview = () => {
    if (!hoveredInstance || !hoveredInstance.userProfile) return null;
    
    const user = hoveredInstance.userProfile;
    const avatarUrl = getMockAvatarUrl(user);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-[70px] right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
      >
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img src={avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.title}</p>
          </div>
        </div>
        
        <div className="text-xs text-gray-700 dark:text-gray-200 mb-2">
          <div className="grid grid-cols-3 gap-1 mb-1">
            <span className="font-medium">Company:</span>
            <span className="col-span-2">{user.company}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 mb-1">
            <span className="font-medium">Tech Skill:</span>
            <span className="col-span-2">{user.techProficiency}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-800 dark:text-gray-200">
          <p className="font-medium mb-1">Goals:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {user.goals.slice(0, 2).map((goal, idx) => (
              <li key={idx}>{goal}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };
  
  const handleToggle = () => {
    // Toggle both local and Redux state
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    dispatch(toggleSpotlight());
    
    // Focus input when opening
    if (newIsOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };
  
  const openDemoSelector = () => {
    // Close spotlight first
    setIsOpen(false);
    dispatch(toggleSpotlight());
    
    // Give a small delay before opening the demo selector
    // This prevents UI glitches when transitioning between modals
    setTimeout(() => {
      dispatch(setDemoSelectorOpen(true));
    }, 100);
  };
  
  const getRoleText = () => {
    switch(role) {
      case 'merchant': return 'Business Owner';
      case 'support': return 'Support Agent';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };
  
  const getClientName = () => {
    switch(clientId) {
      case 'deacons': return 'Deacon\'s Pizza';
      case 'cvs': return 'CVS Pharmacy';
      default: return clientId;
    }
  };
  
  // Map the Redux version types to the display names in the UI
  const getVersionText = () => {
    if (!version) return 'Default Version';
    
    switch(version) {
      case 'current': return 'Current Version';
      case 'upcoming': return 'Upcoming Version';
      case 'future': return 'Future Version';
      case 'experimental': return 'Experimental Version';
      default: return 'Default Version';
    }
  };
  
  return (
    <>
      {/* Backdrop element */}
      {isOpen && (
        <div 
          ref={backdropRef} 
          className="spotlight-backdrop"
          onClick={() => {
            setIsOpen(false);
            dispatch(toggleSpotlight());
          }}
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
              className="w-[700px] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl spotlight-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism container */}
              <div className="glass-intense rounded-xl">
                {/* Search input */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-200/70 dark:border-gray-700/70 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for demo instances or users..."
                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Results */}
                <div className="relative">
                  {renderGroupedInstances()}
                  <AnimatePresence>
                    {hoveredInstance && renderUserProfilePreview()}
                  </AnimatePresence>
                </div>
                
                {/* Keyboard shortcuts */}
                <div className="px-4 py-2 border-t border-gray-200/70 dark:border-gray-700/70 text-xs text-gray-600 dark:text-gray-300 flex justify-between">
                  <div>
                    <span className="inline-flex items-center mr-3">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-200 font-mono text-xs mr-1">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-200 font-mono text-xs mr-1">↓</kbd>
                      to navigate
                    </span>
                    <span className="inline-flex items-center mr-3">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-200 font-mono text-xs mr-1">Enter</kbd>
                      to select
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center">
                      <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-200 font-mono text-xs mr-1">Esc</kbd>
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
        Press <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 font-mono text-xs mx-1">⌘</kbd>+<kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 font-mono text-xs mx-1">K</kbd> for demo switcher
      </div>

      {/* Spotlight button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 left-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-30"
        aria-label="Toggle Demo Spotlight"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <SparklesIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default DemoSpotlight; 