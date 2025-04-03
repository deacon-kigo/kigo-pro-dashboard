'use client';

import { useState, useEffect } from 'react';
import Sidebar from "../components/organisms/Sidebar";
import Header from "../components/organisms/Header";
import { AIChat } from "../components/features/ai";
import DemoSpotlight from "../components/demo/DemoSpotlight";
import { useAppSelector } from "@/lib/redux/hooks";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useAppSelector(state => state.ui);
  
  // Add client-side detection to avoid hydration errors
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div className="flex min-h-screen bg-bg-light">
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