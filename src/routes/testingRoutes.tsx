
import React from 'react';
import { Route } from 'react-router-dom';
import TestingPage from '@/pages/TestingPage';
import ServiceFeeTest from '@/pages/ServiceFeeTest';
import AdminSystemTestPage from '@/pages/AdminSystemTestPage';
import EnhancedNotificationsPage from '@/pages/notifications/enhanced/EnhancedNotificationsPage';
import Phase4TestingPage from '@/pages/notifications/enhanced/Phase4TestingPage';

export const testingRoutes = (
  <>
    <Route path="/testing" element={<TestingPage />} />
    <Route path="/service-fee-test" element={<ServiceFeeTest />} />
    <Route path="/admin-system-test" element={<AdminSystemTestPage />} />
    <Route path="/testing/enhanced-notifications" element={<EnhancedNotificationsPage />} />
    <Route path="/testing/phase4-integration" element={<Phase4TestingPage />} />
  </>
);
