import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPageLayout } from '@/components/admin/layout';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Building2, Plus, Search, Filter } from 'lucide-react';

// Mock establishment data
const mockEstablishments = [
  { 
    id: '1', 
    name: 'The Mockingbird', 
    address: '123 Main St, City, State',
    cocktailCount: 15,
    status: 'active',
    created_at: '2024-01-15',
    latitude: 40.7128,
    longitude: -74.0060,
    category: 'restaurant'
  },
  { 
    id: '2', 
    name: 'Zero Proof Lounge', 
    address: '456 Oak Ave, City, State',
    cocktailCount: 22,
    status: 'active',
    created_at: '2024-01-10',
    latitude: 40.7589,
    longitude: -73.9851,
    category: 'bar'
  },
  { 
    id: '3', 
    name: 'Dry Bar & Grill', 
    address: '789 Pine St, City, State',
    cocktailCount: 8,
    status: 'pending',
    created_at: '2024-01-20',
    latitude: 40.7831,
    longitude: -73.9712,
    category: 'restaurant'
  }
];

const AdminEstablishmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  const pageConfig = {
    title: 'Establishment Management',
    description: 'Manage establishments, their listings, and cocktail offerings',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Add Establishment',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => console.log('Add establishment')
    },
    {
      label: 'Export Data',
      icon: Filter,
      variant: 'outline' as const,
      onClick: () => console.log('Export establishments')
    }
  ];

  const filteredEstablishments = mockEstablishments.filter(est => {
    const matchesSearch = est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         est.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || est.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstablishments.slice(indexOfFirstItem, indexOfLastItem);

  const viewEstablishmentDetails = (id: string) => {
    navigate(`/admin/establishments/${id}`);
  };

  const viewOnMap = (id: string, lat: number, lng: number) => {
    navigate('/map');
    toast({
      title: 'Viewing on map',
      description: `Viewing location for establishment ${id}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const establishmentStats = [
    { title: 'Total Establishments', value: mockEstablishments.length, icon: Building2 },
    { title: 'Active', value: mockEstablishments.filter(e => e.status === 'active').length, icon: Building2 },
    { title: 'Pending Review', value: mockEstablishments.filter(e => e.status === 'pending').length, icon: Building2 },
    { title: 'Total Cocktails', value: mockEstablishments.reduce((sum, e) => sum + e.cocktailCount, 0), icon: Building2 }
  ];

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {establishmentStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search establishments by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Establishments Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Cocktails</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((est) => (
                    <TableRow key={est.id}>
                      <TableCell className="font-medium">{est.name}</TableCell>
                      <TableCell>{est.address}</TableCell>
                      <TableCell>{est.cocktailCount}</TableCell>
                      <TableCell>{getStatusBadge(est.status)}</TableCell>
                      <TableCell>{formatDate(est.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOnMap(est.id, est.latitude, est.longitude)}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewEstablishmentDetails(est.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No establishments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminEstablishmentsPage;