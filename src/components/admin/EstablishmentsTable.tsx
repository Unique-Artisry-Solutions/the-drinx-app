
import React from 'react';
import { SimpleAdminTable } from './tables/SimpleAdminTable';
import { Building2, MapPin } from 'lucide-react';
import { Establishment } from '@/types/CoreTypes';

interface EstablishmentsTableProps {
  establishments: Establishment[];
  onDeleteEstablishment: (id: string) => void;
}

const EstablishmentsTable: React.FC<EstablishmentsTableProps> = ({ 
  establishments,
  onDeleteEstablishment
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => (
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
      render: (value: any, item: any) => (item.cocktailCount ?? item.cocktail_count ?? 0).toString()
    }
  ];

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => onDeleteEstablishment(id));
  };

  return (
    <SimpleAdminTable
      title="Establishments"
      items={establishments}
      columns={columns}
      onDelete={onDeleteEstablishment}
      onBulkDelete={handleBulkDelete}
    />
  );
};

export default EstablishmentsTable;
