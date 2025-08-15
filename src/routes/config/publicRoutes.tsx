
import React from 'react';
import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import VerifyEmail from '@/pages/VerifyEmail';
import ContactPage from '@/pages/ContactPage';
import MapPage from '@/pages/MapPage';
import LegalPage from '@/pages/LegalPage';

// Simple redirect component for root route using Navigate component
const RootRedirect: React.FC = () => {
  console.log('🔄 Root redirect: redirecting to /landing');
  
  return (
    <Navigate to="/landing" replace />
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
  { path: '/legal', element: <LegalPage /> },
  { path: '/map', element: <MapPage /> },
  { path: '/swig-circuits', element: <SwigCircuitsPage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/404', element: <NotFound /> },
];
