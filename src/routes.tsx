import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import Contact from './routes/Contact';
import NotFound from './routes/NotFound';
import Login from './routes/Login';
import Register from './routes/Register';
import Profile from './routes/Profile';
import EstablishmentProfile from './routes/establishments/EstablishmentProfile';
import EstablishmentDashboard from './routes/establishments/EstablishmentDashboard';
import AdminDashboard from './routes/admin/AdminDashboard';
import BarCrawls from './routes/BarCrawls';
import BarCrawlDetails from './routes/BarCrawlDetails';
import EventsDashboard from './routes/admin/EventsDashboard';
import EventDetails from './routes/EventDetails';
import CreateEvent from './routes/admin/CreateEvent';
import EditEvent from './routes/admin/EditEvent';
import MocktailBuilder from './routes/MocktailBuilder';
import UserManagement from './routes/admin/UserManagement';
import ContentManagement from './routes/admin/ContentManagement';
import RewardsManagement from './routes/admin/RewardsManagement';
import SystemConfiguration from './routes/admin/SystemConfiguration';
import AnalyticsDashboard from './routes/admin/AnalyticsDashboard';
import PromoterApplication from './routes/PromoterApplication';
import PromoterDashboard from './routes/promoter/PromoterDashboard';
import VenueManagement from './routes/promoter/VenueManagement';
import VenueDetails from './routes/VenueDetails';
import VenueEditor from './routes/admin/VenueEditor';
import EventMarketing from './routes/admin/EventMarketing';
import AudienceManagement from './routes/admin/AudienceManagement';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/establishments/:id",
    element: <EstablishmentProfile />,
  },
  {
    path: "/establishments/:id/dashboard",
    element: <EstablishmentDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/bar-crawls",
    element: <BarCrawls />,
  },
  {
    path: "/bar-crawls/:id",
    element: <BarCrawlDetails />,
  },
  {
    path: "/admin/events",
    element: <EventsDashboard />,
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
  },
  {
    path: "/admin/events/create",
    element: <CreateEvent />,
  },
  {
    path: "/admin/events/edit/:id",
    element: <EditEvent />,
  },
  {
    path: "/mocktail-builder",
    element: <MocktailBuilder />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/content",
    element: <ContentManagement />,
  },
  {
    path: "/admin/rewards",
    element: <RewardsManagement />,
  },
  {
    path: "/admin/system",
    element: <SystemConfiguration />,
  },
  {
    path: "/admin/analytics",
    element: <AnalyticsDashboard />,
  },
  {
    path: "/promoter-application",
    element: <PromoterApplication />,
  },
  {
    path: "/promoter/dashboard",
    element: <PromoterDashboard />,
  },
  {
    path: "/promoter/venues",
    element: <VenueManagement />,
  },
  {
    path: "/venues/:id",
    element: <VenueDetails />,
  },
  {
    path: "/admin/venues/edit/:id",
    element: <VenueEditor />,
  },
  {
    path: "/admin/events/:eventId/marketing",
    element: <EventMarketing />,
  },
  {
    path: "/admin/audience",
    element: <AudienceManagement />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
