
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SimpleAdminDashboard from '@/components/admin/SimpleAdminDashboard';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <SimpleAdminDashboard />
    </AdminLayout>
  );
};

export default AdminDashboard;
