
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

// Sample data - would be fetched from Supabase in a real application
import { sampleEstablishments } from '@/data/sampleData';

const AdminEstablishmentsPage = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const filteredEstablishments = establishments.filter(
    est => est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstablishments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstablishments.length / itemsPerPage);

  const viewEstablishmentDetails = (id: string) => {
    navigate(`/establishment/${id}`);
  };

  const viewOnMap = (id: string, lat: number, lng: number) => {
    // In a real app, this would navigate to a map centered on this location
    navigate('/map');
    toast({
      title: 'Viewing on map',
      description: `Viewing location for establishment ${id}`,
    });
  };

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />

      <main className="container max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Establishment Management</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search establishments by name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Mocktails</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((est) => (
                <TableRow key={est.id}>
                  <TableCell className="font-medium">{est.name}</TableCell>
                  <TableCell>{est.address}</TableCell>
                  <TableCell>{est.cocktailCount}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => viewOnMap(est.id, 0, 0)}
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="sr-only">View on map</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => viewEstablishmentDetails(est.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {currentItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No establishments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-end p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEstablishmentsPage;
