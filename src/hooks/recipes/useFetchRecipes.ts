
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';

export const useFetchRecipes = (user: User | null) => {
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  
  // Use either the authenticated user ID or bypass user ID
  const userId = user?.id || (isAdminBypass ? bypassUserId : null);
  
  return useQuery({
    queryKey: ['userRecipes', userId || 'anonymous'],
    queryFn: async () => {
      // If no authentication and not in admin bypass, return empty array
      if (!userId) {
        console.log('No authenticated user or bypass ID, returning empty recipes array');
        return [];
      }

      console.log('Fetching recipes for user ID:', userId);

      // For demo/testing mode with localStorage
      if (localStorage.getItem('DEMO_MODE') === 'true') {
        try {
          const localRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
          return localRecipes.filter((recipe: UserRecipe) => recipe.user_id === userId) || [];
        } catch (err) {
          console.error('Error parsing local recipes:', err);
          return [];
        }
      }

      // Otherwise fetch from Supabase
      try {
        // For admin bypass, we'll use local storage since we can't bypass RLS
        if (isAdminBypass) {
          console.log('Admin bypass active, using localStorage for recipes');
          // Initialize recipes array if it doesn't exist
          if (!localStorage.getItem('user_recipes')) {
            localStorage.setItem('user_recipes', JSON.stringify([]));
          }
          
          try {
            const localRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
            return localRecipes.filter((recipe: UserRecipe) => recipe.user_id === userId) || [];
          } catch (err) {
            console.error('Error parsing local recipes:', err);
            return [];
          }
        }
        
        // Regular Supabase query for authenticated users
        const { data, error } = await supabase
          .from('user_recipes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        return data as UserRecipe[] || [];
      } catch (error) {
        console.error('Error in recipe fetch:', error);
        return [];
      }
    },
    enabled: !!userId
  });
};
