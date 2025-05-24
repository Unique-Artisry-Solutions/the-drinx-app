
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import EmailVerificationPage from '@/pages/EmailVerificationPage';

const NotFound = lazy(() => import('@/pages/NotFound'));

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },
  { path: '/404', element: <NotFound /> },
];
