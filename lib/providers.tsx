"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./redux/store";
import { ResizablePanelProvider } from "./context/ResizablePanelContext";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ResizablePanelProvider>{children}</ResizablePanelProvider>
      </ThemeProvider>
    </Provider>
  );
}
