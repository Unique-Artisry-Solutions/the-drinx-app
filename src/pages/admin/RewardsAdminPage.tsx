
import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { RewardsAdminPage as RewardsAdmin } from '@/components/admin/rewards/RewardsAdminPage';

export default function RewardsAdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader onLogout={() => {}} />
      <div className="container mx-auto p-6 max-w-7xl">
        <RewardsAdmin />
      </div>
    </div>
  );
}
