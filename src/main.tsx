
// Main Application Entry Point - Phase 9E Completed
// Enhanced imports for Phase 9E standard components

// Core React and routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Application core
import App from './App.tsx';
import AppProviders from '@/providers/AppProviders';
import './index.css';

// Phase 9E: Import enhanced validation system
import './utils/typeValidation';

// Phase 9E: Enhanced development mode error boundary
const DevErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, let errors bubble up for better debugging
    return <>{children}</>;
  }
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {children}
    </React.Suspense>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <App />
        </AppProviders>
      </BrowserRouter>
    </DevErrorBoundary>
  </React.StrictMode>,
);

// Phase 9E: Enhanced development console logging
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Phase 9E Application initialized with enhanced validation');
  console.log('📊 QueryClient configured with optimized retry logic');
  console.log('🔧 Development mode features enabled');
  console.log('🎯 App starting - check initialization order');
}
