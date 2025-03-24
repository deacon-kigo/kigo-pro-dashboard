'use client';

import { Provider } from 'react-redux';
import { store } from './store';

// Provider component for Redux
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
} 