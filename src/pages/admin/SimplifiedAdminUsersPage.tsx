
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { UnifiedAdminTable } from '@/components/admin/tables/UnifiedAdminTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { impersonateUser } from '@/utils/impersonation';
import { toast } from 'sonner';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
const SimplifiedAdminUsersPage: React.FC = () => {
  console.log('🎯 SimplifiedAdminUsersPage component rendered');
  
  const { state, actions } = useSimpleAdmin('users');
  const { userType } = useAuthenticatedUser();
  const canImpersonate = userType === 'admin';

  console.log('📊 SimplifiedAdminUsersPage state:', { 
    itemsCount: state.items?.length || 0, 
    isLoading: state.isLoading, 
    error: state.error,
    total: state.total
  });

  // Add component-level error handling
  React.useEffect(() => {
    if (state.error) {
      console.error('🚨 SimplifiedAdminUsersPage detected error in state:', state.error);
      toast.error(`Failed to load users: ${state.error}`);
    }
  }, [state.error]);

  // Add loading state logging
  React.useEffect(() => {
    console.log('⏳ SimplifiedAdminUsersPage loading state changed:', state.isLoading);
  }, [state.isLoading]);

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
      <div className="mb-4 flex items-center justify-end">
        <Button
          variant="secondary"
          size="sm"
          disabled={!canImpersonate}
          title={!canImpersonate ? 'Requires admin role' : undefined}
          onClick={async () => {
            const targetId = window.prompt('Enter target user ID to impersonate:');
            if (!targetId) return;
            toast.message('Generating impersonation link...');
            const res = await impersonateUser(targetId.trim());
            if (!res.ok) {
              toast.error(res.error || 'Impersonation failed');
            } else {
              toast.message('Impersonation link generated. Redirecting...');
            }
          }}
        >
          Impersonate by ID
        </Button>
      </div>
      <UnifiedAdminTable
        title="Users Management"
        items={state.items}
        columns={columns}
        isLoading={state.isLoading}
        onSearch={actions.setSearch}
        onDelete={actions.deleteItem}
        onBulkDelete={actions.bulkDelete}
        onRefresh={actions.refresh}
        searchPlaceholder="Search users..."
      />
      
      {/* Enhanced error display with debugging info */}
      {state.error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-destructive mb-2">Error Loading Users</h4>
              <p className="text-sm text-destructive/80">{state.error}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Debug Info:</p>
                <p>• Items loaded: {state.items?.length || 0}</p>
                <p>• Loading state: {state.isLoading ? 'true' : 'false'}</p>
                <p>• Total: {state.total}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔄 Manual retry button clicked');
                actions.refresh();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Show helpful message when no data and no error */}
      {!state.isLoading && !state.error && state.items.length === 0 && (
        <div className="mt-4 p-4 bg-muted/50 border border-muted rounded-md text-center">
          <p className="text-muted-foreground">No users found. This could mean:</p>
          <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
            <li>The profiles table is empty</li>
            <li>You don't have permission to view users</li>
            <li>There's a connectivity issue</li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              console.log('🔄 Refresh when no data button clicked');
              actions.refresh();
            }}
          >
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimplifiedAdminUsersPage;
