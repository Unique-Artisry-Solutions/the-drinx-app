
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { UnifiedAdminTable } from '../tables/UnifiedAdminTable';
import { Building2, MapPin } from 'lucide-react';
import type { AdminEstablishment } from '@/services/admin';

export const EstablishmentsAdminTable: React.FC = () => {
  const { state, actions } = useSimpleAdmin<AdminEstablishment>('establishments');

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string, item: AdminEstablishment) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
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
      key: 'address',
      label: 'Address',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'cocktailCount',
      label: 'Cocktails',
      render: (value: number) => value?.toString() || '0'
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <UnifiedAdminTable
      title="Establishments"
      items={state.items}
      columns={columns}
      isLoading={state.isLoading}
      onSearch={actions.setSearch}
      onDelete={actions.deleteItem}
      onBulkDelete={actions.bulkDelete}
      onRefresh={actions.refresh}
      searchPlaceholder="Search establishments..."
    />
  );
};
