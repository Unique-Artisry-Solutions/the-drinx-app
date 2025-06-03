
import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import { TabSystemMigration } from '@/components/admin/migration/TabSystemMigration';

const AdminDashboardWithMigration: React.FC = () => {
  const [useNewTabSystem, setUseNewTabSystem] = useState(false);

  const handleToggleSystem = () => {
    setUseNewTabSystem(prev => !prev);
  };

  return (
    <div>
      <TabSystemMigration
        currentSystem={useNewTabSystem ? 'new' : 'legacy'}
        onToggleSystem={handleToggleSystem}
        pageTitle="Admin Dashboard"
        migrationStatus="in-progress"
      />
      <AdminDashboard useNewTabSystem={useNewTabSystem} />
    </div>
  );
};

export default AdminDashboardWithMigration;
