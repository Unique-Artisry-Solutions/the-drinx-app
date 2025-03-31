
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import SearchFilter from '@/components/SearchFilter';
import { Button } from '@/components/ui/button';
import { Map, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Sample data - would be fetched from API in a real application
import { sampleCocktails, sampleBarCrawls } from '@/data/sampleData';

const Explore = () => {
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [filteredCocktails, setFilteredCocktails] = useState(sampleCocktails);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25],
    distance: 10,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Search is handled by the useEffect above
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Filter changes are only applied when the Apply button is clicked
  };

  const applyFilters = () => {
    let results = [...cocktails];
    
    // Apply search filter if there's a query
    if (searchQuery) {
      results = results.filter(cocktail => 
        cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cocktail.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cocktail.establishment.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply price filter
    results = results.filter(cocktail => 
      cocktail.price <= filters.priceRange[1]
    );
    
    // In a real app, you would filter by distance here
    // This is just a simulation
    const distanceFiltered = results;
    
    setFilteredCocktails(distanceFiltered);
    
    // Show a toast notification with the results
    toast({
      title: "Filters Applied",
      description: `Found ${distanceFiltered.length} cocktails matching your criteria.`
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-material-on-background">Explore Cocktails</h1>
          <p className="text-material-on-surface-variant">
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

        {/* Bar Crawl Section */}
        <div className="mb-8 p-4 bg-gradient-to-r from-spiritless-pink/10 to-spiritless-green/10 rounded-lg border border-spiritless-pink/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-spiritless-pink mb-1">Bar Crawls</h2>
              <p className="text-sm text-material-on-surface-variant">
                Discover or create spirit-free bar crawls in your area
              </p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-spiritless-green text-spiritless-green"
                asChild
              >
                <Link to="/map">
                  <Map className="h-4 w-4" />
                  <span>Find</span>
                </Link>
              </Button>
              {user && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex items-center gap-1 bg-spiritless-pink text-white hover:bg-spiritless-pink/90"
                  asChild
                >
                  <Link to="/create-bar-crawl">
                    <Route className="h-4 w-4" />
                    <span>Create</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Sample Bar Crawls Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleBarCrawls.slice(0, 3).map((crawl) => (
              <div key={crawl.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-1">{crawl.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{crawl.stops} stops</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/bar-crawl/${crawl.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cocktails Section - Original content */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Cocktails</h2>
          <span className="text-sm text-gray-500">{filteredCocktails.length} results</span>
        </div>
        
        {filteredCocktails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCocktails.map((cocktail) => (
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
        ) : (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <p className="text-material-on-surface-variant mb-2">No cocktails found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  priceRange: [0, 25],
                  distance: 10,
                });
                setFilteredCocktails(cocktails);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;
