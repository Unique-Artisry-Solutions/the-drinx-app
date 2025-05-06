
import React from 'react';
import { AudienceManagementTab } from '@/components/admin/audience/AudienceManagementTab';

const AudienceManagement = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Audience Management</h1>
      <AudienceManagementTab />
    </div>
  );
};

export default AudienceManagement;
