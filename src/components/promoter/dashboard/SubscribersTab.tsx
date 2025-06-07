
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import SubscriberManagementDashboard from '@/components/promoter/subscribers/SubscriberManagementDashboard';

export const SubscribersTab: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Subscriber Management</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of your subscriber analytics, engagement, and monetization
        </p>
      </div>
      
      <SubscriberManagementDashboard promoterId={promoterId} />
    </div>
  );
};
