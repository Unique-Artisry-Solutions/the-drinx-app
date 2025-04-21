
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './index.css'

// Get the correct basename for preview URLs
const getBasename = () => {
  const { hostname } = window.location;
  if (hostname.includes('lovable.app')) {
    // Extract the basename for preview URLs
    const parts = hostname.split('--');
    if (parts.length === 2) {
      return `/${parts[0]}`;
    }
  }
  return '/';
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={getBasename()}>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);
