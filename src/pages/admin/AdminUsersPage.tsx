import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageLayout } from '@/components/admin/layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { useUsers } from '@/hooks/admin/useUsers';
import { startImpersonation } from '@/utils/impersonationSimplified';
import { toast } from 'sonner';

const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { users, isLoading, error, stats, refetch, deleteUser } = useUsers();
  
  const pageConfig = {
    title: 'User Management',
    description: 'Manage user accounts, roles, and permissions across the platform',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Refresh',
      icon: Search,
      variant: 'outline' as const,
      onClick: refetch
    },
    {
      label: 'Export Users',
      icon: Filter,
      variant: 'outline' as const,
      onClick: () => toast.info('Export functionality coming soon')
    }
  ];
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.display_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.user_type === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (user: any) => {
    if (user.display_name || user.username) {
      return <Badge variant="default">Active</Badge>;
    } else {
      return <Badge variant="secondary">Incomplete</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      establishment: 'bg-blue-100 text-blue-800',
      promoter: 'bg-green-100 text-green-800',
      individual: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors] || colors.individual}`}>
        {role}
      </span>
    );
  };

  const userStats = [
    { title: 'Total Users', value: stats.total, icon: Users },
    { title: 'Active Users', value: stats.active, icon: Users },
    { title: 'Pending Approval', value: stats.pending, icon: Users },
    { title: 'Admins', value: stats.byRole.admin || 0, icon: Users }
  ];

  if (error) {
    return (
      <AdminPageLayout config={pageConfig} actions={pageActions}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <TooltipProvider>
        <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="establishment">Establishment</option>
            <option value="promoter">Promoter</option>
            <option value="individual">Individual</option>
          </select>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading users...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No users found</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-medium cursor-help">{user.display_name || user.username || 'No name'}</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                {user.username && <div><strong>Username:</strong> {user.username}</div>}
                                {user.display_name && <div><strong>Display Name:</strong> {user.display_name}</div>}
                                <div><strong>Full ID:</strong> {user.id}</div>
                                <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <div className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.user_type || 'individual')}</TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/users/${user.id}`}>View</Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              const res = await startImpersonation(user.id);
                              if (!res.ok) {
                                toast.error(res.error || 'Impersonation failed');
                              } else {
                                toast.success('Impersonation link generated. Redirecting...');
                              }
                            }}
                          >
                            Impersonate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>
      </TooltipProvider>
    </AdminPageLayout>
  );
};

export default AdminUsersPage;