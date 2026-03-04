/**
 * Redux store wrapper for Remotion compositions.
 * Pre-populates the store with demo state for video rendering.
 */
import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";

// Create a dedicated store instance for Remotion
// (separate from the Next.js app store)
const remotionStore = makeStore();

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={remotionStore}>{children}</Provider>;
};
