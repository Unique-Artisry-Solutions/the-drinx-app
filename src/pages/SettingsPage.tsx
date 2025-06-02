
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SimpleSystemSettings from '@/components/admin/SimpleSystemSettings';

const SettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<SimpleSystemSettings />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default SettingsPage;
