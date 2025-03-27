
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

// Imported components
import AdminHeader from '@/components/admin/AdminHeader';
import SearchToolbar from '@/components/admin/SearchToolbar';
import EstablishmentsTable from '@/components/admin/EstablishmentsTable';
import CocktailsTable from '@/components/admin/CocktailsTable';
import TabContentPlaceholder from '@/components/admin/TabContentPlaceholder';

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

  const handleLogout = () => {a
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
      <AdminHeader onLogout={handleLogout} />

      <main className="container max-w-5xl mx-auto p-4">
        <SearchToolbar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <Tabs defaultValue="establishments">
          <TabsList className="mb-4">
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="cocktails">Cocktails</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="establishments">
            <EstablishmentsTable 
              establishments={filteredEstablishments} 
              onDeleteEstablishment={handleDeleteEstablishment} 
            />
          </TabsContent>

          <TabsContent value="cocktails">
            <CocktailsTable 
              cocktails={filteredCocktails}
              onDeleteCocktail={handleDeleteCocktail}
            />
          </TabsContent>

          <TabsContent value="promotions">
            <TabContentPlaceholder
              title="Promotions Management"
              description="This section will allow you to manage promotional codes created by establishments."
            />
          </TabsContent>

          <TabsContent value="reviews">
            <TabContentPlaceholder
              title="Reviews Management"
              description="This section will allow you to manage user reviews for mocktails."
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
