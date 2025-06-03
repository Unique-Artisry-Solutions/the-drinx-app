
import React from 'react';
import { AdminStatsCard } from '../charts/AdminStatsCard';
import { useData } from '@/hooks/core';
import { Building2, Wine, Users, TrendingUp } from 'lucide-react';

// Mock services for data fetching
const fetchEstablishments = async () => [
  { id: '1', name: 'The Tipsy Tavern' },
  { id: '2', name: 'Sunset Lounge' },
];

const fetchCocktails = async () => [
  { id: '1', name: 'Mojito' },
  { id: '2', name: 'Cosmopolitan' },
];

const fetchUsers = async () => [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

export const AdminDashboardStats: React.FC = () => {
  const { state: establishmentsState } = useData({
    initialData: [],
    fetchFn: fetchEstablishments,
    itemType: 'establishment'
  });
  
  const { state: cocktailsState } = useData({
    initialData: [],
    fetchFn: fetchCocktails,
    itemType: 'cocktail'
  });
  
  const { state: usersState } = useData({
    initialData: [],
    fetchFn: fetchUsers,
    itemType: 'user'
  });

  const statsConfig = [
    {
      title: 'Total Establishments',
      value: establishmentsState.data.length,
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
      value: cocktailsState.data.length,
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
      value: usersState.data.length,
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
