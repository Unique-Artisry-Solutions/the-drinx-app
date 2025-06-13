
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Promoter {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  is_verified: boolean;
  category: string;
  tags: string[];
  follower_count: number;
  event_count: number;
  rating?: number;
  location?: string;
}

export const usePopularPromoters = () => {
  return useQuery({
    queryKey: ['popular-promoters'],
    queryFn: async () => {
      // First get promoter profiles
      const { data: promoters, error: promotersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio')
        .eq('user_type', 'promoter')
        .limit(12);

      if (promotersError) {
        console.error('Error fetching promoters:', promotersError);
        throw promotersError;
      }

      // Transform to our expected format with mock data for demo
      const transformedPromoters: Promoter[] = (promoters || []).map((promoter, index) => ({
        id: promoter.id,
        name: promoter.full_name || `Promoter ${index + 1}`,
        description: promoter.bio || 'Experienced event promoter creating amazing nightlife experiences',
        avatar_url: promoter.avatar_url,
        is_verified: Math.random() > 0.6, // Random verification for demo
        category: ['Nightlife', 'Entertainment', 'Events', 'Music'][index % 4],
        tags: [
          ['nightlife', 'cocktails'],
          ['music', 'dance'],
          ['events', 'social'],
          ['entertainment', 'networking']
        ][index % 4],
        follower_count: Math.floor(Math.random() * 5000) + 100,
        event_count: Math.floor(Math.random() * 50) + 5,
        rating: Math.random() > 0.3 ? Math.round((Math.random() * 2 + 3) * 10) / 10 : undefined,
        location: ['Downtown', 'Midtown', 'Uptown', 'Westside'][index % 4]
      }));

      return transformedPromoters;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
