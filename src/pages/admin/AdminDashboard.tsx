
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

const AdminDashboard: React.FC = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const handleDeleteEstablishment = (id: string) => {
    setEstablishments(establishments.filter(est => est.id !== id));
    toast({
      title: 'Establishment deleted',
      description: 'The establishment has been removed from the database',
    });
  };

  const handleDeleteCocktail = (id: string) => {
    setCocktails(cocktails.filter(cocktail => cocktail.id !== id));
    toast({
      title: 'Cocktail deleted',
      description: 'The cocktail has been removed from the database',
    });
  };

  const filteredEstablishments = establishments.filter(
    est => est.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCocktails = cocktails.filter(
    cocktail => cocktail.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-material-background">
      <header className="bg-material-primary text-material-on-primary p-4 shadow-md">
        <div className="container max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">Manage Data</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-material-on-surface-variant" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate('/add')}>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        <Tabs defaultValue="establishments">
          <TabsList className="mb-4">
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="establishments">
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
                  {filteredEstablishments.map((est) => (
                    <TableRow key={est.id}>
                      <TableCell className="font-medium">{est.name}</TableCell>
                      <TableCell>{est.address}</TableCell>
                      <TableCell>{est.cocktailCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/establishment/${est.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteEstablishment(est.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cocktails">
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
                  {filteredCocktails.map((cocktail) => (
                    <TableRow key={cocktail.id}>
                      <TableCell className="font-medium">{cocktail.name}</TableCell>
                      <TableCell>{cocktail.establishment}</TableCell>
                      <TableCell>${cocktail.price.toFixed(2)}</TableCell>
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
                              onClick={() => handleDeleteCocktail(cocktail.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="promotions">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Promotions Management</h3>
              <p className="text-material-on-surface-variant mt-2">
                This section will allow you to manage promotional codes created by establishments.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Reviews Management</h3>
              <p className="text-material-on-surface-variant mt-2">
                This section will allow you to manage user reviews for mocktails.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
