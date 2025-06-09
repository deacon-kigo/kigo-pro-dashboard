"use client";

import React, { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/organisms/Header/Header";
import Sidebar from "@/components/organisms/Sidebar/Sidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { AIChat } from "@/components/features/ai";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import {
  ResizablePanelProvider,
  useResizablePanel,
} from "@/lib/context/ResizablePanelContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface AppLayoutProps {
  children: ReactNode;
  customBreadcrumb?: ReactNode;
}

// A wrapper component that uses the context
function AppLayoutContent({ children, customBreadcrumb }: AppLayoutProps) {
  const { sidebarWidth } = useAppSelector((state) => state.ui);
  const pathname = usePathname();
  const { isPanelOpen, panelContent, panelMinWidth, panelMaxWidth } =
    useResizablePanel();

  // Removed client-side detection - relying entirely on Redux state

  // Simple inline style using Redux state directly
  const mainContentStyle = {
    paddingLeft: `calc(${sidebarWidth} + 1.5rem)`,
    transition: "padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    if (!pathname) return null;

    // Skip generating breadcrumbs for home page
    if (pathname === "/") return null;

    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) return null;

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const formattedSegment = segment
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {formattedSegment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  // Determine the layout based on whether the panel is open
  if (!isPanelOpen) {
    return (
      <div className="flex min-h-screen bg-bg-light">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <Header />
          <main
            className="pt-[72px] p-6 min-h-screen overflow-hidden transition-all duration-300 ease-in-out will-change-padding"
            style={mainContentStyle}
          >
            <div className="h-full w-full pt-4">
              {customBreadcrumb || getBreadcrumbItems()}
              {children}
            </div>
          </main>
        </div>
        <AIChat />
      </div>
    );
  }

  // Layout with resizable panel
  return (
    <div className="flex min-h-screen bg-bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header />
        <main
          className="pt-[72px] min-h-screen overflow-hidden transition-all duration-300 ease-in-out"
          style={mainContentStyle}
        >
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Main content panel */}
            <ResizablePanel defaultSize={80} minSize={50}>
              <div className="h-full p-6">
                <div className="h-full w-full pt-4">
                  {customBreadcrumb || getBreadcrumbItems()}
                  {children}
                </div>
              </div>
            </ResizablePanel>

            {/* Resizable handle */}
            <ResizableHandle withHandle />

            {/* Side panel */}
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={40}
              className="border-l border-border-light bg-white"
            >
              <div className="h-full p-6">{panelContent}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <AIChat />
    </div>
  );
}

// Export the main component that provides the context
export const AppLayout = (props: AppLayoutProps) => {
  return <AppLayoutContent {...props} />;
};

export default AppLayout;
