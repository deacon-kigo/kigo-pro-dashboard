'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftEllipsisIcon,
  PlusIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useDemo } from '../../contexts/DemoContext';

export default function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState('225px');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { role, clientId, theme, themeMode } = useDemo();
  
  // Mock search suggestions - role-based
  const getSearchSuggestions = () => {
    switch(role) {
      case 'merchant':
        return [
          { type: 'campaign', text: 'Summer Sale Promotion', icon: '🚀' },
          { type: 'analytics', text: 'Weekend performance report', icon: '📊' },
          { type: 'recent', text: 'Product inventory status', icon: '⏱️' },
          { type: 'product', text: 'Discount codes overview', icon: '🏷️' },
        ];
      case 'support':
        return [
          { type: 'ticket', text: 'Merchant payment issue #1293', icon: '🎫' },
          { type: 'merchant', text: 'Acme Corporation', icon: '🏢' },
          { type: 'recent', text: 'Onboarding tutorials', icon: '⏱️' },
          { type: 'knowledge', text: 'Payment processing guide', icon: '📚' },
        ];
      case 'admin':
        return [
          { type: 'merchant', text: 'Acme Corporation', icon: '🏢' },
          { type: 'analytics', text: 'Platform growth metrics', icon: '📊' },
          { type: 'setting', text: 'API configuration', icon: '⚙️' },
          { type: 'user', text: 'Support team member', icon: '👤' },
        ];
      default:
        return [
          { type: 'campaign', text: 'Summer Sale Promotion', icon: '🚀' },
          { type: 'merchant', text: 'Acme Corporation', icon: '🏢' },
          { type: 'analytics', text: 'Weekend performance report', icon: '📊' },
          { type: 'recent', text: 'ROI analysis', icon: '⏱️' },
        ];
    }
  };
  
  const searchSuggestions = getSearchSuggestions();
  
  // Listen for changes to the sidebar width CSS variable
  useEffect(() => {
    const handleResize = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') || '225px';
      setSidebarWidth(width);
    };
    
    // Initial setup
    handleResize();
    
    // Setup a MutationObserver to watch for style attribute changes
    const observer = new MutationObserver(handleResize);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/campaigns')) {
      if (pathname === '/campaigns/create') return 'Create Campaign';
      return 'Campaigns';
    }
    if (pathname === '/analytics') return 'Analytics';
    if (pathname === '/merchants') return 'Merchants';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/notifications') return 'Notifications';
    if (pathname === '/help') return 'Help & Support';
    if (pathname === '/tickets') return 'Support Tickets';
    return '';
  };

  // Get the appropriate action button based on role
  const getActionButton = () => {
    if (pathname.includes('/create')) return null;
    
    switch(role) {
      case 'merchant':
        return (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-40 animate-rainbow-border blur-[1px]"></div>
            <Link 
              href="/demos/ai-campaign-creation"
              className="relative z-10 bg-primary text-white font-medium rounded-lg px-4 py-2 flex items-center space-x-1 shadow-md hover:bg-primary/95 transition-all duration-500 ease-in-out
              before:absolute before:content-[''] before:-z-10 before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity before:duration-500 
              hover:before:opacity-100 before:bg-gradient-to-r before:from-primary/30 before:via-blue-500/20 before:to-purple-500/30 before:blur-xl before:animate-spin-slow"
            >
              <PlusIcon className="w-5 h-5" />
              <span>New Campaign</span>
            </Link>
          </div>
        );
      case 'support':
        return (
          <Link 
            href="/tickets/create"
            className={`bg-primary text-white font-medium rounded-lg px-4 py-2 flex items-center space-x-1 shadow-md hover:bg-primary/95 transition-colors`}
          >
            <TicketIcon className="w-5 h-5" />
            <span>New Ticket</span>
          </Link>
        );
      case 'admin':
        return (
          <Link 
            href="/merchants/create"
            className={`bg-primary text-white font-medium rounded-lg px-4 py-2 flex items-center space-x-1 shadow-md hover:bg-primary/95 transition-colors`}
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add Merchant</span>
          </Link>
        );
      default:
        return null;
    }
  };

  // Get search placeholder based on role
  const getSearchPlaceholder = () => {
    switch(role) {
      case 'merchant': return 'Search campaigns, products...';
      case 'support': return 'Search tickets, merchants...';
      case 'admin': return 'Search merchants, users...';
      default: return 'Search...';
    }
  };

  const isDarkMode = themeMode === 'dark';

  return (
    <header 
      className={`h-[72px] flex items-center px-8 fixed top-0 right-0 z-[40] transition-all duration-300 ease-in-out`}
      style={{ left: sidebarWidth }}
    >
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-gray-900/90 via-gray-800/5 to-gray-700/10' : 'bg-gradient-to-r from-white/90 via-pastel-blue/5 to-pastel-purple/10'} backdrop-blur-md border-b border-border-light`}></div>
      
      <div className="relative z-10 flex items-center w-full">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getPageTitle()}</h1>
        
        <div id="search-container" className="relative ml-8 flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border ${isDarkMode ? 'border-gray-700 bg-gray-800/80 focus:ring-blue-500/20 focus:border-blue-500 text-white' : 'border-gray-200 bg-white/80 focus:ring-primary/20 focus:border-primary text-gray-900'} rounded-lg focus:outline-none focus:ring-2 text-sm`}
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
          />
          
          {/* AI Search Dropdown */}
          {showSearchDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border overflow-hidden z-50 animate-fadeIn`}>
              <div className={`p-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-text-muted'}`}>AI Suggestions</p>
              </div>
              <ul>
                {searchSuggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button className={`w-full px-4 py-2.5 text-left ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center`}>
                      <span className="w-6 h-6 flex items-center justify-center text-lg mr-3">{suggestion.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-text-dark'}`}>{suggestion.text}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-text-muted'} capitalize`}>{suggestion.type}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className={`p-2 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'} border-t`}>
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-text-muted'}`}>Powered by AI</p>
                  <button className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-primary'} font-medium`}>Search all results</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <button className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-white/80'}`}>
            <BellIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-white/80'}`}>
            <ChatBubbleLeftEllipsisIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          
          {getActionButton()}
        </div>
      </div>
    </header>
  );
} 