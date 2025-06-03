
import React from 'react';
import { AdminDataTable } from '../tables/AdminDataTable';
import { useAdminService } from '@/hooks/admin/useAdminService';
import { usersService } from '@/services/admin';
import { Edit, Trash, Eye, User, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AdminTableConfig } from '../tables/AdminDataTable';
import type { AdminUser } from '@/services/admin';

export const UsersAdminTable: React.FC = () => {
  const { state, actions } = useAdminService(usersService);

  const config: AdminTableConfig<AdminUser> = {
    columns: [
      {
        key: 'display_name',
        label: 'User',
        sortable: true,
        render: (value, item) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{value || item.username || 'Unknown User'}</div>
              {item.bio && (
                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {item.bio}
                </div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'user_type',
        label: 'Type',
        render: (value) => (
          <Badge variant="secondary">
            {value?.charAt(0).toUpperCase() + value?.slice(1) || 'User'}
          </Badge>
        )
      },
      {
        key: 'phone',
        label: 'Contact',
        render: (value) => (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{value || 'Not provided'}</span>
          </div>
        )
      },
      {
        key: 'created_at',
        label: 'Joined',
        type: 'date',
        sortable: true
      }
    ],
    actions: [
      {
        label: 'View Profile',
        action: 'view',
        icon: Eye,
        onClick: (item) => {
          console.log('View user:', item);
        }
      },
      {
        label: 'Edit',
        action: 'edit',
        icon: Edit,
        onClick: (item) => {
          console.log('Edit user:', item);
        }
      },
      {
        label: 'Delete',
        action: 'delete',
        icon: Trash,
        variant: 'destructive',
        onClick: (item) => {
          if (confirm('Are you sure you want to delete this user?')) {
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
          if (confirm(`Are you sure you want to delete ${selectedItems.length} users?`)) {
            actions.bulkDelete(selectedItems.map(item => item.id));
          }
        }
      }
    ],
    filters: [
      {
        key: 'user_type',
        label: 'User Type',
        type: 'select',
        options: [
          { value: 'all', label: 'All Types' },
          { value: 'individual', label: 'Individual' },
          { value: 'establishment', label: 'Establishment' },
          { value: 'promoter', label: 'Promoter' }
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
      title="Users"
      description="Manage all users in the system"
    />
  );
};
