
import React from 'react';
import { Route } from 'react-router-dom';
import TestingPage from '@/pages/TestingPage';
import ServiceFeeTest from '@/pages/ServiceFeeTest';

export const testingRoutes = (
  <>
    <Route path="/testing" element={<TestingPage />} />
    <Route path="/service-fee-test" element={<ServiceFeeTest />} />
  </>
);
