import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
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

// Create a presentational-only version of the Sidebar
const PresentationalSidebar = ({ 
  isCollapsed = false,
  role = 'merchant',
  clientId = 'deacons',
  clientName = 'Deacon\'s Pizza',
  pathname = '/',
  onToggleSidebar = () => {}
}: {
  isCollapsed?: boolean;
  role?: 'merchant' | 'support' | 'admin';
  clientId?: string;
  clientName?: string;
  pathname?: string;
  onToggleSidebar?: () => void;
}) => {
  // Check if we're in the CVS context
  const isCVSContext = clientId === 'cvs' || pathname.includes('cvs-');
  
  // CVS brand colors for gradients
  const cvsBlue = '#2563EB';
  const cvsRed = '#CC0000';
  
  const isLinkActive = (path: string): boolean => {
    // Basic path matching for presentation
    if (pathname === path) return true;
    if (path.includes('token-management') && (pathname.includes('token-management') || pathname.includes('cvs-token-management'))) {
      return true;
    }
    if (path.includes('/dashboard') && (pathname === '/' || pathname.includes('dashboard'))) {
      return true;
    }
    return false;
  };

  // Client logos
  const clientLogos: Record<string, { logo: string; logoOnly: string }> = {
    deacons: { 
      logo: '/logos/deacons.svg',
      logoOnly: '/logos/deacons-icon.svg'
    },
    cvs: {
      logo: '/logos/cvs-logo.svg',
      logoOnly: '/logos/cvs-logo-only.svg'
    },
    support: {
      logo: '/kigo logo.svg',
      logoOnly: '/kigo logo only.svg'
    },
    admin: {
      logo: '/kigo logo.svg',
      logoOnly: '/kigo logo only.svg'
    }
  };

  const client = clientLogos[clientId] || clientLogos.support;
  const clientLogo = client.logo;
  const clientLogoIconOnly = client.logoOnly;
  
  // Get CVS-specific navigation items
  const getCVSNavigationItems = () => {
    const dashboardUrl = `/cvs/dashboard`;
    const customersUrl = `/cvs/token-management`;
    const tokenManagementUrl = `/cvs/token-catalog`;
    const ticketsUrl = `/cvs/tickets`;
    
    return (
      <>
        <li className="nav-item px-3 py-1">
          <a 
            href="#"
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive(dashboardUrl) 
                ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-800' 
                : 'text-text-dark hover:text-gray-800 hover:bg-gray-100'
              }
            `}
            title="Dashboard"
          >
            <HomeIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive(dashboardUrl) ? 'text-gray-800' : 'text-text-muted'}`} />
            {!isCollapsed && (
              <span className={`${isLinkActive(dashboardUrl) ? 'font-semibold' : ''} ${isLinkActive(dashboardUrl) ? 'bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent' : ''}`}>
                Dashboard
              </span>
            )}
          </a>
        </li>
        <li className="nav-item px-3 py-1">
          <a 
            href="#"
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive(customersUrl) 
                ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-800' 
                : 'text-text-dark hover:text-gray-800 hover:bg-gray-100'
              }
            `}
            title="Customers"
          >
            <UserGroupIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive(customersUrl) ? 'text-gray-800' : 'text-text-muted'}`} />
            {!isCollapsed && (
              <span className={`${isLinkActive(customersUrl) ? 'font-semibold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent' : ''}`}>
                Customers
              </span>
            )}
          </a>
        </li>
        <li className="nav-item px-3 py-1">
          <a 
            href="#"
            className={`
              flex items-center py-2 text-sm font-medium rounded-md
              ${isCollapsed ? 'justify-center px-2' : 'px-3'}
              ${isLinkActive(tokenManagementUrl) 
                ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-800' 
                : 'text-text-dark hover:text-gray-800 hover:bg-gray-100'
              }
            `}
            title="Token Management"
          >
            <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive(tokenManagementUrl) ? 'text-gray-800' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {!isCollapsed && (
              <span className={`${isLinkActive(tokenManagementUrl) ? 'font-semibold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent' : ''}`}>
                Tokens
              </span>
            )}
          </a>
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
              <a 
                href="#"
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
              </a>
            </li>
            <li className="nav-item px-3 py-1">
              <a 
                href="#"
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
              </a>
            </li>
            <li className="nav-item px-3 py-1">
              <a 
                href="#"
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
              </a>
            </li>
          </>
        );
      case 'support':
        return (
          <>
            <li className="nav-item px-3 py-1">
              <a 
                href="#"
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
              </a>
            </li>
            <li className="nav-item px-3 py-1">
              <a 
                href="#"
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
              </a>
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
        <div className={`flex items-center h-[64px] px-4 ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? (
            <a href="#" className="flex flex-col items-center justify-center w-full">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <span style={{fontSize: '0px'}}>Logo</span>
                {isCVSContext ? 
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" fill="#CC0000"/>
                    <path d="M5 12 L19 12 M12 5 L12 19" stroke="white" strokeWidth="2" />
                  </svg>
                  :
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4F46E5"/>
                    <path d="M8 12 L11 15 L16 9" stroke="white" strokeWidth="2" />
                  </svg>
                }
              </div>
            </a>
          ) : (
            <a href="#" className="flex items-center">
              {isCVSContext ? (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                    CVS Portal
                  </div>
                </div>
              ) : role === 'merchant' ? (
                <div className="text-lg font-bold text-gray-800">
                  {clientName}
                </div>
              ) : (
                <div className="text-lg font-bold text-indigo-600">Kigo</div>
              )}
            </a>
          )}
        </div>
        
        <button 
          onClick={onToggleSidebar}
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
              <a 
                href="#"
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/settings') 
                    ? (isCVSContext ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-800' : 'text-primary bg-primary-light')
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Settings"
              >
                <Cog6ToothIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/settings') ? (isCVSContext ? 'text-gray-800' : 'text-primary') : 'text-text-muted'}`} />
                {!isCollapsed && (
                  <span className={`${isLinkActive('/settings') && isCVSContext ? 'font-semibold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent' : ''}`}>
                    Settings
                  </span>
                )}
              </a>
            </li>
            <li className="nav-item px-3 py-1">
              <a 
                href="#"
                className={`
                  flex items-center py-2 text-sm font-medium rounded-md
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isLinkActive('/notifications') 
                    ? (isCVSContext ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-800' : 'text-primary bg-primary-light')
                    : 'text-text-dark hover:text-primary hover:bg-gray-100'
                  }
                `}
                title="Notifications"
              >
                <BellIcon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isLinkActive('/notifications') ? (isCVSContext ? 'text-gray-800' : 'text-primary') : 'text-text-muted'}`} />
                {!isCollapsed && (
                  <span className={`${isLinkActive('/notifications') && isCVSContext ? 'font-semibold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent' : ''}`}>
                    Notifications
                  </span>
                )}
                {!isCollapsed && (
                  <span className="bg-pastel-red text-red-600 text-xs rounded-full px-1.5 py-0.5 ml-auto">5</span>
                )}
              </a>
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
};

// Now set up the meta for the presentational component
const meta: Meta<typeof PresentationalSidebar> = {
  component: PresentationalSidebar,
  title: 'Organisms/Sidebar',
  parameters: {
    docs: {
      description: {
        component: 'Navigation sidebar that adapts based on user role and context. Can be collapsed or expanded.'
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isCollapsed: { control: 'boolean' },
    role: { 
      control: 'select', 
      options: ['merchant', 'support', 'admin'] 
    },
    clientId: { 
      control: 'select', 
      options: ['deacons', 'cvs', 'support', 'admin'] 
    },
    pathname: { control: 'text' },
  }
};

export default meta;
type Story = StoryObj<typeof PresentationalSidebar>;

export const MerchantSidebar: Story = {
  args: {
    isCollapsed: false,
    role: 'merchant',
    clientId: 'deacons',
    clientName: 'Deacon\'s Pizza',
    pathname: '/'
  },
};

export const SupportSidebar: Story = {
  args: {
    isCollapsed: false,
    role: 'support',
    clientId: 'support',
    clientName: 'Support Portal',
    pathname: '/tickets'
  },
};

export const CVSSidebar: Story = {
  args: {
    isCollapsed: false,
    role: 'support',
    clientId: 'cvs',
    clientName: 'CVS Health',
    pathname: '/cvs/dashboard'
  },
};

export const CollapsedSidebar: Story = {
  args: {
    isCollapsed: true,
    role: 'merchant',
    clientId: 'deacons',
    clientName: 'Deacon\'s Pizza',
    pathname: '/'
  },
};

export const AdminSidebar: Story = {
  args: {
    isCollapsed: false,
    role: 'admin',
    clientId: 'admin',
    clientName: 'Admin Portal',
    pathname: '/settings'
  },
}; 