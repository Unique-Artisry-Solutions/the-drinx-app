
import React from 'react';
import { useIndexPageLogic } from '@/hooks/useIndexPageLogic';
import { useAuth } from '@/contexts/auth';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import { supabase } from '@/lib/supabase';

const ExplorePage = () => {
  // Get data from the useIndexPageLogic hook
  const { 
    establishments, 
    cocktails: hookCocktails,
    resetFilters
  } = useIndexPageLogic();
  
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  // Convert cocktails to ensure price is always a string and establishment has id
  const cocktails = React.useMemo(() => {
    return hookCocktails.map(cocktail => {
      // We need to safely handle the case when establishment might not have an ID
      const establishmentId = cocktail.establishment && 
        typeof cocktail.establishment === 'object' && 
        'id' in cocktail.establishment ? 
        cocktail.establishment.id : 
        cocktail.id;
        
      return {
        ...cocktail,
        price: typeof cocktail.price === 'number' ? cocktail.price.toString() : cocktail.price,
        establishment: {
          id: establishmentId, // Use establishment ID if available, fallback to cocktail ID
          name: cocktail.establishment.name,
          distance: cocktail.establishment.distance
        }
      };
    });
  }, [hookCocktails]);
  
  // Sample bar crawls data (could be fetched from API in the future)
  const barCrawls = React.useMemo(() => {
    return [
      {
        id: "1",
        name: "Downtown Mocktail Tour",
        stops: 4
      },
      {
        id: "2",
        name: "Uptown Refreshment Walk",
        stops: 3
      },
      {
        id: "3",
        name: "Harbor Breeze Crawl",
        stops: 5
      }
    ];
  }, []);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      
      <FeaturedEstablishmentsSection establishments={establishments} />
      
      <div className="my-10">
        <BarCrawlSection barCrawls={barCrawls} isAuthenticated={isAuthenticated} />
      </div>
      
      <div className="my-10">
        <CocktailsSection cocktails={cocktails} resetFilters={resetFilters} />
      </div>
    </div>
  );
};

export default ExplorePage;
