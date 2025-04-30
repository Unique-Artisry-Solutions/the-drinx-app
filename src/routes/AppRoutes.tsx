
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { publicRoutes } from './config/publicRoutes';
import { isLovablePreview } from '@/utils/environment';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-4 text-gray-600">Loading application...</p>
      {isLovablePreview() && <p className="mt-2 text-blue-500 text-sm">Running in Lovable Preview Mode</p>}
    </div>
  </div>
);

const AppRoutes = () => {
  if (isLovablePreview()) {
    console.log('Rendering optimized routes for Lovable preview');
  }
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Establishment Routes */}
        {establishmentRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Promoter Routes */}
        {promoterRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Profile Routes */}
        {profileRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
