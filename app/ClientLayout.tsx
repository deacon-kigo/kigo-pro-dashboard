'use client';

import { useState, useEffect } from 'react';
import Sidebar from "../components/organisms/Sidebar";
import Header from "../components/organisms/Header";
import { AIChat } from "../components/features/ai";
import DemoSpotlight from "../components/demo/DemoSpotlight";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, sidebarWidth } = useAppSelector(state => state.ui);
  
  // Add client-side detection to avoid hydration errors
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Apply CSS variable for sidebar width (redundant but ensures consistency)
    const widthValue = sidebarCollapsed ? '70px' : '225px';
    document.documentElement.style.setProperty('--sidebar-width', widthValue);
    
    // Add a class to the body for global styling
    document.body.classList.add('has-sidebar');
    
    return () => {
      document.body.classList.remove('has-sidebar');
    };
  }, [sidebarCollapsed]);
  
  return (
    <div className="flex min-h-screen bg-bg-light">
      <style jsx global>{`
        /* Global styles for sidebar consistency */
        body.has-sidebar main {
          transition: padding-left 0.3s ease-in-out;
        }
        
        /* Ensure content doesn't overflow on small screens */
        @media (max-width: 768px) {
          body.has-sidebar main {
            padding-left: 1.5rem !important;
          }
        }
      `}</style>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main 
          className="pt-[72px] p-6 min-h-screen overflow-auto transition-all duration-300"
          style={{ 
            paddingLeft: isClient ? `calc(${sidebarWidth} + 1.5rem)` : '1.5rem',
            width: '100%'
          }}
        >
          {children}
        </main>
      </div>
      <AIChat />
      <DemoSpotlight />
    </div>
  );
} 