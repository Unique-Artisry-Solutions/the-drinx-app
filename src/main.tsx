
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'

// Register service worker
const registerServiceWorker = async () => {
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

// Register service worker before mounting the app
registerServiceWorker().then(() => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={basename}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}).catch(error => {
  console.error('Failed to register service worker, continuing without it:', error);
  // Still render the app even if service worker registration fails
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={basename}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
});

