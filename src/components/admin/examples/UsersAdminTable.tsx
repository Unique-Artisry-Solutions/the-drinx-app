
import React from 'react';
import { AdminDataTable } from '../tables/AdminDataTable';
import { useAdminService } from '@/hooks/admin/useAdminService';
import { usersService } from '@/services/admin';
import { Edit, Trash, Eye, User, Shield, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AdminTableConfig } from '../tables/AdminDataTable';
import type { AdminUser } from '@/services/admin';

export const UsersAdminTable: React.FC = () => {
  const { state, actions } = useAdminService(usersService);

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'promoter':
        return <Crown className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'destructive';
      case 'promoter':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const config: AdminTableConfig<AdminUser> = {
    columns: [
      {
        key: 'display_name',
        label: 'User',
        sortable: true,
        render: (value, item) => (
          <div className="flex items-center gap-2">
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
        sortable: true,
        render: (value) => (
          <Badge 
            variant={getUserTypeBadgeVariant(value)}
            className="flex items-center gap-1"
          >
            {getUserTypeIcon(value)}
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        )
      },
      {
        key: 'phone',
        label: 'Contact',
        render: (value) => value || 'Not provided'
      },
      {
        key: 'email_notifications',
        label: 'Email Notifications',
        type: 'boolean',
        render: (value) => (
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Enabled' : 'Disabled'}
          </Badge>
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
          console.log('View user profile:', item);
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
          { value: 'user', label: 'Users' },
          { value: 'promoter', label: 'Promoters' },
          { value: 'establishment', label: 'Establishments' },
          { value: 'admin', label: 'Admins' }
        ]
      },
      {
        key: 'email_notifications',
        label: 'Email Notifications',
        type: 'select',
        options: [
          { value: 'all', label: 'All' },
          { value: 'true', label: 'Enabled' },
          { value: 'false', label: 'Disabled' }
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
      description="Manage all user accounts and profiles"
    />
  );
};
