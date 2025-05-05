
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchFilter from '@/components/SearchFilter';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import DataMigration from '@/components/admin/DataMigration';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments, sampleBarCrawls } from '@/data/sampleData';

const Explore = () => {
  const [cocktails] = useState(sampleCocktails);
  const [establishments] = useState(sampleEstablishments);
  const [filteredCocktails, setFilteredCocktails] = useState(sampleCocktails);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25],
    distance: 10,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Apply search filter when search query changes
  useEffect(() => {
    handleSearchFilter();
  }, [searchQuery]);

  // This function will handle the search now
  const handleSearchFilter = () => {
    let results = [...cocktails];
    
    // Apply search filter if there's a query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      
      results = results.filter(cocktail => 
        cocktail.name.toLowerCase().includes(query) ||
        cocktail.description.toLowerCase().includes(query) ||
        cocktail.establishment.name.toLowerCase().includes(query) ||
        (cocktail.ingredients && cocktail.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query)
        ))
      );
      
      console.log(`Search query "${query}" found ${results.length} results`);
    }
    
    // Apply price filter
    results = results.filter(cocktail => {
      const cocktailPrice = typeof cocktail.price === 'string' 
        ? parseFloat(cocktail.price.replace('$', '')) 
        : cocktail.price;
        
      return !isNaN(cocktailPrice) && 
             cocktailPrice >= filters.priceRange[0] && 
             cocktailPrice <= filters.priceRange[1];
    });
    
    // Store the filtered results
    setFilteredCocktails(results);
  };

  // Update search query and trigger filter through useEffect
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const applyFilters = () => {
    handleSearchFilter();
    
    // Show a toast notification with the results
    toast({
      title: "Filters Applied",
      description: `Found ${filteredCocktails.length} cocktails matching your criteria.`
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      priceRange: [0, 25],
      distance: 10,
    });
    setFilteredCocktails(cocktails);
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-7xl mx-auto px-3 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-foreground">Explore Cocktails</h1>
          <p className="text-muted-foreground">
            Find your perfect non-alcoholic drink
          </p>
        </div>

        <SearchFilter 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters} 
          className="mb-6"
          initialSearchTerm={searchQuery}
        />
        
        {/* Add the data migration component for admins or development */}
        <div className="mb-6">
          <DataMigration />
        </div>

        {/* Events Section - NEW! */}
        <EventsSection />

        {/* Swig Circuit Section */}
        <BarCrawlSection 
          barCrawls={sampleBarCrawls} 
          isAuthenticated={!!user}
        />

        {/* Featured Establishments Section */}
        <div className="mt-6">
          <FeaturedEstablishmentsSection establishments={establishments} />
        </div>

        {/* Cocktails Section */}
        <div className="mt-6">
          <CocktailsSection 
            cocktails={filteredCocktails} 
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
