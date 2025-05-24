
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments, sampleCocktails } from '@/data/sampleData';

// Imported components
import SearchToolbar from '@/components/admin/SearchToolbar';
import EstablishmentsTable from '@/components/admin/EstablishmentsTable';
import CocktailsTable from '@/components/admin/CocktailsTable';
import TabContentPlaceholder from '@/components/admin/TabContentPlaceholder';

const AdminDashboard: React.FC = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-5xl mx-auto p-4 pt-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mb-4">Manage your establishments, cocktails, and more</p>
          
          <SearchToolbar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs defaultValue="establishments" className="w-full">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-md">
              <TabsTrigger value="establishments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Establishments
              </TabsTrigger>
              <TabsTrigger value="cocktails" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Cocktails
              </TabsTrigger>
              <TabsTrigger value="promotions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Promotions
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Reviews
              </TabsTrigger>
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
