
import React from 'react';
import { AdminStatsCard } from '../charts/AdminStatsCard';
import { useAdminService } from '@/hooks/admin/useAdminService';
import { establishmentsService, cocktailsService, usersService } from '@/services/admin';
import { Building2, Wine, Users, TrendingUp } from 'lucide-react';

export const AdminDashboardStats: React.FC = () => {
  const { state: establishmentsState } = useAdminService(establishmentsService);
  const { state: cocktailsState } = useAdminService(cocktailsService);
  const { state: usersState } = useAdminService(usersService);

  const statsConfig = [
    {
      title: 'Total Establishments',
      value: establishmentsState.pagination.total,
      description: 'Active venues',
      trend: {
        value: 12,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: Building2,
      variant: 'success' as const
    },
    {
      title: 'Total Cocktails',
      value: cocktailsState.pagination.total,
      description: 'Recipes available',
      trend: {
        value: 8,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: Wine,
      variant: 'default' as const
    },
    {
      title: 'Total Users',
      value: usersState.pagination.total,
      description: 'Registered users',
      trend: {
        value: 5,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: Users,
      variant: 'default' as const
    },
    {
      title: 'Growth Rate',
      value: '15.3%',
      description: 'Monthly growth',
      trend: {
        value: 2.1,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: TrendingUp,
      variant: 'success' as const
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((config, index) => (
        <AdminStatsCard
          key={index}
          config={config}
          isLoading={establishmentsState.isLoading || cocktailsState.isLoading || usersState.isLoading}
        />
      ))}
    </div>
  );
};
