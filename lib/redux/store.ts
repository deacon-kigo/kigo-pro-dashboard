import { configureStore } from "@reduxjs/toolkit";
import demoReducer from "./slices/demoSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import cvsTokenReducer from "./slices/cvsTokenSlice";
import featureConfigReducer from "./slices/featureConfigSlice";
import analyticsReducer from "./slices/analyticsSlice";
import externalTicketingReducer from "./slices/externalTicketingSlice";
import sessionReducer from "./slices/sessionSlice";
import { useDispatch } from "react-redux";
import { ActionWithType } from "../../types/redux";

// Simple flag to disable all middleware logging if needed
const ENABLE_ACTION_LOGGING = true;

// Simple set to track the types of actions we've already seen
const seenActionTypes = new Set<string>();

// Simplified middleware that avoids accessing store state during action processing
const demoActionLoggerMiddleware =
  (store: any) => (next: any) => (action: any) => {
    // Process the action first to ensure proper flow
    const result = next(action);

    // Only log if logging is enabled
    if (
      ENABLE_ACTION_LOGGING &&
      typeof action.type === "string" &&
      action.type.startsWith("demo/")
    ) {
      // Only log new action types we haven't seen before to reduce console noise
      if (!seenActionTypes.has(action.type)) {
        console.log(`Redux: First occurrence of action ${action.type}`);
        seenActionTypes.add(action.type);
      }

      // For debugging specific actions, uncomment this
      // console.log(`Redux: Action ${action.type} processed with payload:`, action.payload);
    }

    return result;
  };

export const store = configureStore({
  reducer: {
    demo: demoReducer,
    ui: uiReducer,
    user: userReducer,
    cvsToken: cvsTokenReducer,
    featureConfig: featureConfigReducer,
    analytics: analyticsReducer,
    externalTicketing: externalTicketingReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(demoActionLoggerMiddleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
