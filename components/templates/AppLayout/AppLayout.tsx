"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "@/components/organisms/Header/Header";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { AIChat } from "@/components/features/ai";
import DemoSpotlight from "@/components/demo/DemoSpotlight";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";

  // Add client-side detection to avoid hydration errors
  const [isClient, setIsClient] = useState(false);

  // Ensure CSS variable matches the actual sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
    setIsClient(true);
  }, [sidebarWidth]);

  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main
          className="pt-[72px] p-6 min-h-screen overflow-auto transition-all duration-300"
          style={{
            paddingLeft: isClient ? `calc(${sidebarWidth} + 1.5rem)` : "1.5rem",
            width: "100%",
          }}
        >
          <div className="h-full w-full max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
      <AIChat />
      <DemoSpotlight />
    </div>
  );
};

export default AppLayout;
