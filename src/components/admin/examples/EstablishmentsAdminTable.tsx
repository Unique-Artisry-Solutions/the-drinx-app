
import React from 'react';
import { AdminDataTable } from '../tables/AdminDataTable';
import { useAdminService } from '@/hooks/admin/useAdminService';
import { establishmentsService } from '@/services/admin';
import { Edit, Trash, Eye, Building2, Phone, Mail } from 'lucide-react';
import type { AdminTableConfig } from '../tables/AdminDataTable';
import type { AdminEstablishment } from '@/services/admin';

export const EstablishmentsAdminTable: React.FC = () => {
  const { state, actions } = useAdminService(establishmentsService);

  const config: AdminTableConfig<AdminEstablishment> = {
    columns: [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (value, item) => (
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
        render: (value) => (
          <div className="max-w-[200px] truncate">{value}</div>
        )
      },
      {
        key: 'phone',
        label: 'Contact',
        render: (_, item) => (
          <div className="space-y-1">
            {item.phone && (
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3" />
                {item.phone}
              </div>
            )}
            {item.email && (
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-3 w-3" />
                {item.email}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'cocktailCount',
        label: 'Cocktails',
        type: 'badge',
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
          console.log('View establishment:', item);
        }
      },
      {
        label: 'Edit',
        action: 'edit',
        icon: Edit,
        onClick: (item) => {
          console.log('Edit establishment:', item);
        }
      },
      {
        label: 'Delete',
        action: 'delete',
        icon: Trash,
        variant: 'destructive',
        onClick: (item) => {
          if (confirm('Are you sure you want to delete this establishment?')) {
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
          if (confirm(`Are you sure you want to delete ${selectedItems.length} establishments?`)) {
            actions.bulkDelete(selectedItems.map(item => item.id));
          }
        }
      }
    ],
    filters: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        options: []
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
      title="Establishments"
      description="Manage all establishments in the system"
    />
  );
};
