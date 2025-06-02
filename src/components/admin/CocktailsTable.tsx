
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface Cocktail {
  id: string;
  name: string;
  establishment: string;
  price: string;
}

interface CocktailsTableProps {
  cocktails: Cocktail[];
  onDeleteCocktail: (id: string) => void;
}

const CocktailsTable: React.FC<CocktailsTableProps> = ({ 
  cocktails,
  onDeleteCocktail
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Establishment</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cocktails.map((cocktail) => (
            <TableRow key={cocktail.id}>
              <TableCell className="font-medium">{cocktail.name}</TableCell>
              <TableCell>{cocktail.establishment}</TableCell>
              <TableCell>{cocktail.price}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeleteCocktail(cocktail.id)}
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

export default CocktailsTable;
