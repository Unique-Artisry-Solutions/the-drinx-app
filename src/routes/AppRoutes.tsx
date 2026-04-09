import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { simplifiedPublicRoutes } from './config/simplifiedPublicRoutes';
import { individualRoutes } from './config/individualRoutes';
import PageSuspense from '@/components/loading/PageSuspense';
import { useNavigationTracking } from '@/utils/lazyRouteLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ModuleLoadingErrorBoundary from '@/components/error/ModuleLoadingErrorBoundary';
import PromoterRouteProtection from './PromoterRouteProtection';

// Direct imports for commerce and event pages - simplified routing
import CheckoutPage from '@/pages/CheckoutPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import EventDetailPage from '@/pages/EventDetailPage';
import BarCrawlDetail from '@/pages/BarCrawlDetail';
import UserSettingsPage from '@/pages/UserSettingsPage';

// Keep lazy loading only for scanner page (requires camera permissions)
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));

const AppRoutes = () => {
  useNavigationTracking();
  const location = useLocation();

  return (
    <PageSuspense>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Simplified Public Routes - No lazy loading */}
          {simplifiedPublicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Simplified Individual User Routes - Direct rendering */}
          {individualRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Simplified Commerce Routes - Direct rendering */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchase-success" element={<PurchaseSuccessPage />} />

          {/* Simplified Event Routes - Direct rendering */}
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/bar-crawl/:id" element={<BarCrawlDetail />} />

          {/* Direct Settings Route */}
          <Route path="/settings" element={<UserSettingsPage />} />

          {/* Scanner route - Keep lazy loading for camera permissions */}
          <Route 
            path="/events/scan/:eventId/:token" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <EventScannerPage />
              </PageSuspense>
            }
          />

          {/* Admin Routes - Keep complex structure */}
          {adminRoutes.map((route, index) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children && route.children.map((childRoute, childIndex) => (
                <Route 
                  key={childRoute.path || 'index'} 
                  path={childRoute.path} 
                  index={childRoute.index}
                  element={childRoute.element} 
                />
              ))}
            </Route>
          ))}

          {/* Other Protected Routes - Wrap with module loading error boundary */}
          {establishmentRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={
              <ModuleLoadingErrorBoundary>
                {route.element}
              </ModuleLoadingErrorBoundary>
            } />
          ))}

          {promoterRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={
              <PromoterRouteProtection>
                <ModuleLoadingErrorBoundary>
                  {route.element}
                </ModuleLoadingErrorBoundary>
              </PromoterRouteProtection>
            } />
          ))}

          {profileRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={
              <ModuleLoadingErrorBoundary>
                {route.element}
              </ModuleLoadingErrorBoundary>
            } />
          ))}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </PageSuspense>
  );
};

export default AppRoutes;
