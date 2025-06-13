
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import CategoryTabs from '@/components/CategoryTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import PromoterSection from '@/components/explore/PromoterSection';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { RecommendationCategoryType } from '@/types/explore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { recommendations } = usePersonalizedRecommendations();

  // Fetch cocktails for popular, trending, new, and personalized categories
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
    <div className="space-y-6">
      {selectedCategory === 'personalized' && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recommendations.slice(0, 6).map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {rec.reason}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {rec.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
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
    </div>
  );

  const renderSelectedSection = () => {
    switch (selectedCategory) {
      case 'swig-circuits':
        return <SwigCircuitsSection />;
      case 'promoters':
        return <PromoterSection />;
      default:
        return renderCocktailsSection();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover Your Perfect Experience
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore cocktails, circuits, and promoters - all in one place
          </p>
        </div>

        <div className="mb-6">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {renderSelectedSection()}
      </div>
    </Layout>
  );
};

export default Explore;
