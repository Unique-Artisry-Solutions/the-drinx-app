
import React from 'react';
import { Route } from 'react-router-dom';
import ExplorePage from '@/pages/ExplorePage';
import Explore from '@/pages/Explore';
import NotFound from '@/pages/NotFound';

// Individual user routes - accessible to all users
export const individualRoutes = [
  {
    path: '/explore',
    element: <ExplorePage />,
  },
  {
    path: '/map',
    element: <Explore />, // Using Explore page which has map functionality
  },
  {
    path: '/cocktails',
    element: <Explore />, // Using Explore page which shows cocktails
  },
  {
    path: '/404',
    element: <NotFound />,
  }
];

// This component is used by AppRoutes.tsx
const IndividualRoutes = () => {
  return (
    <>
      {individualRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default IndividualRoutes;
