"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ResizablePanelProvider } from "./context/ResizablePanelContext";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ResizablePanelProvider>{children}</ResizablePanelProvider>
    </Provider>
  );
}
