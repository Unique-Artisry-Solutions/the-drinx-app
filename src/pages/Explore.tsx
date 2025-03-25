
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import SearchFilter from '@/components/SearchFilter';

// Sample data - would be fetched from API in a real application
import { sampleCocktails } from '@/data/sampleData';

const Explore = () => {
  const [cocktails, setCocktails] = useState(sampleCocktails);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 25],
    distance: 10,
  });

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
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-material-on-background">Explore Cocktails</h1>
          <p className="text-material-on-surface-variant">
            Find your perfect non-alcoholic drink
          </p>
        </div>

        <SearchFilter 
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cocktails.map((cocktail) => (
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
      </div>
    </Layout>
  );
};

export default Explore;
