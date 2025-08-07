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
import { Users, UserPlus, Search, Filter } from 'lucide-react';

// Mock user data - in a real app this would come from a database
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'individual', status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active', joinDate: '2024-01-10' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', role: 'establishment', status: 'active', joinDate: '2024-01-20' },
  { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'promoter', status: 'pending', joinDate: '2024-01-25' },
  { id: '5', name: 'Carol Brown', email: 'carol@example.com', role: 'individual', status: 'suspended', joinDate: '2024-01-12' },
];

const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const pageConfig = {
    title: 'User Management',
    description: 'Manage user accounts, roles, and permissions across the platform',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Add User',
      icon: UserPlus,
      variant: 'default' as const,
      onClick: () => console.log('Add user')
    },
    {
      label: 'Export Users',
      icon: Filter,
      variant: 'outline' as const,
      onClick: () => console.log('Export users')
    }
  ];
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
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
    { title: 'Total Users', value: mockUsers.length, icon: Users },
    { title: 'Active Users', value: mockUsers.filter(u => u.status === 'active').length, icon: Users },
    { title: 'Pending Approval', value: mockUsers.filter(u => u.status === 'pending').length, icon: Users },
    { title: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length, icon: Users }
  ];

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
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
              placeholder="Search users by name or email..."
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
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/users/${user.id}`}>View</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminUsersPage;