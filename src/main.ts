
// Main Application Entry Point - Phase 9D Updated
// Uses consolidated imports for better organization

// Core React and routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Application core
import App from './App.tsx';
import './index.css';

// Context providers
import { DevelopmentModeProvider } from './contexts/DevelopmentModeContext';
import { Toaster } from './components/ui/toaster';

// Initialize QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DevelopmentModeProvider>
          <App />
          <Toaster />
        </DevelopmentModeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
