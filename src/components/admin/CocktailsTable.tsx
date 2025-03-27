
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

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
          {cocktails.map((cocktail) => {
            // Fix: Properly handle establishment that could be an object or string
            let establishmentName: string;
            if (typeof cocktail.establishment === 'object' && cocktail.establishment !== null) {
              establishmentName = cocktail.establishment.name;
            } else if (typeof cocktail.establishment === 'string') {
              establishmentName = cocktail.establishment;
            } else {
              establishmentName = 'Unknown';
            }
            
            // Fix: Properly handle price formatting for both string and number types
            let displayPrice: string;
            if (typeof cocktail.price === 'number') {
              // Type assertion to ensure TypeScript knows this is a number
              displayPrice = (cocktail.price as number).toFixed(2);
            } else if (typeof cocktail.price === 'string') {
              // Remove $ if it exists in the string
              displayPrice = cocktail.price.replace('$', '');
            } else {
              displayPrice = '0.00';
            }
            
            return (
              <TableRow key={cocktail.id}>
                <TableCell className="font-medium">{cocktail.name}</TableCell>
                <TableCell>{establishmentName}</TableCell>
                <TableCell>${displayPrice}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => onDeleteCocktail(cocktail.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CocktailsTable;
