'use client';

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import AIChat from "../components/ai-assistant/AIChat";
import DemoSpotlight from "../components/demo/DemoSpotlight";
import AppStateProvider from "@/lib/redux/AppStateProvider";
import { useAppSelector } from "@/lib/redux/hooks";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useAppSelector(state => state.ui);
  
  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main 
          className="pt-[72px] p-6 min-h-screen overflow-auto transition-all duration-300"
          style={{ 
            paddingLeft: `calc(${sidebarWidth} + 1.5rem)`,
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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <MainLayout>{children}</MainLayout>
    </AppStateProvider>
  );
} 