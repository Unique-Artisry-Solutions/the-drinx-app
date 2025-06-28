
import React from 'react';
import { Route } from 'react-router-dom';
import TestingPage from '@/pages/TestingPage';

export const testingRoutes = (
  <Route path="/testing" element={<TestingPage />} />
);
