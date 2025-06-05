import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { simplifiedPublicRoutes } from './config/simplifiedPublicRoutes';
import { individualRoutes } from './config/individualRoutes';
import { SmartRouteWrapper } from '@/components/routing/SmartRouteWrapper';
import PageSuspense from '@/components/loading/PageSuspense';
import { useNavigationTracking } from '@/utils/lazyRouteLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Direct imports for commerce and event pages - simplified routing
import CheckoutPage from '@/pages/CheckoutPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import EventDetailPage from '@/pages/EventDetailPage';
import BarCrawlDetail from '@/pages/BarCrawlDetail';

// Keep lazy loading only for scanner page (requires camera permissions)
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));

const AppRoutes = () => {
  useNavigationTracking();
  const location = useLocation();

  return (
    <SmartRouteWrapper>
      <PageSuspense>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Simplified Public Routes - No complex context needed */}
            {simplifiedPublicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Simplified Individual User Routes - Basic auth only */}
            {individualRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Simplified Commerce Routes - Direct rendering */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />

            {/* Simplified Event Routes - Direct rendering */}
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/bar-crawl/:id" element={<BarCrawlDetail />} />

            {/* Scanner route - Keep lazy loading for camera permissions */}
            <Route 
              path="/events/scan/:eventId/:token" 
              element={
                <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                  <EventScannerPage />
                </PageSuspense>
              }
            />

            {/* Protected Routes - These get complex auth context automatically */}
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

            {establishmentRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {promoterRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {profileRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AnimatePresence>
      </PageSuspense>
    </SmartRouteWrapper>
  );
};

export default AppRoutes;
