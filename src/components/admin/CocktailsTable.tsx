
import React from 'react';
import { SimpleAdminTable } from './tables/SimpleAdminTable';
import { Wine, Building2 } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
}

interface Cocktail {
  id: string;
  name: string;
  establishment: Establishment | string;
  price: number | string;
}

interface CocktailsTableProps {
  cocktails: Cocktail[];
  onDeleteCocktail: (id: string) => void;
}

const CocktailsTable: React.FC<CocktailsTableProps> = ({ 
  cocktails,
  onDeleteCocktail
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Wine className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'establishment',
      label: 'Establishment',
      render: (value: any) => {
        let establishmentName: string;
        if (typeof value === 'object' && value !== null) {
          establishmentName = value.name;
        } else if (typeof value === 'string') {
          establishmentName = value;
        } else {
          establishmentName = 'Unknown';
        }
        
        return (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{establishmentName}</span>
          </div>
        );
      }
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: any) => {
        let displayPrice: string;
        if (typeof value === 'number') {
          displayPrice = value.toFixed(2);
        } else if (typeof value === 'string') {
          displayPrice = value.replace('$', '');
        } else {
          displayPrice = '0.00';
        }
        return `$${displayPrice}`;
      }
    }
  ];

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => onDeleteCocktail(id));
  };

  return (
    <SimpleAdminTable
      title="Cocktails"
      items={cocktails}
      columns={columns}
      onDelete={onDeleteCocktail}
      onBulkDelete={handleBulkDelete}
    />
  );
};

export default CocktailsTable;
