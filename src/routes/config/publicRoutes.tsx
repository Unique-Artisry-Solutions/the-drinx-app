
import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import MissionPage from '@/pages/MissionPage';
import ResourcesPage from '@/pages/ResourcesPage';
import LegalPage from '@/pages/LegalPage';
import PricingPage from '@/pages/PricingPage';

// This export is used by routeConfig.tsx
export const publicRoutes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/mission',
    element: <MissionPage />,
  },
  {
    path: '/resources',
    element: <ResourcesPage />,
  },
  {
    path: '/legal',
    element: <LegalPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  }
];

// This component is used by AppRoutes.tsx
const PublicRoutes = () => {
  return (
    <>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default PublicRoutes;
