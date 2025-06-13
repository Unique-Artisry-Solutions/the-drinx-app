
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Promoter } from '@/types/explore';

export const usePopularPromoters = () => {
  return useQuery({
    queryKey: ['popular-promoters'],
    queryFn: async () => {
      // Query the correct columns that exist in the profiles table
      const { data: promoters, error: promotersError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, bio')
        .eq('user_type', 'promoter')
        .limit(12);

      if (promotersError) {
        console.error('Error fetching promoters:', promotersError);
        throw promotersError;
      }

      // Transform to our expected format with mock data for demo
      const transformedPromoters: Promoter[] = (promoters || []).map((promoter, index) => ({
        id: promoter.id,
        name: promoter.display_name || `Promoter ${index + 1}`,
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
