
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'
import { isLovablePreview } from './utils/environment';

// Log the environment for debugging purposes
console.log('Application environment:', isLovablePreview() ? 'Lovable Preview' : 'Production/Development');

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

// Always render immediately for better performance, especially in preview
console.log('Rendering application immediately');
renderApp();

// Only attempt to register service worker in non-preview environments
if (!isLovablePreview()) {
  console.log('Will register service worker in background for non-preview environment');
  // Delay service worker registration to prioritize app rendering
  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      console.log('Starting service worker registration (delayed)');
      navigator.serviceWorker.register('/service-worker.js').catch(error => {
        console.error('Failed to register service worker, continuing without it:', error);
      });
    } else {
      console.log('Service workers not supported in this browser');
    }
  }, 2000); // 2 second delay
} else {
  console.log('Service worker registration skipped for Lovable preview');
}
