
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import SearchFilter from '@/components/SearchFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';

// Import the new components
import FeaturedCocktails from '@/components/home/FeaturedCocktails';
import NearbyEstablishments from '@/components/home/NearbyEstablishments';
import AllCocktails from '@/components/home/AllCocktails';
import MapSection from '@/components/home/MapSection';
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const userType = localStorage.getItem('user_type');
  const isEstablishment = userType === 'establishment';
  
  const {
    cocktails,
    establishments,
    searchQuery,
    filters,
    activeTab,
    setActiveTab,
    userLocation,
    isLoadingLocation,
    refreshLocation,
    handleSearch,
    handleFilterChange,
    applyFilters,
    resetFilters
  } = useIndexPageLogic();
  
  // Redirect authenticated individual users to explore page, but only once after loading
  useEffect(() => {
    if (!isLoading && user && !isEstablishment) {
      navigate('/explore', { replace: true });
    }
  }, [user, isLoading, navigate, isEstablishment]);

  // If the user is not authenticated, show the normal index page
  // If the user is an establishment (including bypass logins), show the dashboard
  if (user && isEstablishment) {
    return (
      <Layout>
        <EstablishmentDashboard 
          establishmentName={localStorage.getItem('user_username') || 'Your Establishment'} 
        />
      </Layout>
    );
  }

  // Show the regular index page for guests
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

        <SearchFilter 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
          onApplyFilters={applyFilters}
          className="mb-6" 
        />

        <Tabs defaultValue="featured" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">All Cocktails</TabsTrigger>
            <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <FeaturedCocktails cocktails={cocktails} />
            <NearbyEstablishments 
              establishments={establishments} 
              onViewMap={() => setActiveTab("map")} 
            />
          </TabsContent>
          
          <TabsContent value="all">
            <AllCocktails 
              cocktails={cocktails} 
              onResetFilters={resetFilters} 
            />
          </TabsContent>
          
          <TabsContent value="map">
            <MapSection 
              establishments={establishments}
              mapHeight={isMobile ? "h-[60vh]" : "h-[50vh]"}
              userLocation={userLocation}
              onRefreshLocation={refreshLocation}
              isLoadingLocation={isLoadingLocation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
