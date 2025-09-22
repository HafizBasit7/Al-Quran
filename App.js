import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from './src/contexts/SettingsContext';
import Navigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation />
      </QueryClientProvider>
    </SettingsProvider>
  );
}