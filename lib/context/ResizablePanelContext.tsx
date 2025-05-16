"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface ResizablePanelContextType {
  isPanelOpen: boolean;
  panelContent: ReactNode | null;
  openPanel: (content: ReactNode) => void;
  closePanel: () => void;
  panelWidth: number;
  setPanelWidth: (width: number) => void;
  panelMinWidth: number;
  panelMaxWidth: number;
}

const ResizablePanelContext = createContext<
  ResizablePanelContextType | undefined
>(undefined);

export function ResizablePanelProvider({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<ReactNode | null>(null);
  const [panelWidth, setPanelWidth] = useState(400); // Default width
  const panelMinWidth = 320; // Minimum width
  const panelMaxWidth = 800; // Maximum width

  const openPanel = useCallback((content: ReactNode) => {
    setPanelContent(content);
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    // Clear the content after animation completes
    setTimeout(() => {
      if (!isPanelOpen) {
        setPanelContent(null);
      }
    }, 300);
  }, [isPanelOpen]);

  return (
    <ResizablePanelContext.Provider
      value={{
        isPanelOpen,
        panelContent,
        openPanel,
        closePanel,
        panelWidth,
        setPanelWidth,
        panelMinWidth,
        panelMaxWidth,
      }}
    >
      {children}
    </ResizablePanelContext.Provider>
  );
}

export function useResizablePanel() {
  const context = useContext(ResizablePanelContext);
  if (context === undefined) {
    throw new Error(
      "useResizablePanel must be used within a ResizablePanelProvider"
    );
  }
  return context;
}
