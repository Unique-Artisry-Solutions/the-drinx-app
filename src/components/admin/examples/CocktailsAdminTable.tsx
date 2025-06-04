
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { UnifiedAdminTable } from '../tables/UnifiedAdminTable';
import { Wine, Building2 } from 'lucide-react';
import type { AdminCocktail } from '@/services/admin';

export const CocktailsAdminTable: React.FC = () => {
  const { state, actions } = useSimpleAdmin<AdminCocktail>('cocktails');

  const columns = [
    {
      key: 'name',
      label: 'Cocktail Name',
      render: (value: string, item: AdminCocktail) => (
        <div className="flex items-center gap-2">
          <Wine className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value}</div>
            {item.description && (
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {item.description}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'establishment',
      label: 'Establishment',
      render: (value: any) => (
        <div className="flex items-center gap-1">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {typeof value === 'object' && value?.name ? value.name : 'Unknown'}
          </span>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: string | number) => {
        if (typeof value === 'number') return `$${value.toFixed(2)}`;
        if (typeof value === 'string') return value.startsWith('$') ? value : `$${value}`;
        return '$0.00';
      }
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <UnifiedAdminTable
      title="Cocktails"
      items={state.items}
      columns={columns}
      isLoading={state.isLoading}
      onSearch={actions.setSearch}
      onDelete={actions.deleteItem}
      onBulkDelete={actions.bulkDelete}
      onRefresh={actions.refresh}
      searchPlaceholder="Search cocktails..."
    />
  );
};
