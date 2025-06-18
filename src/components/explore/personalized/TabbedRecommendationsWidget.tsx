
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Sparkles, MapPin, Coffee, Calendar, ChefHat } from 'lucide-react';
import { RecommendationCategory } from '@/types/ExploreTypes';

export interface TabbedRecommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
  title: string;
  subtitle: string;
  imageUrl?: string;
  rating?: number;
  reason: string;
  category: RecommendationCategory;
}

export interface TabbedRecommendationsWidgetProps {
  recommendations?: TabbedRecommendation[];
}

const defaultRecommendations: TabbedRecommendation[] = [
  {
    id: '1',
    type: 'cocktail',
    title: 'Tropical Paradise',
    subtitle: 'Pineapple, Coconut & Lime',
    rating: 4.8,
    reason: 'Based on your love for fruity drinks',
    category: 'drinks'
  },
  {
    id: '2',
    type: 'establishment',
    title: 'The Garden Lounge',
    subtitle: '2.1 miles away',
    rating: 4.6,
    reason: 'New establishment in your area',
    category: 'places'
  },
  {
    id: '3',
    type: 'event',
    title: 'Mocktail Masterclass',
    subtitle: 'Tomorrow at 7 PM',
    reason: 'Perfect for your skill level',
    category: 'events'
  },
  {
    id: '4',
    type: 'recipe',
    title: 'Sunset Spritz Recipe',
    subtitle: 'Easy 5-minute recipe',
    rating: 4.7,
    reason: 'Matches your preferred difficulty',
    category: 'recipes'
  },
  {
    id: '5',
    type: 'establishment',
    title: 'Rooftop Bar & Grill',
    subtitle: '1.5 miles away',
    rating: 4.9,
    reason: 'Highly rated in your area',
    category: 'places'
  },
  {
    id: '6',
    type: 'cocktail',
    title: 'Berry Mint Cooler',
    subtitle: 'Refreshing summer blend',
    rating: 4.5,
    reason: 'Popular this season',
    category: 'drinks'
  }
];

export const TabbedRecommendationsWidget: React.FC<TabbedRecommendationsWidgetProps> = ({
  recommendations = defaultRecommendations
}) => {
  const [activeTab, setActiveTab] = useState<RecommendationCategory>('all');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cocktail':
        return <Coffee className="h-4 w-4" />;
      case 'establishment':
        return <MapPin className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'recipe':
        return <ChefHat className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: RecommendationCategory) => {
    switch (category) {
      case 'places':
        return <MapPin className="h-4 w-4" />;
      case 'drinks':
        return <Coffee className="h-4 w-4" />;
      case 'events':
        return <Calendar className="h-4 w-4" />;
      case 'recipes':
        return <ChefHat className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeTab === 'all') return true;
    return rec.category === activeTab;
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RecommendationCategory)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              All
            </TabsTrigger>
            <TabsTrigger value="places" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Places
            </TabsTrigger>
            <TabsTrigger value="drinks" className="flex items-center gap-1">
              <Coffee className="h-3 w-3" />
              Drinks
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Events
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-1">
              <ChefHat className="h-3 w-3" />
              Recipes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-primary">{getTypeIcon(rec.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                        {rec.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{rec.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.subtitle}</p>
                      <p className="text-xs text-primary mb-3 italic">{rec.reason}</p>
                      <Button size="sm" variant="outline" className="w-full text-xs h-8">
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredRecommendations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon(activeTab)}
                    <p>No {activeTab === 'all' ? 'recommendations' : activeTab} available</p>
                    <p className="text-xs">Check back later for new suggestions</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TabbedRecommendationsWidget;
