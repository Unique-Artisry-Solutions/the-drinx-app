
import React from 'react';
import { AdminDataTable } from '../tables/AdminDataTable';
import { useAdminService } from '@/hooks/admin/useAdminService';
import { cocktailsService } from '@/services/admin';
import { Edit, Trash, Eye, Wine, Building2 } from 'lucide-react';
import type { AdminTableConfig } from '../tables/AdminDataTable';
import type { AdminCocktail } from '@/services/admin';

export const CocktailsAdminTable: React.FC = () => {
  const { state, actions } = useAdminService(cocktailsService);

  const config: AdminTableConfig<AdminCocktail> = {
    columns: [
      {
        key: 'name',
        label: 'Cocktail Name',
        sortable: true,
        render: (value, item) => (
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
        render: (value, item) => (
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
        type: 'text',
        sortable: true
      },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        sortable: true
      }
    ],
    actions: [
      {
        label: 'View',
        action: 'view',
        icon: Eye,
        onClick: (item) => {
          console.log('View cocktail:', item);
        }
      },
      {
        label: 'Edit',
        action: 'edit',
        icon: Edit,
        onClick: (item) => {
          console.log('Edit cocktail:', item);
        }
      },
      {
        label: 'Delete',
        action: 'delete',
        icon: Trash,
        variant: 'destructive',
        onClick: (item) => {
          if (confirm('Are you sure you want to delete this cocktail?')) {
            actions.deleteItem(item.id);
          }
        }
      }
    ],
    bulkActions: [
      {
        label: 'Delete Selected',
        action: 'bulk-delete',
        icon: Trash,
        variant: 'destructive',
        onClick: (selectedItems) => {
          if (confirm(`Are you sure you want to delete ${selectedItems.length} cocktails?`)) {
            actions.bulkDelete(selectedItems.map(item => item.id));
          }
        }
      }
    ],
    filters: [
      {
        key: 'establishment_id',
        label: 'Establishment',
        type: 'select',
        options: [
          { value: 'all', label: 'All Establishments' }
        ]
      }
    ],
    searchable: true,
    selectable: true,
    sortable: true
  };

  return (
    <AdminDataTable
      config={config}
      state={state}
      actions={actions}
      title="Cocktails"
      description="Manage all cocktails and recipes in the system"
    />
  );
};
