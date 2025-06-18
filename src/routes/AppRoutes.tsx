
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/SignupPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import MapPage from '@/pages/MapPage';
import CocktailDetail from '@/pages/CocktailDetail';
import BarCrawlDetail from '@/pages/BarCrawlDetail';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import NotFound from '@/pages/NotFound';
import MissionPage from '@/pages/MissionPage';
import VerifyEmail from '@/pages/VerifyEmail';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import FinancialManagementPage from '@/pages/FinancialManagementPage';
import ExplorePage from '@/pages/Explore';
import CreateRecipePage from '@/pages/CreateRecipePage';
import EstablishmentsPage from '@/pages/EstablishmentsPage';
import CocktailsPage from '@/pages/CocktailsPage';
import SocialPage from '@/pages/SocialPage';

// Import modular routes
import { establishmentRoutes } from '@/routes/config/establishmentRoutes';
import { promoterRoutes } from '@/routes/config/promoterRoutes';
import { adminRoutes } from '@/routes/config/adminRoutes';
import { profileRoutes } from '@/routes/config/profileRoutes';
import { publicRoutes } from '@/routes/config/publicRoutes';
import { individualRoutes } from '@/routes/config/individualRoutes';

// Create wrapper components for routes that need special layout props
const LandingLayout = () => <Layout forceGuestNavigation={true}><LandingPage /></Layout>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing page with forced guest navigation */}
      <Route path="/landing" element={<LandingLayout />} />
      
      {/* Public routes - these don't need layout wrapping as they handle it internally */}
      {publicRoutes.map((route, index) => (
        <Route key={`public-${index}`} path={route.path} element={route.element} />
      ))}
      
      {/* Admin routes - these have their own protection and layout */}
      {adminRoutes.map((route, index) => (
        <Route key={`admin-${index}`} path={route.path} element={route.element}>
          {route.children?.map((childRoute, childIndex) => (
            <Route key={`admin-child-${childIndex}`} path={childRoute.path} element={childRoute.element} index={childRoute.index} />
          ))}
        </Route>
      ))}
      
      {/* Establishment routes - these have their own protection */}
      {establishmentRoutes.map((route, index) => (
        <Route key={`establishment-${index}`} path={route.path} element={route.element} />
      ))}
      
      {/* Promoter routes - these have their own protection */}
      {promoterRoutes.map((route, index) => (
        <Route key={`promoter-${index}`} path={route.path} element={route.element} />
      ))}
      
      {/* Individual user routes */}
      {individualRoutes.map((route, index) => (
        <Route key={`individual-${index}`} path={route.path} element={route.element} />
      ))}
      
      {/* Profile routes */}
      {profileRoutes.map((route, index) => (
        <Route key={`profile-${index}`} path={route.path} element={route.element} />
      ))}
      
      {/* Standard layout routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="cocktails/:id" element={<CocktailDetail />} />
        <Route path="bar-crawls/:id" element={<BarCrawlDetail />} />
        <Route path="swig-circuits" element={<SwigCircuitsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="mission" element={<MissionPage />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="purchase-success" element={<PurchaseSuccessPage />} />
        <Route path="financial-management" element={<FinancialManagementPage />} />
        <Route path="create-recipe" element={<CreateRecipePage />} />
        <Route path="establishments" element={<EstablishmentsPage />} />
        <Route path="cocktails" element={<CocktailsPage />} />
        <Route path="social" element={<SocialPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
