import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Plus, RefreshCw, MapPin } from 'lucide-react';
import { useSimpleAdmin } from '@/hooks/admin/useSimpleAdmin';

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
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    actions.setSearch(value);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this establishment?')) {
      await actions.deleteItem(id);
    }
  };

  const filteredEstablishments = searchTerm 
    ? state.items.filter(establishment => 
        establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : state.items;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Establishments Management</h1>
        <div className="flex gap-2">
          <Button onClick={actions.refresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Establishment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Establishment List ({state.total})</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search establishments..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {state.isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredEstablishments.map((establishment) => (
                <div key={establishment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{establishment.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {establishment.address}
                    </div>
                    <div className="text-sm text-muted-foreground">{establishment.phone}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={establishment.status === 'active' ? 'default' : 'secondary'}>
                        {establishment.status}
                      </Badge>
                      <Badge variant="outline">
                        {establishment.cocktailCount} cocktails
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(establishment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedAdminEstablishmentsPage;
