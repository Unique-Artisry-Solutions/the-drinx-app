
import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import MapPage from '@/pages/MapPage';
import Explore from '@/pages/Explore';
import EstablishmentDetail from '@/pages/EstablishmentDetail';
import CocktailDetail from '@/pages/CocktailDetail';
import BarCrawlDetail from '@/pages/BarCrawlDetail';
import BarCrawlProfilePage from '@/pages/BarCrawlProfilePage';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import VerifyEmail from '@/pages/VerifyEmail';
import EmailVerificationHandler from '@/routes/EmailVerificationHandler';
import PrivacyPolicy from '@/pages/LegalPage';
import ResourcesPage from '@/pages/ResourcesPage';
import MissionPage from '@/pages/MissionPage';
import PricingPage from '@/pages/PricingPage';
import NotFound from '@/pages/NotFound';

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <Index /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/map', element: <MapPage /> },
  { path: '/explore', element: <Explore /> },
  { path: '/establishment/:id', element: <EstablishmentDetail /> },
  { path: '/cocktail/:id', element: <CocktailDetail /> },
  { path: '/bar-crawl/:id', element: <BarCrawlDetail /> },
  { path: '/bar-crawl-details/:id', element: <BarCrawlProfilePage /> },
  { path: '/swig-circuits', element: <SwigCircuitsPage /> },
  { path: '/swig-circuits/:id', element: <BarCrawlDetail /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/verification', element: <EmailVerificationHandler /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/resources', element: <ResourcesPage /> },
  { path: '/mission', element: <MissionPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/404', element: <NotFound /> },
];
