'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import AppStateProvider from './AppStateProvider';

// Provider component for Redux
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppStateProvider>
        {children}
      </AppStateProvider>
    </Provider>
  );
} 