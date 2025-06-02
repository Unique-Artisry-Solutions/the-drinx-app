
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SimpleSystemSettings from '@/components/admin/SimpleSystemSettings';

const SystemConfigurationPage: React.FC = () => {
  return (
    <AdminLayout>
      <SimpleSystemSettings />
    </AdminLayout>
  );
};

export default SystemConfigurationPage;
