
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchFilter from '@/components/SearchFilter';
import useDevAuthBypass from '@/hooks/useDevAuthBypass';
import { useToast } from '@/hooks/use-toast';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import PersonalizedProgressHeader from '@/components/explore/PersonalizedProgressHeader';
import DailyChallenges from '@/components/rewards/DailyChallenges';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleEstablishments, sampleBarCrawls } from '@/data/sampleData';

const Explore = () => {
  const [cocktails] = useState(sampleCocktails);
  const [establishments] = useState(sampleEstablishments);
  const [filteredCocktails, setFilteredCocktails] = useState(sampleCocktails);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25] as [number, number],
    distance: 10,
  });
  const { user, isAuthenticated } = useDevAuthBypass();
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

  const handleChallengeComplete = (challengeId: string) => {
    toast({
      title: "Challenge Completed! 🎉",
      description: "You've earned points and unlocked new rewards!",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-foreground mb-2">Explore Cocktails</h1>
            <p className="text-muted-foreground">
              Find your perfect non-alcoholic drink
            </p>
          </div>

          {/* Personalized Progress Header - Only show for authenticated users */}
          {isAuthenticated && (
            <PersonalizedProgressHeader className="mb-6" />
          )}

          <SearchFilter 
            onSearch={handleSearch} 
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters} 
            className="mb-6"
            initialSearchTerm={searchQuery}
            cocktails={cocktails}
            establishments={establishments}
          />

          {/* Daily Challenges Section */}
          <div className="mb-8">
            <DailyChallenges 
              onChallengeComplete={handleChallengeComplete}
              className="max-w-md mx-auto md:max-w-none"
            />
          </div>

          {/* Events Section */}
          <EventsSection />

          {/* Swig Circuit Section */}
          <BarCrawlSection 
            barCrawls={sampleBarCrawls} 
            isAuthenticated={isAuthenticated}
          />

          {/* Featured Establishments Section */}
          <div className="mt-8">
            <FeaturedEstablishmentsSection establishments={establishments} />
          </div>

          {/* Cocktails Section */}
          <div className="mt-8">
            <CocktailsSection 
              cocktails={filteredCocktails} 
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
