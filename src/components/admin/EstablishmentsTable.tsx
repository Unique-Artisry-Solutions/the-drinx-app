
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  address: string;
  cocktailCount: number;
}

interface EstablishmentsTableProps {
  establishments: Establishment[];
  onDeleteEstablishment: (id: string) => void;
}

const EstablishmentsTable: React.FC<EstablishmentsTableProps> = ({ 
  establishments,
  onDeleteEstablishment
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Cocktails</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establishments.map((est) => (
            <TableRow key={est.id}>
              <TableCell className="font-medium">{est.name}</TableCell>
              <TableCell>{est.address}</TableCell>
              <TableCell>{est.cocktailCount}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeleteEstablishment(est.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EstablishmentsTable;
