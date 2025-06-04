
import React from 'react';
import { AdminStatsCard } from '../charts/AdminStatsCard';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { 
  Building2, 
  Wine, 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  DollarSign,
  BarChart3 
} from 'lucide-react';
import type { StatCardConfig } from '../charts/AdminStatsCard';
import type { AdminUser, AdminEstablishment, AdminCocktail } from '@/services/admin';

export const AdminAnalyticsDashboard: React.FC = () => {
  const { state: establishmentsState } = useSimpleAdmin<AdminEstablishment>('establishments');
  const { state: cocktailsState } = useSimpleAdmin<AdminCocktail>('cocktails');
  const { state: usersState } = useSimpleAdmin<AdminUser>('users');

  // Primary metrics
  const primaryMetrics: StatCardConfig[] = [
    {
      title: 'Total Establishments',
      value: establishmentsState.total,
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
      value: cocktailsState.total,
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
      value: usersState.total,
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

  // Secondary metrics
  const secondaryMetrics: StatCardConfig[] = [
    {
      title: 'New This Week',
      value: 47,
      description: 'New registrations',
      trend: {
        value: 23,
        label: 'from last week',
        direction: 'up' as const
      },
      icon: Calendar,
      variant: 'default' as const
    },
    {
      title: 'Active Users',
      value: '1,284',
      description: 'Last 30 days',
      trend: {
        value: 8.2,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: Activity,
      variant: 'default' as const
    },
    {
      title: 'Revenue',
      value: '$12,450',
      description: 'This month',
      trend: {
        value: 15.3,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: DollarSign,
      variant: 'success' as const
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      description: 'Visitor to user',
      trend: {
        value: 0.8,
        label: 'from last month',
        direction: 'up' as const
      },
      icon: BarChart3,
      variant: 'default' as const
    }
  ];

  const isLoading = establishmentsState.isLoading || cocktailsState.isLoading || usersState.isLoading;

  return (
    <div className="space-y-8">
      {/* Primary Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {primaryMetrics.map((config, index) => (
            <AdminStatsCard
              key={index}
              config={config}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Indicators</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {secondaryMetrics.map((config, index) => (
            <AdminStatsCard
              key={index}
              config={config}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
