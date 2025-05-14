
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';
import FeatureAccessMonitoringPage from './admin/FeatureAccessMonitoringPage';

const SettingsPage: React.FC = () => {
  // Add console logging to confirm page is rendering
  React.useEffect(() => {
    console.log('SettingsPage rendered');
  }, []);

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
