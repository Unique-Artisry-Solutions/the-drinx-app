
import React from 'react';
import { UrgencyDashboard } from '@/components/promoter/urgency/UrgencyDashboard';

interface DashboardUrgencyTabProps {
  promoterId: string;
}

export const DashboardUrgencyTab: React.FC<DashboardUrgencyTabProps> = ({ promoterId }) => {
  return <UrgencyDashboard promoterId={promoterId} />;
};
