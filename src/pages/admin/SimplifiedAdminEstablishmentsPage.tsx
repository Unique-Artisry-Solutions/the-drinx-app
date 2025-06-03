
import React, { useState } from 'react';
import { AdminSimplifiedLayout } from '@/components/admin/layout/AdminSimplifiedLayout';
import { SimpleAdminTable } from '@/components/admin/tables/SimpleAdminTable';
import { Building2, MapPin } from 'lucide-react';

const mockEstablishments = [
  { id: '1', name: 'The Tipsy Tavern', address: '123 Main St', cocktailCount: 12, created_at: '2024-01-01' },
  { id: '2', name: 'Sunset Lounge', address: '456 Beach Ave', cocktailCount: 8, created_at: '2024-01-02' },
  { id: '3', name: 'The Beer Garden', address: '789 Park Blvd', cocktailCount: 15, created_at: '2024-01-03' },
];

const SimplifiedAdminEstablishmentsPage: React.FC = () => {
  const [establishments, setEstablishments] = useState(mockEstablishments);
  const [isLoading, setIsLoading] = useState(false);

  const deleteEstablishment = (id: string) => {
    setEstablishments(prev => prev.filter(est => est.id !== id));
  };

  const bulkDelete = (ids: string[]) => {
    setEstablishments(prev => prev.filter(est => !ids.includes(est.id)));
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setEstablishments(mockEstablishments);
      return;
    }
    
    const filtered = mockEstablishments.filter(est => 
      est.name.toLowerCase().includes(query.toLowerCase()) ||
      est.address.toLowerCase().includes(query.toLowerCase())
    );
    setEstablishments(filtered);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string, item: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'cocktailCount',
      label: 'Cocktails',
      render: (value: number) => value?.toString() || '0'
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <AdminSimplifiedLayout 
      title="Establishments Management" 
      description="Simplified admin interface for establishment management"
    >
      <SimpleAdminTable
        title="Establishments"
        items={establishments}
        columns={columns}
        isLoading={isLoading}
        onSearch={handleSearch}
        onDelete={deleteEstablishment}
        onBulkDelete={bulkDelete}
      />
    </AdminSimplifiedLayout>
  );
};

export default SimplifiedAdminEstablishmentsPage;
