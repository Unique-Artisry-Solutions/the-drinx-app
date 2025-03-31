
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import CocktailCard from '@/components/CocktailCard';
import EstablishmentCard from '@/components/EstablishmentCard';
import SearchFilter from '@/components/SearchFilter';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from '@/components/map/MapView';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments } from '@/data/sampleData';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [allCocktails, setAllCocktails] = useState(sampleCocktails);
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25],
    distance: 10
  });
  const [activeTab, setActiveTab] = useState("featured");
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const {
    userLocation,
    isLoading: isLoadingLocation,
    refreshLocation,
    calculateDistance,
    formatDistance
  } = useUserLocation();

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation && establishments.length > 0) {
      const updatedEstablishments = establishments.map(est => ({
        ...est,
        distance: formatDistance(calculateDistance(est.latitude, est.longitude))
      }));
      setEstablishments(updatedEstablishments);
    }
  }, [userLocation, establishments, calculateDistance, formatDistance]);
  
  useEffect(() => {
    // If user is authenticated, redirect to explore page
    if (user && !isLoading) {
      navigate('/explore');
    }
  }, [user, isLoading, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter cocktails based on search query
    if (query) {
      const filtered = allCocktails.filter(cocktail => cocktail.name.toLowerCase().includes(query.toLowerCase()) || cocktail.description.toLowerCase().includes(query.toLowerCase()) || cocktail.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase())));
      setCocktails(filtered);
    } else {
      setCocktails(allCocktails);
    }
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);

    // Apply price range filter
    const filtered = allCocktails.filter(cocktail => cocktail.price >= newFilters.priceRange[0] && cocktail.price <= newFilters.priceRange[1]);
    setCocktails(filtered);
  };

  // Transform establishment data for the map
  const mapEstablishments = establishments.map(e => ({
    id: e.id,
    name: e.name,
    latitude: e.latitude,
    longitude: e.longitude,
    cocktailCount: e.cocktailCount
  }));
  
  return (
    <Layout>
      <div className="animate-fade-in my-4 sm:my-[30px] px-3 sm:px-6 md:px-[148px]">
        <div className="mb-6 mt-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-medium text-material-on-background">
            Spirit<span className="text-material-primary">less</span>
          </h1>
          <p className="text-material-on-surface-variant text-sm sm:text-base">
            Discover non-alcoholic cocktails near you
          </p>
        </div>

        <SearchFilter onSearch={handleSearch} onFilterChange={handleFilterChange} className="mb-6" />

        <Tabs defaultValue="featured" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">All Cocktails</TabsTrigger>
            <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-material-on-surface">Featured Cocktails</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cocktails.slice(0, 4).map(cocktail => (
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
                <button className="text-sm text-material-primary" onClick={() => setActiveTab("map")}>
                  View map
                </button>
              </div>
              
              <div className="space-y-3">
                {establishments.slice(0, 5).map(establishment => (
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
          </TabsContent>
          
          <TabsContent value="all">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-material-on-surface mb-4">All Cocktails</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cocktails.map(cocktail => (
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
              
              {cocktails.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-material-on-surface-variant">No cocktails found matching your criteria.</p>
                  <button 
                    className="text-material-primary mt-2" 
                    onClick={() => {
                      setSearchQuery('');
                      setCocktails(allCocktails);
                      setFilters({
                        priceRange: [0, 25],
                        distance: 10
                      });
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <div className={isMobile ? "h-[60vh]" : "h-[50vh]"}>
              <MapView 
                establishments={mapEstablishments} 
                userLocation={userLocation} 
                onRefreshLocation={refreshLocation} 
                isLoadingLocation={isLoadingLocation} 
              />
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-medium text-material-on-surface mb-4">Establishments</h2>
              <div className="space-y-3">
                {establishments.map(establishment => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
