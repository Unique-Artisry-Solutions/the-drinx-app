
import { useState, useEffect } from 'react';

export interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'establishments' | 'cocktails' | 'events'>('all');

  useEffect(() => {
    const loadRecommendations = async () => {
      // Enhanced mock recommendations with personalization
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
