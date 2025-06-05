
import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import VerifyEmail from '@/pages/VerifyEmail';
import ContactPage from '@/pages/ContactPage';
import MapPage from '@/pages/MapPage';

// Simple redirect component for root route
const RootRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.replace('/landing');
  }, []);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

const NotFound = lazy(() => import('@/pages/NotFound'));
const SwigCircuitsPage = lazy(() => import('@/pages/SwigCircuitsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <RootRedirect /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/map', element: <MapPage /> },
  { path: '/swig-circuits', element: <SwigCircuitsPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/404', element: <NotFound /> },
];
