
import React from 'react';
import { Route } from 'react-router-dom';
import TestingPage from '@/pages/TestingPage';
import ServiceFeeTest from '@/pages/ServiceFeeTest';
import AdminSystemTestPage from '@/pages/AdminSystemTestPage';

export const testingRoutes = (
  <>
    <Route path="/testing" element={<TestingPage />} />
    <Route path="/service-fee-test" element={<ServiceFeeTest />} />
    <Route path="/admin-system-test" element={<AdminSystemTestPage />} />
  </>
);
