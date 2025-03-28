import { configureStore } from '@reduxjs/toolkit';
import demoReducer from './slices/demoSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import cvsTokenReducer from './slices/cvsTokenSlice';
import featureConfigReducer from './slices/featureConfigSlice';
import analyticsReducer from './slices/analyticsSlice';
import externalTicketingReducer from './slices/externalTicketingSlice';
import { useDispatch } from 'react-redux';
import { ActionWithType } from '../../types/redux';

// Custom middleware for logging only, NO URL SYNC
const demoActionLoggerMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Log demo-related actions for debugging
  if (
    typeof action.type === 'string' && 
    action.type.startsWith('demo/')
  ) {
    const { demo } = store.getState();
    console.log(`Redux: Action ${action.type} processed`, {
      clientId: demo.clientId,
      scenario: demo.scenario
    });
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
    externalTicketing: externalTicketingReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(demoActionLoggerMiddleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 