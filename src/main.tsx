
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'
import { isPreviewEnvironment } from './utils/environment';

// Register service worker only if not in preview environment
const registerServiceWorker = async () => {
  // Skip service worker registration in preview environment
  if (isPreviewEnvironment()) {
    console.log('Preview environment detected: skipping service worker registration');
    return null;
  }
  
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully:', registration);

      // Wait for the service worker to be active
      if (registration.installing) {
        console.log('Service Worker installing');
        
        registration.installing.addEventListener('statechange', () => {
          if (registration.active) {
            console.log('Service Worker activated');
          }
        });
      }

      // Return registration for potential use
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Service Workers are not supported in this browser');
    return null;
  }
};

// Get the correct basename for preview URLs
const getBasename = () => {
  // For debugging purposes
  console.log('Current URL:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  
  const { hostname, pathname } = window.location;
  
  // Check if we're on a Lovable preview URL
  if (hostname.includes('lovable.app')) {
    console.log('Detected Lovable preview URL');
    
    // For preview URLs, no basename is needed as the server handles it
    return '/';
  }
  
  // Default case - use root path
  console.log('Using default basename: /');
  return '/';
};

// Initialize the app with the correct routing configuration
const basename = getBasename();
console.log('Using basename:', basename);

// Conditional service worker registration
const initializeApp = async () => {
  try {
    // Only register service worker if not in preview
    if (!isPreviewEnvironment()) {
      await registerServiceWorker();
    } else {
      console.log('Preview environment detected: skipping service worker registration');
    }
  } catch (error) {
    console.error('Failed to register service worker, continuing without it:', error);
  }
  
  // Always render the app regardless of service worker status
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={basename}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
};

// Start the application
initializeApp();
