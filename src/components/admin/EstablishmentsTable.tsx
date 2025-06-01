
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, Plus } from 'lucide-react';

const EstablishmentsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const establishments = [
    {
      id: '1',
      name: 'The Mocktail Lounge',
      address: '123 Main St, City',
      status: 'active',
      cocktailCount: 12,
      rating: 4.5,
      verified: true
    },
    {
      id: '2', 
      name: 'Spiritless Bar',
      address: '456 Oak Ave, Town',
      status: 'pending',
      cocktailCount: 8,
      rating: 4.2,
      verified: false
    }
  ];

  const filteredEstablishments = establishments.filter(est =>
    est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    console.log('Approving establishment:', id);
    // Implementation would go here
  };

  const handleEdit = (id: string) => {
    console.log('Editing establishment:', id);
    // Implementation would go here
  };

  const handleDelete = (id: string) => {
    console.log('Deleting establishment:', id);
    // Implementation would go here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Establishments</CardTitle>
            <CardDescription>
              Manage registered establishments and their status
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Establishment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search establishments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cocktails</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEstablishments.map((establishment) => (
              <TableRow key={establishment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <span>{establishment.name}</span>
                    {establishment.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{establishment.address}</TableCell>
                <TableCell>
                  <Badge 
                    variant={establishment.status === 'active' ? 'default' : 'secondary'}
                  >
                    {establishment.status}
                  </Badge>
                </TableCell>
                <TableCell>{establishment.cocktailCount}</TableCell>
                <TableCell>{establishment.rating}★</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(establishment.id)}>
                        Edit
                      </DropdownMenuItem>
                      {establishment.status === 'pending' && (
                        <DropdownMenuItem onClick={() => handleApprove(establishment.id)}>
                          Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(establishment.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEstablishments.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No establishments found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstablishmentsTable;
