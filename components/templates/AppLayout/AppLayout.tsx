"use client";

import { ReactNode, useEffect } from "react";
import Header from "@/components/organisms/Header/Header";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import { useAppSelector } from "@/lib/redux/hooks";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui);
  const sidebarWidth = sidebarCollapsed ? "70px" : "225px";

  // Ensure CSS variable matches the actual sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
  }, [sidebarWidth]);

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <Header />
      <main
        className="px-8 transition-all duration-300"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: "72px" /* Exactly match header height */,
        }}
      >
        <div className="h-full w-full max-w-[1600px] mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
