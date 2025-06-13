
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ViewMode } from '@/types/ExploreTypes';
import RecommendationsWidget from '@/components/explore/RecommendationsWidget';
import { FeaturedEstablishmentsSection } from '@/components/explore/FeaturedEstablishmentsSection';
import { EventsSection } from '@/components/explore/EventsSection';
import { PromoterDiscoverySection } from '@/components/explore/PromoterDiscoverySection';

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

const Explore: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch cocktails
  useEffect(() => {
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
  }, [toast]);

  const renderCocktails = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full h-40 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    const gridClass = viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4';

    return (
      <div className={gridClass}>
        {cocktails.map((cocktail) => (
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
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Explore Experiences
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover amazing cocktails, venues, and experiences near you
          </p>
        </div>

        {/* Personalized Recommendations Widget */}
        <div className="mb-8">
          <RecommendationsWidget />
        </div>

        {/* Featured Establishments */}
        <div className="mb-8">
          <FeaturedEstablishmentsSection />
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <EventsSection />
        </div>

        {/* Promoter Discovery */}
        <div className="mb-8">
          <PromoterDiscoverySection />
        </div>

        {/* All Cocktails Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">All Cocktails</h2>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
          {renderCocktails()}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
