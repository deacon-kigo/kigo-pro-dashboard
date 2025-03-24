import { configureStore } from '@reduxjs/toolkit';
import demoReducer from './slices/demoSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    demo: demoReducer,
    ui: uiReducer,
    user: userReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Define RootState type for type checking
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch; 