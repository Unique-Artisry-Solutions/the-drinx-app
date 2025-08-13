
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { SimpleAdminTable } from '@/components/admin/tables/SimpleAdminTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { impersonateUser } from '@/utils/impersonation';
import { toast } from 'sonner';
const SimpleAdminUsersPage: React.FC = () => {
  const { state, actions } = useSimpleAdmin('users');

  const columns = [
    {
      key: 'display_name',
      label: 'Name',
      render: (value: string, item: any) => value || item.username || 'Unknown User'
    },
    {
      key: 'user_type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant="secondary">
          {value?.charAt(0).toUpperCase() + value?.slice(1) || 'User'}
        </Badge>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || 'Not provided'
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: '_actions',
      label: 'Actions',
      render: (_: any, item: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const res = await impersonateUser(item.id);
            if (!res.ok) {
              toast.error(res.error || 'Impersonation failed');
            } else {
              toast.message('Impersonation link generated. Redirecting...');
            }
          }}
        >
          Impersonate
        </Button>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <SimpleAdminTable
        title="Users Management"
        items={state.items}
        columns={columns}
        isLoading={state.isLoading}
        onSearch={actions.setSearch}
        onDelete={actions.deleteItem}
        onBulkDelete={actions.bulkDelete}
      />
      
      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAdminUsersPage;
