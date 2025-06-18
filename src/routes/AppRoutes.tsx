
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

// Create wrapper components for routes that need special layout props
const LandingLayout = () => <Layout forceGuestNavigation={true}><LandingPage /></Layout>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Landing page with forced guest navigation */}
      <Route path="/landing" element={<LandingLayout />} />
      
      {/* All other routes use standard layout */}
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
