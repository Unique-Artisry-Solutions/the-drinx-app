
import React, { useState, useEffect } from 'react';
import { AdminSimplifiedLayout } from '@/components/admin/layout/AdminSimplifiedLayout';
import { SimpleAdminTable } from '@/components/admin/tables/SimpleAdminTable';
import { Badge } from '@/components/ui/badge';

// Direct data fetching without complex service abstractions
const mockUsers = [
  { id: '1', display_name: 'John Doe', user_type: 'individual', phone: '+1234567890', created_at: '2024-01-01' },
  { id: '2', display_name: 'Jane Smith', user_type: 'establishment', phone: '+0987654321', created_at: '2024-01-02' },
  { id: '3', display_name: 'Bob Wilson', user_type: 'promoter', phone: '+1122334455', created_at: '2024-01-03' },
];

const SimplifiedAdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple data fetching without complex hooks
  const refreshUsers = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const bulkDelete = (ids: string[]) => {
    setUsers(prev => prev.filter(user => !ids.includes(user.id)));
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setUsers(mockUsers);
      return;
    }
    
    const filtered = mockUsers.filter(user => 
      user.display_name.toLowerCase().includes(query.toLowerCase()) ||
      user.user_type.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filtered);
  };

  const columns = [
    {
      key: 'display_name',
      label: 'Name',
      render: (value: string) => value || 'Unknown User'
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
    }
  ];

  return (
    <AdminSimplifiedLayout 
      title="Users Management" 
      description="Simplified admin interface for user management"
    >
      <SimpleAdminTable
        title="Users"
        items={users}
        columns={columns}
        isLoading={isLoading}
        onSearch={handleSearch}
        onDelete={deleteUser}
        onBulkDelete={bulkDelete}
      />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </AdminSimplifiedLayout>
  );
};

export default SimplifiedAdminUsersPage;
