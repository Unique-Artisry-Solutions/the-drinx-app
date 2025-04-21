
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'

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

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);
