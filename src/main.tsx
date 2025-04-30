
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'
import { isLovablePreview, getEnvironmentName, previewLog } from './utils/environment';

// Log the environment for debugging purposes
console.log('Application environment:', getEnvironmentName());

// Get the correct basename for routing
const getBasename = () => {
  // For debugging purposes
  previewLog('Current URL: ' + window.location.href);
  previewLog('Hostname: ' + window.location.hostname);
  
  // Simple implementation - use root path
  return '/';
};

// Initialize the app with the correct routing configuration
const basename = getBasename();
previewLog('Using basename: ' + basename);

// Specialized initialization for different environments
const initializeApp = () => {
  previewLog('Starting application initialization');
  
  // Always render the app first for better performance
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  createRoot(rootElement).render(
    <BrowserRouter basename={basename}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
  
  // If we're in Lovable preview, skip service worker completely
  if (isLovablePreview()) {
    previewLog('Preview mode - service worker registration skipped');
    return;
  }

  // Only register service worker in production mode after app has rendered
  previewLog('Registering service worker in background');
  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      console.log('Starting service worker registration (delayed)');
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service worker registered successfully:', registration);
        })
        .catch(error => {
          console.error('Failed to register service worker:', error);
        });
    } else {
      console.log('Service workers not supported in this browser');
    }
  }, 2000); // 2 second delay
};

// Start the application
initializeApp();
