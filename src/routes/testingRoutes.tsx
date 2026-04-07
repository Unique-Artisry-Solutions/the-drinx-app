
import React from 'react';
import { Route } from 'react-router-dom';
import EnhancedNotificationsPage from '@/pages/notifications/enhanced/EnhancedNotificationsPage';
import Phase4TestingPage from '@/pages/notifications/enhanced/Phase4TestingPage';

export const testingRoutes = (
  <>
    <Route path="/testing/enhanced-notifications" element={<EnhancedNotificationsPage />} />
    <Route path="/testing/phase4-integration" element={<Phase4TestingPage />} />
  </>
);
