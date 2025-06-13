
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CocktailCard from '@/components/CocktailCard';
import SwigCircuitCard from '@/components/swigCircuit/SwigCircuitCard';
import { useSwigCircuitsData } from '@/hooks/swigCircuit/useSwigCircuitsData';
import { Route } from 'lucide-react';

type RecommendationCategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits';

interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  image_url: string;
  price: number;
  establishment_id: string;
  establishment: {
    id: string;
    name: string;
  };
}

const RecommendationsWidget: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RecommendationCategoryType>('popular');
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { filteredCircuits, isLoading: circuitsLoading } = useSwigCircuitsData();

  // Helper functions for SwigCircuitCard
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration': return 'from-blue-600 to-cyan-600';
      case 'Weekend Getaway': return 'from-purple-600 to-pink-600';
      case 'Cocktail Masters': return 'from-amber-600 to-orange-600';
      default: return 'from-green-600 to-emerald-600';
    }
  };

  const getThemeBorderColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration': return 'border-b-blue-500';
      case 'Weekend Getaway': return 'border-b-purple-500';
      case 'Cocktail Masters': return 'border-b-amber-500';
      default: return 'border-b-green-500';
    }
  };

  const getThemeImage = (theme: string) => {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>')`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-white';
      case 'Moderate': return 'bg-yellow-500 text-white';
      case 'Challenging': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    return <Route className="h-3 w-3 mr-1" />;
  };

  // Fetch cocktails for non-swig-circuits categories
  useEffect(() => {
    if (['popular', 'trending', 'new', 'personalized'].includes(selectedCategory)) {
      const fetchCocktails = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('cocktails')
            .select('*, establishment:establishment_id(id, name)')
            .limit(20);

          if (error) {
            console.error("Error fetching cocktails:", error);
            toast({
              title: "Error",
              description: "Failed to fetch cocktails. Please try again.",
              variant: "destructive"
            });
            return;
          }

          // Transform the data to match our interface
          const transformedData = (data || []).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            ingredients: Array.isArray(item.ingredients) 
              ? item.ingredients 
              : (typeof item.ingredients === 'string' ? [item.ingredients] : []),
            image_url: item.image_url,
            price: parseFloat(item.price) || 0,
            establishment_id: item.establishment_id,
            establishment: item.establishment || { id: item.establishment_id, name: 'Unknown' }
          })) as Cocktail[];

          setCocktails(transformedData);
        } catch (error) {
          console.error("Unexpected error fetching cocktails:", error);
          toast({
            title: "Unexpected Error",
            description: "An unexpected error occurred while fetching cocktails.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchCocktails();
    }
  }, [selectedCategory, toast]);

  const renderCocktailsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full h-40 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </>
      ) : (
        cocktails.map((cocktail) => (
          <CocktailCard
            key={cocktail.id}
            id={cocktail.id}
            name={cocktail.name}
            price={cocktail.price.toString()}
            description={cocktail.description}
            ingredients={cocktail.ingredients}
            image={cocktail.image_url}
            establishment={cocktail.establishment}
          />
        ))
      )}
    </div>
  );

  const renderSwigCircuitsSection = () => {
    if (circuitsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ))}
        </div>
      );
    }

    if (filteredCircuits.length === 0) {
      return (
        <div className="text-center py-12 bg-card rounded-lg border border-dashed">
          <Route className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Swig Circuits Available</h3>
          <p className="text-muted-foreground">Check back later for new circuit experiences</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCircuits.slice(0, 6).map(circuit => (
          <SwigCircuitCard
            key={circuit.id}
            circuit={circuit}
            getThemeColor={getThemeColor}
            getThemeBorderColor={getThemeBorderColor}
            getThemeImage={getThemeImage}
            getDifficultyColor={getDifficultyColor}
            getDifficultyIcon={getDifficultyIcon}
          />
        ))}
      </div>
    );
  };

  const renderSelectedSection = () => {
    switch (selectedCategory) {
      case 'swig-circuits':
        return renderSwigCircuitsSection();
      default:
        return renderCocktailsSection();
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
        <p className="text-muted-foreground">
          Discover cocktails, circuits, and experiences tailored just for you
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RecommendationCategoryType)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="personalized">For You</TabsTrigger>
          <TabsTrigger value="swig-circuits">Circuits</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {renderSelectedSection()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationsWidget;
