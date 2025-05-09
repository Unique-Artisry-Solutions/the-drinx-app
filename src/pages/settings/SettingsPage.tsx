
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';
import FeatureAccessMonitoringPage from '../admin/FeatureAccessMonitoringPage';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <Routes>
        <Route path="/" element={<SystemConfigurationPage />} />
        <Route path="/feature-access" element={<FeatureAccessMonitoringPage />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  );
};

export default SettingsPage;
