
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { UnifiedAdminTable } from '../tables/UnifiedAdminTable';
import { User, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/services/admin';
export const UsersAdminTable: React.FC = () => {
  const { state, actions } = useSimpleAdmin<AdminUser>('users');

  const columns = [
    {
      key: 'display_name',
      label: 'Full Name',
      render: (value: string, item: AdminUser) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{value || item.username || 'Unknown User'}</div>
            {item.username && item.username !== value && (
              <div className="text-xs text-muted-foreground font-mono">@{item.username}</div>
            )}
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
      label: 'User Type',
      render: (value: string) => (
        <Badge variant="secondary">
          {value?.charAt(0).toUpperCase() + value?.slice(1) || 'User'}
        </Badge>
      )
    },
    {
      key: 'active_roles',
      label: 'Active Roles',
      render: (value: string[], item: AdminUser) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            value.map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
        </div>
      )
    },
    {
      key: 'establishment_name',
      label: 'Establishment',
      render: (value: string) => (
        <span className="text-sm">{value || '-'}</span>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value || 'Not provided'}</span>
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <UnifiedAdminTable
      title="Users"
      items={state.items}
      columns={columns}
      isLoading={state.isLoading}
      onSearch={actions.setSearch}
      onDelete={actions.deleteItem}
      onBulkDelete={actions.bulkDelete}
      onRefresh={actions.refresh}
      searchPlaceholder="Search users..."
    />
  );
};
