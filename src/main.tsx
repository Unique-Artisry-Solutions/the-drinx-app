
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'

// Helper to detect Lovable preview environment
const isLovablePreview = () => {
  try {
    // Check if we're in an iframe (Lovable preview uses iframe)
    const isInIframe = window !== window.parent;
    
    // Check for specific URL patterns or parameters of Lovable
    const isLovableDomain = window.location.hostname.includes('lovable');
    
    // Check if window has specific Lovable properties
    const hasLovableProps = 'LovablePreview' in window || 
                           document.querySelector('meta[name="lovable-preview"]') !== null;
    
    return isInIframe || isLovableDomain || hasLovableProps;
  } catch (e) {
    // If accessing window.parent throws a security error, we're likely in a cross-origin iframe
    console.log('Error detecting environment, assuming Lovable preview:', e);
    return true;
  }
};

// Register service worker
const registerServiceWorker = async () => {
  // Skip service worker in Lovable preview
  if (isLovablePreview()) {
    console.log('Running in Lovable preview - skipping service worker registration');
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

// Render the app first, then register service worker
const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={basename}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
};

// Render immediately for better performance in Lovable
renderApp();

// Register service worker in background after app is loaded
if (!isLovablePreview()) {
  // Delay service worker registration to prioritize app rendering
  setTimeout(() => {
    registerServiceWorker().catch(error => {
      console.error('Failed to register service worker, continuing without it:', error);
    });
  }, 2000); // 2 second delay
}
