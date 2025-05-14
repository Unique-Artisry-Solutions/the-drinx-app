
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';
import FeatureAccessMonitoringPage from '../admin/FeatureAccessMonitoringPage';

const SettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<SystemConfigurationPage />} />
        <Route path="/feature-access" element={<FeatureAccessMonitoringPage />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default SettingsPage;
