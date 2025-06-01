import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Users, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  cocktail_count?: number;
}

const EstablishmentsTable = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const fetchEstablishments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*');

      if (error) {
        console.error('Error fetching establishments:', error);
      } else {
        setEstablishments(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredEstablishments = establishments.filter(establishment =>
    establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Establishment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2">
            <Input
              type="search"
              placeholder="Search establishments..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button><Plus className="mr-2" /> Add Establishment</Button>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : filteredEstablishments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No establishments found.</TableCell>
            </TableRow>
          ) : (
            filteredEstablishments.map((establishment) => (
              <TableRow key={establishment.id}>
                <TableCell>{establishment.name}</TableCell>
                <TableCell>{establishment.address}</TableCell>
                <TableCell>
                  <Badge variant={establishment.status === 'active' ? 'outline' : 'secondary'}>
                    {establishment.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(establishment.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><Edit className="mr-2" />Edit</Button>
                  <Button variant="ghost" size="sm"><Trash2 className="mr-2" />Delete</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EstablishmentsTable;
