
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import SearchToolbar from '@/components/admin/SearchToolbar';
import { useEstablishments } from '@/hooks/useEstablishments';

const AdminEstablishmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { 
    establishments, 
    isLoading, 
    filterEstablishments 
  } = useEstablishments({ searchTerm });

  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
    console.log("AdminEstablishmentsPage rendered inside AdminLayout");
  }, [navigate]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    filterEstablishments(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = establishments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(establishments.length / itemsPerPage);

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

  // Format date or return a placeholder if not available
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // The content to be displayed inside AdminLayout
  const pageContent = (
    <div className="min-h-full">
      <SearchToolbar 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange} 
        title="Establishment Management"
        addButtonLink="/admin/add-establishment"
        addButtonText="Add Establishment"
      />

      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading establishments...
                </TableCell>
              </TableRow>
            ) : currentItems.length > 0 ? (
              currentItems.map((est) => (
                <TableRow key={est.id}>
                  <TableCell className="font-medium">{est.name}</TableCell>
                  <TableCell>{est.address}</TableCell>
                  <TableCell>{est.cocktailCount}</TableCell>
                  <TableCell>{formatDate(est.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => viewOnMap(est.id, est.latitude, est.longitude)}
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
              ))
            ) : (
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
    </div>
  );

  // Wrap the page content with AdminLayout
  return <AdminLayout>{pageContent}</AdminLayout>;
};

export default AdminEstablishmentsPage;
