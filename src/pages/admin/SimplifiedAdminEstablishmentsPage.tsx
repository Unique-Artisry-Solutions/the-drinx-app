
import React from 'react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';
import { UnifiedAdminTable } from '@/components/admin/tables/UnifiedAdminTable';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  cocktailCount: number;
}

const mockEstablishments: Establishment[] = [
  { id: '1', name: 'The Tipsy Tavern', address: '123 Main St', phone: '555-0101', status: 'active', cocktailCount: 12 },
  { id: '2', name: 'Sunset Lounge', address: '456 Oak Ave', phone: '555-0102', status: 'active', cocktailCount: 8 },
  { id: '3', name: 'The Beer Garden', address: '789 Pine Rd', phone: '555-0103', status: 'pending', cocktailCount: 15 }
];

const SimplifiedAdminEstablishmentsPage: React.FC = () => {
  const { state, actions } = useSimpleAdmin<Establishment>('establishments', mockEstablishments);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => <span className="font-medium">{value}</span>
    },
    {
      key: 'address',
      label: 'Address',
      render: (value: string) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {value}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => <span className="text-sm">{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'cocktailCount',
      label: 'Cocktails',
      render: (value: number) => (
        <Badge variant="outline">
          {value} cocktails
        </Badge>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <UnifiedAdminTable
        title="Establishments Management"
        items={state.items}
        columns={columns}
        isLoading={state.isLoading}
        onSearch={actions.setSearch}
        onDelete={actions.deleteItem}
        onBulkDelete={actions.bulkDelete}
        onRefresh={actions.refresh}
        searchPlaceholder="Search establishments..."
      />
      
      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default SimplifiedAdminEstablishmentsPage;
