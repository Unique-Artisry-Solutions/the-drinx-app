
import React from 'react';
import { DynamicPricingDashboard } from '@/components/pricing/DynamicPricingDashboard';

interface DashboardPricingTabProps {
  promoterId: string;
}

export const DashboardPricingTab: React.FC<DashboardPricingTabProps> = ({ promoterId }) => {
  return <DynamicPricingDashboard promoterId={promoterId} />;
};
