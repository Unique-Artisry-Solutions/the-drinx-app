
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import CocktailCard from '@/components/CocktailCard';
import CategoryTabs from '@/components/CategoryTabs';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import PromoterSection from '@/components/explore/PromoterSection';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { ViewMode } from '@/types/ExploreTypes';

// Import existing personalized widgets
import QuickStatsWidget from '@/components/explore/personalized/QuickStatsWidget';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import RewardsHighlightWidget from '@/components/explore/personalized/RewardsHighlightWidget';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import NearbyEstablishmentsWidget from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import UpcomingEventsWidget from '@/components/explore/personalized/UpcomingEventsWidget';

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
  const [isLoadingCocktails, setIsLoadingCocktails] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { toast } = useToast();

  // Fetch cocktails for popular, trending, new, and personalized categories
  useEffect(() => {
    if (['popular', 'trending', 'new', 'personalized'].includes(selectedCategory)) {
      const fetchCocktails = async () => {
        setIsLoadingCocktails(true);
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
          setIsLoadingCocktails(false);
        }
      };

      fetchCocktails();
    }
  }, [selectedCategory, toast]);

  const renderCocktailsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoadingCocktails ? (
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

  const renderMainContent = () => {
    switch (selectedCategory) {
      case 'swig-circuits':
        return <SwigCircuitsSection />;
      case 'promoters':
        return <PromoterSection />;
      default:
        return renderCocktailsGrid();
    }
  };

  const shouldShowSidebarWidgets = () => {
    // Show sidebar widgets for personalized tab and cocktail categories
    return ['popular', 'trending', 'new', 'personalized'].includes(selectedCategory);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover Your Perfect Experience
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore cocktails, circuits, and promoters tailored to your preferences
              </p>
            </div>
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className={shouldShowSidebarWidgets() ? "lg:col-span-8" : "lg:col-span-12"}>
            {/* Quick Stats and Actions for personalized tab */}
            {selectedCategory === 'personalized' && (
              <div className="space-y-6 mb-8">
                <QuickStatsWidget />
                <QuickActionCards />
              </div>
            )}
            
            {/* Dynamic Content Based on Category */}
            {renderMainContent()}
          </div>

          {/* Sidebar Widgets - Only show for cocktail categories and personalized */}
          {shouldShowSidebarWidgets() && (
            <div className="lg:col-span-4">
              <div className="space-y-6 sticky top-8">
                <RewardsHighlightWidget />
                <StreakMotivationWidget />
                <NearbyEstablishmentsWidget />
                <UpcomingEventsWidget />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
