
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import VerifyEmail from '@/pages/VerifyEmail';
import ContactPage from '@/pages/ContactPage';
import MapPage from '@/pages/MapPage';

const NotFound = lazy(() => import('@/pages/NotFound'));
const SwigCircuitsPage = lazy(() => import('@/pages/SwigCircuitsPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
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
