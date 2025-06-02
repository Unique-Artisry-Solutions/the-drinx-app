
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import SimpleUserManagement from '@/components/admin/SimpleUserManagement';

const AdminUsersPage: React.FC = () => {
  return (
    <AdminLayout>
      <SimpleUserManagement />
    </AdminLayout>
  );
};

export default AdminUsersPage;
