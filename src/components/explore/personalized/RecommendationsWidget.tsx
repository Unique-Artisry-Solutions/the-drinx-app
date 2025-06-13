
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Users, Route } from 'lucide-react';

type RecommendationCategoryType = 'all' | 'places' | 'drinks' | 'events' | 'recipes' | 'swig-circuits';

interface RecommendationItem {
  id: string;
  title: string;
  category: 'places' | 'drinks' | 'events' | 'recipes' | 'swig-circuits';
  rating?: number;
  location?: string;
  image?: string;
  description?: string;
  price?: string;
  participants?: number;
  duration?: string;
}

const RecommendationsWidget: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RecommendationCategoryType>('all');

  // Sample data for recommendations
  const recommendations: RecommendationItem[] = [
    {
      id: '1',
      title: 'The Mocktail Lounge',
      category: 'places',
      rating: 4.8,
      location: 'Downtown',
      description: 'Cozy spot with creative alcohol-free cocktails',
      image: '/placeholder-establishment.jpg'
    },
    {
      id: '2',
      title: 'Virgin Mojito Supreme',
      category: 'drinks',
      rating: 4.9,
      description: 'Refreshing mint and lime combination',
      price: '$8'
    },
    {
      id: '3',
      title: 'Mocktail Mixology Class',
      category: 'events',
      rating: 4.7,
      location: 'Midtown',
      description: 'Learn to craft professional mocktails',
      price: '$45'
    },
    {
      id: '4',
      title: 'Homemade Ginger Beer',
      category: 'recipes',
      rating: 4.6,
      description: 'Spicy and refreshing homemade recipe'
    },
    {
      id: '5',
      title: 'Urban Exploration Circuit',
      category: 'swig-circuits',
      rating: 4.8,
      participants: 15,
      duration: '3 hours',
      description: 'Discover hidden mocktail gems across the city'
    },
    {
      id: '6',
      title: 'Weekend Getaway Circuit',
      category: 'swig-circuits',
      rating: 4.9,
      participants: 12,
      duration: '2 days',
      description: 'Relaxing weekend circuit through scenic venues'
    }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'places': return <MapPin className="h-4 w-4" />;
      case 'drinks': return <Star className="h-4 w-4" />;
      case 'events': return <Clock className="h-4 w-4" />;
      case 'recipes': return <Star className="h-4 w-4" />;
      case 'swig-circuits': return <Route className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RecommendationCategoryType)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="drinks">Drinks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="swig-circuits">Swig Circuits</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecommendations.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    {item.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {item.rating}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      )}
                      {item.participants && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.participants} participants
                        </span>
                      )}
                      {item.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.duration}
                        </span>
                      )}
                    </div>
                    {item.price && (
                      <Badge variant="outline">{item.price}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;
