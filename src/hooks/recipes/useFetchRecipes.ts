import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';

export const useFetchRecipes = (user: User | null) => {
  return useQuery({
    queryKey: ['userRecipes', user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass'],
    queryFn: async () => {
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      
      // If no authentication and not in admin bypass, return empty array
      if (!user && !isAdminBypass) {
        console.log('No authenticated user, returning empty recipes array');
        return [];
      }

      const userId = user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass';
      console.log('Fetching recipes for user ID:', userId);

      // For demo/testing mode with localStorage
      if (localStorage.getItem('DEMO_MODE') === 'true') {
        const localRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
        return localRecipes.filter((recipe: UserRecipe) => recipe.user_id === userId);
      }

      // Otherwise fetch from Supabase
      const { data, error } = await supabaseClient
        .from('user_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      return data as UserRecipe[];
    },
    enabled: !!user || localStorage.getItem('admin_bypass') === 'true'
  });
};
