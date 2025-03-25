'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  TicketIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { toggleSidebar, setSidebarCollapsed } from '@/lib/redux/slices/uiSlice';
import demoConfigs from '../../config/demoConfigs';

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { role, clientId, clientName } = useAppSelector(state => state.demo);
  const { sidebarCollapsed } = useAppSelector(state => state.ui);
  
  // Local state for backward compatibility during migration
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if we're in the CVS context
  const isCVSContext = clientId === 'cvs';
  
  // Sync local state with Redux
  useEffect(() => {
    setIsCollapsed(sidebarCollapsed);
  }, [sidebarCollapsed]);
  
  // Store collapse state in localStorage (will be handled by Redux in the future)
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setIsCollapsed(storedState === 'true');
      dispatch(setSidebarCollapsed(storedState === 'true'));
    }
  }, [dispatch]);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    
    // Update the main content padding when sidebar collapses/expands
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isCollapsed ? '70px' : '225px'
    );
  }, [isCollapsed]);
  
  // Handle toggle sidebar click - update both local and Redux state
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    dispatch(toggleSidebar());
  };
  
  const isLinkActive = (path: string) => {
    // Special case for demo pages
    if (path === '/' && pathname.startsWith('/demos/deacons-pizza')) {
      return true;
    }
    
    // Special case for CVS pages
    if (isCVSContext) {
      if (path === '/demos/cvs-dashboard' && pathname.startsWith('/demos/cvs-dashboard')) {
        return true;
      }
      if (path === '/demos/cvs-token-management' && pathname.startsWith('/demos/cvs-token-management')) {
        return true;
      }
    }
    
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Get client-specific information
  const client = demoConfigs.clients[clientId];
  const clientLogo = client?.logo || '/kigo logo.svg';
  const clientLogoIconOnly = client?.logo || '/kigo logo only.svg';
  
  // Get CVS-specific navigation items
  const getCVSNavigationItems = () => {
    return (
      <>
        <li className="nav-item px-3 py-1">
          <Link 
            href="/demos/cvs-dashboard" 
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive('/demos/cvs-dashboard') 
                ? 'text-red-600 bg-red-50' 
                : 'text-text-dark hover:text-red-600 hover:bg-gray-100'
              }
            `}
            title="Dashboard"
          >
            <HomeIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/demos/cvs-dashboard') ? 'text-red-600' : 'text-text-muted'}`} />
            {!isCollapsed && (
              <span className={`${isLinkActive('/demos/cvs-dashboard') ? 'font-semibold' : ''}`}>
                Dashboard
              </span>
            )}
          </Link>
        </li>
        <li className="nav-item px-3 py-1">
          <Link 
            href="/demos/cvs-customers" 
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive('/demos/cvs-customers') 
                ? 'text-red-600 bg-red-50' 
                : 'text-text-dark hover:text-red-600 hover:bg-gray-100'
              }
            `}
            title="Customers"
          >
            <UserGroupIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/demos/cvs-customers') ? 'text-red-600' : 'text-text-muted'}`} />
            {!isCollapsed && <span>Customers</span>}
          </Link>
        </li>
        <li className="nav-item px-3 py-1">
          <Link 
            href="/demos/cvs-token-management" 
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive('/demos/cvs-token-management') 
                ? 'text-red-600 bg-red-50' 
                : 'text-text-dark hover:text-red-600 hover:bg-gray-100'
              }
            `}
            title="Token Management"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {!isCollapsed && <span>Tokens</span>}
          </Link>
        </li>
        <li className="nav-item px-3 py-1">
          <Link 
            href="/demos/cvs-tickets" 
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive('/demos/cvs-tickets') 
                ? 'text-red-600 bg-red-50' 
                : 'text-text-dark hover:text-red-600 hover:bg-gray-100'
              }
            `}
            title="Support Tickets"
          >
            <TicketIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/demos/cvs-tickets') ? 'text-red-600' : 'text-text-muted'}`} />
            {!isCollapsed && <span>Tickets</span>}
          </Link>
        </li>
      </>
    );
  };
  
  // Role-specific navigation items
  const getNavigationItems = () => {
    // If in CVS context, show CVS-specific navigation
    if (isCVSContext) {
      return getCVSNavigationItems();
    }
    
    switch(role) {
      case 'merchant':
        return (
          <>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Dashboard"
              >
                <HomeIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && (
                  <span className={`${isLinkActive('/') ? 'font-semibold' : ''}`}>
                    Dashboard
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/campaigns" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/campaigns') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Campaigns"
              >
                <RocketLaunchIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/campaigns') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Campaigns</span>}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/analytics" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/analytics') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Analytics"
              >
                <ChartBarIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/analytics') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Analytics</span>}
              </Link>
            </li>
          </>
        );
      case 'support':
        return (
          <>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Dashboard"
              >
                <HomeIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && (
                  <span className={`${isLinkActive('/') ? 'font-semibold' : ''}`}>
                    Dashboard
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/tickets" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/tickets') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Support Tickets"
              >
                <TicketIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/tickets') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Tickets</span>}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/merchants" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/merchants') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Merchants"
              >
                <BuildingStorefrontIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/merchants') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Merchants</span>}
              </Link>
            </li>
          </>
        );
      case 'admin':
        return (
          <>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Dashboard"
              >
                <HomeIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && (
                  <span className={`${isLinkActive('/') ? 'font-semibold' : ''}`}>
                    Dashboard
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/merchants" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/merchants') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Merchants"
              >
                <UserGroupIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/merchants') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Merchants</span>}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/analytics" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/analytics') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Analytics"
              >
                <ChartBarIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/analytics') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Analytics</span>}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/settings" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/settings') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Settings"
              >
                <Cog6ToothIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/settings') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };
  
  const getRoleTitle = () => {
    switch(role) {
      case 'merchant': return 'Business Owner';
      case 'support': return 'Support Agent';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };
  
  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen border-r border-border-light bg-white
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? 'w-[70px]' : 'w-[225px]'}
      `}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-[64px] px-4">
          {isCollapsed ? (
            <Link href="/" className="flex items-center justify-center w-full">
              <Image 
                src={isCVSContext ? "/logos/cvs-logo.svg" : "/kigo logo only.svg"}
                alt={clientName || 'Kigo'}
                width={40} 
                height={40} 
                className="transition-all duration-300"
              />
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              {isCVSContext ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">
                    CVS
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-900">Support Portal</span>
                </div>
              ) : role === 'merchant' ? (
                <div className="text-lg font-bold text-gray-800">
                  {clientName}
                </div>
              ) : (
                <Image 
                  src="/kigo logo.svg" 
                  alt="Kigo Logo" 
                  width={100} 
                  height={40} 
                  className="transition-all duration-300"
                />
              )}
            </Link>
          )}
        </div>
        
        <button 
          onClick={handleToggleSidebar}
          className="absolute top-24 -right-3 transform -translate-y-1/2 bg-white border border-border-light rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-30 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronLeftIcon className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>
        
        <div className="mt-6 mb-6 flex-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">
              {role === 'merchant' ? 'Business' : 'Main'}
            </p>
          )}
          <ul className="nav-items">
            {getNavigationItems()}
          </ul>
        </div>
        
        <div className="mb-4">
          {!isCollapsed && <p className="text-xs font-medium text-text-muted px-5 uppercase tracking-wider mb-2">Settings</p>}
          <ul className="nav-items">
            <li className="nav-item px-3 py-1">
              <Link 
                href={isCVSContext ? "/demos/cvs-settings" : "/settings"} 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive(isCVSContext ? '/demos/cvs-settings' : '/settings') 
                    ? (isCVSContext ? 'text-red-600 bg-red-50' : 'text-primary bg-primary-light')
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Settings"
              >
                <Cog6ToothIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive(isCVSContext ? '/demos/cvs-settings' : '/settings') ? (isCVSContext ? 'text-red-600' : 'text-primary') : 'text-text-muted'}`} />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/notifications" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/notifications') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Notifications"
              >
                <BellIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/notifications') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Notifications</span>}
                <span className={`bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ${isCollapsed ? 'absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center' : 'ml-auto'}`}>5</span>
              </Link>
            </li>
            <li className="nav-item px-3 py-1">
              <Link 
                href="/help" 
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/help') 
                    ? 'text-primary bg-primary-light' 
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Help & Support"
              >
                <QuestionMarkCircleIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/help') ? 'text-primary' : 'text-text-muted'}`} />
                {!isCollapsed && <span>Help & Support</span>}
              </Link>
            </li>
          </ul>
        </div>
        
        <div className={`mt-auto pt-4 ${isCollapsed ? 'px-3' : 'px-5'} border-t border-border-light`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} pb-6`}>
            <div className="w-9 h-9 bg-pastel-purple rounded-full flex items-center justify-center text-indigo-500 font-semibold text-sm shadow-sm">
              {isCVSContext ? 'SJ' : (role === 'merchant' ? 'DP' : (role === 'support' ? 'SA' : 'AD'))}
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {isCVSContext ? 'Sarah Johnson' : (role === 'merchant' ? 'Deacon Poon' : (role === 'support' ? 'Support Agent' : 'Admin User'))}
                </p>
                <p className="text-xs text-text-muted">{isCVSContext ? 'CVS Agent ID: 2358' : getRoleTitle()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 