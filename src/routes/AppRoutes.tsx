
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { simplifiedRoutes } from './config/flattenedRoutes';
import PageSuspense from '@/components/loading/PageSuspense';
import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <PageSuspense>
      <Routes location={location} key={location.pathname}>
        {simplifiedRoutes.map((route, index) => (
          <Route 
            key={route.path || `route-${index}`} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
    </PageSuspense>
  );
};

export default AppRoutes;
