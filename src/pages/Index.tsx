
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import EstablishmentCard from '@/components/EstablishmentCard';
import SearchFilter from '@/components/SearchFilter';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

const Index = () => {
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25],
    distance: 10,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast({
            title: "Location access denied",
            description: "Enable location services to find nearby non-alcoholic cocktails.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger an API call with the search query
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real app, this would trigger an API call with the filters
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6 mt-2 text-center">
          <h1 className="text-3xl font-medium text-material-on-background">
            Spirit<span className="text-material-primary">less</span>
          </h1>
          <p className="text-material-on-surface-variant">
            Discover non-alcoholic cocktails near you
          </p>
        </div>

        <SearchFilter 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
          className="mb-6"
        />

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-material-on-surface">Featured Cocktails</h2>
            <a href="/explore" className="text-sm text-material-primary">View all</a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cocktails.slice(0, 4).map((cocktail) => (
              <CocktailCard
                key={cocktail.id}
                id={cocktail.id}
                name={cocktail.name}
                price={cocktail.price}
                description={cocktail.description}
                ingredients={cocktail.ingredients}
                image={cocktail.image}
                establishment={cocktail.establishment}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-material-on-surface">Nearby Establishments</h2>
            <a href="/map" className="text-sm text-material-primary">View map</a>
          </div>
          
          <div className="space-y-3">
            {establishments.slice(0, 5).map((establishment) => (
              <EstablishmentCard
                key={establishment.id}
                id={establishment.id}
                name={establishment.name}
                address={establishment.address}
                distance={establishment.distance}
                cocktailCount={establishment.cocktailCount}
                image={establishment.image}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
