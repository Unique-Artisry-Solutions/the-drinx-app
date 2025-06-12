import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import CategoryTabs from '@/components/CategoryTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type RecommendationCategoryType = 'popular' | 'trending' | 'new' | 'personalized';

interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  image_url: string;
  price: number;
  establishment_id: string;
  establishment: {
    id: string;
    name: string;
  };
}

const PersonalizedExplorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RecommendationCategoryType>('popular');
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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

        setCocktails(data as Cocktail[]);
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
  }, [selectedCategory, toast]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover Your Perfect Mocktail
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized recommendations based on your preferences and location
          </p>
        </div>

        <div className="mb-6">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={(value) => setSelectedCategory(value as RecommendationCategoryType)}
          />
        </div>

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
                price={cocktail.price}
                description={cocktail.description}
                ingredients={cocktail.ingredients}
                image={cocktail.image_url}
                establishment={cocktail.establishment}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PersonalizedExplorePage;
