
import { useState, useEffect } from 'react';
import { RecommendationCategoryType } from '@/types/explore';

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe' | 'swig-circuit';
  rating?: number;
  distance?: string;
  price?: string;
  imageUrl?: string;
  reason: string;
  tags: string[];
  isSaved: boolean;
  availability?: 'open' | 'closing-soon' | 'closed';
  trending?: boolean;
  metadata?: Record<string, any>;
}

export const usePersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<RecommendationCategoryType>('all');

  useEffect(() => {
    const loadRecommendations = async () => {
      // Enhanced mock recommendations with Swig Circuits
      const mockRecommendations: PersonalizedRecommendation[] = [
        {
          id: '1',
          title: 'The Zen Garden',
          description: 'Peaceful atmosphere with meditation-inspired mocktails',
          type: 'establishment',
          rating: 4.8,
          distance: '0.3 miles',
          price: '$$',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Based on your love for quiet spaces',
          tags: ['peaceful', 'meditation', 'organic'],
          isSaved: false,
          availability: 'open',
          trending: true,
          metadata: { establishment_id: 'est1' }
        },
        {
          id: '2',
          title: 'Tropical Paradise Punch',
          description: 'Refreshing blend of coconut water and tropical fruits',
          type: 'cocktail',
          rating: 4.6,
          imageUrl: '/api/placeholder/300/200',
          reason: 'Perfect for your afternoon preferences',
          tags: ['tropical', 'refreshing', 'coconut'],
          isSaved: true,
          metadata: { cocktail_id: 'cocktail1', difficulty: 'easy' }
        },
        {
          id: '3',
          title: 'Mindful Mixology Workshop',
          description: 'Learn to create mocktails with intention and mindfulness',
          type: 'event',
          rating: 4.9,
          distance: '1.2 miles',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Matches your interest in wellness activities',
          tags: ['workshop', 'mindfulness', 'learning'],
          isSaved: false,
          availability: 'open',
          metadata: { event_id: 'event1', date: '2024-01-15' }
        },
        {
          id: '4',
          title: 'Downtown Discovery Circuit',
          description: 'Explore 5 unique alcohol-free venues in the city center',
          type: 'swig-circuit',
          rating: 4.7,
          distance: '2.1 miles',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Based on your urban exploration preferences',
          tags: ['urban', 'discovery', 'social'],
          isSaved: false,
          trending: true,
          metadata: { 
            circuit_id: 'circuit1', 
            stops: 5, 
            duration: '3 hours',
            difficulty: 'easy',
            theme: 'Urban Exploration'
          }
        },
        {
          id: '5',
          title: 'Sunset Rooftop Circuit',
          description: 'Experience stunning views and creative mocktails across 4 rooftop bars',
          type: 'swig-circuit',
          rating: 4.9,
          distance: '1.8 miles',
          imageUrl: '/api/placeholder/300/200',
          reason: 'Perfect for your love of scenic venues',
          tags: ['rooftop', 'scenic', 'premium'],
          isSaved: true,
          trending: false,
          metadata: { 
            circuit_id: 'circuit2', 
            stops: 4, 
            duration: '2.5 hours',
            difficulty: 'moderate',
            theme: 'Scenic Views'
          }
        }
      ];

      setRecommendations(mockRecommendations);
      setIsLoading(false);
    };

    loadRecommendations();
  }, []);

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'establishments') return rec.type === 'establishment';
    if (activeCategory === 'cocktails') return rec.type === 'cocktail';
    if (activeCategory === 'events') return rec.type === 'event';
    if (activeCategory === 'recipes') return rec.type === 'recipe';
    return true;
  });

  const saveRecommendation = async (recommendationId: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, isSaved: !rec.isSaved }
          : rec
      )
    );
  };

  const dismissRecommendation = async (recommendationId: string) => {
    setRecommendations(prev =>
      prev.filter(rec => rec.id !== recommendationId)
    );
  };

  const shareRecommendation = async (recommendationId: string) => {
    console.log('Recommendation shared:', recommendationId);
  };

  return {
    recommendations: filteredRecommendations,
    isLoading,
    activeCategory,
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  };
};
